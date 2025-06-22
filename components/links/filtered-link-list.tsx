"use client";

import { useSearch } from "@/components/search-provider";
import type { Link } from "@/lib/types";
import { useMemo } from "react";
import { LinkCard } from "./link-card";

export function FilteredLinkList({ links }: { links: Link[] }) {
	const { searchTerm } = useSearch();

	const filteredLinks = useMemo(() => {
		if (!searchTerm) {
			return links;
		}
		const lowercasedTerm = searchTerm.toLowerCase();
		return links.filter(
			(link) =>
				link.slug.toLowerCase().includes(lowercasedTerm) ||
				link.url.toLowerCase().includes(lowercasedTerm) ||
				link.description?.toLowerCase().includes(lowercasedTerm),
		);
	}, [links, searchTerm]);

	if (filteredLinks.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
				<h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
					No links found
				</h3>
				<p className="mt-2 text-sm text-muted-foreground">
					Your search for "{searchTerm}" did not match any links.
				</p>
			</div>
		);
	}

	return (
		<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
			{filteredLinks.map((link) => (
				<LinkCard key={link.slug} link={link} />
			))}
		</div>
	);
}
