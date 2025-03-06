import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from "recharts";

// Mock Chart Data
const data = [
  { name: "Jan", amount: 1000 },
  { name: "Feb", amount: 5000 },
  { name: "Mar", amount: 12000 },
  { name: "Apr", amount: 20000 },
  { name: "May", amount: 18000 },
  { name: "Jun", amount: 30000 },
];

interface ChartProps {
  type: "line" | "bar";
  title: string;
}

const DashboardChart: React.FC<ChartProps> = ({ type, title }) => {
  return (
    <div className="p-4 border border-[#39B8FF] rounded-lg bg-[#0B1437] text-white shadow-lg">
      <h3 className="text-lg font-semibold mb-3 text-[#39B8FF]">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        {type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#A3AED0" />
            <XAxis dataKey="name" stroke="#A3AED0" />
            <YAxis stroke="#A3AED0" />
            <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#39B8FF" }} />
            <Line type="monotone" dataKey="amount" stroke="#39B8FF" strokeWidth={2} dot={{ fill: "#39B8FF", r: 4 }} />
          </LineChart>
        ) : (
            <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#A3AED0" />
            <XAxis dataKey="name" stroke="#A3AED0" />
            <YAxis stroke="#A3AED0" />
            <Tooltip contentStyle={{ backgroundColor: "#222", borderColor: "#A020F0" }} />
            <Bar dataKey="amount" fill="#A020F0" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
