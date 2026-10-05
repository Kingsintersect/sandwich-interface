"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ReturningFeeProgrammePicker from "@/components/payments/ReturningFeeProgrammePicker";

type ReturningFeeDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** The session the fee is being paid for, shown so the student can check it. */
    session?: string | null;
};

/**
 * The returning-fee flow in a dialog, for the student dashboard. The picker
 * itself is shared with the admission page.
 */
export default function ReturningFeeDialog({
    open,
    onOpenChange,
    session,
}: ReturningFeeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-ocean-900 dark:text-foreground">
                        Choose your programme
                    </DialogTitle>
                    <DialogDescription>
                        Select the programme you are returning into
                        {session ? ` for ${session}` : ""}. You can pay once you have
                        chosen one.
                    </DialogDescription>
                </DialogHeader>

                <ReturningFeeProgrammePicker
                    session={session}
                    onCancel={() => onOpenChange(false)}
                    resetKey={open}
                    hideIntro
                    surfaceClassName="bg-background"
                />
            </DialogContent>
        </Dialog>
    );
}
