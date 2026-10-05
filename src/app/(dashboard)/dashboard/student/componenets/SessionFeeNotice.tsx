"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    AlertDiamondIcon,
    ArrowRight01Icon,
    CreditCardIcon,
    Loading03Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useSessionFee } from "@/hooks/useSessionFee";
import { useApplicationFormPurchase, readCheckoutUrl } from "@/hooks/usePayments";
import { useAuth } from "@/contexts/AuthContext";
import { APPLICATION_FEE } from "@/config";
import { formatToCurrency } from "@/lib/utils";
import { toastApiError } from "@/lib/toastApiError";
import ReturningFeeDialog from "./ReturningFeeDialog";

/**
 * Prompts a student who owes the fee for the session they are currently on.
 *
 * The two cases take different routes to the gateway. A returning student picks
 * the programme they are returning into first, because
 * `/account/pay-return-fee` is charged against a programme; a first-year has
 * already chosen one during signup, so they go straight to
 * `/application/retry-purchase`.
 */
export default function SessionFeeNotice() {
    const { label, isReturning, session, isOwing, isIndeterminate, isLoading } =
        useSessionFee();
    const { access_token } = useAuth();
    const router = useRouter();

    const [pickingProgramme, setPickingProgramme] = useState(false);

    const { mutate, data, isPending, isError, error } = useApplicationFormPurchase();

    const goToGateway = useCallback((url: string) => router.push(url), [router]);

    useEffect(() => {
        if (data?.status === 200) {
            const url = readCheckoutUrl(data.data);
            if (url) goToGateway(url);
            else toastApiError(null, "The payment gateway did not return a checkout link");
        } else if (isError) {
            toastApiError(error, "Could not start your application fee payment");
        }
    }, [data, isError, error, goToGateway]);

    if (isLoading || !isOwing) return null;

    return (
        <>
            <section className="flex flex-col gap-4 rounded-2xl border border-ember-200 bg-ember-50 p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between dark:border-ember-900/60 dark:bg-ember-950/40">
                <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ember-100 text-ember-700 dark:bg-ember-900/60 dark:text-ember-200">
                        <Icon icon={AlertDiamondIcon} className="size-5" />
                    </span>

                    <div className="min-w-0">
                        <h3 className="font-semibold text-ember-900 dark:text-ember-100">
                            {label} outstanding
                            {session ? ` for ${session}` : ""}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-ember-800 dark:text-ember-100/80">
                            {isReturning
                                ? `You have enrolled into a new session. Choose your programme and pay the returning fee of ${formatToCurrency(APPLICATION_FEE)} to complete your registration for it.`
                                : `Pay your application fee of ${formatToCurrency(APPLICATION_FEE)} to continue with your admission.`}
                            {isIndeterminate && (
                                <span className="mt-1 block text-xs text-ember-700 dark:text-ember-200/70">
                                    No payment on your record is tagged to this session. If you
                                    have already paid for it, contact the registry.
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() =>
                        isReturning
                            ? setPickingProgramme(true)
                            : access_token && mutate({ access_token })
                    }
                    disabled={!access_token || (!isReturning && isPending)}
                    className="ember-surface group shrink-0 rounded-full text-white shadow-ember hover:bg-none hover:bg-ember-700"
                >
                    <Icon
                        icon={!isReturning && isPending ? Loading03Icon : CreditCardIcon}
                        className={!isReturning && isPending ? "size-4 animate-spin" : "size-4"}
                    />
                    {!isReturning && isPending
                        ? "Starting payment…"
                        : isReturning
                            ? "Choose programme"
                            : `Pay ${label.toLowerCase()}`}
                    {!(!isReturning && isPending) && (
                        <Icon
                            icon={ArrowRight01Icon}
                            className="size-4 transition-transform group-hover:translate-x-0.5"
                        />
                    )}
                </Button>
            </section>

            <ReturningFeeDialog
                open={pickingProgramme}
                onOpenChange={setPickingProgramme}
                session={session}
            />
        </>
    );
}
