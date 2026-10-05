import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import SectionHeading from "./SectionHeading";
import Reveal from "./application/Reveal";
import { Icon } from "./ui/icon";
import { cn } from "@/lib/utils";

const highlights = [
	{
		src: "/campus/library.jpg",
		title: "Prof Festus Aghagbo Nwako Library",
		caption: "Over 200,000 volumes, plus round-the-clock digital access.",
		// The lead tile spans two columns and both rows on large screens.
		className: "lg:col-span-2 lg:row-span-2",
		sizes: "(max-width: 1024px) 100vw, 50vw",
		position: "center 45%",
	},
	{
		src: "/campus/maingate.jpg",
		title: "The Main Gate",
		caption: "The Enugu-Onitsha Expressway entrance to the Awka campus.",
		className: "",
		sizes: "(max-width: 1024px) 100vw, 25vw",
		position: "center 40%",
	},
	{
		src: "/campus/statue.jpg",
		title: "The Zik Statue",
		caption: "Dr Nnamdi Azikiwe, the university's namesake, at the campus entrance.",
		className: "",
		sizes: "(max-width: 1024px) 100vw, 25vw",
		position: "center 30%",
	},
	{
		src: "/campus/heritage.jpg",
		title: "Cultural Heritage Week",
		caption: "Student and staff life beyond the lecture hall.",
		className: "lg:col-span-2",
		sizes: "(max-width: 1024px) 100vw, 50vw",
		// Pulled up so the camera's date stamp along the bottom edge is cropped out.
		position: "center 35%",
	},
];

export default function CampusHighlights() {
	return (
		<section id="campus" className="relative py-16 sm:py-24">
			<div className="shell">
				<SectionHeading
					eyebrow="Life at Awka"
					title="A campus built for"
					accent="serious study"
					lede="Sandwich students get the same libraries, laboratories and facilities as the full-time cohort for the length of every vacation session."
				/>

				<div className="mt-16 grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{highlights.map((item, i) => (
						<Reveal
							key={item.title}
							delay={i * 80}
							className={cn("h-full", item.className)}
						>
							<Link
								href="#"
								className="group relative block h-full overflow-hidden rounded-2xl shadow-soft"
							>
								<Image
									src={item.src}
									alt={item.title}
									fill
									sizes={item.sizes}
									style={{ objectPosition: item.position }}
									className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
								/>

								{/* Navy scrim keeps the caption readable; it deepens on hover */}
								<span className="absolute inset-0 bg-gradient-to-t from-ocean-950/95 via-ocean-950/20 to-transparent transition-opacity duration-500 group-hover:from-ocean-950 group-hover:via-ocean-950/45" />

								{/* Ember underline that grows across the base */}
								<span className="ember-surface absolute inset-x-0 bottom-0 h-1 w-0 transition-all duration-500 group-hover:w-full" />

								<span className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100">
									<Icon icon={ArrowUpRight01Icon} className="size-4" />
								</span>

								<div className="absolute inset-x-0 bottom-0 p-6">
									<h3 className="text-lg font-semibold text-white">
										{item.title}
									</h3>
									<p className="mt-1 max-w-sm translate-y-1 text-sm leading-relaxed text-white/0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-white/75">
										{item.caption}
									</p>
								</div>
							</Link>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
