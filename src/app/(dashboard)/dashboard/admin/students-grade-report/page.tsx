"use client";

import React, { useMemo, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { Icon } from '@/components/ui/icon';
import { ResultsTable } from './components/ResultsTable';
import { summariseResults, useResults, type ResultFilters } from '@/hooks/useResults';
import { useDebounce } from '@/hooks/useDebounce';

const ALL = "ALL";

function FilterSelect({
    label,
    value,
    options,
    placeholder,
    onChange,
}: {
    label: string;
    value: string;
    options: string[];
    placeholder: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {label}
            </label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL}>{placeholder}</SelectItem>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

const AdminResultsPage = () => {
    const [session, setSession] = useState(ALL);
    const [level, setLevel] = useState(ALL);
    const [course, setCourse] = useState(ALL);
    const [status, setStatus] = useState(ALL);
    const [searchInput, setSearchInput] = useState('');
    const search = useDebounce(searchInput, 400);

    // Only the narrowing filters go to the API; search is debounced separately.
    const filters: ResultFilters = useMemo(
        () => ({ session, level, course_code: course, status, search }),
        [session, level, course, status, search]
    );

    const { filtered, options, isLoading, isError } = useResults(filters);
    const summary = useMemo(() => summariseResults(filtered), [filtered]);

    const hasFilters =
        session !== ALL || level !== ALL || course !== ALL || status !== ALL || !!searchInput;

    const clearFilters = () => {
        setSession(ALL);
        setLevel(ALL);
        setCourse(ALL);
        setStatus(ALL);
        setSearchInput('');
    };

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-ocean-900 dark:text-foreground">
                    Results
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                    Every published and pending result across the programme.
                </p>
            </div>

            {/* Summary of whatever the filters currently select */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Results", value: summary.count },
                    { label: "Students", value: summary.students },
                    { label: "Average score", value: isLoading ? "—" : `${summary.averageScore}` },
                    { label: "Pass rate", value: isLoading ? "—" : `${summary.passRate}%` },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-border bg-card p-6 shadow-soft"
                    >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            {stat.label}
                        </p>
                        <p className="mt-2 text-3xl font-bold tabular-nums text-ocean-900 dark:text-foreground">
                            {isLoading ? "—" : stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-5">
                    <div>
                        <h2 className="font-semibold text-ocean-900 dark:text-foreground">Filters</h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Options come from the results on record.
                        </p>
                    </div>
                    {hasFilters && (
                        <Button variant="ghost" size="sm" className="rounded-full" onClick={clearFilters}>
                            Clear all
                        </Button>
                    )}
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-5">
                    <FilterSelect
                        label="Session"
                        value={session}
                        options={options.sessions}
                        placeholder="All sessions"
                        onChange={setSession}
                    />
                    <FilterSelect
                        label="Level"
                        value={level}
                        options={options.levels}
                        placeholder="All levels"
                        onChange={setLevel}
                    />
                    <FilterSelect
                        label="Course"
                        value={course}
                        options={options.courses}
                        placeholder="All courses"
                        onChange={setCourse}
                    />
                    <FilterSelect
                        label="Status"
                        value={status}
                        options={options.statuses}
                        placeholder="All statuses"
                        onChange={setStatus}
                    />

                    <div>
                        <label
                            htmlFor="results-search"
                            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                        >
                            Search
                        </label>
                        <div className="relative">
                            <Icon
                                icon={Search01Icon}
                                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                            />
                            <input
                                id="results-search"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Name, reg number, course"
                                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-500/30"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <ResultsTable rows={filtered} isLoading={isLoading} isError={isError} />
        </div>
    );
};

export default AdminResultsPage;
