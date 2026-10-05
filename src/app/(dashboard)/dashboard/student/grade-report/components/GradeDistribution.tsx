"use client";
import React from 'react';
import { GPACourse } from '@/lib/gpa.utils';

type GradeDistributionProps = {
    courses: GPACourse[];
};

const gradeData = [
    { grade: 'A', name: 'Excellent (70-100%)', bar: 'bg-emerald-500' },
    { grade: 'B', name: 'Very good (60-69%)', bar: 'bg-ocean-500' },
    { grade: 'C', name: 'Good (50-59%)', bar: 'bg-ocean-400' },
    { grade: 'D', name: 'Fair (45-49%)', bar: 'bg-ember-500' },
    { grade: 'E', name: 'Pass (40-44%)', bar: 'bg-amber-500' },
    { grade: 'F', name: 'Fail (0-39%)', bar: 'bg-red-500' },
];

export const GradeDistribution = React.memo(({ courses }: GradeDistributionProps) => {
    const gradeAnalysis = React.useMemo(
        () =>
            gradeData.map((gradeInfo) => {
                const count = courses.filter(
                    (course) => course.grade?.toUpperCase() === gradeInfo.grade
                ).length;
                const percentage = courses.length > 0 ? (count / courses.length) * 100 : 0;
                return { ...gradeInfo, count, percentage: Math.round(percentage) };
            }),
        [courses]
    );

    const maxCount = Math.max(...gradeAnalysis.map((g) => g.count), 1);

    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-600">
                Grade distribution
            </h4>

            <div className="mt-5 space-y-3.5">
                {gradeAnalysis.map(({ grade, name, bar, count, percentage }) => (
                    <div key={grade} className="flex items-center gap-3">
                        <span className="w-5 shrink-0 text-center text-sm font-bold text-ocean-900 dark:text-foreground">
                            {grade}
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="mb-1.5 flex items-center justify-between gap-3">
                                <span className="truncate text-xs text-muted-foreground">{name}</span>
                                <span className="shrink-0 text-xs font-semibold tabular-nums text-ocean-800 dark:text-foreground">
                                    {count} ({percentage}%)
                                </span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${bar}`}
                                    style={{ width: `${(count / maxCount) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5 flex justify-between border-t border-border pt-4 text-xs">
                <span className="text-muted-foreground">Total courses</span>
                <span className="font-semibold tabular-nums text-ocean-900 dark:text-foreground">
                    {courses.length}
                </span>
            </div>
        </div>
    );
});

GradeDistribution.displayName = 'GradeDistribution';
