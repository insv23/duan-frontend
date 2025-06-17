"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";
import type { ReactNode } from "react";
import { getAllSlugs } from "@/app/actions/link.actions";

interface SlugsContextType {
	slugs: Set<string>;
	isSlugAvailable: (slug: string) => boolean;
	addSlug: (slug: string) => void;
	removeSlug: (slug: string) => void;
	isLoading: boolean;
	refreshSlugs: () => Promise<void>;
}

const SlugsContext = createContext<SlugsContextType | undefined>(undefined);

interface SlugsProviderProps {
	children: ReactNode;
	initialSlugs?: string[];
}

export function SlugsProvider({
	children,
	initialSlugs = [],
}: SlugsProviderProps) {
	const [slugs, setSlugs] = useState<Set<string>>(new Set(initialSlugs));
	const [isLoading, setIsLoading] = useState(true);

	// Initialize slugs from server
	const refreshSlugs = useCallback(async () => {
		try {
			setIsLoading(true);
			const serverSlugs = await getAllSlugs();
			setSlugs(new Set(serverSlugs));
		} catch (error) {
			console.error("Failed to fetch slugs:", error);
			// Keep existing slugs on error
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Initialize on mount
	useEffect(() => {
		// If no initial slugs provided, fetch from server
		if (initialSlugs.length === 0) {
			refreshSlugs();
		} else {
			setIsLoading(false);
		}
	}, [initialSlugs.length, refreshSlugs]);

	// Check if a slug is available (not taken)
	const isSlugAvailable = (slug: string): boolean => {
		if (!slug.trim()) return false;
		return !slugs.has(slug);
	};

	// Add a new slug to the set (when creating a link)
	const addSlug = (slug: string) => {
		setSlugs((prev) => new Set([...prev, slug]));
	};

	// Remove a slug from the set (when deleting a link)
	const removeSlug = (slug: string) => {
		setSlugs((prev) => {
			const newSlugs = new Set(prev);
			newSlugs.delete(slug);
			return newSlugs;
		});
	};

	const value: SlugsContextType = {
		slugs,
		isSlugAvailable,
		addSlug,
		removeSlug,
		isLoading,
		refreshSlugs,
	};

	return (
		<SlugsContext.Provider value={value}>{children}</SlugsContext.Provider>
	);
}

export function useSlugsContext(): SlugsContextType {
	const context = useContext(SlugsContext);
	if (context === undefined) {
		throw new Error("useSlugsContext must be used within a SlugsProvider");
	}
	return context;
}
