"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Alert02Icon,
    CreditCardIcon,
    Loading03Icon,
    Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
    DetachedProgramAccordion,
    type ProgramNode,
} from "@/components/forms/DetachedProgramAccordionDisplay";
import { useExternalPrograms } from "@/hooks/useExternalPrograms";
import { useReturningFeePayment, readCheckoutUrl } from "@/hooks/usePayments";
import { useAuth } from "@/contexts/AuthContext";
import { APPLICATION_FEE } from "@/config";
import { cn, formatToCurrency } from "@/lib/utils";
import { toastApiError } from "@/lib/toastApiError";

type ReturningFeeProgrammePickerProps = {
    /** The session the fee is for, so the student can check it before paying. */
    session?: string | null;
    /** Renders a cancel button when the picker sits in something dismissable. */
    onCancel?: () => void;
    /** Reset the choice whenever this flips to true (e.g. a dialog opening). */
    resetKey?: boolean;
    /** Suppress the intro line when the container already carries one. */
    hideIntro?: boolean;
    /**
     * The surface the pinned action bar sits on. `--card` and `--background`
     * are different shades, so the caller names whichever it uses or the bar
     * reads as the wrong tone when it overlaps scrolling content.
     */
    surfaceClassName?: string;
};

/**
 * Programme choice, then payment, for a student returning into a new session.
 *
 * The fee is charged against a programme - `POST /account/pay-return-fee` takes
 * `program_id` and `program_name` - so nothing is said about paying until a
 * programme has been picked. It is the same tree the application step shows,
 * from `/odl/our-programs`, rendered through the form-free accordion so no
 * react-hook-form is needed.
 *
 * Shared by the dashboard notice and the admission page so the two cannot drift.
 */
export default function ReturningFeeProgrammePicker({
    session,
    onCancel,
    resetKey,
    hideIntro,
    surfaceClassName = "bg-card",
}: ReturningFeeProgrammePickerProps) {
    const { access_token } = useAuth();
    const router = useRouter();

    const { data: programs, isLoading, isError } = useExternalPrograms();
    const [selected, setSelected] = useState<{ id: number; name: string } | null>(null);

    const { mutate, data, isPending, isError: payFailed, error } = useReturningFeePayment();

    useEffect(() => {
        if (resetKey) setSelected(null);
    }, [resetKey]);

    useEffect(() => {
        if (data) {
            const url = readCheckoutUrl(data.data);
            if (url) {
                router.push(url);
                return;
            }
            toastApiError(
                data.message ?? null,
                "The payment gateway did not return a checkout link"
            );
        } else if (payFailed) {
            toastApiError(error, "Could not start your returning fee payment");
        }
    }, [data, payFailed, error, router]);

    // `/odl/our-programs` is passed through raw elsewhere, so it may arrive as a
    // bare array or wrapped by the usual Laravel envelope. Accept either.
    const nodes: ProgramNode[] = Array.isArray(programs)
        ? (programs as ProgramNode[])
        : Array.isArray((programs as { data?: unknown } | undefined)?.data)
            ? ((programs as { data: ProgramNode[] }).data)
            : [];

    return (
        <div className="space-y-4">
            {!hideIntro && (
                <p className="text-sm text-muted-foreground">
                    Select the programme you are returning into
                    {session ? ` for ${session}` : ""}. You can pay once you have chosen one.
                </p>
            )}

            {isLoading && (
                <div className="space-y-2.5">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="h-11 animate-pulse rounded-lg bg-muted" />
                    ))}
                </div>
            )}

            {isError && (
                <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                    <Icon icon={Alert02Icon} className="mt-0.5 size-5 shrink-0 text-destructive" />
                    <div>
                        <p className="font-semibold text-destructive">Failed to load programmes</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            Check your network connection and try again.
                        </p>
                    </div>
                </div>
            )}

            {!isLoading && !isError && nodes.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    No programmes are open for enrolment right now.
                </p>
            )}

            {!isLoading && nodes.length > 0 && (
                <div className="max-h-[20rem] overflow-y-auto overscroll-contain rounded-xl border border-border p-2">
                    <DetachedProgramAccordion
                        nodes={nodes}
                        selectedValue={selected?.name}
                        onProgramSelect={setSelected}
                    />
                </div>
            )}

            <div
                className={cn(
                    "sticky bottom-0 -mx-1 flex flex-col gap-3 border-t border-border px-1 pb-1 pt-4 sm:flex-row sm:items-center sm:justify-between",
                    surfaceClassName
                )}
            >
                {selected ? (
                    <p className="flex min-w-0 items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        <Icon icon={Tick02Icon} className="size-4 shrink-0" />
                        <span className="min-w-0 truncate">{selected.name}</span>
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No programme chosen yet
                    </p>
                )}

                <div className="flex flex-wrap justify-end gap-2.5">
                {onCancel && (
                    <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={onCancel}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    onClick={() =>
                        selected &&
                        access_token &&
                        mutate({
                            access_token,
                            program_id: selected.id,
                            program_name: selected.name,
                        })
                    }
                    disabled={!selected || !access_token || isPending}
                    className="ember-surface rounded-full text-white shadow-ember hover:bg-none hover:bg-ember-700"
                >
                    <Icon
                        icon={isPending ? Loading03Icon : CreditCardIcon}
                        className={isPending ? "size-4 animate-spin" : "size-4"}
                    />
                    {isPending
                        ? "Starting payment…"
                        : selected
                            ? `Pay returning fee — ${formatToCurrency(APPLICATION_FEE)}`
                            : "Choose a programme to continue"}
                </Button>
                </div>
            </div>
        </div>
    );
}
