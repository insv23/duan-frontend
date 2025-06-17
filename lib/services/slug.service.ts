import { fetchWithAuth } from "@/lib/api";

/**
 * Fetches all existing slugs (shortcodes) from the backend
 * Backend endpoint returns shortcodes, but we treat them as slugs in the frontend
 */
export async function getAllSlugs(): Promise<string[]> {
	try {
		const slugs = await fetchWithAuth<string[]>("/api/shortcodes", {
			method: "GET",
			next: {
				tags: ["slugs"],
			},
		});

		if (!slugs) {
			return [];
		}

		if (!Array.isArray(slugs)) {
			console.error("API did not return an array:", slugs);
			return [];
		}

		return slugs;
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred.";
		console.error("Error fetching slugs:", message);
		throw new Error(message);
	}
}