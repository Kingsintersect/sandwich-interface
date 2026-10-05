"use client";

import { useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Award01Icon, ChartUpIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
} from "recharts";
import { toNumber, type ResultRow } from "@/hooks/useResults";

// Brand chart tokens rather than raw tailwind hexes, so these follow the theme
// (including dark mode) like every other chart.
const gradeColorMap = {
    A: "var(--chart-1)",
    B: "var(--chart-3)",
    C: "var(--chart-4)",
    D: "var(--chart-2)",
    F: "var(--muted-foreground)",
};
type ScoreAnalyticsProps = {
    /** The rows currently shown by the filters, so the charts follow them. */
    scores: ResultRow[];
};
export const ScoreAnalytics = ({ scores }: ScoreAnalyticsProps) => {
    const analytics = useMemo(() => {
        if (!scores?.length) return null;

        // Grade Distribution
        const gradeDistribution = scores.reduce((acc, row) => {
            const grade = (row.grade || "F").toUpperCase();
            acc[grade] = (acc[grade] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Average Score
        const averageScore =
            scores.reduce((sum, row) => sum + toNumber(row.score), 0) / scores.length;

        // Grade bar data
        const barData = Object.entries(gradeDistribution).map(
            ([grade, count]) => ({
                name: `Grade ${grade}`,
                value: count,
                fill: gradeColorMap[grade as keyof typeof gradeColorMap] ?? "var(--muted-foreground)",
            })
        );

        // Pie chart data
        const pieData = barData;

        return {
            averageScore,
            pieData,
            barData,
            totalResults: scores.length,
            totalStudents: new Set(scores.map((r) => r.user_id)).size,
        };
    }, [scores]);

    if (!analytics) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon icon={ChartUpIcon} className="h-5 w-5" />
                        Grade Breakdown
                    </CardTitle>
                    <CardDescription>Student count per grade</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={analytics.barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <RechartsTooltip />
                            <Bar dataKey="value">
                                {analytics.barData.map((entry, index) => (
                                    <Cell key={`bar-cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon icon={Award01Icon} className="h-5 w-5" />
                        Performance Summary
                    </CardTitle>
                    <CardDescription>Overall class performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">
                                {Math.round(analytics.averageScore)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Class Average
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{analytics.totalResults}</div>
                            <div className="text-sm text-muted-foreground">
                                Results
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                            <Pie
                                data={analytics.pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                dataKey="value"
                            >
                                {analytics.pieData.map((entry, index) => (
                                    <Cell key={`pie-cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};
