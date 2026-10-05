import AdmissionCta from "@/components/AdmissionCta";
import AdmissionSteps from "@/components/AdmissionSteps";
import Announcements from "@/components/Announcements";
import CampusHighlights from "@/components/CampusHighlights";
import FeaturedPrograms from "@/components/FeaturedPrograms";
import HeroCarousel from "@/components/HeroCarousel";
import UpcomingEvents from "@/components/UpcomingEvents";

export default function Home() {
	return (
		<main className="min-h-screen bg-background">
			<HeroCarousel />

			<FeaturedPrograms />

			<AdmissionSteps />

			{/* Registry feed: announcements lead, calendar sits alongside */}
			<section className="py-16 sm:py-24">
				<div className="shell grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
					<div className="lg:col-span-2">
						<Announcements />
					</div>
					<UpcomingEvents />
				</div>
			</section>

			<CampusHighlights />

			<AdmissionCta />
		</main>
	);
}
