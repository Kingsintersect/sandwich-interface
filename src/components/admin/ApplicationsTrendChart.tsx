"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { formatMonth, type TrendPoint } from "@/lib/admin.analytics";

const chartConfig = {
    applied: { label: "Applications", color: "var(--chart-1)" },
    admitted: { label: "Admitted", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ApplicationsTrendChart({ data }: { data: TrendPoint[] }) {
    return (
        <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="border-b border-border px-6 py-5">
                <h3 className="font-semibold text-ocean-900 dark:text-foreground">
                    Applications over time
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                    By month the account was created
                </p>
            </div>

            <div className="flex-1 p-4">
                {data.length === 0 ? (
                    <p className="py-16 text-center text-sm text-muted-foreground">
                        No dated applicant records to chart yet.
                    </p>
                ) : (
                    <ChartContainer config={chartConfig} className="min-h-56 w-full">
                        <AreaChart accessibilityLayer data={data} margin={{ left: 4, right: 12 }}>
                            <defs>
                                <linearGradient id="fillApplied" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-applied)" stopOpacity={0.7} />
                                    <stop offset="95%" stopColor="var(--color-applied)" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="fillAdmitted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-admitted)" stopOpacity={0.7} />
                                    <stop offset="95%" stopColor="var(--color-admitted)" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={24}
                                tickFormatter={formatMonth}
                                className="text-xs"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                width={32}
                                allowDecimals={false}
                                className="text-xs"
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent labelFormatter={(v) => formatMonth(String(v))} />
                                }
                            />
                            <Area
                                dataKey="applied"
                                type="linear"
                                fill="url(#fillApplied)"
                                stroke="var(--color-applied)"
                                strokeWidth={2}
                                stackId="a"
                            />
                            <Area
                                dataKey="admitted"
                                type="linear"
                                fill="url(#fillAdmitted)"
                                stroke="var(--color-admitted)"
                                strokeWidth={2}
                                stackId="b"
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                )}
            </div>
        </section>
    );
}
