// A service for handling authentication-related API requests.

export async function verifyToken() {
	const res = await fetch("/api/auth/verify");
	if (!res.ok) {
		// The specific error message can be improved based on API responses.
		throw new Error("Session verification failed");
	}
	return res.json();
}

export async function login(token: string) {
	const res = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ token }),
	});

	// Try to parse the body for an error message, even on failed requests.
	const data = await res.json().catch(() => ({}));

	if (!res.ok) {
		throw new Error(data.error || "An error occurred during login");
	}

	return data;
}
