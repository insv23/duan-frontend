import { z } from "zod";

export const UpdateLinkSchema = z.object({
	slug: z.string(),
	url: z
		.string()
		.min(1, { message: "URL cannot be empty." })
		.url({ message: "A valid URL is required." })
		.refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
			message: "URL must start with 'http://' or 'https://'.",
		}),
	description: z.string().optional(),
	is_enabled: z.enum(["true", "false"]).transform((val) => val === "true"),
});
