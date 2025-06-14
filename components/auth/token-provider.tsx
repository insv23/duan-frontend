"use client";

import { useAuth } from "@/hooks/use-auth";
import { FullPageLoader } from "@/components/ui/full-page-loader";
import { LoginDialog } from "./login-dialog";

export function TokenProvider({ children }: { children: React.ReactNode }) {
	const { isAuthorized, isLoading, isSubmitting, error, login } = useAuth();

	if (isLoading) {
		return <FullPageLoader />;
	}

	if (!isAuthorized) {
		return (
			<LoginDialog onSubmit={login} error={error} isSubmitting={isSubmitting} />
		);
	}

	return <>{children}</>;
}
