import Link from "next/link";
import Image from "next/image";
import {
	ArrowRight01Icon,
	Call02Icon,
	Facebook01Icon,
	InstagramIcon,
	Linkedin01Icon,
	Location01Icon,
	Mail01Icon,
	NewTwitterIcon,
	YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import PhotoCredits from "./PhotoCredits";

const columns = [
	{
		heading: "Programme",
		links: [
			{ label: "About the Sandwich Programme", href: "#" },
			{ label: "Faculties & courses", href: "#programmes" },
			{ label: "Admission requirements", href: "/admission" },
			{ label: "Fees & payments", href: "#" },
			{ label: "Academic calendar", href: "#" },
		],
	},
	{
		heading: "Students",
		links: [
			{ label: "Student portal", href: "/auth/signin" },
			{ label: "Course registration", href: "#" },
			{ label: "Results & transcripts", href: "#" },
			{ label: "Library", href: "#" },
			{ label: "IT support", href: "#" },
		],
	},
];

// NewTwitterIcon is HugeIcons' name for the X mark.
const socials = [
	{ icon: Facebook01Icon, label: "Facebook" },
	{ icon: NewTwitterIcon, label: "X" },
	{ icon: InstagramIcon, label: "Instagram" },
	{ icon: Linkedin01Icon, label: "LinkedIn" },
	{ icon: YoutubeIcon, label: "YouTube" },
];

export default function Footer() {
	return (
		<footer className="relative overflow-hidden bg-ocean-950 text-white">
			{/* Ember bleed in the corner, mirroring the hero */}
			<div className="pointer-events-none absolute -right-32 -top-32 size-[30rem] rounded-full bg-ember-600/15 blur-[130px]" />
			<div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

			<div className="shell relative py-16 lg:py-20">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
					{/* Crest + contact */}
					<div className="lg:col-span-4">
						<Link href="/" className="relative block h-14 w-44">
							<Image
								src="/logo/crest-wordmark.png"
								alt="Nnamdi Azikiwe University, Awka"
								fill
								sizes="176px"
								className="object-contain object-left brightness-0 invert"
							/>
						</Link>

						<p className="mt-6 max-w-sm text-sm leading-relaxed text-white/60">
							The Sandwich Programme of Nnamdi Azikiwe University, Awka -
							accredited degrees delivered across vacation sessions for
							working professionals and teachers.
						</p>

						<ul className="mt-7 space-y-3 text-sm text-white/70">
							<li className="flex items-start gap-3">
								<Icon
									icon={Location01Icon}
									className="mt-0.5 size-4 text-ember-500"
								/>
								Nnamdi Azikiwe University, PMB 5025, Awka, Anambra State
							</li>
							<li className="flex items-center gap-3">
								<Icon icon={Call02Icon} className="size-4 text-ember-500" />
								+234 (0) 700 864 9425
							</li>
							<li className="flex items-center gap-3">
								<Icon icon={Mail01Icon} className="size-4 text-ember-500" />
								sandwich@unizik.edu.ng
							</li>
						</ul>
					</div>

					{/* Link columns */}
					{columns.map((column) => (
						<div key={column.heading} className="lg:col-span-2">
							<h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-500">
								{column.heading}
							</h3>
							<ul className="mt-5 space-y-3">
								{column.links.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="text-sm text-white/65 transition-colors hover:text-white"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}

					{/* Newsletter */}
					<div className="lg:col-span-4">
						<h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-500">
							Stay informed
						</h3>
						<p className="mt-5 text-sm leading-relaxed text-white/60">
							Session dates, registration deadlines and results releases,
							sent to your inbox.
						</p>

						<form className="mt-5 flex flex-col gap-2.5 sm:flex-row">
							<label htmlFor="footer-email" className="sr-only">
								Email address
							</label>
							<input
								id="footer-email"
								type="email"
								placeholder="you@example.com"
								className="h-11 w-full rounded-full border border-white/15 bg-white/5 px-5 text-sm text-white placeholder:text-white/40 focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/40"
							/>
							<Button
								type="submit"
								className="ember-surface group h-11 shrink-0 rounded-full px-6 text-sm font-semibold text-white hover:bg-none hover:bg-ember-700"
							>
								Subscribe
								<Icon
									icon={ArrowRight01Icon}
									className="size-4 transition-transform group-hover:translate-x-0.5"
								/>
							</Button>
						</form>

						<div className="mt-8 flex gap-2.5">
							{socials.map((social) => (
								<Link
									key={social.label}
									href="#"
									aria-label={social.label}
									className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-all hover:-translate-y-0.5 hover:border-ember-500/50 hover:bg-ember-600 hover:text-white"
								>
									<Icon icon={social.icon} className="size-4" />
								</Link>
							))}
						</div>
					</div>
				</div>

				<div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
					<p className="text-xs text-white/45">
						&copy; {new Date().getFullYear()} Nnamdi Azikiwe University, Awka.
						All rights reserved.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-xs">
						<Link href="#" className="text-white/55 transition-colors hover:text-white">
							Privacy policy
						</Link>
						<Link href="#" className="text-white/55 transition-colors hover:text-white">
							Terms of service
						</Link>
						<Link href="#" className="text-white/55 transition-colors hover:text-white">
							Accessibility
						</Link>
					</div>
				</div>

				<PhotoCredits />
			</div>
		</footer>
	);
}
