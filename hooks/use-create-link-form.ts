"use client";

import { useActionState, useEffect, useState } from "react";
import { createLink } from "@/app/actions/link.actions";
import { CreateLinkSchema } from "@/lib/schemas";
import { useSlugAvailability, useSlugManager } from "@/hooks/use-slugs";
import { generateRandomSlug } from "@/lib/utils";
import type { FormState } from "@/lib/types";

const initialState: FormState = { message: "" };

export function useCreateLinkForm() {
	const [actionState, formAction] = useActionState(createLink, initialState);
	const { addSlug } = useSlugManager();

	const [url, setUrl] = useState("");
	const [slug, setSlug] = useState("");
	const [description, setDescription] = useState("");

	const [urlError, setUrlError] = useState("");
	const [slugError, setSlugError] = useState("");

	// Get slug availability status
	const { isAvailable, status } = useSlugAvailability(slug);

	useEffect(() => {
		if (actionState.error) {
			setUrlError(actionState.fieldErrors?.url?.[0] ?? "");
			setSlugError(actionState.fieldErrors?.slug?.[0] ?? "");
		}
	}, [actionState]);

	// Handle slug availability status - unify all feedback in slugError
	useEffect(() => {
		if (status === "checking" && slug.trim()) {
			setSlugError("🔄 Checking availability...");
		} else if (status === "unavailable") {
			setSlugError("❌ This slug is already taken");
		} else if (status === "available") {
			setSlugError("✅ Available");
		} else if (status === "idle" && slug.trim()) {
			// Clear status messages but keep format validation errors
			if (
				slugError &&
				(slugError.includes("🔄") ||
					slugError.includes("❌") ||
					slugError.includes("✅"))
			) {
				setSlugError("");
			}
		}
	}, [status, slug, slugError]);

	const handleUrlChange = (newUrl: string) => {
		setUrl(newUrl);
		setUrlError("");
	};

	const handleSlugChange = (newSlug: string) => {
		setSlug(newSlug);
		// Clear status messages when typing, but keep format validation errors
		if (
			slugError &&
			(slugError.includes("🔄") ||
				slugError.includes("❌") ||
				slugError.includes("✅"))
		) {
			setSlugError("");
		}
	};

	const handleUrlBlur = () => {
		const result = CreateLinkSchema.pick({ url: true }).safeParse({ url });
		if (!result.success) {
			setUrlError(result.error.flatten().fieldErrors.url?.[0] || "");
		}
	};

	const handleSlugBlur = () => {
		const result = CreateLinkSchema.pick({ slug: true }).safeParse({ slug });
		if (!result.success) {
			setSlugError(result.error.flatten().fieldErrors.slug?.[0] || "");
		}
	};

	const generateSlug = () => {
		const newSlug = generateRandomSlug();
		setSlug(newSlug);
		// Clear any existing errors when generating
		setSlugError("");
	};

	const resetForm = () => {
		setUrl("");
		setSlug("");
		setDescription("");
		setUrlError("");
		setSlugError("");
	};

	// Handle successful form submission
	const handleSuccess = () => {
		// Add the new slug to the cache immediately for better UX
		if (slug.trim()) {
			addSlug(slug);
		}
		resetForm();
	};

	const isFormValid =
		!urlError &&
		url.trim() !== "" &&
		slug.trim() !== "" &&
		(!slugError || slugError === "✅ Available"); // Allow submission only if no error or slug is available

	return {
		form: {
			state: actionState,
			action: formAction,
		},
		fields: {
			url,
			slug,
			description,
			urlError,
			slugError,
		},
		handlers: {
			handleUrlChange,
			handleSlugChange,
			setDescription,
			handleUrlBlur,
			handleSlugBlur,
			generateSlug,
			resetForm,
			handleSuccess,
		},
		isFormValid,
	};
}

export type UseCreateLinkForm = ReturnType<typeof useCreateLinkForm>;
