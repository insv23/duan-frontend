"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
		toast.error(error.message || "Something went wrong.");
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center h-full">
			<h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
			<p className="text-muted-foreground mb-6">{error.message}</p>
			<Button
				onClick={
					// Attempt to recover by trying to re-render the segment
					() => reset()
				}
			>
				Try again
			</Button>
		</div>
	);
}
