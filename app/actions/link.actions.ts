"use server";

import { revalidateTag } from "next/cache";
import { verifySessionAction } from "./auth.actions";
import type { Link, FormState } from "@/lib/types";
import {
	getAllLinks,
	updateLink as updateLinkService,
	deleteLink as deleteLinkService,
} from "@/lib/services/link.service";
import { UpdateLinkSchema } from "@/lib/schemas";

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

export async function updateLink(
	state: FormState,
	formData: FormData,
): Promise<FormState> {
	try {
		await authenticate();

		const validatedFields = UpdateLinkSchema.safeParse({
			slug: formData.get("slug"),
			url: formData.get("url"),
			description: formData.get("description"),
			is_enabled: formData.get("is_enabled"),
		});

		if (!validatedFields.success) {
			return {
				message:
					validatedFields.error.flatten().fieldErrors.url?.[0] ||
					"Invalid data provided.",
				error: true,
			};
		}

		const { slug, ...dataToUpdate } = validatedFields.data;

		await updateLinkService(slug, dataToUpdate);

		// Invalidate the cache for any data tagged with "links".
		revalidateTag("links");
		return { message: "Link updated successfully." };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred.";
		console.error("Error updating link in action:", message);
		return { message, error: true };
	}
}

export async function deleteLink(
	slug: string,
): Promise<{ message: string; error?: boolean }> {
	try {
		await authenticate();

		if (!slug) {
			return { message: "Slug is required to delete a link.", error: true };
		}

		const result = await deleteLinkService(slug);

		// Invalidate the cache for the links list to reflect the deletion.
		revalidateTag("links");

		return { message: result.message };
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred.";
		console.error("Error deleting link in action:", message);
		return { message, error: true };
	}
}
