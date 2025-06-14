import { DASHBOARD_TOKEN } from "@/lib/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
	const cookieStore = await cookies();
	const tokenCookie = cookieStore.get("dashboard-token");

	if (tokenCookie && tokenCookie.value === DASHBOARD_TOKEN) {
		return NextResponse.json({ authorized: true });
	}

	return NextResponse.json({ authorized: false }, { status: 401 });
}
