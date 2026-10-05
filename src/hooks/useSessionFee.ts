"use client";

import { useQuery } from "@tanstack/react-query";
import { GetStudentPaymentHistory } from "@/app/actions/student";
import { useAuth } from "@/contexts/AuthContext";
import { resolveStudyYear } from "@/lib/academics.utils";
import { StatusType } from "@/config/Types";

/**
 * Where each case goes to pay, because the two run different flows.
 *
 * A first-year pays through the card on `/admission`, which initiates
 * `/application/retry-purchase`. A returning student has to pick the programme
 * they are returning into first, so they go to their dashboard, where the fee
 * notice opens the programme picker and initiates `/account/pay-return-fee`.
 */
export const APPLICATION_FEE_PAY_URL = "/admission";
export const RETURNING_FEE_PAY_URL = "/dashboard/student";

type PaymentRecord = Record<string, unknown>;

const readRows = (response: unknown): PaymentRecord[] => {
	const data = (response as { success?: { data?: unknown } } | null)?.success?.data;
	if (Array.isArray(data)) return data as PaymentRecord[];
	const nested = (data as { data?: unknown } | null)?.data;
	return Array.isArray(nested) ? (nested as PaymentRecord[]) : [];
};

const sessionOf = (payment: PaymentRecord): string | null => {
	const value = payment.academic_session ?? payment.session;
	return typeof value === "string" && value.trim() ? value.trim() : null;
};

const isSettled = (payment: PaymentRecord): boolean => {
	const status = String(payment.status ?? "").toLowerCase();
	return (
		status === "paid" ||
		status === "success" ||
		status === "successful" ||
		status === "fully_paid"
	);
};

export type SessionFee = {
	/** "Application fee" for a first-year student, "Returning fee" after that. */
	label: string;
	isReturning: boolean;
	/** The session the fee is for - the student's own, not the programme-wide one. */
	session: string | null;
	status: StatusType;
	/** True when the student owes the fee for the session they are now on. */
	isOwing: boolean;
	/**
	 * True when nothing in the payment history can be attributed to a session,
	 * so "paid for THIS session" could not be established and the notice says so
	 * instead of stating it flatly.
	 */
	isIndeterminate: boolean;
	isLoading: boolean;
	payUrl: string;
};

/**
 * Whether the student owes the fee for the session they are currently on.
 *
 * It is one and the same fee - the application fee - charged once per session;
 * past year one it is called the returning fee. But the two are owed for
 * different sessions, so the evidence for them differs:
 *
 * - Year one owes it for their first session, and `application_payment_status`
 *   is authoritative for that one.
 * - Year two and up owe it again for each new session. Nothing on the account
 *   record tracks that. `application_payment_status` in particular stays
 *   FULLY_PAID from the original application forever, so treating it as
 *   evidence marked every migrated student as settled and hid the prompt.
 *
 * So for a returning student the only acceptable evidence is a settled payment
 * attributable to their current `academic_session`. Absent that the fee is
 * treated as outstanding: it is a new obligation, and unpaid is the correct
 * default for one.
 */
export const useSessionFee = (): SessionFee => {
	const { user, access_token } = useAuth();

	const { data: payments = [], isLoading } = useQuery<PaymentRecord[]>({
		queryKey: ["student-payment-history", access_token],
		queryFn: async () => readRows(await GetStudentPaymentHistory(access_token ?? "")),
		enabled: !!access_token,
		staleTime: 60 * 1000,
	});

	const session = (user?.academic_session as string) ?? null;

	// The level moves on migration (100 -> 200); the programme name does not.
	// `is_moved` is a second, independent signal the API sets on migration.
	const year = resolveStudyYear(user) ?? 1;
	const isReturning = year > 1 || Number(user?.is_moved ?? 0) === 1;
	const label = isReturning ? "Returning fee" : "Application fee";

	if (isLoading) {
		return {
			label,
			isReturning,
			session,
			status: StatusType.UNPAID,
			isOwing: false,
			isIndeterminate: false,
			isLoading: true,
			payUrl: isReturning ? RETURNING_FEE_PAY_URL : APPLICATION_FEE_PAY_URL,
		};
	}

	// A first-year student's obligation is the application fee, and the account
	// record answers that one directly.
	if (!isReturning) {
		const accountStatus =
			(user?.application_payment_status as StatusType) ?? StatusType.UNPAID;

		return {
			label,
			isReturning: false,
			session,
			status: accountStatus,
			isOwing: accountStatus !== StatusType.FULLY_PAID,
			isIndeterminate: false,
			isLoading: false,
			payUrl: isReturning ? RETURNING_FEE_PAY_URL : APPLICATION_FEE_PAY_URL,
		};
	}

	// Returning student: only a settled payment carrying this session counts.
	const paidThisSession = payments.some(
		(p) => session && sessionOf(p) === session && isSettled(p)
	);
	const sessionAware = payments.some((p) => sessionOf(p) !== null);

	return {
		label,
		isReturning: true,
		session,
		status: paidThisSession ? StatusType.FULLY_PAID : StatusType.UNPAID,
		isOwing: !paidThisSession,
		// Owing, but say it was inferred rather than read off a record.
		isIndeterminate: !paidThisSession && !sessionAware,
		isLoading: false,
		payUrl: isReturning ? RETURNING_FEE_PAY_URL : APPLICATION_FEE_PAY_URL,
	};
};
