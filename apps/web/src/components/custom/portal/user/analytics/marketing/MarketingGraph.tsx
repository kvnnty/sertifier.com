import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface GraphDataPoint {
  date: string;
  viewers: number;
}

interface MarketingGraphProps {
  data: GraphDataPoint[];
}

export default function MarketingGraph({ data }: MarketingGraphProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          stroke="#399986"
          axisLine
          tick={{ fill: "black" }}
        />
        <YAxis
          allowDecimals={false}
          stroke="#399986"
          axisLine={false}
          tick={{ fill: "black" }}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="viewers"
          stroke="#399986"
          activeDot={{ r: 8, stroke: "#399986", fill: "#399986" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
