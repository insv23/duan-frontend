"use client";

import { loginAction, verifySessionAction } from "@/app/actions/auth.actions";
import { useEffect, useState } from "react";

export function useAuth() {
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [isLoading, setIsLoading] = useState(true); // For initial verification
	const [isSubmitting, setIsSubmitting] = useState(false); // For login form submission
	const [error, setError] = useState("");

	useEffect(() => {
		async function doVerifyToken() {
			try {
				const data = await verifySessionAction();
				if (data.isAuthorized) {
					setIsAuthorized(true);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		}
		doVerifyToken();
	}, []);

	const login = async (token: string) => {
		setError("");
		setIsSubmitting(true);
		try {
			const data = await loginAction(token);
			if (data.success) {
				setIsAuthorized(true);
			} else {
				setError(data.error || "Invalid token");
			}
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unknown error occurred");
			}
			console.error("Login failed", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return { isAuthorized, isLoading, isSubmitting, error, login };
}
