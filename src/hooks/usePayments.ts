import { baseUrl, remoteApiUrl } from "@/config";
import { useMutation } from "@tanstack/react-query";

interface InitialideApplicationFormPurchaseResponse {
    // define your expected response structure
    status: number | string;
    message?: string;
    data?: Record<string, unknown>;
    error: [];
}

async function InitializeApplicationFormPurchase(access_token: string): Promise<InitialideApplicationFormPurchaseResponse> {
    console.log('access_token', access_token)
    const res = await fetch(`${remoteApiUrl}/application/retry-purchase`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch retry purchase data");
    }

    const result = await res.json();
    return result;
}

export function useApplicationFormPurchase() {
    return useMutation<InitialideApplicationFormPurchaseResponse, Error, { access_token: string }>({
        mutationFn: ({ access_token }) => InitializeApplicationFormPurchase(access_token),
    });
}

/** Where the gateway sends the student back after the returning fee. */
export const RETURN_FEE_CALLBACK_URL = `${baseUrl}/admission/payments/verify-return-fee`;

/**
 * Starts the returning fee payment for a signed-in student.
 *
 * POST /account/pay-return-fee  { program_id, program_name, callback_url }
 *
 * `callback_url` is where the gateway returns the student afterwards, the same
 * arrangement the new-student payment uses with
 * `/admission/payments/verify-admission`.
 *
 * The student picks the programme they are returning into first - the same
 * programme tree the application step shows - because the fee is charged
 * against a programme, not against the account.
 */
async function InitializeReturningFeePayment({
    access_token,
    program_id,
    program_name,
}: ReturningFeePaymentInput): Promise<InitialideApplicationFormPurchaseResponse> {
    const res = await fetch(`${remoteApiUrl}/account/pay-return-fee`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
        },
        body: JSON.stringify({
            program_id,
            program_name,
            callback_url: RETURN_FEE_CALLBACK_URL,
        }),
    });

    const result = await res.json().catch(() => null);

    if (!res.ok) {
        // Surface the server's own message - it explains refusals such as the
        // fee already being paid for this session.
        throw new Error(
            JSON.stringify(result ?? { message: "Failed to start the returning fee payment" })
        );
    }

    return result;
}

export type ReturningFeePaymentInput = {
    access_token: string;
    program_id: number | string;
    program_name: string;
};

export function useReturningFeePayment() {
    return useMutation<InitialideApplicationFormPurchaseResponse, Error, ReturningFeePaymentInput>({
        mutationFn: InitializeReturningFeePayment,
    });
}

/**
 * The gateway link out of a purchase response. The field name is not consistent
 * across these endpoints, so every spelling seen is accepted rather than
 * failing silently and leaving the student on a dead button.
 */
export function readCheckoutUrl(data?: Record<string, unknown>): string | null {
    if (!data) return null;

    const candidates = [
        data.authorizationUrl,
        data.authorization_url,
        data.paymentUrl,
        data.payment_url,
        data.checkoutUrl,
        data.url,
    ];

    const found = candidates.find((v) => typeof v === "string" && v.trim());
    return (found as string | undefined) ?? null;
}
