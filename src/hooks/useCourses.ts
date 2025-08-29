import { courseService } from '@/app/(application)/admission/course.service';
import { useQuery } from '@tanstack/react-query';

export const useLMSCourses = (studentEmail: string, access_token: string) => {
    return useQuery({
        queryKey: ['LMScourses', studentEmail, access_token],
        queryFn: () => courseService.getStudentLMSCourses(studentEmail, access_token),
        enabled: !!studentEmail && !!access_token,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
};
