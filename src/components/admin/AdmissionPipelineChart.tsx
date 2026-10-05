"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import type { PipelineSlice } from "@/lib/admin.analytics";

// Chart tokens are raw oklch values, so they are referenced directly -
// wrapping them in hsl() (as the shadcn demo did) produces an invalid colour.
const chartConfig = {
    students: { label: "Students" },
    unapplied: { label: "Not applied", color: "var(--chart-5)" },
    applied: { label: "Pending", color: "var(--chart-3)" },
    admitted: { label: "Admitted", color: "var(--chart-1)" },
    rejected: { label: "Rejected", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function AdmissionPipelineChart({ data }: { data: PipelineSlice[] }) {
    const total = data.reduce((sum, row) => sum + row.students, 0);

    return (
        <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="border-b border-border px-6 py-5">
                <h3 className="font-semibold text-ocean-900 dark:text-foreground">
                    Admission pipeline
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                    Every registered account by stage
                </p>
            </div>

            <div className="flex-1 p-4">
                {total === 0 ? (
                    <p className="py-16 text-center text-sm text-muted-foreground">
                        No applicant records yet.
                    </p>
                ) : (
                    <ChartContainer config={chartConfig} className="min-h-56 w-full">
                        <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 8, right: 32 }}>
                            <CartesianGrid horizontal={false} />
                            <YAxis
                                dataKey="stage"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                width={92}
                                className="text-xs"
                            />
                            <XAxis dataKey="students" type="number" hide />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="students" radius={6}>
                                <LabelList
                                    dataKey="students"
                                    position="right"
                                    offset={8}
                                    className="fill-foreground text-xs font-semibold"
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </div>
        </section>
    );
}
