"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useSearch } from "@/components/search-provider";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchInput() {
	const { searchTerm, setSearchTerm } = useSearch();
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [isExpanded, setIsExpanded] = useState(false);

	const handleClear = () => {
		setSearchTerm("");
	};

	if (isDesktop) {
		return (
			<div className="relative w-full">
				<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder="Search by URL, slug, or description..."
					className="w-full rounded-lg bg-background pl-8"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				{searchTerm && (
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
						onClick={handleClear}
					>
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>
		);
	}

	return (
		<div className={cn("flex items-center justify-end gap-2")}>
			{isExpanded && (
				<div className="relative flex-1">
					<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search..."
						className="w-full rounded-lg bg-background pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					{searchTerm && (
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
							onClick={handleClear}
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>
			)}
			<Button
				variant="ghost"
				size="icon"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<Search className="h-5 w-5" />
				<span className="sr-only">Search Links</span>
			</Button>
		</div>
	);
}
