import type { NormalisedData } from '../types/github';

interface ContribDay {
  date: string;
  contributionCount: number;
}

interface Props {
  data: NormalisedData;
}

const safeNum = (val: unknown) => (typeof val === 'number' ? val : 0);

export default function StatCards({ data }: Props) {
  if (!data) return null;

  const streak = calcStreak(data);

  const cards = [
    { emoji: '⭐', label: 'Total Stars', value: safeNum(data.stars).toLocaleString() },
    { emoji: '🍴', label: 'Total Forks', value: safeNum(data.forks).toLocaleString() },
    { emoji: '🔥', label: 'Current Streak', value: `${safeNum(streak.currentStreak)} days` },
    { emoji: '🏆', label: 'Longest Streak', value: `${safeNum(streak.longestStreak)} days` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col items-center text-center gap-1"
        >
          <span className="text-2xl">{card.emoji}</span>
          <span className="text-xl font-bold text-white">{card.value}</span>
          <span className="text-xs text-gray-400">{card.label}</span>
        </div>
      ))}
    </div>
  );
}

function calcStreak(data: NormalisedData): { currentStreak: number; longestStreak: number } {
  const contributions = (data as unknown as Record<string, unknown>).contributionCalendar as
    | { weeks: { contributionDays: ContribDay[] }[] }
    | undefined;

  const days: ContribDay[] =
    contributions?.weeks?.flatMap((w) => w.contributionDays ?? []) ?? [];

  if (days.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

  let longestStreak = 0;
  let run = 0;
  for (const day of sorted) {
    if (day.contributionCount > 0) {
      run++;
      if (run > longestStreak) longestStreak = run;
    } else {
      run = 0;
    }
  }

  let currentStreak = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].contributionCount > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  return { currentStreak, longestStreak };
}
