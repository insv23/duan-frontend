"use server";

import { env } from "@/lib/config";
import { cookies } from "next/headers";

export async function verifySessionAction() {
	try {
		const cookieStore = await cookies();
		const tokenCookie = cookieStore.get("dashboard-token");

		if (tokenCookie && tokenCookie.value === env.DASHBOARD_TOKEN) {
			return { isAuthorized: true };
		}
		return { isAuthorized: false };
	} catch (error) {
		console.error("Session verification failed:", error);
		return { isAuthorized: false, error: "Something went wrong." };
	}
}

export async function loginAction(token: string) {
	if (token === env.DASHBOARD_TOKEN) {
		try {
			const cookieStore = await cookies();
			cookieStore.set("dashboard-token", token, {
				httpOnly: true,
				secure: env.NODE_ENV !== "development",
				sameSite: "strict",
				path: "/",
			});
			return { success: true };
		} catch (error) {
			console.error("Failed to set cookie:", error);
			return { success: false, error: "Could not set session cookie." };
		}
	}

	return { success: false, error: "Invalid token." };
}
