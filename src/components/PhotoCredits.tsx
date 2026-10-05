const CC_BY_SA = "https://creativecommons.org/licenses/by-sa/4.0/";
const CC0 = "https://creativecommons.org/publicdomain/zero/1.0/";

/**
 * Attribution for the campus photography. The CC BY-SA images require the
 * author, the licence and a note that the file was changed - all of ours are
 * cropped and resized for the layout - so this block is a licence obligation,
 * not decoration. Keep it rendered wherever those photos are used.
 */
const photos = [
	{
		title: "Nnamdi Azikiwe University second gate at range",
		author: "Egbezomo Florence Eguono",
		licence: "CC BY-SA 4.0",
		licenceUrl: CC_BY_SA,
		source:
			"https://commons.wikimedia.org/wiki/File:Nnamdi_Azikiwe_University_second_gate_at_range.jpg",
	},
	{
		title: "Prof Festus Aghagbo Nwako Library, Nnamdi Azikiwe University",
		author: "Favouridowu",
		licence: "CC BY-SA 4.0",
		licenceUrl: CC_BY_SA,
		source:
			"https://commons.wikimedia.org/wiki/File:Prof_Festus_Aghagbo_Nwako_Library,_Nnamdi_Azikiwe_University,_Awka,_Nigeria.jpg",
	},
	{
		title: "Wikidata and books event in Nnamdi Azikiwe University Library",
		author: "Olugold",
		licence: "CC BY-SA 4.0",
		licenceUrl: CC_BY_SA,
		source:
			"https://commons.wikimedia.org/wiki/File:Wikidata_an_books_event_in_Nnamdi_Azikiwe_University_Library_10.jpg",
	},
	{
		title: "Nnamdi Azikiwe University main gate, Awka",
		author: "MediaMOF",
		licence: "CC BY-SA 4.0",
		licenceUrl: CC_BY_SA,
		source:
			"https://commons.wikimedia.org/wiki/File:Nnamdi_Azikiwe_University_main_gate_Awka.2.jpg",
	},
	{
		title: "Celebration of Cultural Heritage",
		author: "Stanlesign",
		licence: "CC BY-SA 4.0",
		licenceUrl: CC_BY_SA,
		source:
			"https://commons.wikimedia.org/wiki/File:Celebration_of_Cultural_Heritage.jpg",
	},
	{
		title: "Statue of Dr Nnamdi Azikiwe at UNIZIK, Awka",
		author: "Noila'snancy1",
		licence: "CC0",
		licenceUrl: CC0,
		source:
			"https://commons.wikimedia.org/wiki/File:Statue_of_Dr._Nnamdi_Azikiwe_at_Nnamdi_Azikiwe_University_(UNIZIK),_Awka,_Nigeria.jpg",
	},
];

export default function PhotoCredits() {
	return (
		<details className="group mt-6 border-t border-white/10 pt-6">
			<summary className="cursor-pointer list-none text-xs text-white/40 transition-colors hover:text-white/70">
				Photography credits
				<span className="ml-1.5 inline-block transition-transform group-open:rotate-90">
					&rsaquo;
				</span>
			</summary>

			<ul className="mt-4 grid grid-cols-1 gap-2 text-[11px] leading-relaxed text-white/40 sm:grid-cols-2 lg:grid-cols-3">
				{photos.map((photo) => (
					<li key={photo.source}>
						<a
							href={photo.source}
							target="_blank"
							rel="noreferrer noopener"
							className="transition-colors hover:text-white/70"
						>
							{photo.title}
						</a>{" "}
						by {photo.author},{" "}
						<a
							href={photo.licenceUrl}
							target="_blank"
							rel="noreferrer noopener"
							className="underline decoration-white/20 underline-offset-2 transition-colors hover:text-white/70"
						>
							{photo.licence}
						</a>
						. Cropped and resized.
					</li>
				))}
			</ul>
		</details>
	);
}
