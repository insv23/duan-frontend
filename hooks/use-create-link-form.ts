import { useActionState, useEffect, useState } from "react";
import { createLink } from "@/app/actions/link.actions";
import { CreateLinkSchema } from "@/lib/schemas";
import type { FormState } from "@/lib/types";

const initialState: FormState = { message: "" };

export function useCreateLinkForm({ onSave }: { onSave: () => void }) {
	const [state, formAction] = useActionState(createLink, initialState);

	const [url, setUrl] = useState("");
	const [slug, setSlug] = useState("");
	const [description, setDescription] = useState("");

	const [urlError, setUrlError] = useState("");
	const [slugError, setSlugError] = useState("");

	useEffect(() => {
		if (state.error) {
			setUrlError(state.fieldErrors?.url?.[0] ?? "");
			setSlugError(state.fieldErrors?.slug?.[0] ?? "");
		} else if (state.message) {
			// On successful submission, call onSave to close the dialog etc.
			onSave();
		}
	}, [state, onSave]);

	const handleUrlChange = (newUrl: string) => {
		setUrl(newUrl);
		setUrlError("");
	};

	const handleSlugChange = (newSlug: string) => {
		setSlug(newSlug);
		setSlugError("");
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

	const resetForm = () => {
		setUrl("");
		setSlug("");
		setDescription("");
		setUrlError("");
		setSlugError("");
	};

	const isFormValid =
		!urlError && !slugError && url.trim() !== "" && slug.trim() !== "";

	return {
		form: {
			state,
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
			resetForm,
		},
		isFormValid,
	};
}
