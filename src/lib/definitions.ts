export type SessionPayload<T = Record<string, any>> = T & {
	issuedAt?: number;
	expiresAt: number;
};

export const ssoSessionKey = "sso_auth_session_unizik_sandwich";
export const loginSessionKey = "login_session_unizik_sandwich";
export type PaymentStatus = "FULLY_PAID" | "PART_PAID" | "UNPAID" | null;
