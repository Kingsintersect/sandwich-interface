"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	ArrowRight01Icon,
	Cancel01Icon,
	Logout01Icon,
	Menu01Icon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import ThemeToggleButton from "./ThemeToggleButton";
import { cn } from "@/lib/utils";

const navLinks = [
	{ label: "Programmes", href: "#programmes" },
	{ label: "Announcements", href: "#announcements" },
	{ label: "Campus", href: "#campus" },
	{ label: "Admission", href: "/admission" },
];

const Header = () => {
	const { user, initializeLogout, updateUserInState, refreshUserData } = useAuth();
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	// The header floats over the hero until the user leaves it, then it earns
	// a solid surface so the links stay readable against page content.
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const signOut = async () => {
		await initializeLogout();
		updateUserInState(null);
		refreshUserData();
	};

	return (
		<header
			className={cn(
				"fixed top-0 z-50 w-full transition-all duration-500",
				scrolled
					? "glass-light border-b border-border/70 shadow-soft"
					: "border-b border-white/10 bg-gradient-to-b from-ocean-950/70 to-transparent"
			)}
		>
			<div className="shell">
				<div
					className={cn(
						"flex items-center justify-between transition-all duration-500",
						scrolled ? "h-16" : "h-20"
					)}
				>
					{/* Crest. crest-wordmark.png is the transparent cut-out, so over the
					    hero it inverts to a clean white mark with no white plate. */}
					<Link href="/" className="flex items-center gap-3">
						<span
							className={cn(
								"relative block transition-all duration-500",
								scrolled ? "h-10 w-32" : "h-12 w-40"
							)}
						>
							<Image
								src="/logo/crest-wordmark.png"
								alt="Nnamdi Azikiwe University, Awka"
								fill
								priority
								sizes="160px"
								className={cn(
									"object-contain object-left transition-all duration-500",
									// Inverted over the hero, and again in dark mode where the
									// scrolled header surface is dark too.
									scrolled ? "dark:brightness-0 dark:invert" : "brightness-0 invert"
								)}
							/>
						</span>
						<span
							className={cn(
								"hidden h-8 w-px lg:block",
								scrolled ? "bg-border" : "bg-white/25"
							)}
						/>
						<span
							className={cn(
								"hidden text-[11px] font-semibold uppercase leading-tight tracking-[0.18em] lg:block",
								scrolled ? "text-muted-foreground" : "text-white/70"
							)}
						>
							Sandwich
							<br />
							Programme
						</span>
					</Link>

					{/* Desktop nav */}
					<nav className="hidden items-center gap-1 md:flex">
						{navLinks.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								className={cn(
									"relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
									scrolled
										? "text-foreground/70 hover:bg-accent hover:text-ocean-700"
										: "text-white/80 hover:bg-white/10 hover:text-white"
								)}
							>
								{link.label}
							</Link>
						))}
					</nav>

					{/* Account */}
					<div className="flex items-center gap-2">
						<ThemeToggleButton onDark={!scrolled} />

						{user ? (
							<div className="hidden items-center gap-3 sm:flex">
								<Link
									href="/dashboard"
									className={cn(
										"flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 transition-colors",
										scrolled ? "hover:bg-accent" : "hover:bg-white/10"
									)}
								>
									<span className="ember-surface flex size-8 items-center justify-center rounded-full text-xs font-bold uppercase text-white">
										{user?.first_name?.[0] ?? "U"}
									</span>
									<span
										className={cn(
											"text-sm font-medium",
											scrolled ? "text-foreground" : "text-white"
										)}
									>
										{user?.first_name}
									</span>
								</Link>
								<Button
									variant="ghost"
									size="icon"
									onClick={signOut}
									aria-label="Sign out"
									className={cn(
										"rounded-full",
										scrolled
											? "text-muted-foreground hover:text-destructive"
											: "text-white/70 hover:bg-white/10 hover:text-white"
									)}
								>
									<Icon icon={Logout01Icon} className="size-4.5" />
								</Button>
							</div>
						) : (
							<div className="hidden items-center gap-2 sm:flex">
								<Button
									asChild
									variant="ghost"
									className={cn(
										"rounded-full",
										scrolled
											? "text-foreground hover:bg-accent hover:text-ocean-700"
											: "text-white hover:bg-white/10 hover:text-white"
									)}
								>
									<Link href="/auth/signin">Sign in</Link>
								</Button>
								<Button
									asChild
									className="ember-surface group rounded-full px-5 text-white shadow-ember transition-transform hover:scale-[1.03] hover:bg-none hover:bg-ember-700"
								>
									<Link href="/auth/signup">
										Apply now
										<Icon
											icon={ArrowRight01Icon}
											className="size-4 transition-transform group-hover:translate-x-0.5"
										/>
									</Link>
								</Button>
							</div>
						)}

						<Button
							variant="ghost"
							size="icon"
							onClick={() => setMenuOpen((v) => !v)}
							aria-label="Toggle menu"
							aria-expanded={menuOpen}
							className={cn(
								"rounded-full md:hidden",
								scrolled ? "text-foreground" : "text-white hover:bg-white/10"
							)}
						>
							<Icon icon={menuOpen ? Cancel01Icon : Menu01Icon} className="size-5" />
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile sheet */}
			<div
				className={cn(
					"overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-400 md:hidden",
					menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
				)}
			>
				<nav className="shell flex flex-col gap-1 py-4">
					{navLinks.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							onClick={() => setMenuOpen(false)}
							className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-ocean-700"
						>
							{link.label}
						</Link>
					))}
					<div className="mt-3 flex flex-col gap-2 border-t border-border/60 pt-4">
						<div className="flex items-center justify-between rounded-lg px-3 py-1.5">
							<span className="text-sm font-medium text-foreground/80">Appearance</span>
							<ThemeToggleButton />
						</div>

						{user ? (
							<>
								<Button asChild className="rounded-full">
									<Link href="/dashboard">Go to dashboard</Link>
								</Button>
								<Button variant="outline" className="rounded-full" onClick={signOut}>
									Sign out
								</Button>
							</>
						) : (
							<>
								<Button asChild variant="outline" className="rounded-full">
									<Link href="/auth/signin">Sign in</Link>
								</Button>
								<Button asChild className="ember-surface rounded-full text-white">
									<Link href="/auth/signup">Apply now</Link>
								</Button>
							</>
						)}
					</div>
				</nav>
			</div>
		</header>
	);
};

export default Header;
