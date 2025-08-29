import { useLMSCourses } from '@/hooks/useCourses';
import Link from 'next/link';
import { UserInterface } from '@/config/Types';
import { lmsRootUrl } from '@/config';
import { ErrorMessage, LoadingSpinner } from './HelperComponents';
import { LMSCourse } from '../course.service';

interface CourseCardProps {
    course: LMSCourse;
    student: UserInterface | null
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, student }) => {
    const getStatusBadgeColor = (status: LMSCourse['status']) => {
        switch (status) {
            case 'enrolled':
                return 'bg-blue-100 text-blue-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Generate a simple course image based on course code
    const getCourseImage = (courseCode: string) => {
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500'];
        const colorIndex = courseCode.length % colors.length;
        return colors[colorIndex];
    };

    const lmsLink = student?.reg_number
        ? `${lmsRootUrl}/ssotester/index.php?sso_loggers=1&u=${student.reg_number}&password=1`
        : "#";

    return (
        <Link
            href={lmsLink ?? "#"}>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 h-64 flex flex-col">
                {/* Course Image */}
                <div className={`h-32 ${getCourseImage(course.course_code)} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-2xl font-bold">
                        {course.course_code}
                    </span>
                </div>

                {/* Course Content */}
                <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                            {course.course_name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(course.status)} ml-2 flex-shrink-0`}>
                            {course.status === 'in-progress' ? 'Active' : course.status}
                        </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 mt-auto">
                        {/* <p>{course.instructor}</p> */}
                        <p>{course.credit_load} Credit Load</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};



// components/CourseList.tsx


interface CourseListProps {
    access_token: string;
    student: UserInterface | null
}

export const CourseList: React.FC<CourseListProps> = ({ access_token, student }) => {
    // const {
    //     data: courses,
    //     isLoading: coursesLoading,
    //     error: coursesError,
    //     refetch: refetchCourses
    // } = useCourses(studentId);
    const {
        data: courses,
        isLoading: coursesLoading,
        error: coursesError,
        refetch: refetchCourses
    } = useLMSCourses(String(student?.email), access_token);

    if (coursesLoading) {
        return <LoadingSpinner />;
    }

    if (coursesError) {
        return (
            <ErrorMessage
                message="Failed to load course information. Please try again."
                onRetry={refetchCourses}
            />
        );
    }

    if (!courses || courses.length === 0) {
        return (
            <div className="text-center py-8 text-gray-600">
                <p>No courses found for this student.</p>
            </div>
        );
    }

    console.log('courses2', courses)

    return (
        <div className="max-w-6xl mx-auto p-6">
            {student && (
                <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Course Enrollment - {student?.first_name + " " + student?.last_name}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">Programme:</span>
                            <p className="text-gray-900">{student?.program}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Accademic Session:</span>
                            <p className="text-gray-900">{student?.academic_session}</p>
                        </div>
                        {/* <div>
                            <span className="font-medium text-gray-700">Total Credits:</span>
                            <p className="text-gray-900">{totalCredits}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Course Status:</span>
                            <p className="text-gray-900">{completedCourses} completed, {inProgressCourses} in progress</p>
                        </div> */}
                    </div>
                </div>
            )}

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Enrolled Courses ({courses.length})
                </h2>
                <p className="text-gray-600">
                    Manage and view your current course enrollments
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => (
                    <CourseCard key={course.course_id} course={course} student={student} />
                ))}
            </div>
        </div>
    );
};