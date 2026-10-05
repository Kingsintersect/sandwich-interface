import { Task01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { StudentAssessment } from "@/hooks/useStudentAcademics";

/**
 * Real coursework pulled from the grade report's per-course activities.
 * The API carries a score but no due date, so this lists marks and what is
 * still outstanding rather than pretending to be a deadline tracker.
 */
export function RecentAssessments({
    assessments,
    isLoading,
    isError,
}: {
    assessments: StudentAssessment[];
    isLoading?: boolean;
    isError?: boolean;
}) {
    return (
        <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-5">
                <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-ember-50 text-ember-600 dark:bg-ember-900/40 dark:text-ember-300">
                        <Icon icon={Task01Icon} className="size-5" />
                    </span>
                    <h3 className="font-semibold text-ocean-900 dark:text-foreground">
                        Coursework &amp; assessments
                    </h3>
                </div>
                {!isLoading && !isError && assessments.length > 0 && (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                        {assessments.length}
                    </span>
                )}
            </div>

            {isLoading ? (
                <ul className="divide-y divide-border">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <li key={i} className="px-6 py-5">
                            <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />
                            <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-muted" />
                        </li>
                    ))}
                </ul>
            ) : isError ? (
                <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                    We could not load your coursework. Please try again later.
                </p>
            ) : assessments.length === 0 ? (
                <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No coursework has been recorded for your courses yet.
                </p>
            ) : (
                <ul className="flex-1 divide-y divide-border">
                    {assessments.map((item) => {
                        const graded = item.score !== null;
                        return (
                            <li
                                key={item.id}
                                className="flex items-start justify-between gap-4 px-6 py-5 transition-colors hover:bg-accent/60"
                            >
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={cn(
                                                "size-1.5 shrink-0 rounded-full",
                                                graded ? "bg-emerald-500" : "bg-ember-500"
                                            )}
                                        />
                                        <h4 className="truncate text-sm font-semibold text-ocean-900 dark:text-foreground">
                                            {item.name}
                                        </h4>
                                    </div>
                                    <p className="mt-1 pl-3.5 text-xs capitalize text-muted-foreground">
                                        {item.courseCode} &middot; {item.type}
                                    </p>
                                </div>

                                {graded ? (
                                    <span className="shrink-0 text-sm font-bold tabular-nums text-ocean-800 dark:text-ocean-200">
                                        {item.score}
                                    </span>
                                ) : (
                                    <span className="shrink-0 rounded-full bg-ember-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-ember-700 dark:bg-ember-900/40 dark:text-ember-300">
                                        Pending
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
