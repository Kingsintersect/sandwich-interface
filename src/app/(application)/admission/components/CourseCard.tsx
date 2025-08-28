// components/CourseCard.tsx
import { useCourses, useStudent } from '@/hooks/useCourses';
import { ErrorMessage, LoadingSpinner } from './HelperCOmpoenets';
import { Course } from '../course.service';
import Link from 'next/link';
import { UserInterface } from '@/config/Types';

interface CourseCardProps {
    course: Course;
    student: UserInterface | null
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, student }) => {
    const getStatusBadgeColor = (status: Course['status']) => {
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

    const lmsLink = student?.reg_number
        ? `https://unizik-biz-sch.qverselearning.org/ssotester/index.php?sso_loggers=1&u=${student.reg_number}&password=1`
        : "#";

    return (
        <Link
            href={lmsLink ?? "#"}>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {course.code}: {course.title}
                        </h3>
                        <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(course.status)}`}>
                            {course.status.replace('-', ' ').toUpperCase()}
                        </span>
                        {course.grade && (
                            <span className="text-sm font-medium text-gray-700">
                                Grade: {course.grade}
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                        <span className="font-medium">Credits:</span> {course.credits}
                    </div>
                    <div>
                        <span className="font-medium">Schedule:</span> {course.schedule.days.join(', ')} {course.schedule.time}
                    </div>
                    <div>
                        <span className="font-medium">Location:</span> {course.schedule.location}
                    </div>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                    {course.semester} {course.year}
                </div>
            </div>
        </Link>
    );
};



// components/CourseList.tsx


interface CourseListProps {
    studentId: string;
    studentData: UserInterface | null
}

export const CourseList: React.FC<CourseListProps> = ({ studentId, studentData }) => {
    const {
        data: courses,
        isLoading: coursesLoading,
        error: coursesError,
        refetch: refetchCourses
    } = useCourses(studentId);

    const {
        data: student,
        isLoading: studentLoading,
        error: studentError
    } = useStudent(studentId);

    if (coursesLoading || studentLoading) {
        return <LoadingSpinner />;
    }

    if (coursesError || studentError) {
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

    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const completedCourses = courses.filter(course => course.status === 'completed').length;
    const inProgressCourses = courses.filter(course => course.status === 'in-progress').length;

    return (
        <div className="max-w-6xl mx-auto p-6">
            {student && (
                <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Course Enrollment - {student.name}
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">Major:</span>
                            <p className="text-gray-900">{student.major}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Year:</span>
                            <p className="text-gray-900">{student.year}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Total Credits:</span>
                            <p className="text-gray-900">{totalCredits}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Course Status:</span>
                            <p className="text-gray-900">{completedCourses} completed, {inProgressCourses} in progress</p>
                        </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} student={studentData} />
                ))}
            </div>
        </div>
    );
};