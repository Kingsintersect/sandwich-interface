"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GraduationScrollIcon, UserGroupIcon } from '@hugeicons/core-free-icons';
import { ApplicantsDataTable } from './components/ApplicantsDataTable';
import { AdmittedStudentDataTable } from './components/AdmittedStudentDataTable';
import { GetAppliedStudentList } from '@/app/actions/admin';
import { useAuth } from '@/contexts/AuthContext';
import { Icon, type IconSvgElement } from '@/components/ui/icon';
import { SITE_NAME } from '@/config';
import { extractTotal } from '@/lib/admin.analytics';
import { cn } from '@/lib/utils';

type Tab = { id: string; label: string; icon: IconSvgElement };

const tabs: Tab[] = [
    { id: 'applicants', label: 'Admission applicants', icon: UserGroupIcon },
    { id: 'students', label: 'Student listing', icon: GraduationScrollIcon },
];

const StudentApplicationsPage = () => {
    const [activeTab, setActiveTab] = useState('applicants');
    const { access_token } = useAuth();

    // The pending count was hard-coded to 16; read it from the same endpoint
    // the applicants table uses.
    const { data: pendingCount } = useQuery({
        queryKey: ['applied-students-count', access_token],
        queryFn: async () => {
            const res = await GetAppliedStudentList(access_token ?? "");
            return extractTotal(res?.success);
        },
        enabled: !!access_token,
        staleTime: 60 * 1000,
    });

    return (
        <div className="pb-10">
            {/* Header */}
            <div className="border-b border-border pb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-ocean-900 dark:text-foreground">
                            Manage admissions
                        </h1>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            {SITE_NAME} &middot; application review
                        </p>
                    </div>

                    {typeof pendingCount === 'number' && (
                        <div className="flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2 shadow-soft">
                            <span className="ember-surface flex size-6 items-center justify-center rounded-full text-[11px] font-bold tabular-nums text-white">
                                {pendingCount}
                            </span>
                            <span className="text-sm font-medium text-muted-foreground">
                                pending review
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <nav className="-mb-px flex gap-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                            className={cn(
                                "flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-semibold transition-colors",
                                activeTab === tab.id
                                    ? "border-ember-500 text-ocean-900 dark:text-foreground"
                                    : "border-transparent text-muted-foreground hover:border-border hover:text-ocean-700"
                            )}
                        >
                            <Icon icon={tab.icon} className="size-4.5" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab content */}
            <div className="pt-8">
                {activeTab === 'applicants' && <ApplicantsDataTable />}
                {activeTab === 'students' && <AdmittedStudentDataTable />}
            </div>
        </div>
    );
};

export default StudentApplicationsPage;
