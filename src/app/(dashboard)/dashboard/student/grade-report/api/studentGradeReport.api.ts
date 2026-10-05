import { remoteApiUrl } from "@/config";
import { GPACourse, GPAGradeReport } from "@/lib/gpa.utils";

interface ApiResponse {
	status: number;
	data: Array<{
		course_id: number;
		course_name: string;
		course_code: string;
		credit_load: number;
		reg_number: number;
		finalgrade: string | null;
		activities: any[];
	}>;
}

export async function getStudentGradeReport(
	email: string,
	access_token: string,
	/** The student's own academic_session. Falls back to the active session. */
	studentSession?: string | null
): Promise<GPAGradeReport> {
	try {
		const response = await fetch(
			`${remoteApiUrl}/admin/course/grading?student_email=${email}`,
			{
				cache: "no-store",
				method: "GET",
				headers: {
					Authorization: `Bearer ${access_token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (!response.ok) {
			console.error(`Failed to fetch: ${response.status}`);
			return [] as any;
		}

		const apiResponse: ApiResponse = await response.json();
		const coursesData = apiResponse.data;

		const transformedCourses: GPACourse[] = coursesData.map((course) => ({
			course_id: course.course_id.toString(),
			course_code: course.course_code,
			course_name: course.course_name.replace(
				course.course_code + " - ",
				""
			),
			credit_load: course.credit_load ?? 0, //CHANGE THE 2 TO 0 AFTER TESTING
			grade: "A",
			finalgrade: course.finalgrade || 0,
			activities: course.activities,
		}));

		const gradeReport: GPAGradeReport = {
			courses: transformedCourses,
			// The Sandwich programme runs vacation sessions, not semesters.
			semester: "",
			academicYear: studentSession?.trim() || (await getActiveSession()),
		};
		return gradeReport;
	} catch (error) {
		console.error("Error fetching student grade report:", error);
		throw error;
	}
}

/**
 * The active academic session (e.g. "2024/2025"). The report used to
 * hard-code "2024-2025"; this reads the live value instead, and falls back to
 * an empty string so a failure here never takes the whole report down.
 */
async function getActiveSession(): Promise<string> {
	try {
		const res = await fetch(`${remoteApiUrl}/all-sessions`, { cache: "no-store" });
		if (!res.ok) return "";
		const body = await res.json();
		const rows: Array<{ name?: string; status?: string }> = body?.data ?? [];
		return rows.find((row) => row.status === "ACTIVE")?.name ?? "";
	} catch {
		return "";
	}
}
