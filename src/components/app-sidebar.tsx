"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { SidebarBrand } from "@/components/sidebar-brand"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { AdminNavMain, Roles, StudentNavMain, TeacherNavMain } from "@/config"
import { AuthUser } from "@/types/user"
import { NavProjects } from "./nav-projects"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: AuthUser | null;
}
export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const userData = {
    name: user?.first_name + " " + user?.last_name,
    email: user?.email ?? "",
    avatar: user?.passport ?? "/avatars/avatar-man.jpg",
    role: user?.role ?? Roles.STUDENT,
  }
  const navMain = (() => {
    if (!user?.role) return AdminNavMain;
    switch (user.role) {
      case Roles.STUDENT: return StudentNavMain;
      case Roles.TEACHER: return TeacherNavMain;
      case Roles.ADMIN: return AdminNavMain;
      default: return StudentNavMain;
    }
  })();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border pb-2">
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent className="pl-3">
        <NavMain items={navMain.compound} />
        {navMain.flat && <NavProjects projects={navMain.flat} />}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
