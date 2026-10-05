import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cn } from "@/lib/utils";

export type { IconSvgElement };

/**
 * Thin wrapper over HugeiconsIcon so icons are sized with Tailwind
 * (`className="size-5"`) like the rest of the UI rather than a `size` prop.
 * The CSS width/height from the utility class beats the SVG presentation
 * attributes the library writes, so the default `size` never fights it.
 */
export function Icon({
	icon,
	className,
	strokeWidth = 1.8,
	...props
}: {
	icon: IconSvgElement;
	className?: string;
	strokeWidth?: number;
} & Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon" | "className">) {
	return (
		<HugeiconsIcon
			icon={icon}
			strokeWidth={strokeWidth}
			className={cn("size-5 shrink-0", className)}
			{...props}
		/>
	);
}
