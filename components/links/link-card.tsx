"use client";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
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
		<Card className="backdrop-blur-sm bg-white/30 dark:bg-black/30 w-full">
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex items-center gap-2 min-w-0">
						<CardTitle className="text-2xl font-bold tracking-tight break-words">
							{link.slug}
						</CardTitle>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										onClick={handleCopy}
										className="h-8 w-8"
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
					{link.is_enabled ? (
						<Badge
							variant="secondary"
							className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400 border-green-200/50 dark:border-green-800/80"
						>
							<CheckCircle2 />
							Enabled
						</Badge>
					) : (
						<Badge
							variant="secondary"
							className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400 border-yellow-200/50 dark:border-yellow-800/80"
						>
							<XCircle />
							Disabled
						</Badge>
					)}
				</div>
				<div className="flex items-center space-x-2 text-sm text-muted-foreground pt-1 overflow-hidden">
					<LinkIcon className="h-4 w-4 flex-shrink-0" />
					<a
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						className="truncate hover:underline"
					>
						{link.url}
					</a>
				</div>
			</CardHeader>
			{link.description && (
				<CardContent className="pt-2">
					<p className="text-m text-muted-foreground">{link.description}</p>
				</CardContent>
			)}
			<Separator className="my-4" />
			<CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
					<div className="flex items-center">
						<Eye className="h-4 w-4 mr-1" />
						<span>{link.visit_count.toLocaleString()} visits</span>
					</div>
					<span className="hidden sm:inline">·</span>
					<span
						className="truncate text-sm text-muted-foreground"
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
				<div className="flex items-center space-x-1 self-end sm:self-auto">
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
			</CardFooter>
		</Card>
	);
}
