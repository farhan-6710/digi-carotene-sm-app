import { Line, LineChart, ResponsiveContainer } from "recharts";

import type { SparklinePoint } from "@/shared/types/statsCards";

type SparklineProps = {
  data: SparklinePoint[];
  color: string;
};

export function Sparkline({ data, color }: SparklineProps) {
  console.log("color", color);
  return (
    <div className="h-10 w-24 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
        >
          <Line
            type="bump"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
