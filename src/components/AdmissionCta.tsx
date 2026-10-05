import Link from "next/link";
import { ArrowRight01Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import Reveal from "./application/Reveal";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";

export default function AdmissionCta() {
	return (
		<section className="py-16 sm:py-24">
			<div className="shell">
				<Reveal className="crest-surface ring-gradient relative overflow-hidden rounded-3xl px-8 py-16 text-center shadow-float sm:px-16 sm:py-20">
					{/* Soft brand light sources inside the panel */}
					<span className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-ocean-400/20 blur-[120px]" />
					<span className="pointer-events-none absolute -bottom-28 -right-20 size-80 rounded-full bg-ember-500/35 blur-[120px]" />

					<span className="relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
						<Icon icon={Calendar03Icon} className="size-3.5 text-ember-300" />
						Applications close 30 June
					</span>

					<h2 className="relative mx-auto mt-7 max-w-3xl text-3xl font-bold leading-[1.1] text-white sm:text-5xl">
						Your next qualification starts
						<span className="text-ember-300"> this vacation session</span>
					</h2>

					<p className="relative mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70">
						Create an account in under two minutes and save your progress as
						you go. You only pay when you submit.
					</p>

					<div className="relative mt-10 flex flex-col justify-center gap-3 sm:flex-row">
						<Button
							asChild
							size="lg"
							className="ember-surface group h-13 rounded-full px-8 text-base font-semibold text-white shadow-ember transition-transform hover:scale-[1.03] hover:bg-none hover:bg-ember-700"
						>
							<Link href="/auth/signup">
								Create your account
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
							className="h-13 rounded-full border border-white/25 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-md hover:bg-white/15 hover:text-white"
						>
							<Link href="/admission">See admission requirements</Link>
						</Button>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
