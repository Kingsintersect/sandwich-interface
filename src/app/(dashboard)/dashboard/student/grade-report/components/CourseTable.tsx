"use client";
import React from 'react';
import { getGradePoint, calculateQualityPoints, GPACourse } from '@/lib/gpa.utils';
import { cn } from '@/lib/utils';

type CourseTableProps = {
    courses: GPACourse[];
};

const gradeStyles: Record<string, string> = {
    A: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    B: "bg-ocean-50 text-ocean-700 dark:bg-ocean-900/50 dark:text-ocean-200",
    C: "bg-ocean-50 text-ocean-700 dark:bg-ocean-900/50 dark:text-ocean-200",
    D: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    E: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    F: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
};

export const CourseTable = React.memo(({ courses }: CourseTableProps) => (
    <div className="px-7 py-6">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-600">
            Course performance
        </h3>

        {courses.length === 0 ? (
            <p className="rounded-2xl border border-border bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
                No graded courses have been recorded for this session yet.
            </p>
        ) : (
            <>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-muted/50 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                                <th className="px-5 py-3 text-left font-semibold">Code</th>
                                <th className="px-5 py-3 text-left font-semibold">Course</th>
                                <th className="px-5 py-3 text-center font-semibold">CU</th>
                                <th className="px-5 py-3 text-center font-semibold">Score</th>
                                <th className="px-5 py-3 text-center font-semibold">Grade</th>
                                <th className="px-5 py-3 text-center font-semibold">GP</th>
                                <th className="px-5 py-3 text-center font-semibold">QP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {courses.map((course) => {
                                const gradePoint = getGradePoint(course.grade);
                                const qualityPoints = calculateQualityPoints(course.grade, course.credit_load);

                                return (
                                    <tr key={course.course_id} className="transition-colors hover:bg-accent/50">
                                        <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-ember-600">
                                            {course.course_code}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div
                                                className="max-w-xs truncate font-medium text-ocean-900 dark:text-foreground"
                                                title={course.course_name}
                                            >
                                                {course.course_name}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-center tabular-nums text-muted-foreground">
                                            {course.credit_load}
                                        </td>
                                        <td className="px-5 py-4 text-center font-semibold tabular-nums text-ocean-900 dark:text-foreground">
                                            {course.finalgrade || 0}%
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span
                                                className={cn(
                                                    "inline-flex min-w-7 justify-center rounded-full px-2.5 py-1 text-xs font-bold",
                                                    gradeStyles[course.grade?.toUpperCase()] ?? "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                {course.grade}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center tabular-nums text-muted-foreground">
                                            {gradePoint.toFixed(2)}
                                        </td>
                                        <td className="px-5 py-4 text-center font-semibold tabular-nums text-ocean-700 dark:text-ocean-300">
                                            {qualityPoints.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}

                            <tr className="bg-ocean-50/60 font-semibold dark:bg-ocean-900/30">
                                <td colSpan={2} className="px-5 py-4 text-right text-ocean-900 dark:text-foreground">
                                    Totals
                                </td>
                                <td className="px-5 py-4 text-center tabular-nums text-ocean-700 dark:text-ocean-300">
                                    {courses.reduce((sum, course) => sum + course.credit_load, 0)}
                                </td>
                                <td className="px-5 py-4 text-center text-muted-foreground">&mdash;</td>
                                <td className="px-5 py-4 text-center text-muted-foreground">&mdash;</td>
                                <td className="px-5 py-4 text-center text-muted-foreground">&mdash;</td>
                                <td className="px-5 py-4 text-center tabular-nums text-ocean-700 dark:text-ocean-300">
                                    {courses.reduce((sum, course) =>
                                        sum + calculateQualityPoints(course.grade, course.credit_load), 0
                                    ).toFixed(2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 rounded-xl border border-border bg-muted/30 px-5 py-4 text-xs leading-relaxed text-muted-foreground">
                    <p>
                        <strong className="text-ocean-800 dark:text-foreground">GPA</strong> = total
                        quality points (TQP) &divide; total credit units (TCU).
                    </p>
                    <p className="mt-1">
                        <strong className="text-ocean-800 dark:text-foreground">Quality points</strong> =
                        grade point &times; credit units, per course.
                    </p>
                </div>
            </>
        )}
    </div>
));

CourseTable.displayName = 'CourseTable';
