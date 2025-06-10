import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface MiniLineChartProps {
  data: { value: number }[];
  color: string;
}

const MiniLineChart: React.FC<MiniLineChartProps> = ({ data, color }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MiniLineChart;
