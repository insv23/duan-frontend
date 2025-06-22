"use client";

import { Card } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Copy,
	Edit,
	Eye,
	Link as LinkIcon,
	CheckCircle2,
	XCircle,
} from "lucide-react";
import type { Link } from "@/lib/types";
import { useState } from "react";
import { EditLinkDialog } from "./edit-link-dialog";
import { LinkActions } from "./link-actions";
import { DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { env } from "@/lib/config";
import { formatDistanceToNow } from "date-fns";

type LinkCardProps = {
	link: Link;
};

export function LinkCard({ link }: LinkCardProps) {
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const baseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
	const shortUrl = `${baseUrl}/${link.slug}`;

	const handleCopy = () => {
		navigator.clipboard.writeText(shortUrl);
		toast.success(
			<p className="text-sm">
				Copied <code className="bg-muted px-1 py-0.5 rounded">{shortUrl}</code>{" "}
				to clipboard!
			</p>,
		);
	};

	return (
		<Card className="backdrop-blur-sm bg-white/30 dark:bg-black/30 w-full relative flex flex-col overflow-hidden">
			{/* Status indicator triangle in top-right corner */}
			<div
				className={`absolute top-0 right-0 w-0 h-0 border-t-[40px] border-l-[40px] ${
					link.is_enabled
						? "border-t-green-500 border-l-transparent"
						: "border-t-yellow-500 border-l-transparent"
				}`}
			>
				{link.is_enabled ? (
					<CheckCircle2 className="absolute -top-8 -left-4 h-3 w-3 text-white" />
				) : (
					<XCircle className="absolute -top-8 -left-4 h-3 w-3 text-white" />
				)}
			</div>

			<div className="px-6">
				{/* First row: slug + copy button - truly on same line */}
				<div className="flex items-center gap-2 min-w-0">
					<div className="text-2xl font-bold tracking-tight truncate min-w-0">
						{link.slug}
					</div>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={handleCopy}
									className="h-8 w-8 flex-shrink-0"
								>
									<Copy className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Copy full short link</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				{/* Second row: URL */}
				<div className="flex items-center space-x-2 text-sm text-muted-foreground pt-2 overflow-hidden min-w-0">
					<LinkIcon className="h-4 w-4 flex-shrink-0" />
					<a
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						className="truncate hover:underline min-w-0"
					>
						{link.url}
					</a>
				</div>
			</div>

			{/* Third row: Description (if exists) - this section grows to fill available space */}
			<div className="flex-1 px-6">
				{link.description && (
					<p className="text-sm text-muted-foreground pb-4">
						{link.description}
					</p>
				)}
			</div>

			{/* Fixed bottom section: Separator + Footer */}
			<div className="mt-auto">
				<Separator className="my-4" />
				<div className="flex flex-row items-start justify-between px-6">
					<div className="flex flex-col gap-1 text-xs text-muted-foreground">
						<div className="flex items-center">
							<Eye className="h-4 w-4 mr-1" />
							<span>{link.visit_count.toLocaleString()} visits</span>
						</div>
						<span
							className="text-xs text-muted-foreground"
							title={
								link.last_visited_at
									? new Date(`${link.last_visited_at}Z`).toLocaleString()
									: new Date(`${link.created_at}Z`).toLocaleString()
							}
						>
							{link.last_visited_at
								? `Last visited: ${formatDistanceToNow(new Date(`${link.last_visited_at}Z`), { addSuffix: true })}`
								: `Created: ${formatDistanceToNow(new Date(`${link.created_at}Z`), { addSuffix: true })}`}
						</span>
					</div>
					<div className="flex items-center space-x-1">
						<EditLinkDialog
							link={link}
							open={isEditDialogOpen}
							onOpenChange={setIsEditDialogOpen}
						>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<DialogTrigger asChild>
											<Button variant="ghost" size="icon">
												<Edit className="h-4 w-4" />
											</Button>
										</DialogTrigger>
									</TooltipTrigger>
									<TooltipContent>
										<p>Edit link</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</EditLinkDialog>

						<LinkActions link={link} />
					</div>
				</div>
			</div>
		</Card>
	);
}
