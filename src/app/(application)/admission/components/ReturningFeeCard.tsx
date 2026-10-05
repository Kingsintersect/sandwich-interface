"use client";

import { AlertDiamondIcon } from '@hugeicons/core-free-icons';
import { Icon } from '@/components/ui/icon';
import ReturningFeeProgrammePicker from '@/components/payments/ReturningFeeProgrammePicker';

type ReturningFeeCardProps = {
    /** The session the fee is owed for. */
    session?: string | null;
};

/**
 * The returning fee, on the admission page.
 *
 * Sits above the course list because registration for the new session depends
 * on it. Nothing here offers to take a payment until a programme has been
 * chosen - the fee is charged against one.
 */
export const ReturningFeeCard = ({ session }: ReturningFeeCardProps) => {
    return (
        <div className="mb-8 overflow-hidden rounded-3xl border border-ember-200 bg-card shadow-soft dark:border-ember-900/50">
            <div className="flex items-start gap-3 border-b border-ember-200 bg-ember-50 px-7 py-5 dark:border-ember-900/50 dark:bg-ember-950/40">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ember-100 text-ember-700 dark:bg-ember-900/60 dark:text-ember-200">
                    <Icon icon={AlertDiamondIcon} className="size-5" />
                </span>
                <div className="min-w-0">
                    <h3 className="font-semibold text-ember-900 dark:text-ember-100">
                        Returning fee outstanding
                        {session ? ` for ${session}` : ''}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ember-800 dark:text-ember-100/80">
                        You have enrolled into a new session. Choose your programme below to
                        complete your registration for it.
                    </p>
                </div>
            </div>

            <div className="p-7">
                <ReturningFeeProgrammePicker session={session} />
            </div>
        </div>
    );
};
