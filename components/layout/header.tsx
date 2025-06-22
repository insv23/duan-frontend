import Image from "next/image";
import Link from "next/link";
import { CreateLinkDialog } from "@/components/links/create-link-dialog";
import { SearchInput } from "./search-input";

export function Header() {
	return (
		<header className="fixed left-0 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link href="/" className="flex items-center space-x-2">
					<Image src="/duan.png" alt="Duan logo" width={24} height={24} />
					<div className="hidden flex-col sm:flex">
						<span className="font-bold">Duan</span>
						<span className="text-xs text-muted-foreground">URL shortener</span>
					</div>
				</Link>

				<div className="flex flex-1 items-center justify-end gap-4">
					<div className="w-full max-w-lg">
						<SearchInput />
					</div>
					<nav>
						<CreateLinkDialog />
					</nav>
				</div>
			</div>
		</header>
	);
}
