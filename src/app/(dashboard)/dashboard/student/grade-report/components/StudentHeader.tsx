"use client";
import React from 'react';
import { GPAGradeReport } from '@/lib/gpa.utils';

type StudentHeaderProps = {
    gradeReport: GPAGradeReport;
    gpa: number;
    totalCredits: number;
    totalQualityPoints: number;
    degreeClass: string;
};

export const StudentHeader = React.memo(({
    gradeReport,
    gpa,
    totalCredits,
    totalQualityPoints,
    degreeClass
}: StudentHeaderProps) => {
    // No semesters on the Sandwich programme - the session is the whole period.
    const period = gradeReport.academicYear;

    return (
        <div className="crest-surface relative overflow-hidden px-7 py-8">
            <span className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-ember-500/25 blur-[110px]" />
            <span className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-ocean-400/20 blur-[110px]" />

            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ember-400">
                        Official grade report
                    </span>
                    <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                        Academic performance
                    </h1>
                    {period && (
                        <p className="mt-2 text-sm text-white/60">{period} session</p>
                    )}
                    <p className="mt-1 text-xs text-white/40">
                        Computed on the 5.00 grade point scale
                    </p>
                </div>

                <div className="shrink-0 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:min-w-56">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                        Cumulative GPA
                    </p>
                    <p className="mt-2 text-4xl font-bold tabular-nums text-white">
                        {gpa.toFixed(2)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-ember-400">{degreeClass}</p>

                    <dl className="mt-4 space-y-1 border-t border-white/15 pt-3 text-xs text-white/60">
                        <div className="flex justify-between gap-3">
                            <dt>Credit units (TCU)</dt>
                            <dd className="font-semibold tabular-nums text-white/85">{totalCredits}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                            <dt>Quality points (TQP)</dt>
                            <dd className="font-semibold tabular-nums text-white/85">
                                {totalQualityPoints.toFixed(2)}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
});

StudentHeader.displayName = 'StudentHeader';
