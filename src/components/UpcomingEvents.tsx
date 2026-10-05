import Link from "next/link";
import {
	ArrowRight01Icon,
	Clock01Icon,
	Location01Icon,
} from "@hugeicons/core-free-icons";
import Reveal from "./application/Reveal";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";

const events = [
	{
		title: "Vacation Session Orientation",
		month: "Apr",
		day: "22",
		time: "10:00 - 16:00",
		location: "Main Auditorium, Awka",
	},
	{
		title: "Guest Lecture: Ethics in AI",
		month: "Apr",
		day: "25",
		time: "14:00 - 15:30",
		location: "Science Hall 203",
	},
	{
		title: "Teaching Practice Briefing",
		month: "Apr",
		day: "28",
		time: "09:00 - 12:00",
		location: "Faculty of Education",
	},
	{
		title: "Alumni Networking Mixer",
		month: "May",
		day: "05",
		time: "18:00 - 20:00",
		location: "UNIZIK Atrium",
	},
];

export default function UpcomingEvents() {
	return (
		<Reveal
			as="section"
			delay={120}
			className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
		>
			<div className="border-b border-border px-7 py-6">
				<span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-600">
					Session calendar
				</span>
				<h2 className="mt-1.5 text-2xl font-bold text-ocean-900 dark:text-foreground">
					Upcoming events
				</h2>
			</div>

			<ul className="flex-1 divide-y divide-border">
				{events.map((event) => (
					<li key={event.title}>
						<Link
							href="#"
							className="group flex gap-4 px-7 py-5 transition-colors hover:bg-accent/60"
						>
							{/* Date block flips to the crest blue on hover */}
							<span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl border border-ocean-100 bg-ocean-50 transition-colors duration-300 group-hover:border-transparent group-hover:bg-ocean-600 dark:border-border dark:bg-ocean-900/50">
								<span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ember-600 transition-colors group-hover:text-ember-300">
									{event.month}
								</span>
								<span className="text-lg font-bold leading-none text-ocean-700 transition-colors group-hover:text-white dark:text-ocean-200">
									{event.day}
								</span>
							</span>

							<div className="min-w-0 pt-0.5">
								<h3 className="font-semibold leading-snug text-ocean-900 transition-colors group-hover:text-ocean-600 dark:text-foreground">
									{event.title}
								</h3>
								<p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
									<Icon icon={Clock01Icon} className="size-3.5" />
									{event.time}
								</p>
								<p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
									<Icon icon={Location01Icon} className="size-3.5" />
									{event.location}
								</p>
							</div>
						</Link>
					</li>
				))}
			</ul>

			<div className="border-t border-border p-6">
				<Button
					asChild
					className="group h-11 w-full rounded-full text-sm font-semibold"
				>
					<Link href="#">
						View full calendar
						<Icon
							icon={ArrowRight01Icon}
							className="size-4 transition-transform group-hover:translate-x-1"
						/>
					</Link>
				</Button>
			</div>
		</Reveal>
	);
}
