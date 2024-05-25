"use client";

import React from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
  data: any[];
}

const Overview = ({ data }: OverviewProps) => {
  // Extracting names and total values from data
  const names = data.map((item) => item.name);
  const totals = data.map((item) => item.total);

  // Calculate the max value for Y-axis domain
  const maxYValue = Math.max(...totals);

  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey={"name"}
          stroke="#555"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          // Dynamically setting domain for X-axis
          domain={[0, names.length - 1]}
        />
        <YAxis
          stroke="#555"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          // Dynamically setting domain for Y-axis
          domain={[0, maxYValue]}
        />
        <Bar dataKey={"total"} fill="#7B1FA2" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;
