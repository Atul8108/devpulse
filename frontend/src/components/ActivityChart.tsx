import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ActivityPoint {
  month?: string;
  week?: string;
  commits: number;
}

interface Props {
  activity?: ActivityPoint[] | undefined;
}

export default function ActivityChart({ activity: data = [] }: Props) {
  console.log('activity data:', data);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300 mb-3">Commit Activity</h2>
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
          No activity data available
        </div>
      </div>
    );
  }

  const chartData = data.slice(-26).map((p) => ({
    ...p,
    label: p.month ?? (p.week ? p.week.slice(5) : ''),
  }));

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <h2 className="text-sm font-semibold text-gray-300 mb-3">Commit Activity (last 26 weeks)</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 10 }} interval={3} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8 }}
            labelStyle={{ color: '#f3f4f6' }}
          />
          <Line type="monotone" dataKey="commits" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
