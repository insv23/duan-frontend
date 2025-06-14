import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here.
	 * This way you can ensure the app isn't built with invalid env vars.
	 */
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		DASHBOARD_TOKEN: z.string().min(1),
		BACKEND_API_URL: z.string().url({
			message: "BACKEND_API_URL must be a valid URL.",
		}),
		BACKEND_API_TOKEN: z.string().min(1),
	},

	/**
	 * Specify your client-side environment variables schema here.
	 * This way you can ensure the app isn't built with invalid env vars.
	 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
	 */
	client: {
		NEXT_PUBLIC_API_URL: z.string().url({
			message: "NEXT_PUBLIC_API_URL must be a valid URL.",
		}),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares), so you need to list all the env vars you want to use below.
	 */
	runtimeEnv: {
		// Server-side
		NODE_ENV: process.env.NODE_ENV,
		DASHBOARD_TOKEN: process.env.DASHBOARD_TOKEN,
		BACKEND_API_URL: process.env.BACKEND_API_URL,
		BACKEND_API_TOKEN: process.env.BACKEND_API_TOKEN,

		// Client-side
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	},
});
