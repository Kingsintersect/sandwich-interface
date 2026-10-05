"use client";
import React from 'react';
import { AcademicStanding as AcademicStandingType } from '@/lib/gpa.utils';
import { cn } from '@/lib/utils';

type AcademicStandingProps = {
    gpa: number;
    degreeClass: string;
    academicStanding: AcademicStandingType;
};

const getProgressColor = (gpa: number) => {
    if (gpa >= 4.5) return 'bg-emerald-500';
    if (gpa >= 3.5) return 'bg-ocean-500';
    if (gpa >= 2.4) return 'bg-ocean-400';
    if (gpa >= 1.5) return 'bg-ember-500';
    return 'bg-red-500';
};

const getNextTarget = (currentGPA: number) => {
    if (currentGPA < 1.5) return { target: 1.5, label: 'Third Class' };
    if (currentGPA < 2.4) return { target: 2.4, label: 'Second Class Lower' };
    if (currentGPA < 3.5) return { target: 3.5, label: 'Second Class Upper' };
    if (currentGPA < 4.5) return { target: 4.5, label: 'First Class' };
    return { target: 5.0, label: 'Perfect score' };
};

export const AcademicStanding = React.memo(({
    gpa,
    degreeClass,
    academicStanding
}: AcademicStandingProps) => {
    const progressPercentage = (gpa / 5.0) * 100;
    const nextTarget = getNextTarget(gpa);
    const remaining = Math.max(nextTarget.target - gpa, 0);

    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-600">
                Academic standing
            </h4>

            <div className="mt-5 rounded-xl border border-border bg-muted/30 px-5 py-6 text-center">
                <div className="text-4xl font-bold tabular-nums text-ocean-900 dark:text-foreground">
                    {gpa.toFixed(2)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Cumulative GPA</p>
                <span className="mt-3 inline-flex rounded-full bg-ocean-50 px-3 py-1 text-xs font-semibold text-ocean-700 dark:bg-ocean-900/50 dark:text-ocean-200">
                    {degreeClass}
                </span>
            </div>

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress on the 5.00 scale</span>
                    <span className="font-semibold tabular-nums text-ocean-800 dark:text-foreground">
                        {progressPercentage.toFixed(1)}%
                    </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-700 ease-out",
                            getProgressColor(gpa)
                        )}
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                </div>
            </div>

            <dl className="mt-5 space-y-2.5 border-t border-border pt-4 text-xs">
                <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Standing</dt>
                    <dd className="font-semibold text-ocean-900 dark:text-foreground">
                        {academicStanding.text}
                    </dd>
                </div>
                {remaining > 0 && (
                    <div className="flex items-center justify-between gap-3">
                        <dt className="text-muted-foreground">Next class</dt>
                        <dd className="text-right font-semibold text-ocean-900 dark:text-foreground">
                            {nextTarget.label}
                            <span className="ml-1.5 font-normal text-muted-foreground">
                                (+{remaining.toFixed(2)})
                            </span>
                        </dd>
                    </div>
                )}
            </dl>
        </div>
    );
});

AcademicStanding.displayName = 'AcademicStanding';
