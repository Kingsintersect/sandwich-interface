export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_SANDWHICH ?? "";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL_SANDWHICH ?? "";
export const credoPaymentBaseUrl = process.env.NEXT_PUBLIC_CREDO_PAYMENT_GATEWAY_URL ?? "https://pay.credodemo.com/v4";

export const remoteApiUrl = process.env.NEXT_PUBLIC_REMOTE_API_URL_SANDWHICH ?? "";
export const lmsRootUrl = process.env.NEXT_PUBLIC_LMS_ROOT_URL_SANDWHICH ?? "";
export const lmsLoginUrl = process.env.NEXT_PUBLIC_LMS_LOGIN_URL_SANDWHICH ?? "";

export const accessTokenSecret =
	process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET_SANDWHICH ?? "";
export const refreshTokenSecret =
	process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET_SANDWHICH ?? "";

export const sessionSecret = process.env.NEXT_PUBLIC_SESSION_SECRET_SANDWHICH ?? "";
export const sessionPassword =
	process.env.NEXT_PUBLIC_SESSION_PASSWORD_SANDWHICH ?? "";

export const clientId = process.env.NEXT_PUBLIC_CLIENT_ID_SANDWHICH ?? "";
export const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET_SANDWHICH ?? "";

const secretKey = process.env.NEXT_PUBLIC_SESSION_SECRET_SANDWHICH;
export const encodedKey = new TextEncoder().encode(secretKey);

export const SITE_NAME = "UNIZIK SANDWICH PROGRAM LMS"
export const IS_SANDWICH = Boolean(process.env.NEXT_PUBLIC_IS_SANDWICH);

export enum Roles {
	ADMIN = "ADMIN",
	STUDENT = "STUDENT",
	TEACHER = "TEACHER",
	MANAGER = "MANAGER",
}
export const APPLICATION_FEE = 18000;
export const ACCEPTANCE_FEE = 30000;
export const FULL_TUITION_FEE = 195000;
