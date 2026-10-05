import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { getStudentGradeReport } from "@/app/(dashboard)/dashboard/student/grade-report/api/studentGradeReport.api";
import {
	generateGPASummary,
	processGradeReport,
	type GPACourse,
	type GPAGradeReport,
} from "@/lib/gpa.utils";

/**
 * The student's own grade report, client-side. The grade-report page fetches
 * the same endpoint on the server; this is the hook version so the dashboard
 * can show real courses and scores instead of placeholder arrays.
 */
export const useStudentGradeReport = () => {
	const { user, access_token } = useAuth();
	const email = user?.email ?? "";

	return useQuery<GPAGradeReport>({
		queryKey: ["student-grade-report", email, user?.academic_session],
		queryFn: async () => {
			const report = await getStudentGradeReport(
				email,
				access_token ?? "",
				user?.academic_session as string | null
			);
			return processGradeReport(report);
		},
		enabled: !!email && !!access_token,
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
	});
};

export type StudentAssessment = {
	id: string;
	name: string;
	type: string;
	courseCode: string;
	/** null when the activity has not been graded yet */
	score: number | null;
};

/**
 * Flattens the activities nested under each course into one list of
 * assessments, ungraded first so outstanding work surfaces at the top.
 */
export const collectAssessments = (courses: GPACourse[]): StudentAssessment[] => {
	const rows: StudentAssessment[] = [];

	for (const course of courses) {
		if (!Array.isArray(course.activities)) continue;

		for (const [index, activity] of course.activities.entries()) {
			const raw = activity?.grade;
			const parsed = raw === null || raw === undefined || raw === "" ? NaN : Number(raw);

			rows.push({
				id: `${course.course_id}-${index}`,
				name: activity?.activity_name || "Untitled activity",
				type: activity?.type || "activity",
				courseCode: course.course_code,
				score: Number.isFinite(parsed) ? parsed : null,
			});
		}
	}

	// Ungraded work first - that is what the student still has to act on.
	return rows.sort((a, b) => {
		if (a.score === null && b.score !== null) return -1;
		if (a.score !== null && b.score === null) return 1;
		return 0;
	});
};

/** Headline numbers for the dashboard stat row, all derived from real marks. */
export const summariseAcademics = (courses: GPACourse[]) => {
	const summary = generateGPASummary(courses);
	const graded = courses.filter((c) => Number(c.finalgrade) > 0).length;

	return {
		gpa: summary.gpa,
		degreeClass: summary.degreeClass,
		totalCredits: summary.totalCredits,
		courseCount: courses.length,
		gradedCount: graded,
	};
};
