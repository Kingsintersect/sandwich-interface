"use client";

import { AlertDiamondIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    from,
    to,
    isPending = false,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    from?: string;
    to?: string;
    isPending?: boolean;
}) => {
    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-ocean-950/60 p-4 backdrop-blur-sm"
        >
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-float">
                <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                        <Icon icon={AlertDiamondIcon} className="size-5" />
                    </span>
                    <div>
                        <h3 className="font-semibold text-ocean-900 dark:text-foreground">
                            Change the active session?
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                            This sets the session the whole programme runs on. Every
                            screen that reads the current session will follow it.
                        </p>
                    </div>
                </div>

                <dl className="mt-5 space-y-2 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground">Currently active</dt>
                        <dd className="font-semibold text-ocean-900 dark:text-foreground">
                            {from || "None"}
                        </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground">Becomes active</dt>
                        <dd className="font-semibold text-ember-600">{to || "—"}</dd>
                    </div>
                </dl>

                <div className="mt-6 flex justify-end gap-2.5">
                    <Button variant="outline" className="rounded-full" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button className="rounded-full" onClick={onConfirm} disabled={isPending}>
                        {isPending ? "Activating..." : "Yes, activate"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
