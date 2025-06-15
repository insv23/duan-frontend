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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { useCreateLinkForm } from "@/hooks/use-create-link-form";

function SubmitButton({ isValid }: { isValid: boolean }) {
	const { pending } = useFormStatus();
	return (
		<Button type="submit" disabled={!isValid || pending}>
			{pending ? "Creating..." : "Create"}
		</Button>
	);
}

export function CreateLinkDialog() {
	const [open, setOpen] = useState(false);
	const { form, fields, handlers, isFormValid } = useCreateLinkForm({
		onSave: () => {
			setOpen(false);
			handlers.resetForm();
		},
	});

	useEffect(() => {
		if (form.state.message) {
			if (form.state.error && !form.state.fieldErrors) {
				// This is a global error, show a toast
				toast.error(form.state.message);
			} else if (!form.state.error) {
				// This is a success message
				toast.success(form.state.message);
			}
		}
	}, [form.state]);

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) {
					handlers.resetForm();
				}
			}}
		>
			<DialogTrigger asChild>
				<Button>Create Link</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create a new link</DialogTitle>
					<DialogDescription>
						Enter the details for your new short link.
					</DialogDescription>
				</DialogHeader>
				<form action={form.action} className="grid gap-4 py-4">
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
						<Input
							id="slug"
							name="slug"
							placeholder="custom-slug"
							value={fields.slug}
							onChange={(e) => handlers.handleSlugChange(e.target.value)}
							onBlur={handlers.handleSlugBlur}
							required
						/>
						{fields.slugError && (
							<p className="text-sm text-red-500">{fields.slugError}</p>
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
						/>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<SubmitButton isValid={isFormValid} />
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
