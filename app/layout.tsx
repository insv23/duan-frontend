import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TokenProvider } from "@/components/auth/token-provider";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Duan URL Shortener Dashboard",
		template: "%s | Duan URL Shortener",
	},
	description:
		"A simple and efficient URL shortener dashboard to manage your links.",
	applicationName: "Duan URL Shortener",
	keywords: ["URL Shortener", "Link Management", "Duan", "Dashboard"],

	openGraph: {
		type: "website",
		locale: "en_US",
		// To-do: Replace with your domain
		url: "https://duan.im",
		title: "Duan URL Shortener Dashboard",
		description:
			"A simple and efficient URL shortener dashboard to manage your links.",
		siteName: "Duan URL Shortener",
		// To-do: Add your OG image
		// images: [
		//   {
		//     url: "/og-image.png",
		//     width: 1200,
		//     height: 630,
		//     alt: "Duan URL Shortener Dashboard",
		//   },
		// ],
	},

	twitter: {
		card: "summary_large_image",
		title: "Duan URL Shortener Dashboard",
		description:
			"A simple and efficient URL shortener dashboard to manage your links.",
		// To-do: Add your Twitter image
		// images: ["/twitter-image.png"],
		// To-do: Add your Twitter handle
		// creator: "@your_handle",
	},

	icons: {
		icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦘</text></svg>",
	},

	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<TokenProvider>
					<Header />
					{children}
					<Toaster />
				</TokenProvider>
			</body>
		</html>
	);
}
