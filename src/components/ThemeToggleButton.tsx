"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * Compact light/dark switch for the marketing header. `onDark` is for the
 * transparent state over the hero, where the button sits on imagery and needs
 * light-on-dark styling.
 *
 * next-themes resolves the theme on the client, so the icon is held back until
 * mount to avoid a hydration mismatch.
 */
export default function ThemeToggleButton({
	onDark = false,
	className,
}: {
	onDark?: boolean;
	className?: string;
}) {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const isDark = resolvedTheme === "dark";

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			title={isDark ? "Switch to light mode" : "Switch to dark mode"}
			className={cn(
				"flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
				onDark
					? "text-white/80 hover:bg-white/10 hover:text-white"
					: "text-muted-foreground hover:bg-accent hover:text-ocean-700",
				className
			)}
		>
			{mounted ? (
				<Icon icon={isDark ? Sun03Icon : Moon02Icon} className="size-4.5" />
			) : (
				<span className="size-4.5" />
			)}
		</button>
	);
}
