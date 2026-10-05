"use client";
import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { resolveStudentLevel } from '@/lib/academics.utils';

export const StudentInfo = React.memo(() => {
    const { user } = useAuth();
    const { first_name, last_name, pictureRef, passport, reg_number, email, program, level } = user || {};

    const fullname = [first_name, last_name].filter(Boolean).join(" ") || "—";
    const profileImage = pictureRef || passport || "/avatars/avatar-man.jpg";

    // Previously this showed department_id (a raw id) as "Program" and derived
    // the year from a hard-coded enrolmentYear of 2025.
    const fields = [
        { label: "Registration number", value: reg_number },
        { label: "Programme", value: program as string },
        { label: "Email", value: email },
        { label: "Level", value: resolveStudentLevel(user) },
    ];

    return (
        <div className="border-b border-border px-7 py-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-border">
                        <Image
                            src={profileImage}
                            alt={fullname}
                            fill
                            sizes="80px"
                            priority
                            className="object-cover"
                        />
                    </div>
                    <div className="sm:hidden">
                        <h2 className="text-lg font-bold text-ocean-900 dark:text-foreground">
                            {fullname}
                        </h2>
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="hidden text-lg font-bold text-ocean-900 sm:block dark:text-foreground">
                        {fullname}
                    </h2>

                    <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                        {fields.map((field) => (
                            <div key={field.label} className="min-w-0">
                                <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                    {field.label}
                                </dt>
                                <dd className="mt-0.5 truncate text-sm font-medium text-ocean-900 dark:text-foreground">
                                    {field.value || "Not assigned"}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
});

StudentInfo.displayName = 'StudentInfo';
