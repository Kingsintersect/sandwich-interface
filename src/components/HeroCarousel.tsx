"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	ArrowRight01Icon,
	GraduationScrollIcon,
	SparklesIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";

type Slide = {
	url: string;
	alt: string;
	eyebrow: string;
	title: string;
	accent: string;
	subtitle: string;
	/** Where the interesting part of the frame sits, for object-position. */
	focus: string;
};

const slides: Slide[] = [
	{
		url: "/slides/unizik-gate.jpg",
		alt: "The Nnamdi Azikiwe University gate at Awka",
		eyebrow: "Nnamdi Azikiwe University, Awka",
		title: "A degree that fits",
		accent: "the life you already have",
		subtitle:
			"The UNIZIK Sandwich Programme lets working adults and teachers earn an accredited degree across vacation sessions - without stepping away from their career.",
		focus: "center 42%",
	},
	{
		url: "/slides/unizik-library.jpg",
		alt: "Prof Festus Aghagbo Nwako Library, Nnamdi Azikiwe University",
		eyebrow: "Accredited. Rigorous. Respected.",
		title: "Taught by the same faculty,",
		accent: "held to the same standard",
		subtitle:
			"Every course is delivered by UNIZIK's regular academic staff and assessed against the identical syllabus as the full-time programme.",
		focus: "center 38%",
	},
	{
		url: "/slides/unizik-students.jpg",
		alt: "Students working at computers in the university library",
		eyebrow: "One portal, end to end",
		title: "Apply, register and graduate",
		accent: "from a single account",
		subtitle:
			"Admissions, course registration, fee payment and results all live in one place - so your session admin takes minutes, not days.",
		focus: "center 35%",
	},
];

const stats = [
	{ value: "40+", label: "Accredited programmes" },
	{ value: "12,000+", label: "Students enrolled" },
	{ value: "60", label: "Years of UNIZIK heritage" },
	{ value: "3", label: "Vacation sessions a year" },
];

const SLIDE_MS = 7000;

export default function HeroCarousel() {
	const [index, setIndex] = useState(0);

	const goTo = useCallback((i: number) => setIndex(i), []);

	useEffect(() => {
		const id = setInterval(
			() => setIndex((i) => (i + 1) % slides.length),
			SLIDE_MS
		);
		return () => clearInterval(id);
	}, []);

	const active = slides[index];

	return (
		<section className="relative min-h-[92vh]  w-full overflow-hidden bg-ocean-950">
			{/* Imagery */}
			{slides.map((slide, i) => (
				<div
					key={slide.url}
					aria-hidden={i !== index}
					className={cn(
						"absolute inset-0 transition-opacity duration-[1400ms] ease-out",
						i === index ? "opacity-100" : "opacity-0"
					)}
				>
					<div className="absolute inset-0 overflow-hidden">
						<Image
							src={slide.url}
							alt={slide.alt}
							fill
							priority={i === 0}
							sizes="100vw"
							quality={85}
							style={{ objectPosition: slide.focus }}
							className={cn(
								// The slow zoom starts past 100%, which also crops off any
								// scanned border baked into a source photo.
								"object-cover",
								i === index && "animate-ken-burns"
							)}
						/>
					</div>
				</div>
			))}

			{/* Layered brand scrims: navy from the left for text contrast, a warm
			    ember wash bottom-right to echo the torch in the crest. */}
			<div className="absolute inset-0 bg-gradient-to-r from-ocean-950 via-ocean-950/80 to-ocean-950/25" />
			<div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-transparent to-ocean-950/60" />
			<div className="pointer-events-none absolute -bottom-40 -right-24 size-[36rem] rounded-full bg-ember-600/25 blur-[140px]" />
			<div className="pointer-events-none absolute -top-32 left-1/4 size-[30rem] rounded-full bg-ocean-500/20 blur-[130px]" />

			{/* Copy */}
			<div className="relative z-10 flex min-h-[92vh] items-center pb-40 pt-28">
				<div className="shell">
					<div key={index} className="max-w-3xl animate-rise">
						<span className="ring-gradient inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
							
							{active.eyebrow}
						</span>

						<h1 className="mt-7 text-4xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
							{active.title}{" "}
							<span className="bg-gradient-to-r from-ember-400 via-ember-500 to-ember-400 bg-clip-text text-transparent">
								{active.accent}
							</span>
						</h1>

						<p className="mt-7 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
							{active.subtitle}
						</p>

						<div className="my-10 flex flex-col gap-3 sm:flex-row sm:items-center">
							<Button
								asChild
								size="lg"
								className="ember-surface group h-13 rounded-full px-8 text-base font-semibold text-white shadow-ember transition-transform hover:scale-[1.03] hover:bg-none hover:bg-ember-700"
							>
								<Link href="/auth/signup">
									Start your application
									<Icon
										icon={ArrowRight01Icon}
										className="size-4.5 transition-transform group-hover:translate-x-1"
									/>
								</Link>
							</Button>

							<Button
								asChild
								size="lg"
								variant="ghost"
								className="ring-gradient h-13 rounded-full bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
							>
								<Link href="/auth/signin">
									<Icon icon={GraduationScrollIcon} className="size-4.5" />
									Student login
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Slide progress rails */}
			<div className="absolute  bottom-[8.5rem] left-0 right-0 z-20 sm:bottom-[9.5rem] ">
				<div className="shell flex gap-2.5">
					{slides.map((slide, i) => (
						<button
							key={slide.url}
							onClick={() => goTo(i)}
							aria-label={`Show slide ${i + 1}`}
							aria-current={i === index}
							className="group   h-1 w-14 overflow-hidden rounded-full bg-white/25 transition-all hover:bg-white/40 sm:w-20"
						>
							<span
								className={cn(
									"block h-full rounded-full bg-ember-500 transition-all ease-linear",
									i === index ? "w-full" : "w-0"
								)}
								style={{
									transitionDuration: i === index ? `${SLIDE_MS}ms` : "300ms",
								}}
							/>
						</button>
					))}
				</div>
			</div>

			{/* Stat rail pinned to the base of the hero */}
			<div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-ocean-950/60 backdrop-blur-xl">
				<div className="shell grid grid-cols-2  divide-white/10 md:grid-cols-4 md:divide-x">
					{stats.map((stat) => (
						<div key={stat.label} className="px-2 py-5 text-center md:py-6">
							<div className="text-2xl font-bold text-white sm:text-3xl">
								{stat.value}
							</div>
							<div className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/50 sm:text-xs">
								{stat.label}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
