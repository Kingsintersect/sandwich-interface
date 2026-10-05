'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FieldErrors, Path, PathValue, UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CheckmarkCircle02Icon, GraduationScrollIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";


type genericObjectType = Record<string, unknown>;
export type ProgramNode = {
    id: number;
    name: string;
    children?: ProgramNode[];
};

interface ProgramAccordionProps<T extends genericObjectType> {
    nodes: ProgramNode[];
    level?: number;
    fieldKey: string;
    fieldIdKey: string;
    setValue: UseFormSetValue<T>;
    watch: UseFormWatch<T>;
}

export default function ProgramAccordion<T extends genericObjectType>({
    nodes,
    level = 0,
    fieldKey,
    fieldIdKey,
    setValue,
    watch,
}: ProgramAccordionProps<T>) {
    const selected = watch(fieldKey as Path<T>);

    const handleProgramSelect = (node: ProgramNode) => {
        setValue(fieldKey as Path<T>, node.name as PathValue<T, Path<T>>);
        setValue(fieldIdKey as Path<T>, String(node.id) as PathValue<T, Path<T>>);
    };

    return (
        <Accordion
            type="multiple"
            // Indent by inline style: `pl-${level * 4}` is a dynamic class name,
            // so Tailwind never generates it and nesting read as flat.
            style={level > 0 ? { paddingLeft: "0.75rem" } : undefined}
            className={cn(level > 0 && "border-l border-border")}
        >
            {Array.isArray(nodes) && nodes.map((node, index) => {
                const id = `${level}-${index}-${node.name}`;
                const isSelected = selected === node.name;

                return (
                    <AccordionItem key={id} value={id} className="border-border">
                        <AccordionTrigger
                            className={cn(
                                "text-left text-sm font-medium hover:no-underline",
                                level === 0
                                    ? "font-semibold text-ocean-900 dark:text-foreground"
                                    : "text-foreground/80"
                            )}
                        >
                            {node.name}
                        </AccordionTrigger>
                        <AccordionContent>
                            {/* Choosing the node itself - a parent is a valid choice */}
                            <button
                                type="button"
                                onClick={() => handleProgramSelect(node)}
                                aria-pressed={isSelected}
                                className={cn(
                                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                                    isSelected
                                        ? "ember-surface font-semibold text-white"
                                        : "text-muted-foreground hover:bg-accent hover:text-ocean-700"
                                )}
                            >
                                <Icon
                                    icon={isSelected ? CheckmarkCircle02Icon : GraduationScrollIcon}
                                    className="size-4"
                                />
                                {node.name}
                            </button>

                            {Array.isArray(node.children) && node.children.length > 0 && (
                                <div className="mt-1">
                                    <ProgramAccordion<T>
                                        nodes={node.children}
                                        level={level + 1}
                                        setValue={setValue}
                                        fieldKey={fieldKey}
                                        fieldIdKey={fieldIdKey}
                                        watch={watch}
                                    />
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}

interface ProgramAccordionDisplayProps<T extends genericObjectType> {
    programs: ProgramNode[],
    setValue: UseFormSetValue<T>,
    watch: UseFormWatch<T>,
    getValues: UseFormGetValues<T>,
    errors: FieldErrors<T>;
    fieldKey: string;
    fieldIdKey: string;
    heading?: string;
    subHeading?: string;
}
export const ProgramAccordionDisplay = <T extends genericObjectType>({
    programs,
    setValue,
    getValues,
    watch,
    errors,
    fieldKey,
    fieldIdKey,
    heading,
    subHeading,
}: ProgramAccordionDisplayProps<T>) => {
    const programValue = getValues(fieldKey as Path<T>)

    return (
        <div className="w-full">
            {heading && (
                <h2 className="text-lg font-semibold text-ocean-900 dark:text-foreground">
                    {heading}
                </h2>
            )}
            {subHeading && (
                <p className="mb-5 text-sm text-muted-foreground">{subHeading}</p>
            )}

            <div className="overflow-hidden rounded-2xl border border-border bg-card px-4 shadow-soft">
                <ProgramAccordion
                    nodes={programs}
                    setValue={setValue}
                    watch={watch}
                    fieldKey={fieldKey}
                    fieldIdKey={fieldIdKey}
                />
            </div>

            {errors.program && (
                <p className="mt-3 text-sm text-destructive">
                    {String(errors.program.message)}
                </p>
            )}
            {errors.program_id && (
                <p className="mt-1 text-sm text-destructive">
                    {String(errors.program_id.message)}
                </p>
            )}

            {programValue && (
                <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-ocean-100 bg-ocean-50 px-4 py-3.5 text-sm dark:border-border dark:bg-ocean-900/40">
                    <Icon
                        icon={CheckmarkCircle02Icon}
                        className="mt-0.5 size-4.5 text-ember-600"
                    />
                    <span className="text-muted-foreground">
                        Selected programme:{" "}
                        <span className="font-semibold text-ocean-800 dark:text-foreground">
                            {String(programValue)}
                        </span>
                    </span>
                </div>
            )}
        </div>
    );
}
