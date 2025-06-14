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
			// This option tags the fetched data with the "links" cache tag.
			// It applies to cacheable requests (primarily GET). This allows us to
			// later invalidate this specific cache using revalidateTag("links")
			// after a mutation (e.g., create, update, delete) occurs.
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

export async function updateLink(
	slug: string,
	data: Partial<Omit<Link, "slug">>,
): Promise<Link> {
	const payload: Partial<Omit<ApiLink, "short_code">> = {};

	if (data.url !== undefined) {
		payload.original_url = data.url;
	}
	if (data.description !== undefined) {
		payload.description = data.description;
	}
	if (data.is_enabled !== undefined) {
		payload.is_enabled = data.is_enabled ? 1 : 0;
	}

	try {
		const updatedApiLink = await fetchWithAuth<ApiLink>(`/api/links/${slug}`, {
			method: "PATCH",
			body: payload,
		});

		return transformApiLinkToLink(updatedApiLink);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred.";
		console.error(`Error updating link ${slug}:`, message);
		throw new Error(message);
	}
}
