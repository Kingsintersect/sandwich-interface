import Image from "next/image";
import Link from "next/link";
import { ArrowLeft01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { cn } from "@/lib/utils";

const assurances = [
	"Accredited by the National Universities Commission",
	"Taught by UNIZIK's regular academic staff",
	"Apply, pay and check results in one place",
];

/**
 * The shell behind every auth screen. Deliberately does NOT render the site
 * header: sign-in and sign-up are focused tasks, so the only way out is the
 * explicit "Back to site" link.
 *
 * `wide` gives the form column more room for the multi-step application form.
 */
export default function AuthShell({
	title,
	subtitle,
	children,
	footer,
	wide = false,
}: {
	title: string;
	subtitle?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	wide?: boolean;
}) {
	return (
		<main className="flex min-h-screen bg-background">
			{/* Brand panel - decorative, so it steps aside on small screens */}
			<aside
				className={cn(
					"relative hidden overflow-hidden bg-ocean-950 lg:block",
					wide ? "lg:w-[38%]" : "lg:w-[52%]"
				)}
			>
				<Image
					src="/slides/unizik-gate.jpg"
					alt=""
					aria-hidden
					fill
					priority
					sizes="52vw"
					style={{ objectPosition: "center 45%" }}
					className="object-cover"
				/>

				{/* Same scrim recipe as the homepage hero, so the two read as one site */}
				<div className="absolute inset-0 bg-gradient-to-br from-ocean-950/95 via-ocean-950/70 to-ocean-800/55" />
				<div className="pointer-events-none absolute -bottom-32 -left-20 size-[32rem] rounded-full bg-ember-600/25 blur-[130px]" />
				<div className="pointer-events-none absolute -top-24 right-0 size-[26rem] rounded-full bg-ocean-500/20 blur-[120px]" />

				<div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
					<Link href="/" className="relative block h-12 w-44">
						<Image
							src="/logo/crest-wordmark.png"
							alt="Nnamdi Azikiwe University, Awka"
							fill
							sizes="176px"
							className="object-contain object-left brightness-0 invert"
						/>
					</Link>

					<div className="max-w-md">
						<span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ember-400">
							Sandwich Programme
						</span>
						<h2 className="mt-5 text-4xl font-bold leading-[1.1] text-white xl:text-5xl">
							A degree that fits{" "}
							<span className="text-ember-400">the life you already have</span>
						</h2>

						<ul className="mt-9 space-y-4">
							{assurances.map((item) => (
								<li key={item} className="flex items-start gap-3 text-sm text-white/70">
									<Icon
										icon={CheckmarkCircle02Icon}
										className="mt-0.5 size-4.5 text-ember-500"
									/>
									{item}
								</li>
							))}
						</ul>
					</div>

					<p className="text-xs text-white/40">
						&copy; {new Date().getFullYear()} Nnamdi Azikiwe University, Awka.
					</p>
				</div>
			</aside>

			{/* Form column */}
			<section className="flex min-h-screen flex-1 flex-col">
				<header className="flex items-center justify-between gap-4 px-6 py-6 sm:px-10">
					{/* The crest only needs repeating here where the brand panel is hidden */}
					<Link href="/" className="relative block h-10 w-32 lg:hidden">
						<Image
							src="/logo/crest-wordmark.png"
							alt="Nnamdi Azikiwe University, Awka"
							fill
							sizes="128px"
							className="object-contain object-left"
						/>
					</Link>
					<span className="hidden lg:block" />

					<div className="flex items-center gap-2">
						<ThemeToggleButton />
						<Link
							href="/"
							className="group inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-ocean-300 hover:bg-accent hover:text-ocean-700"
						>
							<Icon
								icon={ArrowLeft01Icon}
								className="size-3.5 transition-transform group-hover:-translate-x-0.5"
							/>
							Back to site
						</Link>
					</div>
				</header>

				<div className="flex flex-1 items-center justify-center px-6 pb-12 sm:px-10">
					<div className={cn("w-full", wide ? "max-w-3xl" : "max-w-md")}>
						<h1 className="text-3xl font-bold tracking-tight text-ocean-900 dark:text-foreground">
							{title}
						</h1>
						{subtitle && (
							<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
								{subtitle}
							</p>
						)}

						<div className="mt-9">{children}</div>

						{footer && (
							<div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
								{footer}
							</div>
						)}
					</div>
				</div>
			</section>
		</main>
	);
}
