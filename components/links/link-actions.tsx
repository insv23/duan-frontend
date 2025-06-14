"use client";

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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, MoreVertical, Trash2 } from "lucide-react";
import type { Link } from "@/lib/types";
import { toast } from "sonner";
import { deleteLink } from "@/app/actions/link.actions";
import { useState, useTransition } from "react";

type LinkActionsProps = {
	link: Link;
};

export function LinkActions({ link }: LinkActionsProps) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		startTransition(async () => {
			const result = await deleteLink(link.slug);
			if (result.error) {
				toast.error(result.message);
			} else {
				toast.success(result.message);
				setIsDeleteDialogOpen(false); // Close dialog on success
			}
		});
	};

	return (
		<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DialogTrigger asChild>
						<DropdownMenuItem
							className="text-red-500 hover:!text-red-500 focus:text-red-500 focus:bg-red-500/10"
							onSelect={(e) => e.preventDefault()} // Prevent DropdownMenu from closing
						>
							<Trash2 className="mr-2 h-4 w-4" color="red" />
							<span>Delete</span>
						</DropdownMenuItem>
					</DialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Link</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete the link for{" "}
						<span className="font-semibold text-primary">{link.slug}</span>?
						This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsDeleteDialogOpen(false)}
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={isPending}
					>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
