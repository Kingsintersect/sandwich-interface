export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_UBS ?? "";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL_UBS ?? "";
export const credoPaymentBaseUrl = process.env.NEXT_PUBLIC_CREDO_PAYMENT_GATEWAY_URL ?? "https://pay.credodemo.com/v4";

export const remoteApiUrl = process.env.NEXT_PUBLIC_REMOTE_API_URL_UBS ?? "";
export const lmsLoginUrl = process.env.NEXT_PUBLIC_LMS_LOGIN_URL_UBS ?? "";

export const accessTokenSecret =
	process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET_UBS ?? "";
export const refreshTokenSecret =
	process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET_UBS ?? "";

export const sessionSecret = process.env.NEXT_PUBLIC_SESSION_SECRET_UBS ?? "";
export const sessionPassword =
	process.env.NEXT_PUBLIC_SESSION_PASSWORD_UBS ?? "";

export const clientId = process.env.NEXT_PUBLIC_CLIENT_ID_UBS ?? "";
export const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET_UBS ?? "";

const secretKey = process.env.NEXT_PUBLIC_SESSION_SECRET_UBS;
export const encodedKey = new TextEncoder().encode(secretKey);
export const SITE_NAME = "UNIZIK BUSINESS SCHOOL LMS"

export enum Roles {
	ADMIN = "ADMIN",
	STUDENT = "STUDENT",
	TEACHER = "TEACHER",
	MANAGER = "MANAGER",
}

export const APPLICATION_FEE = 37000;
export const ACCEPTANCE_FEE = 30000;
export const FULL_TUITION_FEE = 195000;
