"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetAllResults, type ResultFilters, type ResultRow } from "@/app/actions/server.admin";
import { useAuth } from "@/contexts/AuthContext";

export type { ResultRow, ResultFilters };

const readRows = (response: unknown): ResultRow[] => {
	const success = (response as { success?: unknown } | null)?.success;
	const data = (success as { data?: unknown } | null)?.data;
	return Array.isArray(data) ? (data as ResultRow[]) : [];
};

/** "Emmanuel Ifeanyichukwu Wubi", falling back to the username. */
export const studentName = (row: ResultRow) => {
	const u = row.user;
	const parts = [u?.first_name, u?.other_name, u?.last_name].filter(Boolean);
	return parts.length ? parts.join(" ") : u?.username ?? "Unknown student";
};

export const toNumber = (value: string | number | null | undefined) => {
	const n = Number(value);
	return Number.isFinite(n) ? n : 0;
};

/**
 * All results, with the filters sent to the API as query params.
 *
 * The same filters are re-applied client-side: it is not known whether the
 * endpoint honours them, and narrowing an already-narrowed list is a no-op, so
 * this is correct either way.
 */
export const useResults = (filters: ResultFilters) => {
	const { access_token } = useAuth();

	const query = useQuery<ResultRow[]>({
		queryKey: ["all-results", access_token, filters],
		queryFn: async () => readRows(await GetAllResults(access_token ?? "", filters)),
		enabled: !!access_token,
		staleTime: 60 * 1000,
	});

	const rows = useMemo(() => query.data ?? [], [query.data]);

	const filtered = useMemo(() => {
		const term = filters.search?.trim().toLowerCase() ?? "";

		return rows.filter((row) => {
			if (filters.session && filters.session !== "ALL" && row.session !== filters.session) return false;
			if (filters.level && filters.level !== "ALL" && row.level !== filters.level) return false;
			if (filters.course_code && filters.course_code !== "ALL" && row.course_code !== filters.course_code) return false;
			if (filters.status && filters.status !== "ALL" && row.status !== filters.status) return false;

			if (!term) return true;
			return [
				studentName(row),
				row.user?.reg_number,
				row.user?.email,
				row.course_code,
				row.course_title,
			].some((field) => String(field ?? "").toLowerCase().includes(term));
		});
	}, [rows, filters]);

	/** Filter options built from the rows actually returned, so they can't drift. */
	const options = useMemo(() => {
		const unique = (values: (string | null | undefined)[]) =>
			[...new Set(values.filter((v): v is string => !!v))].sort();

		return {
			sessions: unique(rows.map((r) => r.session)),
			levels: unique(rows.map((r) => r.level)),
			courses: unique(rows.map((r) => r.course_code)),
			statuses: unique(rows.map((r) => r.status)),
		};
	}, [rows]);

	return { ...query, rows, filtered, options };
};

/** Headline numbers for the results summary, all derived from the rows shown. */
export const summariseResults = (rows: ResultRow[]) => {
	if (rows.length === 0) {
		return { count: 0, students: 0, courses: 0, averageScore: 0, passRate: 0 };
	}

	const scores = rows.map((r) => toNumber(r.score));
	const passed = rows.filter((r) => (r.grade ?? "").toUpperCase() !== "F").length;

	return {
		count: rows.length,
		students: new Set(rows.map((r) => r.user_id)).size,
		courses: new Set(rows.map((r) => r.course_code)).size,
		averageScore: Math.round((scores.reduce((a, b) => a + b, 0) / rows.length) * 10) / 10,
		passRate: Math.round((passed / rows.length) * 100),
	};
};
