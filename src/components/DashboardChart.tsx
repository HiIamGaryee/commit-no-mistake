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
    <div className="p-4 border border-gray-600 rounded-lg bg-gray-800 text-white">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        {type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
