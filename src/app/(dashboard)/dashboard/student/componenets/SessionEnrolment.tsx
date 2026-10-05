"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    AlertDiamondIcon,
    ArrowRight01Icon,
    Calendar03Icon,
    CheckmarkCircle02Icon,
    Loading03Icon,
} from "@hugeicons/core-free-icons";
import { UpgradeStudentSession } from "@/app/actions/student";
import { useAcademicSessions } from "@/hooks/useAccademics";
import { useAuth } from "@/contexts/AuthContext";
import { notify } from "@/contexts/ToastProvider";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import ReturningFeeDialog from "./ReturningFeeDialog";

/**
 * Lets a student move themselves into another academic session.
 * Sessions come from the public sessions endpoint; the student's own session
 * is excluded so they cannot re-enrol where they already are.
 */
export default function SessionEnrolment() {
    const { user, access_token, refreshUserData } = useAuth();
    const { data: sessions = [], isLoading } = useAcademicSessions();
    const queryClient = useQueryClient();

    const [selectedId, setSelectedId] = useState<string>("");
    const [confirming, setConfirming] = useState(false);

    // Held separately because the select is cleared on success, and the fee
    // dialog still needs to name the session it is collecting for.
    const [enrolledSession, setEnrolledSession] = useState<string | null>(null);
    const [payingFee, setPayingFee] = useState(false);

    const currentSession = (user?.academic_session as string) ?? null;

    // Anything the student is not already enrolled in.
    const available = useMemo(
        () => sessions.filter((s) => s.name !== currentSession),
        [sessions, currentSession]
    );

    const selected = available.find((s) => String(s.id) === selectedId);

    const enrol = useMutation({
        mutationFn: async (sessionId: number) => {
            const res = await UpgradeStudentSession(access_token ?? "", { session_id: sessionId });
            if (res?.error) {
                throw new Error(res.error.message ?? "Could not enrol you in that session");
            }
            return res?.success;
        },
        onSuccess: async () => {
            const movedTo = selected?.name ?? null;
            notify({
                message: `You are now enrolled in ${movedTo ?? "the new session"}`,
                variant: "success",
                timeout: 5000,
            });
            setSelectedId("");
            setConfirming(false);
            await refreshUserData?.();
            queryClient.invalidateQueries({ queryKey: ["student-grade-report"] });
            queryClient.invalidateQueries({ queryKey: ["student-payment-history"] });

            // Enrolling is only half of it - the returning fee for the new
            // session is owed straight away, so go on to programme and payment
            // rather than leaving the student to find it.
            setEnrolledSession(movedTo);
            setPayingFee(true);
        },
        onError: (error) => {
            notify({
                message: error instanceof Error ? error.message : "Enrolment failed",
                variant: "error",
                timeout: 6000,
            });
            setConfirming(false);
        },
    });

    return (
        <>
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center gap-3 border-b border-border px-6 py-5">
                <span className="flex size-10 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600 dark:bg-ocean-900/50 dark:text-ocean-300">
                    <Icon icon={Calendar03Icon} className="size-5" />
                </span>
                <div>
                    <h3 className="font-semibold text-ocean-900 dark:text-foreground">
                        Session enrolment
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        You are currently on{" "}
                        <span className="font-semibold text-ocean-800 dark:text-foreground">
                            {currentSession ?? "no session"}
                        </span>
                    </p>
                </div>
            </div>

            <div className="p-6">
                {isLoading ? (
                    <div className="h-10 animate-pulse rounded-full bg-muted" />
                ) : available.length === 0 ? (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon icon={CheckmarkCircle02Icon} className="size-4 text-emerald-600" />
                        There is no other session open to enrol in right now.
                    </p>
                ) : confirming && selected ? (
                    <div className="rounded-xl border border-amber-300/50 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/30">
                        <div className="flex items-start gap-3">
                            <Icon
                                icon={AlertDiamondIcon}
                                className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400"
                            />
                            <div className="min-w-0">
                                <p className="font-semibold text-amber-900 dark:text-amber-200">
                                    Enrol in {selected.name}?
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-amber-800/80 dark:text-amber-200/70">
                                    Your account moves from{" "}
                                    <strong>{currentSession ?? "no session"}</strong> to{" "}
                                    <strong>{selected.name}</strong>. Your courses and results
                                    for the new session start fresh.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2.5">
                            <Button
                                onClick={() => enrol.mutate(selected.id)}
                                disabled={enrol.isPending}
                                className="ember-surface rounded-full text-white shadow-ember hover:bg-none hover:bg-ember-700"
                            >
                                {enrol.isPending && (
                                    <Icon icon={Loading03Icon} className="size-4 animate-spin" />
                                )}
                                {enrol.isPending ? "Enrolling..." : "Yes, enrol me"}
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-full"
                                onClick={() => setConfirming(false)}
                                disabled={enrol.isPending}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex-1">
                            <label
                                htmlFor="enrol-session"
                                className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                            >
                                Move to session
                            </label>
                            <Select value={selectedId} onValueChange={setSelectedId}>
                                <SelectTrigger id="enrol-session" className="w-full">
                                    <SelectValue placeholder="Select a session" />
                                </SelectTrigger>
                                <SelectContent>
                                    {available.map((session) => (
                                        <SelectItem key={session.id} value={String(session.id)}>
                                            {session.name}
                                            {session.status === "ACTIVE" ? " (current session)" : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={() => setConfirming(true)}
                            disabled={!selected}
                            className={cn("group shrink-0 rounded-full")}
                        >
                            Continue
                            <Icon
                                icon={ArrowRight01Icon}
                                className="size-4 transition-transform group-hover:translate-x-0.5"
                            />
                        </Button>
                    </div>
                )}
            </div>
        </section>

        <ReturningFeeDialog
            open={payingFee}
            onOpenChange={setPayingFee}
            session={enrolledSession ?? (user?.academic_session as string) ?? null}
        />
        </>
    );
}
