"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight01Icon, Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import AdmissionDeniedBanner from "./AdmissionDeniedBanner";
import { baseUrl } from "@/config";
import Typewriter from "@/components/TypeWritter";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { UserInterface } from "@/config/Types";

const navigation = {
   applicationFormUrl: `${baseUrl}/admission/form`,
}

const StudentBanner = ({ student }: { student: UserInterface }) => {
   const [isClient, setIsClient] = useState(false);
   const [copied, setCopied] = useState(false);
   const [goto, setGoto] = useState('');
   const router = useRouter();

   useEffect(() => {
      setIsClient(true);
   }, []);

   useEffect(() => {
      if (!student) return;

      // Only the application fee exists, so the form is the single next step.
      if (student.is_applied === 0) {
         setGoto(navigation.applicationFormUrl);
      }
   }, [student]);

   const handleCopy = () => {
      if (isClient && student.reg_number) {
         navigator.clipboard.writeText(student.reg_number);
         setCopied(true);
         setTimeout(() => {
            setCopied(false)
         }, 5000)
      }
   }

   const handleGoTo = () => {
      router.push(goto);
   }

   if (student.admission_status === "NOT_ADMITTED") {
      return <AdmissionDeniedBanner statement={student.reason_for_denial as string} />;
   }

   return (
      <section className="crest-surface ring-gradient relative overflow-hidden rounded-3xl p-7 shadow-lift sm:p-9">
         {/* Brand light sources, matching the marketing pages */}
         <span className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-ember-500/25 blur-[110px]" />
         <span className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-ocean-400/20 blur-[110px]" />

         <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
               <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ember-400">
                  Sandwich Programme
               </span>

               <h2 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Welcome back,{" "}
                  <span className="text-ember-400">{student.first_name}</span>
               </h2>

               <Typewriter
                  className="mt-4 block text-lg font-medium text-white/80"
                  phrases={[
                     'Education, talent and career opportunities.',
                     'All in one place...',
                     'Empowering learning through technology.',
                     'Built for modern education.',
                  ]}
               />

               <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
                  Track your application, register courses and check results - all
                  from this dashboard.
               </p>
            </div>

            {/* Registration number card */}
            <div className="w-full shrink-0 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md lg:w-72">
               {student.reg_number ? (
                  <>
                     <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                        Registration number
                     </p>
                     <p className="mt-3 break-all font-mono text-xl font-bold text-white">
                        {student.reg_number}
                     </p>
                     <Button
                        onClick={handleCopy}
                        size="sm"
                        className="mt-5 w-full rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
                     >
                        <Icon icon={copied ? Tick02Icon : Copy01Icon} className="size-4" />
                        {copied ? "Copied" : "Copy number"}
                     </Button>
                  </>
               ) : (
                  <>
                     <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                        Registration number
                     </p>
                     <p className="mt-3 text-sm leading-relaxed text-white/70">
                        You do not have one yet. Finish your registration to be
                        assigned a number.
                     </p>
                     <Button
                        onClick={handleGoTo}
                        size="sm"
                        className="ember-surface group mt-5 w-full rounded-full text-white shadow-ember hover:bg-none hover:bg-ember-700"
                     >
                        Continue registration
                        <Icon
                           icon={ArrowRight01Icon}
                           className="size-4 transition-transform group-hover:translate-x-0.5"
                        />
                     </Button>
                  </>
               )}
            </div>
         </div>
      </section>
   );
}

export default StudentBanner
