"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
	const [count, setCount] = useState(0);

	return (
		<div>
			<Button onClick={() => setCount((count) => count + 1)}>Click me</Button>
			<p>You've clicked {count} times.</p>
		</div>
	);
}
