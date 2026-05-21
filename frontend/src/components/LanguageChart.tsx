import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { LanguageStat } from '../types/github';

interface Props {
  languages: LanguageStat[];
}

const FALLBACK_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#ec4899',
];

interface LabelProps {
  name: string;
  percent?: number;
  x: number;
  y: number;
  midAngle: number;
}

function renderLabel({ name, percent = 0, x, y, midAngle }: LabelProps) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const nx = x + 10 * Math.cos(-midAngle * RADIAN);
  const ny = y + 10 * Math.sin(-midAngle * RADIAN);
  return (
    <text x={nx} y={ny} fill="#d1d5db" textAnchor="middle" dominantBaseline="central" fontSize={11}>
      {name} {(percent * 100).toFixed(0)}%
    </text>
  );
}

export default function LanguageChart({ languages }: Props) {
  if (languages.length === 0) return null;

  const top = languages.slice(0, 8);
  const total = top.reduce((sum, l) => sum + l.count, 0);
  const data = top.map((l) => ({ ...l, pct: ((l.count / total) * 100).toFixed(1) }));

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <h2 className="text-sm font-semibold text-gray-300 mb-3">Top Languages</h2>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={false}
            label={renderLabel as any}
          >
            {data.map((lang, i) => (
              <Cell key={lang.name} fill={lang.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8 }}
            formatter={(value) => [
              typeof value === 'number' ? `${value.toLocaleString()} repos` : '0',
              '',
            ]}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
