"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ThemeToggle() {
	const { setTheme } = useTheme();

	const onThemeChange = (
		e: React.MouseEvent<HTMLDivElement>,
		theme: string,
	) => {
		const x = e.clientX;
		const y = e.clientY;

		document.documentElement.style.setProperty("--x", `${x}px`);
		document.documentElement.style.setProperty("--y", `${y}px`);

		// @ts-expect-error
		if (!document.startViewTransition) {
			setTheme(theme);
			return;
		}

		// @ts-expect-error
		document.startViewTransition(() => {
			setTheme(theme);
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={(e) => onThemeChange(e, "light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={(e) => onThemeChange(e, "dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={(e) => onThemeChange(e, "system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export { ThemeToggle };
