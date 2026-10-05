"use client";
import Link from 'next/link';
import {
   Alert02Icon,
   ArrowRight01Icon,
   CheckmarkCircle02Icon,
   Loading03Icon,
   CancelCircleIcon,
} from "@hugeicons/core-free-icons";
import { Icon, type IconSvgElement } from '@/components/ui/icon';
import { AdmissionStatusType, StatusType } from '@/config/Types';
import { cn } from '@/lib/utils';

type Tone = "positive" | "caution" | "negative" | "info";

// The state reads from the icon tile and the value text; no coloured rail.
const toneStyles: Record<Tone, { icon: string; value: string }> = {
   positive: {
      icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
      value: "text-ocean-900 dark:text-foreground",
   },
   caution: {
      icon: "bg-ember-50 text-ember-600 dark:bg-ember-900/40 dark:text-ember-300",
      value: "text-ocean-900 dark:text-foreground",
   },
   negative: {
      icon: "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300",
      value: "text-ocean-900 dark:text-foreground",
   },
   info: {
      icon: "bg-ocean-50 text-ocean-600 dark:bg-ocean-900/50 dark:text-ocean-300",
      value: "text-ocean-900 dark:text-foreground",
   },
};

/**
 * Shares StatCard's layout - label and value on the left, icon tile on the
 * right - so the status cards and the academic stats read as one set.
 */
function StatusTile({
   label,
   message,
   tone,
   icon,
   href,
   cta,
}: {
   label: string;
   message: string;
   tone: Tone;
   icon: IconSvgElement;
   href?: string;
   cta?: string;
}) {
   const styles = toneStyles[tone];

   const body = (
      <>
         <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
               <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {label}
               </p>
               <h3 className={cn("mt-2 text-2xl font-bold", styles.value)}>
                  {message}
               </h3>

               {href && cta && (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-ember-600">
                     {cta}
                     <Icon
                        icon={ArrowRight01Icon}
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                     />
                  </span>
               )}
            </div>

            <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", styles.icon)}>
               <Icon icon={icon} className="size-5.5" />
            </span>
         </div>
      </>
   );

   const shell = "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft";

   if (href) {
      return (
         <Link href={href} className={cn(shell, "lift")}>
            {body}
         </Link>
      );
   }
   return <div className={shell}>{body}</div>;
}

export function AdmissionStatus({ admissionStatus }: { admissionStatus: AdmissionStatusType }) {
   const status = admissionStatusConfig[admissionStatus];

   if (!status) {
      return (
         <StatusTile
            label="Admission status"
            message="Unknown"
            tone="negative"
            icon={Alert02Icon}
         />
      );
   }

   return (
      <StatusTile
         label="Admission status"
         message={status.message}
         tone={status.tone}
         icon={status.icon}
      />
   );
}

export function StatusCheckCard({
   dataStatus,
   admission,
   title,
   url = "#",
}: {
   dataStatus: StatusType;
   admission: AdmissionStatusType;
   title: string;
   url?: string;
}) {
   const status = statusConfig[dataStatus as StatusType];

   if (!status) {
      return (
         <StatusTile
            label={title}
            message="Unknown"
            tone="negative"
            icon={Alert02Icon}
         />
      );
   }

   const isLinkActive =
      admission === AdmissionStatusType.ADMITTED && dataStatus !== StatusType.FULLY_PAID;

   return (
      <StatusTile
         label={title}
         message={status.message}
         tone={status.tone}
         icon={status.icon}
         href={isLinkActive ? url : undefined}
         cta={isLinkActive ? "Make payment" : undefined}
      />
   );
}

const statusConfig: Record<StatusType, { tone: Tone; message: string; icon: IconSvgElement }> = {
   [StatusType.FULLY_PAID]: {
      tone: "positive",
      message: "Paid",
      icon: CheckmarkCircle02Icon,
   },
   [StatusType.PART_PAID]: {
      tone: "caution",
      message: "Part paid",
      icon: Alert02Icon,
   },
   [StatusType.UNPAID]: {
      tone: "negative",
      message: "Not paid",
      icon: CancelCircleIcon,
   },
};

const admissionStatusConfig: Record<
   AdmissionStatusType,
   { tone: Tone; message: string; icon: IconSvgElement }
> = {
   [AdmissionStatusType.ADMITTED]: {
      tone: "positive",
      message: "Granted",
      icon: CheckmarkCircle02Icon,
   },
   [AdmissionStatusType.PENDING]: {
      tone: "info",
      message: "Pending",
      icon: Alert02Icon,
   },
   [AdmissionStatusType.NOT_ADMITTED]: {
      tone: "negative",
      message: "Denied",
      icon: CancelCircleIcon,
   },
   [AdmissionStatusType.INPROGRESS]: {
      tone: "info",
      message: "In progress",
      icon: Loading03Icon,
   },
};
