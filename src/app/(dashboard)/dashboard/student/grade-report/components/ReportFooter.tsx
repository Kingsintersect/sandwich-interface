"use client";
import React from 'react';

type ReportFooterProps = {
    academicYear: string;
};

export const ReportFooter = React.memo(({ academicYear }: ReportFooterProps) => {
    // Sandwich runs vacation sessions, so the session alone identifies the period.
    const period = academicYear;

    return (
        <div className="border-t border-border bg-muted/30 px-7 py-6 text-center">
            <p className="text-sm text-muted-foreground">
                {period
                    ? <>Official academic record for <strong className="font-semibold text-ocean-800 dark:text-foreground">{period}</strong> session.</>
                    : "Official academic record."}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                <span>
                    Generated {new Date().toLocaleDateString('en-NG', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                </span>
                <span aria-hidden>&middot;</span>
                <span>5.00 grade point scale</span>
            </div>
        </div>
    );
});

ReportFooter.displayName = 'ReportFooter';
