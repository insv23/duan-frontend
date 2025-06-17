"use client";

import { useSlugsContext } from "@/components/links/slugs-provider";

// Re-export the context hook for convenience
export const useSlugs = useSlugsContext;

// Additional utility hooks for specific use cases

/**
 * Hook for checking slug availability with loading state
 * Returns availability status and loading state
 */
export function useSlugAvailability(slug: string) {
	const { isSlugAvailable, isLoading } = useSlugs();

	// Don't check availability while loading or if slug is empty
	if (isLoading || !slug.trim()) {
		return {
			isAvailable: null,
			isLoading,
			status: isLoading ? "checking" : "idle"
		} as const;
	}

	const isAvailable = isSlugAvailable(slug);

	return {
		isAvailable,
		isLoading: false,
		status: isAvailable ? "available" : "unavailable"
	} as const;
}

/**
 * Hook that returns only the slug checking function
 * Useful when you only need to check availability
 */
export function useSlugChecker() {
	const { isSlugAvailable, isLoading } = useSlugs();
	
	return {
		isSlugAvailable,
		isLoading,
	};
}

/**
 * Hook for managing slug operations (add/remove)
 * Useful for components that create/delete links
 */
export function useSlugManager() {
	const { addSlug, removeSlug, refreshSlugs } = useSlugs();
	
	return {
		addSlug,
		removeSlug,
		refreshSlugs,
	};
}