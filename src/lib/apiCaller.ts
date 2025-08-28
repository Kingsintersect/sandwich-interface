import { remoteApiUrl } from "@/config";
import { ApiResponse } from "@/types/generic.types";
import axios, { Method, AxiosRequestConfig, AxiosError } from "axios";

type IParam = {
	url: string;
	method: Method;
	data?: any;
	headers?: AxiosRequestConfig["headers"];
	throwError?: boolean;
};


type FetchMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
interface FetchOptions<T> {
	url: string;
	method?: FetchMethod;
	data?: T;
	accessToken?: string;
	credentials?: "include" | "same-origin" | "omit";
	cache?: "no-store" | "default" | "force-cache" | "only-if-cached";
}
export const apiCall = async <TRequest = unknown, TResponse = unknown>({
	url,
	method = "GET",
	data,
	accessToken,
	credentials = "include",
	cache = "no-store",
}: FetchOptions<TRequest>): Promise<TResponse | null> => {
	const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

	const headers: HeadersInit = {};
	if (!isFormData) {
		headers["Content-Type"] = "application/json";
	}
	if (accessToken) {
		headers["Authorization"] = `Bearer ${accessToken}`;
	}

	try {
		const response = await fetch(`${remoteApiUrl}${url}`, {
			method,
			headers,
			credentials,
			cache,
			body: method !== "GET"
				? isFormData
					? data as FormData
					: JSON.stringify(data)
				: undefined,
		});

		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			return await response.json();
		} else {
			return null;
		}
	} catch (err) {
		console.error("NETWORK ERROR:", err);
		return null;
	}
};


export const apiCallerBeta = async <T>({
	url,
	method,
	data,
	headers,
}: IParam): Promise<ApiResponse<T>> => {
	try {
		const res = await axios<T>({
			url,
			method,
			data,
			headers,
		});
		return {
			success: res.data,
			error: null,
		};
	} catch (error) {
		const err = error as AxiosError;
		const error_data = {
			statusCode: err.response?.status,
			...(typeof err.response?.data === "object"
				? err.response.data
				: { message: err.message }),
		};
		return {
			success: null as unknown as T,
			error: error_data,
		};
	}
};
