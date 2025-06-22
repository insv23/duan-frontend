"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
	useCreateLinkForm,
	type UseCreateLinkForm,
} from "@/hooks/use-create-link-form";
import { Plus, Shuffle } from "lucide-react";
import type { FormState } from "@/lib/types";
import { useMediaQuery } from "@/hooks/use-media-query";

function SubmitButton({ isValid }: { isValid: boolean }) {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={!isValid || pending}>
			{pending ? "Creating..." : "Create"}
		</Button>
	);
}

/**
 * Solves a key problem with `useActionState`: its state is persistent.
 * A regular `useEffect` watching the state would re-trigger on every render
 * (e.g., re-showing a toast or re-closing a dialog).
 *
 * This component acts as a "state-to-event" converter. It uses `useFormStatus`
 * to detect the exact moment a form action completes (when `pending` flips from
 * true to false) and calls `onSuccess` only at that moment.
 */
function FormEffects({
	formState,
	onSuccess,
}: {
	formState: FormState;
	onSuccess: () => void;
}) {
	const { pending } = useFormStatus();

	// The `wasPending` ref stores the `pending` status from the *previous* render cycle.
	// It holds a boolean (`true`/`false`), not the result of the action itself.
	// This allows us to pinpoint the exact moment an action transitions from submitting to finished.
	const wasPending = useRef(pending);

	useEffect(() => {
		// The goal is to run effects only *after* the form action has completed.
		// We can determine this by tracking the `pending` state across renders.
		//
		// Lifecycle of a submission:
		// 1. Initial render: `pending` is `false`. `wasPending.current` is `false`. Condition fails.
		// 2. Action starts: `pending` becomes `true`. `wasPending.current` is still `false`. Condition fails.
		//    - `wasPending.current` is then updated to `true` at the end of this effect.
		// 3. Action finishes: `pending` becomes `false`. `wasPending.current` is now `true`. Condition passes.
		//    - This is the only time the condition is met, a single moment after submission.
		if (wasPending.current && !pending) {
			if (formState.message) {
				if (formState.error) {
					// Display a generic error toast only if there are no specific field errors.
					// Field-specific errors are displayed inline next to their respective fields.
					if (!formState.fieldErrors) {
						toast.error(formState.message);
					}
				} else {
					// On success, show a success toast and call the `onSuccess` callback.
					toast.success(formState.message);
					onSuccess();
				}
			}
		}

		// After each render, update the ref to the current pending state.
		// This prepares it for the comparison in the next render cycle.
		wasPending.current = pending;
	}, [pending, formState, onSuccess]);

	// This component does not render anything to the DOM.
	return null;
}

function CreateLinkForm({
	form,
	fields,
	handlers,
	isFormValid,
	onSuccess,
}: {
	form: UseCreateLinkForm["form"];
	fields: UseCreateLinkForm["fields"];
	handlers: UseCreateLinkForm["handlers"];
	isFormValid: UseCreateLinkForm["isFormValid"];
	onSuccess: () => void;
}) {
	return (
		<form action={form.action} className="grid gap-4 py-4">
			<FormEffects formState={form.state} onSuccess={onSuccess} />
			<div className="grid gap-2">
				<Label htmlFor="url">URL</Label>
				<Input
					id="url"
					name="url"
					placeholder="https://example.com"
					value={fields.url}
					onChange={(e) => handlers.handleUrlChange(e.target.value)}
					onBlur={handlers.handleUrlBlur}
					required
				/>
				{fields.urlError && (
					<p className="text-sm text-red-500">{fields.urlError}</p>
				)}
			</div>
			<div className="grid gap-2">
				<Label htmlFor="slug">Slug</Label>
				<div className="relative flex gap-2">
					<Input
						id="slug"
						name="slug"
						placeholder="custom-slug"
						value={fields.slug}
						onChange={(e) => handlers.handleSlugChange(e.target.value)}
						onBlur={handlers.handleSlugBlur}
						required
						className={`${
							fields.slugError?.includes("✅")
								? "border-green-500 focus:border-green-500"
								: fields.slugError?.includes("❌")
									? "border-red-500 focus:border-red-500"
									: ""
						}`}
					/>
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={handlers.generateSlug}
						title="Generate random slug"
					>
						<Shuffle className="h-4 w-4" />
					</Button>
				</div>
				{fields.slugError && (
					<p
						className={`text-sm ${
							fields.slugError.includes("✅")
								? "text-green-600 dark:text-green-400"
								: fields.slugError.includes("🔄")
									? "text-blue-600 dark:text-blue-400"
									: "text-red-500"
						}`}
					>
						{fields.slugError}
					</p>
				)}
			</div>
			<div className="grid gap-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					name="description"
					placeholder="A short description (optional)"
					value={fields.description}
					onChange={(e) => handlers.setDescription(e.target.value)}
					className="max-h-[25vh] min-h-[80px] overflow-y-auto resize-none"
				/>
			</div>
			<DialogFooter>
				<SubmitButton isValid={isFormValid} />
			</DialogFooter>
		</form>
	);
}

export function CreateLinkDialog() {
	const [open, setOpen] = useState(false);
	const { form, fields, handlers, isFormValid } = useCreateLinkForm();
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const handleSuccess = () => {
		handlers.handleSuccess(); // This will add slug to cache and reset form
		setOpen(false);
	};

	const dialogProps = {
		open,
		onOpenChange: (isOpen: boolean) => {
			setOpen(isOpen);
			if (!isOpen) {
				handlers.resetForm();
			}
		},
	};

	if (isDesktop) {
		return (
			<Dialog {...dialogProps}>
				<DialogTrigger asChild>
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Create Link
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Create a new link</DialogTitle>
						<DialogDescription>
							Enter the details for your new short link.
						</DialogDescription>
					</DialogHeader>
					<CreateLinkForm
						form={form}
						fields={fields}
						handlers={handlers}
						isFormValid={isFormValid}
						onSuccess={handleSuccess}
					/>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer {...dialogProps}>
			<DrawerTrigger asChild>
				<Button size="icon">
					<Plus className="h-5 w-5" />
					<span className="sr-only">Create Link</span>
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Create a new link</DrawerTitle>
					<DialogDescription>
						Enter the details for your new short link.
					</DialogDescription>
				</DrawerHeader>
				<div className="px-4">
					<CreateLinkForm
						form={form}
						fields={fields}
						handlers={handlers}
						isFormValid={isFormValid}
						onSuccess={handleSuccess}
					/>
				</div>
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button
							type="button"
							variant="outline"
							onClick={() => handlers.resetForm()}
						>
							Cancel
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
