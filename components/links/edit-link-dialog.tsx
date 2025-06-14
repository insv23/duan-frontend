"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Link } from "@/lib/types";
import { useFormStatus } from "react-dom";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEditLinkForm } from "@/hooks/use-edit-link-form";

type EditLinkDialogProps = {
	link: Link;
	children: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function EditLinkDialog({
	link,
	children,
	open,
	onOpenChange,
}: EditLinkDialogProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				{children}
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Link</DialogTitle>
						<DialogDescription>
							Update your shortened link details. Changes will be saved upon
							clicking "Save changes".
						</DialogDescription>
					</DialogHeader>
					<EditLinkForm
						key={link.slug}
						link={link}
						onSave={() => onOpenChange(false)}
						isDesktop={isDesktop}
					/>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			{children}
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DialogTitle>Edit Link</DialogTitle>
					<DialogDescription>
						Update your shortened link details. Changes will be saved upon
						clicking "Save changes".
					</DialogDescription>
				</DrawerHeader>
				<EditLinkForm
					key={link.slug}
					link={link}
					onSave={() => onOpenChange(false)}
					className="px-4"
					isDesktop={isDesktop}
				/>
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

function SubmitButton({
	isDirty,
	urlError,
}: {
	isDirty: boolean;
	urlError: string;
}) {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={!isDirty || !!urlError || pending}>
			{pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
			Save changes
		</Button>
	);
}

function EditLinkForm({
	link,
	onSave,
	className,
	isDesktop,
}: {
	link: Link;
	onSave: () => void;
	className?: string;
	isDesktop: boolean;
}) {
	const { state, form, handlers } = useEditLinkForm({ link, onSave });

	return (
		<form action={form.dispatch} className={cn("grid gap-4 py-4", className)}>
			<input type="hidden" name="slug" value={link.slug} />
			<div className="grid grid-cols-4 items-center gap-4">
				<Label htmlFor="url" className="text-right">
					URL
				</Label>
				<div className="col-span-3">
					<Input
						id="url"
						name="url"
						value={state.url}
						onChange={(e) => handlers.setUrl(e.target.value)}
						onBlur={handlers.handleUrlBlur}
					/>
					{state.urlError && (
						<p className="text-sm text-red-500 mt-1">{state.urlError}</p>
					)}
				</div>
			</div>
			<div className="grid grid-cols-4 items-center gap-4">
				<Label htmlFor="description" className="text-right">
					Description
				</Label>
				<Textarea
					id="description"
					name="description"
					value={state.description}
					onChange={(e) => handlers.setDescription(e.target.value)}
					className="col-span-3"
				/>
			</div>
			<div className="grid grid-cols-4 items-center gap-4">
				<Label htmlFor="enabled" className="text-right">
					Enabled
				</Label>
				<div className="flex items-center">
					<input
						type="hidden"
						name="is_enabled"
						value={state.isEnabled.toString()}
					/>
					<Switch
						id="enabled"
						checked={state.isEnabled}
						onCheckedChange={handlers.setIsEnabled}
					/>
				</div>
			</div>
			{isDesktop ? (
				<DialogFooter>
					<SubmitButton isDirty={state.isDirty} urlError={state.urlError} />
				</DialogFooter>
			) : (
				<SubmitButton isDirty={state.isDirty} urlError={state.urlError} />
			)}
		</form>
	);
}
