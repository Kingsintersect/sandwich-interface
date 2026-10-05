import {
	CheckmarkBadge01Icon,
	CreditCardIcon,
	DocumentValidationIcon,
	UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import SectionHeading from "./SectionHeading";
import Reveal from "./application/Reveal";
import { Icon } from "./ui/icon";

const steps = [
	{
		icon: UserAdd01Icon,
		title: "Create your account",
		description:
			"Register with your name, email and phone number. You will get a registration number straight away.",
	},
	{
		icon: DocumentValidationIcon,
		title: "Complete the application",
		description:
			"Fill in your biodata, academic history and programme choice, then upload your credentials.",
	},
	{
		icon: CreditCardIcon,
		title: "Pay the application fee",
		description:
			"Pay online and get an instant receipt. Your application moves to review the moment payment clears.",
	},
	{
		icon: CheckmarkBadge01Icon,
		title: "Receive your admission",
		description:
			"Track the decision in your dashboard, accept your offer and register courses for the session.",
	},
];

export default function AdmissionSteps() {
	return (
		<section className="relative overflow-hidden py-20 sm:py-28">
			{/* Full-width tinted band with a faint brand grid */}
			<div className="absolute inset-0 bg-ocean-50/60 dark:bg-ocean-950/40" />
			<div className="absolute inset-0 bg-grid opacity-70 mask-fade-b" />

			<div className="shell relative">
				<SectionHeading
					eyebrow="How it works"
					title="From first visit to first lecture,"
					accent="in four steps"
					lede="The whole admission process runs through this portal. No queues at the registry, no paper files."
				/>

				<div className="relative mt-16">
					{/* Connector line behind the row on large screens */}
					<div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-ocean-200 to-transparent lg:block dark:via-border" />

					<ol className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
						{steps.map((step, i) => (
							<Reveal as="li" key={step.title} delay={i * 90} className="relative">
								<span className="relative flex size-14 items-center justify-center rounded-2xl border border-ocean-100 bg-card shadow-lift dark:border-border">
									<Icon
										icon={step.icon}
										className="size-6 text-ocean-600 dark:text-ocean-300"
									/>
									<span className="ember-surface absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full text-[11px] font-bold text-white">
										{i + 1}
									</span>
								</span>

								<h3 className="mt-6 text-lg font-semibold text-ocean-900 dark:text-foreground">
									{step.title}
								</h3>
								<p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
									{step.description}
								</p>
							</Reveal>
						))}
					</ol>
				</div>
			</div>
		</section>
	);
}
