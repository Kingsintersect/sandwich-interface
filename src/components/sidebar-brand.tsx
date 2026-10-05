"use client"

import Image from "next/image"
import Link from "next/link"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

/**
 * Replaces the shadcn TeamSwitcher boilerplate. There are no "teams" in this
 * product, so the sidebar head is simply the crest and the programme name.
 * Collapses to the crest alone when the sidebar is in icon mode.
 */
export function SidebarBrand() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/dashboard">
            <span className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-white p-1">
              <Image
                src="/logo/crest-mark.png"
                alt=""
                aria-hidden
                width={32}
                height={32}
                className="size-full object-contain"
              />
            </span>
            <span className="grid flex-1 text-left leading-tight">
              <span className="truncate text-sm font-semibold">UNIZIK Awka</span>
              <span className="truncate text-xs text-sidebar-foreground/60">
                Sandwich Programme
              </span>
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
