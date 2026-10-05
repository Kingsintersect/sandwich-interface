import { Alert02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";

const AdmissionDeniedBanner = ({ statement }: { statement: string }) => {
   return (
      <section className="overflow-hidden rounded-3xl border border-destructive/25 bg-card shadow-soft">
         <div className="flex flex-col md:flex-row">
            <div className="flex shrink-0 flex-col items-center justify-center gap-3 bg-destructive/10 px-8 py-10 text-center md:w-72">
               <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive text-white">
                  <Icon icon={Alert02Icon} className="size-7" />
               </span>
               <span className="text-lg font-bold text-destructive">
                  Admission denied
               </span>
            </div>

            <div className="flex flex-1 flex-col justify-between gap-6 px-7 py-8">
               <div>
                  <h4 className="text-lg font-semibold text-ocean-900 dark:text-foreground">
                     Your admission was denied for the following reason
                  </h4>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                     {statement}
                  </p>
               </div>

               <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Admission Officer
               </p>
            </div>
         </div>
      </section>
   )
}

export default AdmissionDeniedBanner
