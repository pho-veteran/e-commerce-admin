"use client";

import { currencyFormatter } from "@/lib/utils";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
    data: {
        name: string;
        total: number;
    }[];
}

export const Overview: React.FC<OverviewProps> = async ({
    data
}) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${currencyFormatter.format(value)}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
