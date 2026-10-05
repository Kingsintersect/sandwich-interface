import Link from "next/link";
import {
	ArrowRight01Icon,
	ArrowUpRight01Icon,
	Atom01Icon,
	BookOpen01Icon,
	Briefcase01Icon,
	GlobalIcon,
	MicroscopeIcon,
	SourceCodeIcon,
} from "@hugeicons/core-free-icons";
import SectionHeading from "./SectionHeading";
import Reveal from "./application/Reveal";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";

const programs = [
	{
		title: "Computer Science",
		faculty: "Physical Sciences",
		description:
			"Software engineering, data structures and applied computing, taught with the tooling used in industry today.",
		icon: SourceCodeIcon,
	},
	{
		title: "Business Administration",
		faculty: "Management Sciences",
		description:
			"Strategy, finance and organisational leadership for professionals already running teams and businesses.",
		icon: Briefcase01Icon,
	},
	{
		title: "Biology",
		faculty: "Biosciences",
		description:
			"Molecular and environmental biology anchored in laboratory work at the Awka campus.",
		icon: MicroscopeIcon,
	},
	{
		title: "English & Literary Studies",
		faculty: "Arts",
		description:
			"Close reading, criticism and composition - the backbone of teaching and communication careers.",
		icon: BookOpen01Icon,
	},
	{
		title: "Physics",
		faculty: "Physical Sciences",
		description:
			"Classical and modern physics, from mechanics through to electronics and instrumentation.",
		icon: Atom01Icon,
	},
	{
		title: "Political Science",
		faculty: "Social Sciences",
		description:
			"Governance, public policy and international relations examined in a Nigerian and global frame.",
		icon: GlobalIcon,
	},
];

export default function FeaturedPrograms() {
	return (
		<section id="programmes" className="relative py-16 sm:py-24">
			<div className="shell">
				<SectionHeading
					eyebrow="Faculties & Programmes"
					title="Forty accredited routes to"
					accent="a UNIZIK degree"
					lede="Choose from programmes across six faculties, each delivered on the vacation-session calendar so study fits around full-time work."
				/>

				<div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{programs.map((program, i) => (
						<Reveal key={program.title} delay={i * 70}>
							<Link
								href="/admission"
								className="group lift relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-soft"
							>
								{/* Warm corner glow that only wakes on hover */}
								<span className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-ember-500/0 blur-3xl transition-all duration-500 group-hover:bg-ember-500/20" />

								{/* Brand hairline that draws across the top edge on hover */}
								<span className="absolute inset-x-0 top-0 h-[3px] w-0 bg-gradient-to-r from-ocean-600 to-ember-500 transition-all duration-500 group-hover:w-full" />

								<div className="relative flex items-start justify-between">
									<span className="flex size-12 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600 transition-colors duration-300 group-hover:bg-ocean-600 group-hover:text-white dark:bg-ocean-900/60 dark:text-ocean-300">
										<Icon icon={program.icon} className="size-6" />
									</span>
									<Icon
										icon={ArrowUpRight01Icon}
										className="size-5 -translate-y-1 text-muted-foreground/40 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-ember-600 group-hover:opacity-100"
									/>
								</div>

								<p className="relative mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-ember-600">
									{program.faculty}
								</p>
								<h3 className="relative mt-2 text-xl font-semibold text-ocean-900 transition-colors group-hover:text-ocean-600 dark:text-foreground">
									{program.title}
								</h3>
								<p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
									{program.description}
								</p>
							</Link>
						</Reveal>
					))}
				</div>

				<Reveal delay={120} className="mt-14 text-center">
					<Button
						asChild
						size="lg"
						variant="outline"
						className="group h-12 rounded-full border-ocean-200 px-8 text-base font-semibold text-ocean-700 hover:border-ocean-600 hover:bg-ocean-50 hover:text-ocean-700 dark:border-border dark:text-foreground"
					>
						<Link href="/admission">
							Browse every programme
							<Icon
								icon={ArrowRight01Icon}
								className="size-4.5 transition-transform group-hover:translate-x-1"
							/>
						</Link>
					</Button>
				</Reveal>
			</div>
		</section>
	);
}
