"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface OverviewPieChartsProps {
  data: any[];
}

const PURPLE_COLORS = [
  "#8a2be2", // Blue Violet
  "#9932cc", // Dark Orchid
  "#a020f0", // Purple
  "#9370db", // Medium Purple
  "#ba55d3", // Medium Orchid
  "#8b008b", // Dark Magenta
  "#800080", // Purple
  "#9400d3", // Dark Violet
  "#9932cc", // Dark Orchid
  "#800080", // Purple
];

export const OverviewPieCharts = ({ data }: OverviewPieChartsProps) => {
  // Filter data to remove items where the value is zero
  const filteredData = data.filter((item) => item.value !== 0);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={filteredData} // Use filteredData here
          dataKey={"value"}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#82ca9d"
          label={({ name, value }) => `${name}:${value}`}
        >
          {data.map(
            (
              entry,
              index, // Use filteredData here as well
            ) => (
              <Cell
                key={`cell-${index}`}
                fill={PURPLE_COLORS[index % PURPLE_COLORS.length]}
              />
            ),
          )}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};
