'use client';

export interface StudentStatus {
    id: string;
    admission_status: 'PENDING' | 'ADMITTED' | 'NOT_ADMITTED' | 'INPROGRESS';
    is_applied: boolean;
    created_at: string;
    updated_at: string;
    payments: {
        application_payment_status: 'FULLY_PAID' | 'PART_PAID' | 'UNPAID';
    }
    application: Partial<AdmissionFormData> | null;
}

export interface StudentStatusResponse {
    user: StudentStatus;
    response?: string;
    status: boolean;
}


import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useAuth } from './AuthContext';
import { baseUrl, remoteApiUrl } from '@/config';
import { AdmissionFormData } from '@/schemas/admission-schema';
import { UniversalformatFieldName } from '@/lib/utils';
import { useSessionFee } from "@/hooks/useSessionFee";

// API service
const fetchStudentStatus = async (studentId: string, access_token: string): Promise<StudentStatus> => {
    try {
        const response = await fetch(`${remoteApiUrl}/application/application-data`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const responseData = await response.json();
        const { application, ...rootData } = responseData.data;
        const profileData = rootData;
        const applicationFormData = application;

        const applicationFeild = (!!applicationFormData) ? {
            id: profileData.id,
            first_school_leaving: applicationFormData.first_school_leaving,
            o_level: applicationFormData.o_level,
            hnd: applicationFormData.hnd,
            degree: applicationFormData.degree,
            degree_transcript: applicationFormData.degree_transcript,
            other_documents: applicationFormData.other_documents,
        } : null

        return {
            id: profileData.id,
            admission_status: profileData.admission_status,
            is_applied: profileData.is_applied,
            created_at: profileData.created_at,
            updated_at: profileData.updated_at,
            payments: {
                // Acceptance and tuition fees do not apply to the Sandwich
                // programme - only the application fee is charged.
                application_payment_status: profileData.application_payment_status,
            },
            application: applicationFeild,
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};


const updateStudentStatus = async ({
    studentId,
    updates,
}: {
    studentId: string;
    updates: Partial<StudentStatus>;
}): Promise<StudentStatus> => {
    const response = await fetch(`/api/students/${studentId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error(`Failed to update student status: ${response.statusText}`);
    }

    const data: StudentStatusResponse = await response.json();
    return data.user;
};

// Context types
interface StudentStatusContextType {
    studentStatus: UseQueryResult<StudentStatus, Error>;
    updateStatus: (updates: Partial<StudentStatus>) => void;
    isUpdating: boolean;
    studentId: string | null;
}

// Create context
const StudentStatusContext = createContext<StudentStatusContextType | undefined>(undefined);

// Hook to use the context
export const useStudentStatus = () => {
    const context = useContext(StudentStatusContext);
    if (!context) {
        throw new Error('useStudentStatus must be used within a StudentStatusProvider');
    }
    return context;
};

// Provider component
interface StudentStatusProviderProps {
    children: ReactNode;
}
export const StudentStatusProvider: React.FC<StudentStatusProviderProps> = ({ children, }) => {
    const queryClient = useQueryClient();
    const { user, access_token } = useAuth();
    const studentId = String(user?.id);

    // Query for fetching student status
    const studentStatus = useQuery({
        queryKey: ['studentStatus', studentId, access_token],
        queryFn: () => fetchStudentStatus(studentId!, access_token!),
        enabled: !!studentId && !!access_token,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            // Retry up to 3 times, but not for 404s
            if (error?.message?.includes('404')) return false;
            return failureCount < 3;
        },
    });

    // Mutation for updating student status
    const updateMutation = useMutation({
        mutationFn: updateStudentStatus,
        onSuccess: (updatedStatus) => {
            // Update the cache with the new data
            queryClient.setQueryData(['studentStatus', studentId], updatedStatus);

            // Optionally invalidate to refetch fresh data
            queryClient.invalidateQueries({
                queryKey: ['studentStatus', studentId],
            });
        },
        onError: (error) => {
            console.error('Failed to update student status:', error);
        },
    });

    const updateStatus = (updates: Partial<StudentStatus>) => {
        if (!studentId) {
            console.error('No student ID provided');
            return;
        }

        updateMutation.mutate({
            studentId,
            updates,
        });
    };

    const contextValue: StudentStatusContextType = {
        studentStatus,
        updateStatus,
        isUpdating: updateMutation.isPending,
        studentId,
    };

    return (
        <StudentStatusContext.Provider value={contextValue}>
            {children}
        </StudentStatusContext.Provider>
    );
};

// Utility hooks for specific status checks
export const useAdmissionStatus = () => {
    const { studentStatus } = useStudentStatus();
    return {
        admissionStatus: studentStatus.data?.admission_status,
        isAccepted: studentStatus.data?.admission_status === 'ADMITTED',
        isPending: studentStatus.data?.admission_status === 'PENDING',
        isRejected: studentStatus.data?.admission_status === 'NOT_ADMITTED',
        isWaitlisted: studentStatus.data?.admission_status === 'INPROGRESS',
        isLoading: studentStatus.isLoading,
    };
};

/**
 * The one fee this programme charges, for the session the student is on.
 *
 * Deferred to the session-aware hook rather than read straight off
 * `application_payment_status`: that flag stays FULLY_PAID from the student's
 * first session, so a returning student who owes for a new session was shown
 * nothing here. It also names the fee correctly ("Returning fee" past year one)
 * and links to a page that exists - `/admission/application/payment` never did.
 */
export const useStudentPaymentStatus = () => {
    const { label, status, isOwing, payUrl } = useSessionFee();

    return {
        admissionPaymentStatus: status,
        hasOutstandingPayments: isOwing,
        unpaidFees: isOwing
            ? [{
                label,
                url: `${baseUrl}${payUrl}`,
            }]
            : [],
    };
};

export const useStudentApplicationStatus = () => {
    const { studentStatus } = useStudentStatus();
    const myApplication = studentStatus.data?.application;
    if (myApplication === null) return {}

    return {
        isLoading: studentStatus.isLoading,
        id: myApplication?.id,
        first_school_leaving: myApplication?.first_school_leaving,
        o_level: myApplication?.o_level,
        hnd: myApplication?.hnd,
        degree: myApplication?.degree,
        degree_transcript: myApplication?.degree_transcript,
        other_documents: myApplication?.other_documents,
        hasUnuUploadedDocument: [
            myApplication?.first_school_leaving,
            myApplication?.o_level,
            myApplication?.degree_transcript,
            myApplication?.hnd,
            myApplication?.degree,
            myApplication?.degree_transcript,
        ].some(value => value === undefined),
        missingDoc: myApplication
            ? Object.entries(myApplication)
                .filter(([key]) => !key.startsWith("id"))
                .filter(([, value]) => !String(value).includes("images/") || value === null || value === undefined)
                .map(([key]) => {
                    const link = `/dashboard/update-application-form?id=${myApplication?.id}`;
                    return ({
                        label: UniversalformatFieldName(key),
                        url: `${link}`
                    })
                })
            : [],
    };
};

export const useApplicationStatus = () => {
    const { studentStatus } = useStudentStatus();
    return {
        isApplied: !!studentStatus.data?.is_applied,
        canApply: !studentStatus.data?.is_applied,
        canUpdate: studentStatus.data?.admission_status === "PENDING",
    };
};

// HOC for wrapping components that need student status
export const withStudentStatus = <P extends object>(
    Component: React.ComponentType<P>
) => {
    return function WithStudentStatusComponent(props: P) {
        return (
            <StudentStatusProvider>
                <Component {...props} />
            </StudentStatusProvider>
        );
    };
};
