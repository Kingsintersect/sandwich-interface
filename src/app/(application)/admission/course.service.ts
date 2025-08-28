export interface Course {
    id: string;
    code: string;
    title: string;
    credits: number;
    instructor: string;
    schedule: {
        days: string[];
        time: string;
        location: string;
    };
    semester: string;
    year: number;
    status: 'enrolled' | 'completed' | 'in-progress';
    grade?: string;
}

export interface Student {
    id: string;
    name: string;
    email: string;
    major: string;
    year: number;
}

export const mockCourses: Course[] = [
    {
        id: '1',
        code: 'CS301',
        title: 'Data Structures and Algorithms',
        credits: 3,
        instructor: 'Dr. Smith',
        schedule: {
            days: ['Mon', 'Wed', 'Fri'],
            time: '10:00 AM - 11:00 AM',
            location: 'Room 101'
        },
        semester: 'Fall',
        year: 2024,
        status: 'in-progress'
    },
    {
        id: '2',
        code: 'MATH210',
        title: 'Calculus II',
        credits: 4,
        instructor: 'Prof. Johnson',
        schedule: {
            days: ['Tue', 'Thu'],
            time: '2:00 PM - 3:30 PM',
            location: 'Math Building 205'
        },
        semester: 'Fall',
        year: 2024,
        status: 'enrolled'
    }
];
export const courseService = {
    async getStudentCourses(studentId: string): Promise<Course[]> {
        console.log('studentId', studentId)
        // const response = await fetch(`${API_BASE_URL}/students/${studentId}/courses`);

        // if (!response.ok) {
        //     throw new Error('Failed to fetch student courses');
        // }

        return mockCourses;
    },

    async getStudent(studentId: string): Promise<Student> {
        console.log('studentId', studentId)
        // const response = await fetch(`${API_BASE_URL}/students/${studentId}`);

        // if (!response.ok) {
        //     throw new Error('Failed to fetch student information');
        // }

        return {
            id: '1',
            name: "king solomon",
            email: "kingsolo@gmail.com",
            major: "Computer Scence",
            year: 2024,
        }
    }
};