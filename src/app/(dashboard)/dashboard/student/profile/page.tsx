"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
   Book02Icon,
   LockPasswordIcon,
   Logout01Icon,
   UserIcon,
} from "@hugeicons/core-free-icons";
import UploadAvatar from "./components/UploadAvatar";
import EditInfoForm from "./components/EditInfoForm";
import { ChangePasswordForm } from "./components/ChangePassword";
import { baseUrl } from "@/config";
import { useAuth } from "@/contexts/AuthContext";
import ContentLoader from "@/components/ui/content-loader";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const StudentProfile = () => {
   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
   const { user, loading, initializeLogout } = useAuth();
   const baseLink = `${baseUrl}/dashboard/student`;

   if (loading) {
      return <ContentLoader />;
   }

   if (!user) {
      return (
         <div className="mx-auto max-w-2xl py-10">
            <div className="rounded-2xl border border-destructive/25 bg-destructive/5 p-6">
               <h2 className="text-lg font-semibold text-destructive">Access denied</h2>
               <p className="mt-2 text-sm text-muted-foreground">
                  Your session has expired. Please sign in again to continue.
               </p>
               <Button asChild className="mt-5 rounded-full">
                  <Link href="/auth/signin">Go to sign in</Link>
               </Button>
            </div>
         </div>
      );
   }

   const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");
   const avatar = (user.passport as string) || (user.pictureRef as string) || "/avatars/avatar-man.jpg";

   return (
      <div className="pb-10">
         <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            {/* Header */}
            <div className="crest-surface relative overflow-hidden px-7 py-8">
               <span className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-ember-500/25 blur-[110px]" />
               <div className="relative">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ember-400">
                     Account
                  </span>
                  <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                     Your profile
                  </h1>
                  <p className="mt-2 text-sm text-white/60">
                     Manage your personal information and sign-in details.
                  </p>
               </div>
            </div>

            <div className="flex flex-col lg:flex-row">
               {/* Sidebar */}
               <aside className="border-b border-border p-7 lg:w-80 lg:shrink-0 lg:border-b-0 lg:border-r">
                  <div className="flex flex-col items-center text-center">
                     <UploadAvatar imageUrl={avatar} name={fullName} />

                     <h2 className="mt-4 text-lg font-bold text-ocean-900 dark:text-foreground">
                        {fullName || "—"}
                     </h2>
                     {user.reg_number ? (
                        <p className="mt-1 font-mono text-xs text-ember-600">
                           {user.reg_number as string}
                        </p>
                     ) : (
                        <p className="mt-1 text-xs text-muted-foreground">
                           No registration number yet
                        </p>
                     )}
                  </div>

                  <Button
                     onClick={() => setIsPasswordModalOpen(true)}
                     className="ember-surface mt-6 w-full rounded-full text-white shadow-ember hover:bg-none hover:bg-ember-700"
                  >
                     <Icon icon={LockPasswordIcon} className="size-4" />
                     Change password
                  </Button>

                  <nav className="mt-7 space-y-1">
                     <span className="flex items-center gap-3 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-ocean-700 dark:text-ocean-200">
                        <Icon icon={UserIcon} className="size-4.5" />
                        Profile information
                     </span>
                     <Link
                        href={`${baseLink}/enrolled-courses`}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-ocean-700"
                     >
                        <Icon icon={Book02Icon} className="size-4.5" />
                        My courses
                     </Link>
                     <button
                        type="button"
                        onClick={initializeLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                     >
                        <Icon icon={Logout01Icon} className="size-4.5" />
                        Sign out
                     </button>
                  </nav>
               </aside>

               {/* Main */}
               <main className="min-w-0 flex-1 p-7">
                  <section id="profile">
                     <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-600">
                        Profile information
                     </h3>
                     <div className="mt-5">
                        <EditInfoForm
                           student={{
                              id: user.id as number,
                              first_name: user.first_name as string,
                              last_name: user.last_name as string,
                              other_name: user.other_name as string,
                              email: user.email as string,
                              phone_number: user.phone_number as string,
                           }}
                        />
                     </div>
                  </section>
               </main>
            </div>

            <div className="border-t border-border bg-muted/30 px-7 py-5 text-center text-xs text-muted-foreground">
               &copy; {new Date().getFullYear()} Nnamdi Azikiwe University, Awka &middot;{" "}
               <Link href="#" className="text-ocean-600 hover:underline dark:text-ocean-300">
                  Privacy policy
               </Link>{" "}
               &middot;{" "}
               <Link href="#" className="text-ocean-600 hover:underline dark:text-ocean-300">
                  Terms of service
               </Link>
            </div>
         </div>

         <ChangePasswordForm
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
         />
      </div>
   );
};

export default StudentProfile;
