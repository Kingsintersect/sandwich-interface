"use client";

import React from 'react';
import { Book02Icon } from '@hugeicons/core-free-icons';
import CourseCard from '@/components/ui/cards/CourseCard';
import { Icon } from '@/components/ui/icon';
import { AuthUser } from '@/types/user';
import { useStudentGradeReport } from '@/hooks/useStudentAcademics';

interface EnrolledCourseListProps {
    student: AuthUser | null;
    url?: string;
}

/**
 * Courses come from the same grade-report endpoint the dashboard uses, via
 * react-query, so the two screens share one cache instead of each running
 * their own fetch effect.
 */
const EnrolledCourseList: React.FC<EnrolledCourseListProps> = ({ url }) => {
    const { data: report, isLoading, isError } = useStudentGradeReport();
    const courses = report?.courses ?? [];

    return (
        <section className="mt-8">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600 dark:bg-ocean-900/50 dark:text-ocean-300">
                        <Icon icon={Book02Icon} className="size-5" />
                    </span>
                    <h2 className="text-xl font-bold text-ocean-900 dark:text-foreground">
                        Enrolled courses
                    </h2>
                </div>

                {!isLoading && !isError && courses.length > 0 && (
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                        {courses.length} {courses.length === 1 ? 'course' : 'courses'}
                    </span>
                )}
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-52 animate-pulse rounded-2xl border border-border bg-muted/50"
                        />
                    ))}
                </div>
            ) : isError ? (
                <div className="rounded-2xl border border-destructive/25 bg-destructive/5 px-6 py-12 text-center">
                    <p className="font-medium text-destructive">
                        Failed to load your enrolled courses
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Please try again later, or contact the registry if this continues.
                    </p>
                </div>
            ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {courses.map((course) => {
                        const score = Number(course.finalgrade);
                        return (
                            <CourseCard
                                key={course.course_id}
                                url={url}
                                title={course.course_name}
                                code={course.course_code}
                                credit={course.credit_load}
                                instructor={null}
                                score={Number.isFinite(score) ? score : null}
                                grade={course.grade}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-soft">
                    <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                        <Icon icon={Book02Icon} className="size-6" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-ocean-900 dark:text-foreground">
                        No courses registered
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                        You are not registered for any courses at this level yet. Contact
                        your academic adviser or the registry for help.
                    </p>
                </div>
            )}
        </section>
    );
};

export default EnrolledCourseList;
