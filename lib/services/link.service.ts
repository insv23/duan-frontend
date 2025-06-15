import { fetchWithAuth } from "@/lib/api";
import type { ApiLink, CreateLinkResponse, Link } from "@/lib/types";

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
	payload: Partial<
		Omit<
			ApiLink,
			"short_code" | "created_at" | "last_visited_at" | "visit_count"
		>
	>,
): Promise<Link> {
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

export async function deleteLink(slug: string): Promise<{ message: string }> {
	try {
		// The backend returns a { message: string } object on successful deletion.
		const response = await fetchWithAuth<{ message: string }>(
			`/api/links/${slug}`,
			{
				method: "DELETE",
			},
		);
		return response;
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred.";
		console.error(`Error deleting link ${slug}:`, message);
		throw new Error(message);
	}
}

export async function createLink(data: {
	slug: string;
	url: string;
	description?: string;
}): Promise<CreateLinkResponse> {
	const payload = {
		short_code: data.slug,
		url: data.url,
		description: data.description,
	};

	try {
		const response = await fetchWithAuth<CreateLinkResponse>("/api/links", {
			method: "POST",
			body: payload,
		});
		return response;
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred.";
		console.error("Error creating link:", message);
		throw new Error(message);
	}
}
