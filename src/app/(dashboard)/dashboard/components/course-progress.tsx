import { Book02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface CourseProgressItem {
    id: string;
    name: string;
    code: string;
    /** Final score out of 100, or null when nothing has been graded yet. */
    score: number | null;
    grade: string;
    creditLoad: number;
}

interface CourseProgressProps {
    courses: CourseProgressItem[];
    isLoading?: boolean;
    isError?: boolean;
}

// UNIZIK runs the 5.00 system; colour the letter grade by band.
const gradeStyles: Record<string, string> = {
    A: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    B: "bg-ocean-50 text-ocean-700 dark:bg-ocean-900/50 dark:text-ocean-200",
    C: "bg-ocean-50 text-ocean-700 dark:bg-ocean-900/50 dark:text-ocean-200",
    D: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    E: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    F: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
};

export function CourseProgress({ courses, isLoading, isError }: CourseProgressProps) {
    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-5">
                <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600 dark:bg-ocean-900/50 dark:text-ocean-300">
                        <Icon icon={Book02Icon} className="size-5" />
                    </span>
                    <h3 className="font-semibold text-ocean-900 dark:text-foreground">
                        Your courses
                    </h3>
                </div>
                {!isLoading && !isError && courses.length > 0 && (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                        {courses.length}
                    </span>
                )}
            </div>

            {isLoading ? (
                <ul className="divide-y divide-border">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <li key={i} className="px-6 py-5">
                            <div className="h-3.5 w-1/2 animate-pulse rounded bg-muted" />
                            <div className="mt-3 h-1.5 w-full animate-pulse rounded-full bg-muted" />
                        </li>
                    ))}
                </ul>
            ) : isError ? (
                <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                    We could not load your courses. Please try again later.
                </p>
            ) : courses.length === 0 ? (
                <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                    You are not registered for any courses this session yet.
                </p>
            ) : (
                <ul className="divide-y divide-border">
                    {courses.map((course) => (
                        <li key={course.id} className="px-6 py-5">
                            <div className="flex items-baseline justify-between gap-4">
                                <div className="min-w-0">
                                    <h4 className="truncate text-sm font-semibold text-ocean-900 dark:text-foreground">
                                        {course.name}
                                    </h4>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {course.code} &middot; {course.creditLoad} credit
                                        {course.creditLoad === 1 ? "" : "s"}
                                    </p>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    {course.score === null ? (
                                        <span className="text-xs text-muted-foreground">
                                            Not graded
                                        </span>
                                    ) : (
                                        <>
                                            <span className="text-sm font-bold tabular-nums text-ocean-700 dark:text-ocean-300">
                                                {course.score}
                                            </span>
                                            <span
                                                className={cn(
                                                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                                    gradeStyles[course.grade] ?? "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                {course.grade}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                {/* Stays in the blue ramp: an ocean-to-ember fill turned
                                    muddy brown at the short widths most bars sit at. */}
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-ocean-700 to-ocean-400 transition-[width] duration-700 ease-out"
                                    style={{ width: `${course.score ?? 0}%` }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
