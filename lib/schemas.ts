import { z } from "zod";

export const CreateLinkSchema = z.object({
	slug: z
		.string()
		.min(1, { message: "Slug cannot be empty." })
		.regex(/^[a-zA-Z0-9_-]+$/, {
			message:
				"Slug can only contain alphanumeric characters, hyphens, and underscores.",
		})
		.refine((slug) => !slug.includes("/"), {
			message: "Slug cannot contain slashes.",
		}),
	url: z
		.string()
		.min(1, { message: "URL cannot be empty." })
		.url({ message: "A valid URL is required." })
		.refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
			message: "URL must start with 'http://' or 'https://'.",
		}),
	description: z.string().optional(),
});

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
