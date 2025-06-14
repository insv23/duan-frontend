import { LinkList } from "@/components/links/link-list";
import { Suspense } from "react";

export default async function Home() {
	return (
		<main className="container mx-auto flex min-h-screen flex-col items-center p-4 pt-24">
			<Suspense
				fallback={
					<p className="text-center text-muted-foreground">Loading links...</p>
				}
			>
				<LinkList />
			</Suspense>
		</main>
	);
}
