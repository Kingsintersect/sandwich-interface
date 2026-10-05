import Link from "next/link";
import {
	Alert01Icon,
	ArrowRight01Icon,
	Award01Icon,
	Calendar01Icon,
	UserGroupIcon,
} from "@hugeicons/core-free-icons";
import Reveal from "./application/Reveal";
import { Icon } from "./ui/icon";
import { cn } from "@/lib/utils";

const announcements = [
	{
		title: "2025/2026 Sandwich registration is open",
		date: "15 April 2025",
		description:
			"Course registration for the first vacation session is live. Register early - lecture groups are capped per course.",
		icon: Calendar01Icon,
		tone: "primary",
		tag: "Registration",
	},
	{
		title: "Call for papers: Annual Research Symposium",
		date: "12 April 2025",
		description:
			"Sandwich students and staff may submit abstracts for the annual symposium until 30 May 2025.",
		icon: Award01Icon,
		tone: "academic",
		tag: "Academic",
	},
	{
		title: "Scheduled portal maintenance",
		date: "10 April 2025",
		description:
			"The portal will be unavailable on 20 April, 2:00am - 6:00am, while we upgrade the results service.",
		icon: Alert01Icon,
		tone: "alert",
		tag: "Service",
	},
	{
		title: "Student representative elections",
		date: "8 April 2025",
		description:
			"Voting for the Sandwich Students' Association executive runs from 25 - 26 April at the Awka campus.",
		icon: UserGroupIcon,
		tone: "community",
		tag: "Community",
	},
];

const toneStyles: Record<string, { chip: string; icon: string }> = {
	primary: {
		chip: "bg-ocean-50 text-ocean-700 dark:bg-ocean-900/50 dark:text-ocean-200",
		icon: "bg-ocean-600 text-white",
	},
	academic: {
		chip: "bg-ember-50 text-ember-700 dark:bg-ember-900/40 dark:text-ember-300",
		icon: "ember-surface text-white",
	},
	alert: {
		chip: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
		icon: "bg-amber-500 text-white",
	},
	community: {
		chip: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
		icon: "bg-emerald-600 text-white",
	},
};

export default function Announcements() {
	return (
		<Reveal
			as="section"
			id="announcements"
			className="h-full overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
		>
			<div className="flex items-center justify-between border-b border-border px-7 py-6">
				<div>
					<span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-600">
						From the registry
					</span>
					<h2 className="mt-1.5 text-2xl font-bold text-ocean-900 dark:text-foreground">
						Announcements
					</h2>
				</div>
				<Link
					href="#"
					className="group hidden items-center gap-1.5 text-sm font-semibold text-ocean-600 transition-colors hover:text-ember-600 sm:inline-flex dark:text-ocean-300"
				>
					View all
					<Icon
						icon={ArrowRight01Icon}
						className="size-4 transition-transform group-hover:translate-x-0.5"
					/>
				</Link>
			</div>

			<ul className="divide-y divide-border">
				{announcements.map((item) => {
					const tone = toneStyles[item.tone];
					return (
						<li key={item.title}>
							<Link
								href="#"
								className="group flex gap-5 px-7 py-6 transition-colors hover:bg-accent/60"
							>
								<span
									className={cn(
										"flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
										tone.icon
									)}
								>
									<Icon icon={item.icon} className="size-5" />
								</span>

								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-2.5">
										<span
											className={cn(
												"rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
												tone.chip
											)}
										>
											{item.tag}
										</span>
										<time className="text-xs text-muted-foreground">
											{item.date}
										</time>
									</div>
									<h3 className="mt-2 font-semibold leading-snug text-ocean-900 transition-colors group-hover:text-ocean-600 dark:text-foreground">
										{item.title}
									</h3>
									<p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
										{item.description}
									</p>
								</div>
							</Link>
						</li>
					);
				})}
			</ul>
		</Reveal>
	);
}
