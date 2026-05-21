interface ContribDay {
  date: string;
  contributionCount: number;
}

interface ContribWeek {
  contributionDays: ContribDay[];
}

interface Contributions {
  totalContributions: number;
  weeks: ContribWeek[];
}

interface Props {
  days?: Contributions;
}

const safeCount = (val: unknown) => (typeof val === 'number' ? val : 0);

function getIntensityClass(count: number): string {
  if (count === 0) return 'bg-gray-100';
  if (count < 4) return 'bg-green-200';
  if (count < 10) return 'bg-green-400';
  return 'bg-green-600';
}

const noData = (
  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
    <h2 className="text-sm font-semibold text-gray-300 mb-3">Contribution Activity</h2>
    <div className="text-gray-400 text-sm">No contribution data available</div>
  </div>
);

export default function ContribHeatmap({ days: contributions }: Props) {
  const days: ContribDay[] =
    contributions?.weeks?.flatMap((w) => w.contributionDays ?? []) ?? [];

  if (days.length === 0) return noData;

  const padded = [...Array(Math.max(0, 364 - days.length)).fill(null), ...days].slice(-364);
  const grid: (ContribDay | null)[][] = [];
  for (let i = 0; i < 52; i++) grid.push(padded.slice(i * 7, i * 7 + 7));

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <h2 className="text-sm font-semibold text-gray-300 mb-3">Contribution Activity</h2>
      <div className="flex gap-0.5 overflow-x-auto">
        {grid.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((day, di) => {
              const count = safeCount(day?.contributionCount);
              return (
                <div
                  key={di}
                  title={day ? `${day.date}: ${count}` : ''}
                  className={`w-3 h-3 rounded-sm ${day ? getIntensityClass(count) : 'bg-gray-900'}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
