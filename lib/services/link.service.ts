import { fetchWithAuth } from "@/lib/api";
import type { ApiLink, Link } from "@/lib/types";

function transformApiLinkToLink(link: ApiLink): Link {
	return {
		slug: link.short_code,
		url: link.original_url,
		description: link.description ?? undefined,
		is_enabled: link.is_enabled === 1,
		created_at: link.created_at,
		last_visited_at: link.last_visited_at,
		visit_count: link.visit_count,
	};
}

export async function getAllLinks(): Promise<Link[]> {
	try {
		const data = await fetchWithAuth<ApiLink[]>("/api/links", {
			method: "GET",
			next: {
				tags: ["links"],
			},
		});

		if (!data) {
			return [];
		}

		if (!Array.isArray(data)) {
			console.error("API did not return an array:", data);
			return [];
		}

		return data.map(transformApiLinkToLink);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred.";
		console.error("Error fetching links:", message);
		throw new Error(message);
	}
}
