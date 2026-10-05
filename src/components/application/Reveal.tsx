"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Fades + rises its children into view once, the first time they cross into
 * the viewport. Pair with `delay` to stagger a row of cards.
 * Motion is disabled wholesale by the prefers-reduced-motion rule in globals.css.
 */
export default function Reveal({
	children,
	className,
	delay = 0,
	as: Tag = "div",
	id,
}: {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	as?: "div" | "section" | "li" | "article";
	id?: string;
}) {
	const ref = useRef<HTMLElement | null>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return (
		<Tag
			id={id}
			ref={ref as React.Ref<never>}
			style={{ transitionDelay: `${delay}ms` }}
			className={cn("reveal", visible && "is-visible", className)}
		>
			{children}
		</Tag>
	);
}
