"use client";

import { useState, useMemo, useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { updateLink } from "@/app/actions/link.actions";
import type { Link, FormState } from "@/lib/types";
import { UpdateLinkSchema } from "@/lib/schemas";

type UseEditLinkFormProps = {
	link: Link;
	onSave: () => void;
};

export function useEditLinkForm({ link, onSave }: UseEditLinkFormProps) {
	const [url, setUrl] = useState(link.url);
	const [description, setDescription] = useState(link.description || "");
	const [isEnabled, setIsEnabled] = useState(link.is_enabled);
	const [urlError, setUrlError] = useState("");

	const initialState: FormState = { message: "", error: false };
	const [formState, dispatch] = useActionState(updateLink, initialState);
	const previousMessageRef = useRef<string | undefined>(undefined);

	const isDirty = useMemo(
		() =>
			link.url !== url ||
			(link.description || "") !== description ||
			link.is_enabled !== isEnabled,
		[link, url, description, isEnabled],
	);

	useEffect(() => {
		if (formState.message && formState.message !== previousMessageRef.current) {
			if (formState.error) {
				toast.error(formState.message);
			} else {
				toast.success(formState.message);
				onSave();
			}
		}
		previousMessageRef.current = formState.message;
	}, [formState, onSave]);

	const handleUrlBlur = () => {
		const result = UpdateLinkSchema.shape.url.safeParse(url);
		if (!result.success) {
			// Extract the first error message
			const errorMessage = result.error.issues[0]?.message;
			setUrlError(errorMessage || "Invalid URL.");
		} else {
			setUrlError("");
		}
	};

	return {
		state: {
			url,
			description,
			isEnabled,
			urlError,
			isDirty,
		},
		form: {
			state: formState,
			dispatch,
		},
		handlers: {
			setUrl,
			setDescription,
			setIsEnabled,
			handleUrlBlur,
		},
	};
}
