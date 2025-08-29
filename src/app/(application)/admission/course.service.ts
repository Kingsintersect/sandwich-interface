import { remoteApiUrl } from "@/config";
export interface Student {
    id: string;
    name: string;
    email: string;
    major: string;
    year: number;
}

export interface ApiResponse {
    status: number;
    data: Array<{
        course_id: number;
        course_name: string;
        course_code: string;
        credit_load: number;
        reg_number: number;
    }>;
}
export interface LMSCourse {
    course_id: string;
    course_code: string;
    course_name: string;
    credit_load: number;
    status: 'enrolled' | 'completed' | 'in-progress';
}

export const courseService = {
    async getStudentLMSCourses(studentEmail: string, access_token: string): Promise<LMSCourse[]> {
        console.log('studentEmail', studentEmail)
        try {
            const response = await fetch(
                `${remoteApiUrl}/admin/course/grading?student_email=${studentEmail}`,
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
                return [];
            }

            const apiResponse: ApiResponse = await response.json();
            const coursesData = apiResponse.data;

            const transformedCourses: LMSCourse[] = coursesData.map((course) => ({
                course_id: course.course_id.toString(),
                course_code: course.course_code,
                course_name: course.course_name.replace(
                    course.course_code + " - ",
                    ""
                ),
                credit_load: course.credit_load ?? 2,
                status: "enrolled"
            }));

            return transformedCourses
        } catch (error) {
            console.error("Error fetching student grade report:", error);
            throw error;
        }
    },


};