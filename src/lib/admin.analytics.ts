/**
 * Derives the admin dashboard's chart data from the real applicant lists the
 * page already fetches. Nothing here invents numbers: if a record carries no
 * usable `created_at`, it is left out of the time series and the chart shows
 * its empty state instead.
 */

export type ApplicantRecord = {
	created_at?: string | Date | null;
	[key: string]: unknown;
};

/**
 * Unwraps a list payload from `apiCallerBeta`'s `success` field.
 *
 * These admin endpoints are not consistent: some return `data` as a plain
 * array, others wrap it (a Laravel paginator puts the rows under
 * `data.data`). Reading `.length` on the wrapped shape silently produced
 * `undefined`, and spreading it threw "is not iterable" - hence this guard.
 */
export function extractRows(payload: unknown): ApplicantRecord[] {
	if (Array.isArray(payload)) return payload as ApplicantRecord[];
	if (!payload || typeof payload !== "object") return [];

	const obj = payload as Record<string, unknown>;

	// { data: [...] } or { data: { data: [...] } }
	for (const key of ["data", "rows", "items", "results"]) {
		const value = obj[key];
		if (Array.isArray(value)) return value as ApplicantRecord[];
		if (value && typeof value === "object") {
			const nested = extractRows(value);
			if (nested.length) return nested;
		}
	}

	return [];
}

/**
 * Total record count. A paginated response only carries one page of rows, so
 * prefer the server's own total where it exists and fall back to the rows.
 */
export function extractTotal(payload: unknown): number {
	if (Array.isArray(payload)) return payload.length;

	if (payload && typeof payload === "object") {
		const obj = payload as Record<string, unknown>;
		for (const key of ["total", "count", "totalCount"]) {
			if (typeof obj[key] === "number") return obj[key] as number;
		}
		const inner = obj.data;
		if (inner && typeof inner === "object" && !Array.isArray(inner)) {
			const nested = extractTotal(inner);
			if (nested) return nested;
		}
	}

	return extractRows(payload).length;
}

export type PipelineSlice = {
	stage: string;
	students: number;
	fill: string;
};

export type TrendPoint = {
	date: string;
	applied: number;
	admitted: number;
};

/** Counts per admission stage, in pipeline order. */
export const buildPipeline = (counts: {
	unapplied: number;
	applied: number;
	admitted: number;
	rejected: number;
}): PipelineSlice[] => [
	{ stage: "Not applied", students: counts.unapplied, fill: "var(--color-unapplied)" },
	{ stage: "Pending", students: counts.applied, fill: "var(--color-applied)" },
	{ stage: "Admitted", students: counts.admitted, fill: "var(--color-admitted)" },
	{ stage: "Rejected", students: counts.rejected, fill: "var(--color-rejected)" },
];

const monthKey = (d: Date) =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const toDate = (value: unknown): Date | null => {
	if (!value) return null;
	const d = new Date(value as string);
	return Number.isNaN(d.getTime()) ? null : d;
};

/**
 * Applications and admissions per month, oldest first. Months with no activity
 * between the first and last record are filled with zeros so the line does not
 * imply a gap that is really just a quiet month.
 */
export function buildTrend(
	applied: ApplicantRecord[],
	admitted: ApplicantRecord[],
	maxMonths = 12
): TrendPoint[] {
	const buckets = new Map<string, { applied: number; admitted: number }>();

	const tally = (rows: ApplicantRecord[], key: "applied" | "admitted") => {
		for (const row of Array.isArray(rows) ? rows : []) {
			const d = toDate(row?.created_at);
			if (!d) continue;
			const k = monthKey(d);
			const slot = buckets.get(k) ?? { applied: 0, admitted: 0 };
			slot[key] += 1;
			buckets.set(k, slot);
		}
	};

	tally(applied, "applied");
	tally(admitted, "admitted");

	if (buckets.size === 0) return [];

	const keys = [...buckets.keys()].sort();
	const [startY, startM] = keys[0].split("-").map(Number);
	const [endY, endM] = keys[keys.length - 1].split("-").map(Number);

	const filled: TrendPoint[] = [];
	const cursor = new Date(startY, startM - 1, 1);
	const end = new Date(endY, endM - 1, 1);

	while (cursor <= end) {
		const k = monthKey(cursor);
		const slot = buckets.get(k) ?? { applied: 0, admitted: 0 };
		filled.push({ date: k, applied: slot.applied, admitted: slot.admitted });
		cursor.setMonth(cursor.getMonth() + 1);
	}

	return filled.slice(-maxMonths);
}

/** "2025-04" -> "Apr 2025" */
export const formatMonth = (key: string) => {
	const [y, m] = key.split("-").map(Number);
	if (!y || !m) return key;
	return new Date(y, m - 1, 1).toLocaleDateString("en-NG", {
		month: "short",
		year: "numeric",
	});
};
