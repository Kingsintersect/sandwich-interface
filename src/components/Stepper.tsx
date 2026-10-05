"use client";

import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface Step {
    id: number;
    label: string;
}
interface StepperProps {
    steps: Step[];
    currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <ol className="flex w-full gap-3">
            {steps.map((step) => {
                const done = currentStep > step.id;
                const active = currentStep === step.id;

                return (
                    <li key={step.id} className="flex w-full flex-col gap-2.5">
                        {/* The rail carries the state; ember for done, blue for current */}
                        <span
                            className={cn(
                                "h-1 w-full rounded-full transition-colors duration-500",
                                done && "bg-ember-500",
                                active && "bg-ocean-600",
                                !done && !active && "bg-border"
                            )}
                        />

                        <span className="flex items-center gap-1.5">
                            {done && (
                                <Icon
                                    icon={CheckmarkCircle02Icon}
                                    className="size-3.5 text-ember-600"
                                />
                            )}
                            <span
                                className={cn(
                                    "text-xs font-semibold uppercase tracking-[0.1em] transition-colors",
                                    done && "text-ember-600",
                                    active && "text-ocean-700 dark:text-ocean-300",
                                    !done && !active && "text-muted-foreground/60"
                                )}
                                aria-current={active ? "step" : undefined}
                            >
                                {step.label}
                            </span>
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}
