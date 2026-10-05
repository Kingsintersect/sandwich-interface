import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        positive: boolean;
    };
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
    return (
        <div className="lift group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft">
            {/* Warm corner glow on hover, same gesture as the marketing cards */}
            <span className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-ember-500/0 blur-3xl transition-all duration-500 group-hover:bg-ember-500/15" />

            <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {title}
                    </p>
                    <h3 className="mt-2 text-3xl font-bold tabular-nums text-ocean-900 dark:text-foreground">
                        {value}
                    </h3>

                    {trend && (
                        <p
                            className={cn(
                                "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                                trend.positive
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                                    : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                            )}
                        >
                            <Icon
                                icon={trend.positive ? ArrowUp01Icon : ArrowDown01Icon}
                                className="size-3.5"
                            />
                            {Math.abs(trend.value)}%
                        </p>
                    )}
                </div>

                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600 transition-colors duration-300 group-hover:bg-ocean-600 group-hover:text-white dark:bg-ocean-900/50 dark:text-ocean-300">
                    {icon}
                </span>
            </div>
        </div>
    );
}
