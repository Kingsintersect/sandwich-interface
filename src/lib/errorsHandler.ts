export const extractErrorMessages = (error: any): string[] => {
	const messages: string[] = [];

	if (error?.errors) {
		Object.keys(error.errors).forEach((field) => {
			messages.push(error.errors[field][0]); // Push first error message of each field
		});
	} else if (error?.message) {
		messages.push(error.message); // Handle single error messages
	} else {
		messages.push("An unexpected error occurred. Please try again.");
	}

	return messages;
};

export function handleHttpError(
	error: any,
	message = "",
	requestType = ""
): object {
	const msg =
		typeof error.response?.data === "object"
			? error.response.data
			: { message: error.message };

	if (error.response) {
		console.error(
			`${requestType} failed: Server responded with status ${error.response.status}`
		);
		return { success: false, message: msg || `${message}`, status: "failed" };
	} else if (error.request) {
		// The request was made, but no response received
		console.error(
			`${requestType} failed: No response from server. Please check your connection.`
		);
		return {
			success: false,
			message: "No response from server. Please check your connection.",
		};
	} else {
		// Something happened in setting up the request
		console.error(
			`${requestType} failed: Something went wrong while sending the request.`
		);
		return {
			success: false,
			message: "Something went wrong while sending the request.",
		};
	}
}

export function displayErrors(errorObject) {
	const errorMsg: string[] = [];
	for (const field in errorObject) {
		if (errorObject.hasOwnProperty(field)) {
			const errorMessages = errorObject[field];
			errorMessages?.forEach((error) => {
				if (error !== "") errorMsg.push(`${field}: ${error}`);
			});
		}
	}
	return errorMsg;
}

export const getFriendlyError = (error: unknown): string => {
	if (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as any).message === "string"
	) {
		const rawMessage = (error as any).message as string;

		// Extract JSON from the message string
		const match = rawMessage.match(/{.*}/);
		if (match) {
			try {
				const parsed = JSON.parse(match[0]);
				return parsed.message || "An error occurred. Please try again.";
			} catch {
				return "An error occurred. Please try again.";
			}
		}

		return rawMessage;
	}

	return "An unexpected error occurred. Please try again.";
};

export async function handleApiError(res: Response): Promise<never> {
	let message = `Request failed with status ${res.status}`;
	console.log('res', res);

	try {
		const contentType = res.headers.get("content-type") || "";

		if (contentType.includes("application/json")) {
			const error = await res.json();
			message = error?.message || JSON.stringify(error) || message;
		} else {
			const text = await res.text();
			if (res.status === 503 && text.includes("Service Unavailable")) {
				message = "The server is temporarily unavailable (503). Please try again shortly.";
			} else {
				message = "Unexpected error occurred. Please try again.";
			}
		}
	} catch (err) {
		message = "An unknown error occurred while processing the response.";
		console.log('Raw Error', err)
	}

	throw new Error(message);
}
export function throwFormattedError(errorResponse: {
	errors?: Record<string, string[] | string>;
	message?: string;
	[key: string]: any;
}): never {
	let errorMessage: string;

	// Handle error responses with nested errors object
	if (errorResponse.errors && typeof errorResponse.errors === 'object') {
		const formattedErrors = Object.entries(errorResponse.errors)
			.map(([field, messages]) => {
				if (Array.isArray(messages)) {
					return `${field}: ${messages.join(', ')}`;
				}
				return `${field}: ${messages}`;
			})
			.join('\n');

		errorMessage = formattedErrors;
	}
	// Fallback to regular message or stringify
	else {
		errorMessage = errorResponse.message || JSON.stringify(errorResponse);
	}

	throw new Error(errorMessage);
}

type FieldError = {
	message?: string;
	[key: string]: unknown;
};

export const getReactHookFormErrorMessages = (errObj: Record<string, FieldError>) => {
	return Object.values(errObj).flatMap((err: FieldError) =>
		err?.message
			? [err.message] // direct field error
			: typeof err === "object"
				? getReactHookFormErrorMessages(err as Record<string, FieldError>) // nested errors
				: []
	);
};