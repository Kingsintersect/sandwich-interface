/**
 * Programme names from the ODL endpoint carry the study year in their text,
 * e.g. "YEAR ONE(Direct)", "YEAR TWO Direct(Science Eduction)",
 * "ACP Year Two(Science Education)" or "BIOLOGY OPTION YEAR 500".
 *
 * UNIZIK expresses that year as a level: Year One is 100 level, Year Two is
 * 200, and so on up to Year Six / 600.
 */

const WORD_TO_YEAR: Record<string, number> = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
};

const MIN_YEAR = 1;
const MAX_YEAR = 6;

/** Returns the study year (1-6) named in a programme title, or null. */
export function parseStudyYear(programme?: string | null): number | null {
	if (!programme) return null;

	const text = programme.toLowerCase();

	// "year 500" / "year 5" - the level or the year written as a number
	const numeric = text.match(/year\s*(\d{1,3})/);
	if (numeric) {
		const value = Number(numeric[1]);
		const year = value >= 100 ? Math.round(value / 100) : value;
		if (year >= MIN_YEAR && year <= MAX_YEAR) return year;
	}

	// "year one" / "year two" - written out, which is the common case
	const worded = text.match(/year\s+(one|two|three|four|five|six)/);
	if (worded) return WORD_TO_YEAR[worded[1]];

	// Bare "500 level" with no "year" prefix
	const bare = text.match(/\b([1-6])00\s*level\b/);
	if (bare) return Number(bare[1]);

	return null;
}

/** "YEAR TWO Direct(Science Eduction)" -> "200 Level" */
export function levelFromProgramme(programme?: string | null): string | null {
	const year = parseStudyYear(programme);
	return year ? `${year * 100} Level` : null;
}

/**
 * Study year from a bare `academic_level`, which the API sends as either a
 * number (200) or a string ("100"). Accepts 1-6 and 100-600.
 *
 * `parseStudyYear` cannot do this: it reads programme *titles* and every one of
 * its patterns needs the word "year" or "level", so a bare 200 returned null
 * and every migrated student looked like a first-year.
 */
export function yearFromAcademicLevel(value: unknown): number | null {
	if (value === null || value === undefined || value === "") return null;

	const digits = String(value).replace(/\D/g, "");
	if (!digits) return null;

	const n = Number(digits);
	if (n >= MIN_YEAR && n <= MAX_YEAR) return n;
	if (n % 100 === 0 && n >= 100 && n <= MAX_YEAR * 100) return n / 100;

	return null;
}

/** Normalises 100-600, or 1-6, into "N00 Level". Returns null otherwise. */
function levelFromNumber(value: unknown): string | null {
	const year = yearFromAcademicLevel(value);
	return year ? `${year * 100} Level` : null;
}

/** Pulls the study year out of an LMS short code such as "SOC-ECO-100-1SM". */
function yearFromShortCode(code?: string | null): number | null {
	const match = code?.match(/(?:^|-)([1-6])00(?:-|$)/);
	return match ? Number(match[1]) : null;
}

/** Pulls the level out of an LMS short code such as "SOC-ECO-100-1SM". */
function levelFromShortCode(code?: string | null): string | null {
	const year = yearFromShortCode(code);
	return year ? `${year * 100} Level` : null;
}

/**
 * The level to display for a student.
 *
 * `academic_level` wins because it is the only one that moves: when a student
 * changes session the server bumps it (100 -> 200), while `program` keeps the
 * name they originally enrolled under ("YEAR ONE(DIRECT)") forever. Reading the
 * programme first made migrated students keep showing 100 Level.
 */
export function resolveStudentLevel(
	source:
		| {
			academic_level?: number | string | null;
			program?: string | null;
			level?: string | null;
		}
		| null
		| undefined
): string {
	if (!source) return "Not assigned";

	return (
		levelFromNumber(source.academic_level) ??
		levelFromShortCode(source.level) ??
		levelFromProgramme(source.program) ??
		"Not assigned"
	);
}

/**
 * The student's study year (1-6), using the same precedence as
 * `resolveStudentLevel`: `academic_level` first because it is the only field
 * that moves when a student changes session.
 */
export function resolveStudyYear(
	source:
		| {
			academic_level?: number | string | null;
			program?: string | null;
			level?: string | null;
		}
		| null
		| undefined
): number | null {
	if (!source) return null;

	return (
		yearFromAcademicLevel(source.academic_level) ??
		yearFromShortCode(source.level) ??
		parseStudyYear(source.program) ??
		null
	);
}
