"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { verifySessionAction } from "./auth.actions";
import type { Link, FormState } from "@/lib/types";
import { getAllLinks } from "@/lib/services/link.service";

// Helper function for authentication
async function authenticate() {
	const { isAuthorized } = await verifySessionAction();
	if (!isAuthorized) {
		throw new Error("Unauthorized");
	}
}

export async function listLinks(): Promise<Link[]> {
	try {
		await authenticate();
		const links = await getAllLinks();
		return links;
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred.";
		// The service layer already logs the detailed error
		console.error("Error listing links in action:", message);
		throw new Error(message);
	}
}
