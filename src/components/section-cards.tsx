import {
    CheckmarkCircle02Icon,
    CancelCircleIcon,
    UserGroupIcon,
    UserMinus01Icon,
} from "@hugeicons/core-free-icons";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface StudentStat {
    totalStudents: number;
    totalAdmitted: number;
    totalApplied: number;
    totalRejected: number;
    totalUnapplied: number;
}

interface SectionCardsProps {
    studentStat: StudentStat;
}

function StatTile({
    label,
    value,
    hint,
    icon,
    tone,
}: {
    label: string;
    value: number;
    hint?: string;
    icon: IconSvgElement;
    tone: string;
}) {
    return (
        <div className="lift group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft">
            <span className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-ember-500/0 blur-3xl transition-all duration-500 group-hover:bg-ember-500/15" />

            <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {label}
                    </p>
                    <h3 className="mt-2 text-3xl font-bold tabular-nums text-ocean-900 dark:text-foreground">
                        {value}
                    </h3>
                    {hint && (
                        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
                    )}
                </div>

                <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", tone)}>
                    <Icon icon={icon} className="size-5.5" />
                </span>
            </div>
        </div>
    );
}

export function SectionCards({ studentStat }: SectionCardsProps) {
    const {
        totalStudents = 0,
        totalAdmitted = 0,
        totalApplied = 0,
        totalRejected = 0,
        totalUnapplied = 0,
    } = studentStat ?? {};

    const share = (n: number) =>
        totalStudents > 0 ? `${Math.round((n / totalStudents) * 100)}% of all accounts` : undefined;

    return (
        <div className="grid grid-cols-1 gap-5 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <StatTile
                label="Total accounts"
                value={totalStudents}
                hint={`${totalUnapplied} yet to apply`}
                icon={UserGroupIcon}
                tone="bg-ocean-50 text-ocean-600 dark:bg-ocean-900/50 dark:text-ocean-300"
            />
            <StatTile
                label="Admitted"
                value={totalAdmitted}
                hint={share(totalAdmitted)}
                icon={CheckmarkCircle02Icon}
                tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
            />
            <StatTile
                label="Pending review"
                value={totalApplied}
                hint={share(totalApplied)}
                icon={UserMinus01Icon}
                tone="bg-ember-50 text-ember-600 dark:bg-ember-900/40 dark:text-ember-300"
            />
            <StatTile
                label="Rejected"
                value={totalRejected}
                hint={share(totalRejected)}
                icon={CancelCircleIcon}
                tone="bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300"
            />
        </div>
    );
}
