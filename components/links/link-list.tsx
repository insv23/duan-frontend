import { listLinks } from "@/app/actions/link.actions";
import { LinkCard } from "./link-card";
import { CreateLinkDialog } from "./create-link-dialog";

export async function LinkList() {
	const links = await listLinks();

	if (!links || links.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
				<h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
					You have no links yet
				</h3>
				<p className="mt-2 text-sm text-muted-foreground">
					Get started by creating your first short link.
				</p>
				<div className="mt-6">
					<CreateLinkDialog />
				</div>
			</div>
		);
	}

	return (
		<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
			{links.map((link) => (
				<LinkCard key={link.slug} link={link} />
			))}
		</div>
	);
}
