import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const ConfidenceDonut = ({ data }) => {
  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"]; // high, medium, low

  const formattedData = [
    { name: "High", value: data.high },
    { name: "Medium", value: data.medium },
    { name: "Low", value: data.low },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={formattedData}
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {formattedData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConfidenceDonut;