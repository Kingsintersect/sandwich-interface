import { FC } from 'react'
import Link from 'next/link'
import { ArrowUpRight01Icon, Bookmark01Icon, Book02Icon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'

type Lecturer = {
    image_url: string
    name: string
    email: string
    phone: string
}

interface CourseCardProps {
    url?: string
    title: string
    code: string
    credit: string | number
    instructor: Lecturer | null
    /** Final score out of 100 when the course has been graded. */
    score?: number | null
    grade?: string
}

const CourseCard: FC<CourseCardProps> = ({ url, title, instructor, code, credit, score, grade }) => {
    const graded = typeof score === "number" && score > 0;

    return (
        <Link
            href={url ?? "#"}
            target="_blank"
            className="lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
            {/* Warm corner glow on hover, matching the marketing cards */}
            <span className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-ember-500/0 blur-3xl transition-all duration-500 group-hover:bg-ember-500/20" />
            <span className="absolute inset-x-0 top-0 h-[3px] w-0 bg-gradient-to-r from-ocean-600 to-ember-500 transition-all duration-500 group-hover:w-full" />

            <div className="relative flex items-start justify-between gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600 transition-colors duration-300 group-hover:bg-ocean-600 group-hover:text-white dark:bg-ocean-900/50 dark:text-ocean-300">
                    <Icon icon={Book02Icon} className="size-5" />
                </span>
                <Icon
                    icon={ArrowUpRight01Icon}
                    className="size-5 -translate-y-1 text-muted-foreground/40 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-ember-600 group-hover:opacity-100"
                />
            </div>

            <p className="relative mt-5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ember-600">
                {code}
            </p>
            <h3 className="relative mt-1.5 line-clamp-2 text-base font-semibold leading-snug text-ocean-900 transition-colors group-hover:text-ocean-600 dark:text-foreground">
                {title}
            </h3>

            {instructor?.name && (
                <p className="relative mt-2 truncate text-xs text-muted-foreground">
                    {instructor.name}
                </p>
            )}

            <div className="relative mt-auto flex items-center justify-between gap-3 pt-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    <Icon icon={Bookmark01Icon} className="size-3.5" />
                    {credit} {Number(credit) === 1 ? "credit" : "credits"}
                </span>

                {graded && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold tabular-nums text-ocean-700 dark:text-ocean-300">
                        {score}
                        {grade && (
                            <span className="rounded-full bg-ocean-50 px-2 py-0.5 text-[10px] dark:bg-ocean-900/50">
                                {grade}
                            </span>
                        )}
                    </span>
                )}
            </div>
        </Link>
    )
}

export default CourseCard
