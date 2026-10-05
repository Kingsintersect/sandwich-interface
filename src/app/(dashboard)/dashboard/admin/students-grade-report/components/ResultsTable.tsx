"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { studentName, toNumber, type ResultRow } from "@/hooks/useResults";

const gradeStyles: Record<string, string> = {
    A: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    B: "bg-ocean-50 text-ocean-700 dark:bg-ocean-900/50 dark:text-ocean-200",
    C: "bg-ocean-50 text-ocean-700 dark:bg-ocean-900/50 dark:text-ocean-200",
    D: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    E: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    F: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
};

export function ResultsTable({
    rows,
    isLoading,
    isError,
}: {
    rows: ResultRow[];
    isLoading?: boolean;
    isError?: boolean;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-5">
                <h2 className="font-semibold text-ocean-900 dark:text-foreground">Results</h2>
                {!isLoading && !isError && rows.length > 0 && (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                        {rows.length}
                    </span>
                )}
            </div>

            {isLoading ? (
                <div className="space-y-3 p-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-10 animate-pulse rounded-lg bg-muted/60" />
                    ))}
                </div>
            ) : isError ? (
                <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                    Could not load results. Please try again.
                </p>
            ) : rows.length === 0 ? (
                <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No results match these filters.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Student</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead className="text-center">CU</TableHead>
                                <TableHead className="text-center">Assign.</TableHead>
                                <TableHead className="text-center">Quiz</TableHead>
                                <TableHead className="text-center">Exam</TableHead>
                                <TableHead className="text-center">Score</TableHead>
                                <TableHead className="text-center">Grade</TableHead>
                                <TableHead className="text-center">QP</TableHead>
                                <TableHead>Session</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row) => {
                                const grade = (row.grade ?? "").toUpperCase();
                                const published = (row.status ?? "").toLowerCase() === "published";
                                const bonus = toNumber(row.bonus_points_applied);

                                return (
                                    <TableRow key={row.id}>
                                        <TableCell>
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-ocean-900 dark:text-foreground">
                                                    {studentName(row)}
                                                </p>
                                                <p className="truncate font-mono text-xs text-muted-foreground">
                                                    {row.user?.reg_number ?? "—"}
                                                </p>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="min-w-0">
                                                <p className="font-mono text-xs font-semibold text-ember-600">
                                                    {row.course_code ?? "—"}
                                                </p>
                                                <p className="max-w-56 truncate text-xs text-muted-foreground">
                                                    {row.course_title ?? "—"}
                                                </p>
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-center tabular-nums text-muted-foreground">
                                            {row.credit_load ?? "—"}
                                        </TableCell>
                                        <TableCell className="text-center tabular-nums text-muted-foreground">
                                            {toNumber(row.assignment)}
                                        </TableCell>
                                        <TableCell className="text-center tabular-nums text-muted-foreground">
                                            {toNumber(row.quiz)}
                                        </TableCell>
                                        <TableCell className="text-center tabular-nums text-muted-foreground">
                                            {toNumber(row.exam)}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            <span className="font-semibold tabular-nums text-ocean-900 dark:text-foreground">
                                                {toNumber(row.score)}
                                            </span>
                                            {bonus > 0 && (
                                                <span
                                                    className="ml-1 text-[10px] font-semibold text-ember-600"
                                                    title={`Includes ${bonus} bonus point${bonus === 1 ? "" : "s"}`}
                                                >
                                                    +{bonus}
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            <span
                                                className={cn(
                                                    "inline-flex min-w-7 justify-center rounded-full px-2.5 py-1 text-xs font-bold",
                                                    gradeStyles[grade] ?? "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                {grade || "—"}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-center tabular-nums text-muted-foreground">
                                            {toNumber(row.quality_point)}
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                            {row.session ?? "—"}
                                        </TableCell>

                                        <TableCell>
                                            <span
                                                className={cn(
                                                    "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]",
                                                    published
                                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                                                        : "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                {row.status ?? "—"}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </section>
    );
}
