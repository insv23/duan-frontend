import { env } from "@/lib/config";

interface ApiError {
	error: string;
}

interface FetchOptions {
	method: string;
	body?: unknown;
	headers?: Record<string, string>;
	next?: {
		revalidate?: number | false;
		tags?: string[];
	};
}

export const fetchWithAuth = async <T>(
	path: string,
	options: FetchOptions,
): Promise<T> => {
	const url = new URL(path, env.BACKEND_API_URL);
	const response = await fetch(url.toString(), {
		headers: {
			Authorization: `Bearer ${env.BACKEND_API_TOKEN}`,
			"Content-Type": "application/json",
			"User-Agent": "Raycast Extension: duan",
			...options.headers,
		},
		method: options.method,
		body: options.body ? JSON.stringify(options.body) : undefined,
		next: options.next,
	});

	const data = await response.json().catch(() => null);

	if (!response.ok) {
		const error = data as ApiError;
		throw new Error(error?.error || `HTTP error! status: ${response.status}`);
	}

	return data as T;
};
