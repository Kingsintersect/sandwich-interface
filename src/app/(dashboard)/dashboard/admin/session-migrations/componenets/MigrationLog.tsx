"use client";

import { CancelCircleIcon, CheckmarkCircle02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { MigrationLogEntry } from "@/hooks/useSessionMigration";

export const MigrationLog = ({ logs }: { logs: MigrationLogEntry[] }) => {
    if (logs.length === 0) return null;

    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="border-b border-border px-6 py-5">
                <h3 className="font-semibold text-ocean-900 dark:text-foreground">Activity</h3>
            </div>

            <ul className="max-h-64 divide-y divide-border overflow-y-auto">
                {logs.map((log) => (
                    <li key={log.id} className="flex items-start gap-3 px-6 py-3 text-sm">
                        <span className="shrink-0 pt-0.5">
                            {log.type === 'success' && (
                                <Icon icon={CheckmarkCircle02Icon} className="size-4 text-emerald-600 dark:text-emerald-400" />
                            )}
                            {log.type === 'error' && (
                                <Icon icon={CancelCircleIcon} className="size-4 text-destructive" />
                            )}
                            {log.type === 'info' && (
                                <Icon icon={InformationCircleIcon} className="size-4 text-ocean-500" />
                            )}
                        </span>
                        <span
                            className={cn(
                                "min-w-0 flex-1",
                                log.type === 'success' && "text-emerald-700 dark:text-emerald-300",
                                log.type === 'error' && "text-destructive",
                                log.type === 'info' && "text-foreground/80"
                            )}
                        >
                            {log.message}
                        </span>
                        <time className="shrink-0 font-mono text-xs text-muted-foreground">
                            {log.timestamp}
                        </time>
                    </li>
                ))}
            </ul>
        </section>
    );
};
