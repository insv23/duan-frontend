import { DASHBOARD_TOKEN } from "@/lib/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { token } = await request.json();

		if (token === DASHBOARD_TOKEN) {
			const cookieStore = await cookies();
			cookieStore.set("dashboard-token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV !== "development",
				sameSite: "strict",
				path: "/",
			});
			return NextResponse.json({ success: true });
		}

		return NextResponse.json(
			{ success: false, error: "Invalid token" },
			{ status: 401 },
		);
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: "Something went wrong" },
			{ status: 500 },
		);
	}
}
