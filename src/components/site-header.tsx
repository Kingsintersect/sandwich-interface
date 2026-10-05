"use client";

import React from 'react'
import Link from 'next/link'
import { Logout01Icon } from '@hugeicons/core-free-icons'
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from './ui/mood-toggle'
import { ThemeSelector } from './theme-selector'
import { DynamicBreadcrumb } from './ui/dynamic-breadcrumb'
import { Icon } from './ui/icon'

interface SiteHeaderProps {
    logout?: () => void;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ logout }) => {
    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-background/80 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
            <div className="flex min-w-0 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <DynamicBreadcrumb />
            </div>

            <div className="flex shrink-0 items-center gap-3 px-4">
                <Link
                    href="/admission"
                    className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-ocean-700 sm:block"
                >
                    Admission
                </Link>
                <Separator
                    orientation="vertical"
                    className="hidden data-[orientation=vertical]:h-4 sm:block"
                />
                <ThemeSelector />
                <ModeToggle />
                {logout && (
                    <button
                        type="button"
                        onClick={logout}
                        aria-label="Sign out"
                        title="Sign out"
                        className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Icon icon={Logout01Icon} className="size-4.5" />
                    </button>
                )}
            </div>
        </header>
    )
}

export default SiteHeader
