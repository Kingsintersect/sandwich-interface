"use client";

import React, { useState } from 'react';
import {
    Alert02Icon,
    CheckmarkCircle02Icon,
    Loading03Icon,
    PlusSignIcon,
} from '@hugeicons/core-free-icons';
import {
    useAcademicSessions,
    useActivateSession,
    useCreateSession,
    useMigrationState,
} from '@/hooks/useSessionMigration';
import { MigrationLog } from './componenets/MigrationLog';
import { ConfirmationDialog } from './componenets/ConfirmationDialog';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Sessions are written as YYYY/YYYY with consecutive years, e.g. 2026/2027. */
const SESSION_PATTERN = /^(\d{4})\/(\d{4})$/;

const validateSessionName = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) return "Enter a session, for example 2026/2027";

    const match = trimmed.match(SESSION_PATTERN);
    if (!match) return "Use the format YYYY/YYYY, for example 2026/2027";

    const [, start, end] = match;
    if (Number(end) !== Number(start) + 1) {
        return "The second year should follow the first, for example 2026/2027";
    }
    return null;
};

const AdminMigrationInterface = () => {
    const { data: sessions = [], isLoading, isError } = useAcademicSessions();
    const createSession = useCreateSession();
    const activateSession = useActivateSession();
    const { migrationLogs, confirmDialog, addLog, openConfirmDialog, closeConfirmDialog } =
        useMigrationState();

    const [newSession, setNewSession] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    const active = sessions.find((s) => s.status === "ACTIVE");
    const activeIndex = sessions.findIndex((s) => s.status === "ACTIVE");
    const next = activeIndex >= 0 ? sessions[activeIndex + 1] : undefined;

    // Suggest the year after the newest session on record.
    const suggestion = (() => {
        const latest = sessions[sessions.length - 1]?.name;
        const match = latest?.match(SESSION_PATTERN);
        if (!match) return "2026/2027";
        const start = Number(match[2]);
        return `${start}/${start + 1}`;
    })();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const problem = validateSessionName(newSession);
        setFormError(problem);
        if (problem) return;

        const name = newSession.trim();
        try {
            await createSession.mutateAsync(name);
            addLog(`Created session ${name}`, 'success');
            setNewSession('');
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            addLog(`Could not create ${name}: ${message}`, 'error');
            setFormError(message);
        }
    };

    const handleActivateConfirm = async () => {
        const { id, to } = confirmDialog.details;
        closeConfirmDialog();
        if (typeof id !== "number") return;

        try {
            await activateSession.mutateAsync(id);
            addLog(`${to} is now the active session`, 'success');
        } catch (error) {
            addLog(
                `Could not activate ${to}: ${error instanceof Error ? error.message : String(error)}`,
                'error'
            );
        }
    };

    return (
        <div className="space-y-6 pb-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-ocean-900 dark:text-foreground">
                    Academic sessions
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                    Add a session and choose which one the programme currently runs on.
                </p>
            </div>

            {/* Summary */}
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Active session
                    </p>
                    <p className="mt-2 text-2xl font-bold text-ocean-900 dark:text-foreground">
                        {isLoading ? "—" : active?.name ?? "None set"}
                    </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Next session
                    </p>
                    <p className="mt-2 text-2xl font-bold text-ocean-900 dark:text-foreground">
                        {isLoading ? "—" : next?.name ?? "None recorded"}
                    </p>
                </div>
            </div>

            {/* Add a session */}
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="border-b border-border px-6 py-5">
                    <h2 className="font-semibold text-ocean-900 dark:text-foreground">
                        Add a session
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Creating a session does not activate it &mdash; you choose when to switch.
                    </p>
                </div>

                <form onSubmit={handleCreate} className="flex flex-col gap-3 p-6 sm:flex-row sm:items-start">
                    <div className="flex-1">
                        <label htmlFor="session-name" className="sr-only">Session</label>
                        <input
                            id="session-name"
                            value={newSession}
                            onChange={(e) => {
                                setNewSession(e.target.value);
                                if (formError) setFormError(null);
                            }}
                            placeholder={suggestion}
                            aria-invalid={!!formError}
                            className={cn(
                                "h-11 w-full rounded-full border bg-background px-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2",
                                formError
                                    ? "border-destructive focus:ring-destructive/30"
                                    : "border-input focus:border-ocean-500 focus:ring-ocean-500/30"
                            )}
                        />
                        {formError && (
                            <p className="mt-2 pl-1 text-xs text-destructive">{formError}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={createSession.isPending}
                        className="ember-surface h-11 shrink-0 rounded-full px-6 text-white shadow-ember hover:bg-none hover:bg-ember-700"
                    >
                        <Icon
                            icon={createSession.isPending ? Loading03Icon : PlusSignIcon}
                            className={cn("size-4", createSession.isPending && "animate-spin")}
                        />
                        {createSession.isPending ? "Adding..." : "Add session"}
                    </Button>
                </form>
            </section>

            {/* All sessions */}
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="border-b border-border px-6 py-5">
                    <h2 className="font-semibold text-ocean-900 dark:text-foreground">
                        All sessions
                    </h2>
                </div>

                {isLoading ? (
                    <ul className="divide-y divide-border">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <li key={i} className="px-6 py-5">
                                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                            </li>
                        ))}
                    </ul>
                ) : isError ? (
                    <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                        Could not load academic sessions.
                    </p>
                ) : sessions.length === 0 ? (
                    <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                        No sessions recorded yet. Add one above to get started.
                    </p>
                ) : (
                    <ul className="divide-y divide-border">
                        {sessions.map((session) => {
                            const isActive = session.status === "ACTIVE";
                            return (
                                <li
                                    key={session.id}
                                    className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={cn(
                                                "flex size-9 items-center justify-center rounded-xl",
                                                isActive
                                                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
                                                    : "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            <Icon
                                                icon={isActive ? CheckmarkCircle02Icon : Alert02Icon}
                                                className="size-4.5"
                                            />
                                        </span>
                                        <div>
                                            <p className="font-semibold tabular-nums text-ocean-900 dark:text-foreground">
                                                {session.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {isActive ? "Currently active" : "Inactive"}
                                            </p>
                                        </div>
                                    </div>

                                    {isActive ? (
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                                            Active
                                        </span>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full"
                                            disabled={activateSession.isPending}
                                            onClick={() =>
                                                openConfirmDialog("Session", {
                                                    from: active?.name,
                                                    to: session.name,
                                                    id: session.id,
                                                })
                                            }
                                        >
                                            Make active
                                        </Button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            <MigrationLog logs={migrationLogs} />

            <ConfirmationDialog
                isOpen={confirmDialog.open}
                onClose={closeConfirmDialog}
                onConfirm={handleActivateConfirm}
                from={confirmDialog.details.from}
                to={confirmDialog.details.to}
                isPending={activateSession.isPending}
            />
        </div>
    );
};

export default AdminMigrationInterface;
