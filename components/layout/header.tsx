import Image from "next/image";
import Link from "next/link";
import { CreateLinkDialog } from "@/components/links/create-link-dialog";

export function Header() {
	return (
		<header className="fixed left-0 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link href="/" className="flex items-center space-x-2">
					<Image src="/duan.png" alt="Duan logo" width={24} height={24} />
					<div className="flex flex-col">
						<span className="font-bold">Duan</span>
						<span className="text-xs text-muted-foreground">URL shortener</span>
					</div>
				</Link>

				<nav>
					<CreateLinkDialog />
				</nav>
			</div>
		</header>
	);
}
