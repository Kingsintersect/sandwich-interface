"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
	ActivateAcademicSession,
	CreateAcademicSession,
	GetAllAcademicSessions,
	type AcademicSession,
} from "@/app/actions/server.admin";
import { useAuth } from "@/contexts/AuthContext";

export type MigrationLogEntry = {
	id: number;
	message: string;
	type: "info" | "success" | "error";
	timestamp: string;
};

export type SessionSummary = {
	academicYear: string;
};

const SESSIONS_KEY = ["academic-sessions"];

/** Oldest session first, so "the next one" is well defined. */
const byId = (rows: AcademicSession[]) => [...rows].sort((a, b) => a.id - b.id);

const readRows = (response: unknown): AcademicSession[] => {
	const data = (response as { success?: { data?: unknown } } | null)?.success?.data;
	return Array.isArray(data) ? (data as AcademicSession[]) : [];
};

/** Every academic session on record, oldest first. */
export const useAcademicSessions = () => {
	const { access_token } = useAuth();

	return useQuery<AcademicSession[]>({
		queryKey: [...SESSIONS_KEY, access_token],
		queryFn: async () => byId(readRows(await GetAllAcademicSessions(access_token ?? ""))),
		enabled: !!access_token,
		staleTime: 60 * 1000,
	});
};

export const useCurrentSession = () => {
	const { data, ...rest } = useAcademicSessions();
	const active = data?.find((s) => s.status === "ACTIVE");
	return { ...rest, data: active ? ({ academicYear: active.name } as SessionSummary) : null };
};

export const useNextSession = () => {
	const { data, ...rest } = useAcademicSessions();
	const rows = data ?? [];
	const activeIndex = rows.findIndex((s) => s.status === "ACTIVE");
	const next = activeIndex >= 0 ? rows[activeIndex + 1] : undefined;
	return { ...rest, data: next ? ({ academicYear: next.name } as SessionSummary) : null };
};

/** POST /admin/add-session */
export const useCreateSession = () => {
	const { access_token } = useAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (name: string) => {
			const res = await CreateAcademicSession(access_token ?? "", { name });
			if (res?.error) {
				throw new Error(res.error.message ?? "Could not create the session");
			}
			return res?.success;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
		},
	});
};

/**
 * PATCH /admin/modify-session - the session whose id is sent becomes ACTIVE,
 * which is what rolling the programme into a new session amounts to.
 */
export const useActivateSession = () => {
	const { access_token } = useAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number) => {
			const res = await ActivateAcademicSession(access_token ?? "", { id });
			if (res?.error) {
				throw new Error(res.error.message ?? "Could not activate the session");
			}
			return res?.success;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
		},
	});
};

/** Local UI state for the confirmation dialog and the activity log. */
export const useMigrationState = () => {
	const [migrationLogs, setMigrationLogs] = useState<MigrationLogEntry[]>([]);
	const [confirmDialog, setConfirmDialog] = useState({
		open: false,
		type: "",
		details: {} as { from?: string; to?: string; id?: number },
	});

	const addLog = (message: string, type: MigrationLogEntry["type"] = "info") => {
		setMigrationLogs((prev) => [
			...prev,
			{ id: Date.now() + prev.length, message, type, timestamp: new Date().toLocaleTimeString() },
		]);
	};

	const openConfirmDialog = (
		type: string,
		details: { from?: string; to?: string; id?: number }
	) => setConfirmDialog({ open: true, type, details });

	const closeConfirmDialog = () =>
		setConfirmDialog({ open: false, type: "", details: {} });

	return {
		migrationLogs,
		confirmDialog,
		addLog,
		openConfirmDialog,
		closeConfirmDialog,
	};
};
