import chalk from "chalk";

const token = process.env.DASHBOARD_TOKEN;

if (!token) {
	if (process.env.NODE_ENV === "production") {
		throw new Error("DASHBOARD_TOKEN environment variable is not set");
	}
	console.warn(
		chalk.yellow(
			"DASHBOARD_TOKEN is not set. Using 'dev-token' for development. This is not secure.",
		),
	);
}

export const DASHBOARD_TOKEN = token || "dev-token";
