import { courseService } from '@/app/(application)/admission/course.service';
import { useQuery } from '@tanstack/react-query';

export const useCourses = (studentId: string) => {
    return useQuery({
        queryKey: ['courses', studentId],
        queryFn: () => courseService.getStudentCourses(studentId),
        enabled: !!studentId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
};

export const useStudent = (studentId: string) => {
    return useQuery({
        queryKey: ['student', studentId],
        queryFn: () => courseService.getStudent(studentId),
        enabled: !!studentId,
        staleTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
    });
};