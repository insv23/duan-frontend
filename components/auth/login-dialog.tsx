"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type FormEvent, useState } from "react";

interface LoginDialogProps {
	onSubmit: (token: string) => void;
	error?: string;
	isSubmitting: boolean;
}

export function LoginDialog({
	onSubmit,
	error,
	isSubmitting,
}: LoginDialogProps) {
	const [token, setToken] = useState("");

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (!token || isSubmitting) return;
		onSubmit(token);
	};

	return (
		<Dialog open={true} onOpenChange={() => {}}>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Dashboard Access</DialogTitle>
						<DialogDescription>
							Please enter the dashboard token to continue.
						</DialogDescription>
					</DialogHeader>
					<div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 py-4">
						<Label htmlFor="token" className="text-right">
							Token
						</Label>
						<Input
							id="token"
							type="password"
							value={token}
							onChange={(e) => setToken(e.target.value)}
							autoFocus
						/>
						{error && (
							<p className="col-start-2 text-sm text-red-500">{error}</p>
						)}
					</div>
					<DialogFooter>
						<Button
							type="submit"
							disabled={isSubmitting || !token}
							className="w-24"
						>
							{isSubmitting ? "Verifying..." : "Verify"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
