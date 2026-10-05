import { cn } from "@/lib/utils";
import Reveal from "./application/Reveal";

/**
 * The one heading treatment used by every marketing band: an ember eyebrow,
 * a tight display headline, and an optional lede.
 */
export default function SectionHeading({
	eyebrow,
	title,
	accent,
	lede,
	align = "center",
	className,
	tone = "light",
}: {
	eyebrow?: string;
	title: string;
	accent?: string;
	lede?: string;
	align?: "center" | "left";
	className?: string;
	tone?: "light" | "dark";
}) {
	const dark = tone === "dark";

	return (
		<Reveal
			className={cn(
				"max-w-2xl",
				align === "center" ? "mx-auto text-center" : "text-left",
				className
			)}
		>
			{eyebrow && (
				<span
					className={cn(
						"inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]",
						dark ? "text-ember-400" : "text-ember-600"
					)}
				>
					<span
						className={cn(
							"h-px w-6",
							dark ? "bg-ember-400/60" : "bg-ember-600/50"
						)}
					/>
					{eyebrow}
				</span>
			)}

			<h2
				className={cn(
					"mt-4 text-3xl font-bold leading-[1.12] sm:text-4xl lg:text-[2.75rem]",
					// `dark` here is the surface tone, not the colour scheme - a light
					// surface still needs a dark-mode colour or the heading vanishes.
					dark ? "text-white" : "text-ocean-900 dark:text-white"
				)}
			>
				{title}
				{accent && (
					<>
						{" "}
						<span className={dark ? "text-ember-400" : "text-gradient-ember"}>
							{accent}
						</span>
					</>
				)}
			</h2>

			{lede && (
				<p
					className={cn(
						"mt-5 text-base leading-relaxed",
						dark ? "text-white/65" : "text-muted-foreground"
					)}
				>
					{lede}
				</p>
			)}
		</Reveal>
	);
}
