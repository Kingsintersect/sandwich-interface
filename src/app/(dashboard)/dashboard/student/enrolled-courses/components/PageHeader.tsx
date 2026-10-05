"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
   ArrowRight01Icon,
   Building06Icon,
   Copy01Icon,
   GraduationScrollIcon,
   Tick02Icon,
   UserIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { UserInterface } from "@/config/Types";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentSession } from "@/hooks/useAccademics";
import { resolveStudentLevel } from "@/lib/academics.utils";

function InfoRow({
   icon,
   label,
   value,
}: {
   icon: IconSvgElement;
   label: string;
   value?: string | null;
}) {
   return (
      <div className="flex items-start gap-3 rounded-xl border border-border bg-background/60 px-4 py-3">
         <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ocean-50 text-ocean-600 dark:bg-ocean-900/50 dark:text-ocean-300">
            <Icon icon={icon} className="size-4.5" />
         </span>
         <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
               {label}
            </p>
            <p className="mt-0.5 truncate text-sm font-medium text-ocean-900 dark:text-foreground">
               {value || "Not assigned"}
            </p>
         </div>
      </div>
   );
}

const PageHeader = ({ student }: { student: UserInterface | null }) => {
   const { user, loading, initializeLogout } = useAuth();
   const [isClient, setIsClient] = useState(false);
   const [copied, setCopied] = useState(false);
   const { data: session } = useCurrentSession();

   useEffect(() => {
      if (typeof window !== "undefined") setIsClient(true);
   }, []);

   const handleCopy = () => {
      if (isClient && student?.reg_number) {
         navigator.clipboard.writeText(student.reg_number);
         setCopied(true);
         setTimeout(() => setCopied(false), 5000);
      }
   };

   if (!user && !loading) {
      return (
         <section className="rounded-2xl border border-destructive/25 bg-destructive/5 p-6">
            <h2 className="text-lg font-semibold text-destructive">Access denied</h2>
            <p className="mt-2 text-sm text-muted-foreground">
               You must be signed in to view this page.
            </p>
            <Button className="mt-5 rounded-full" onClick={initializeLogout} asChild>
               <Link href="/auth/signin">Go to sign in</Link>
            </Button>
         </section>
      );
   }

   return (
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
         <div className="crest-surface relative overflow-hidden px-7 py-8">
            <span className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-ember-500/25 blur-[110px]" />
            <div className="relative">
               <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ember-400">
                  Learning Management System
               </span>
               <h2 className="mt-2 text-2xl font-bold text-white">
                  Your study account
               </h2>
               <p className="mt-2 max-w-lg text-sm text-white/65">
                  Use these credentials to sign in to the UNIZIK LMS, where your
                  course materials and activities live.
               </p>
            </div>
         </div>

         <div className="grid gap-6 p-7 md:grid-cols-2">
            {/* Academic information */}
            <div>
               <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-600">
                  Academic information
               </h3>
               <div className="mt-4 space-y-3">
                  <InfoRow
                     icon={GraduationScrollIcon}
                     label="Programme"
                     value={user?.program as string}
                  />
                  <InfoRow
                     icon={Building06Icon}
                     label="Level"
                     value={resolveStudentLevel(user)}
                  />
                  <InfoRow
                     icon={UserIcon}
                     label="Session"
                     value={(user?.academic_session as string) || session?.name}
                  />
               </div>
            </div>

            {/* Credentials */}
            <div>
               <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember-600">
                  LMS credentials
               </h3>

               <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-border bg-background/60 px-4 py-3">
                     <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Username
                     </p>
                     <div className="mt-1.5 flex items-center justify-between gap-3">
                        <p className="min-w-0 truncate font-mono text-sm font-semibold text-ocean-900 dark:text-foreground">
                           {student?.reg_number || "Not assigned"}
                        </p>
                        <Button
                           onClick={handleCopy}
                           disabled={!student?.reg_number}
                           size="sm"
                           variant="outline"
                           className="shrink-0 rounded-full"
                        >
                           <Icon icon={copied ? Tick02Icon : Copy01Icon} className="size-3.5" />
                           {copied ? "Copied" : "Copy"}
                        </Button>
                     </div>
                  </div>

                  <div className="rounded-xl border border-border bg-background/60 px-4 py-3">
                     <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Default password
                     </p>
                     <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                        <p className="font-mono text-sm font-semibold text-ocean-900 dark:text-foreground">
                           P@55word
                        </p>
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
                           Change on first login
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default PageHeader;
