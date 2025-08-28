"use server";

import { remoteApiUrl } from "@/config";
import { UserInterface } from "@/config/Types";
import { UseDataTableOptions } from "@/hooks/useDataTable";
import { apiCall } from "@/lib/apiCaller";
import { loginSessionKey } from "@/lib/definitions";
import { getSession } from "@/lib/session";
import { ApplicationChunk, ApplicationDetailsType } from "@/schemas/admission-schema";
import { ApplicationApproveValues, ApplicationRejectValues } from "@/schemas/applicationReview-schema";
import { ApiResponseArray, ApiResponseSingle } from "@/types/api.types";
import { Application } from "@/types/application";
import { SessionData } from "@/types/auth";

export async function getAdmissionApplicants(options?: UseDataTableOptions): Promise<{ data: UserInterface[]; total: number }> {
    const loginSession = (await getSession(loginSessionKey)) as SessionData;
    const {
        pageIndex = 0,
        pageSize = 10,
        sortBy = "id",
        sortOrder = "desc",
        search = "",
        filters = {},
    } = options ?? {};

    const query = new URLSearchParams({
        page: (pageIndex + 1).toString(),
        limit: pageSize.toString(),
        sortBy,
        sortOrder,
        search,
        ...filters,
    });

    const response = await apiCall<undefined, ApiResponseArray<UserInterface>>({
        // url: `/admin/all-applications?academicSession=2024/2025&${query.toString()}`,
        url: `/admin/all-applications?${query.toString()}`,
        method: "GET",
        accessToken: loginSession.access_token
    });

    if (response?.status && response.data.data) {
        return {
            data: response.data.data,
            total: response.data.total,
        };
    } else {
        console.error("Failed to fetch categories");
        return { data: [], total: 0 };
    }
}

export async function getAdmittedApplicants(options?: UseDataTableOptions): Promise<{ data: UserInterface[]; total: number }> {
    const loginSession = (await getSession(loginSessionKey)) as SessionData;
    const {
        pageIndex = 0,
        pageSize = 10,
        sortBy = "id",
        sortOrder = "desc",
        search = "",
        filters = {},
    } = options ?? {};

    const query = new URLSearchParams({
        page: (pageIndex + 1).toString(),
        limit: pageSize.toString(),
        sortBy,
        sortOrder,
        search,
        ...filters,
    });

    const response = await apiCall<undefined, ApiResponseArray<UserInterface>>({
        url: `/admin/approved-applicants?academicSession=2024/2025&${query.toString()}`,
        method: "GET",
        accessToken: loginSession.access_token
    });

    if (response?.status && response.data.data) {
        return {
            data: response.data.data,
            total: response.data.total,
        };
    } else {
        console.error("Failed to fetch categories");
        return { data: [], total: 0 };
    }
}

export async function getStudentApplicantion(id: string): Promise<{ data: ApplicationDetailsType | null }> {
    const loginSession = (await getSession(loginSessionKey)) as SessionData;
    const routeUrl = (loginSession.user.role === "STUDENT")
        ? `/application/application-data`
        : (loginSession.user.role === "ADMIN")
            ? `/admin/single-application?id=${id}`
            : "";

    const response = await apiCall<undefined, ApiResponseSingle<ApplicationDetailsType>>({
        url: `${routeUrl}`,
        method: "GET",
        accessToken: loginSession.access_token
    });

    if (response?.status && response.data) {
        return {
            data: response.data,
        };
    } else {
        console.error("Failed to fetch student application");
        return { data: null };
    }
}

export async function ApproveStudentApplicantion(data: ApplicationApproveValues): Promise<boolean> {
    const loginSession = (await getSession(loginSessionKey)) as SessionData;
    const response = await apiCall<ApplicationApproveValues, ApiResponseSingle<ApplicationDetailsType>>({
        url: `/admin/approve-application`,
        method: "POST",
        data: data,
        accessToken: loginSession.access_token
    });
    if (response?.status !== 200) {
        console.error("Invalid API response", response);
        throw new Error("Failed to approve student applocation");
    }

    return true;
}

export async function RejectStudentApplicantion(data: ApplicationRejectValues): Promise<boolean> {
    const loginSession = (await getSession(loginSessionKey)) as SessionData;

    const response = await apiCall<ApplicationRejectValues, ApiResponseSingle<ApplicationDetailsType>>({
        url: `/admin/reject-application`,
        method: "DELETE",
        data: data,
        accessToken: loginSession.access_token
    });
    if (response?.status !== 200) {
        console.error("Invalid API response", response);
        throw new Error("Failed to  reject student applocation");
    }

    return true;
}

// use ApplicationsHook
export async function getApplications(
    filters?: Record<string, string>,
    access_token?: string,
): Promise<Application[]> {
    const params = new URLSearchParams(filters);
    // const res = await fetch(`/api/applications?${params.toString()}`);
    const res = await fetch(`${remoteApiUrl}/admin/all-applications?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch applications");
    }

    return res.json();
}

// review editing
export const updateStudentApplicationData = async (applicationId: string, data: ApplicationChunk): Promise<void> => {
    const requestData = { application_id: applicationId, ...data };
    const loginSession = (await getSession(loginSessionKey)) as SessionData;
    const response = await fetch(`${remoteApiUrl}/application/update-application-form`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loginSession.access_token}`,
        },
        body: JSON.stringify(requestData),
    });
    if (!response.ok) {
        const error = await response.json();
        console.error('error', error)
        throw new Error(error.message || 'Failed to update personal information');
    }
    const result = await response.json();
    return result;
};
export const updateStudentPersonalInfoData = async (data: ApplicationChunk): Promise<void> => {
    const requestData = { ...data };
    const loginSession = (await getSession(loginSessionKey)) as SessionData;
    const routeUrl = (loginSession.user.role === "STUDENT")
        ? `/account/user-personal-update`
        : (loginSession.user.role === "ADMIN")
            ? `/account/user-update`
            : "";
    console.log('routeUrl', routeUrl, `${remoteApiUrl}${routeUrl}`)
    try {
        const response = await fetch(`${remoteApiUrl}${routeUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${loginSession.access_token}`,
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} ${errorText}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Network or API error:", error);
        throw new Error("Failed to update personal information. Please try again later.");
    }
};
