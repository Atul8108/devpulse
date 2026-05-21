import { calcStreak, buildActivityFromCalendar, transformProfile } from '../utils/transform';

describe('calcStreak', () => {
  test('returns 0 for empty days', () => {
    expect(calcStreak([])).toEqual({ currentStreak: 0, longestStreak: 0 });
  });

  test('counts a single active day', () => {
    const days = [{ date: '2024-01-01', contributionCount: 5 }];
    expect(calcStreak(days)).toEqual({ currentStreak: 1, longestStreak: 1 });
  });

  test('counts consecutive active days correctly', () => {
    const days = [
      { date: '2024-01-05', contributionCount: 3 },
      { date: '2024-01-04', contributionCount: 2 },
      { date: '2024-01-03', contributionCount: 1 },
      { date: '2024-01-02', contributionCount: 0 },
      { date: '2024-01-01', contributionCount: 4 },
    ];
    const result = calcStreak(days);
    expect(result.currentStreak).toBe(3);
    expect(result.longestStreak).toBe(3);
  });

  test('longestStreak exceeds currentStreak when broken', () => {
    const days = [
      { date: '2024-01-07', contributionCount: 0 },
      { date: '2024-01-06', contributionCount: 0 },
      { date: '2024-01-05', contributionCount: 1 },
      { date: '2024-01-04', contributionCount: 2 },
      { date: '2024-01-03', contributionCount: 3 },
      { date: '2024-01-02', contributionCount: 4 },
      { date: '2024-01-01', contributionCount: 5 },
    ];
    const result = calcStreak(days);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(5);
  });

  test('handles all zero days', () => {
    const days = [
      { date: '2024-01-03', contributionCount: 0 },
      { date: '2024-01-02', contributionCount: 0 },
      { date: '2024-01-01', contributionCount: 0 },
    ];
    expect(calcStreak(days)).toEqual({ currentStreak: 0, longestStreak: 0 });
  });
});

describe('buildActivityFromCalendar', () => {
  test('returns empty array for no weeks', () => {
    expect(buildActivityFromCalendar([])).toEqual([]);
  });

  test('groups contributions by month', () => {
    const weeks = [
      {
        contributionDays: [
          { date: '2024-01-10', contributionCount: 3 },
          { date: '2024-01-15', contributionCount: 2 },
        ],
      },
      {
        contributionDays: [
          { date: '2024-02-05', contributionCount: 5 },
        ],
      },
    ];
    const result = buildActivityFromCalendar(weeks);
    expect(result).toHaveLength(2);
    const jan = result.find((r) => r.month.startsWith('Jan'));
    const feb = result.find((r) => r.month.startsWith('Feb'));
    expect(jan?.commits).toBe(5);
    expect(feb?.commits).toBe(5);
  });

  test('skips days with no date', () => {
    const weeks = [{ contributionDays: [{ date: '', contributionCount: 10 }] }];
    expect(buildActivityFromCalendar(weeks)).toEqual([]);
  });
});

describe('transformProfile', () => {
  test('handles completely missing fields gracefully', () => {
    const result = transformProfile({});
    expect(result.profile.login).toBe('');
    expect(result.stats.totalStars).toBe(0);
    expect(result.stats.totalContributions).toBe(0);
    expect(result.languages).toEqual([]);
    expect(result.activity).toEqual([]);
  });

  test('maps user fields correctly', () => {
    const raw = {
      user: { login: 'alice', name: 'Alice', avatar_url: 'http://img', public_repos: 7, followers: 2, following: 1 },
      contributionCalendar: { totalContributions: 200, weeks: [] },
      languages: [{ name: 'Go', color: '#00add8', size: 3000 }],
      totalStars: 15,
      pinnedRepos: [],
    };
    const result = transformProfile(raw);
    expect(result.profile.login).toBe('alice');
    expect(result.stats.totalStars).toBe(15);
    expect(result.stats.totalContributions).toBe(200);
    expect(result.languages[0].language).toBe('Go');
  });

  test('slices languages to top 8', () => {
    const languages = Array.from({ length: 12 }, (_, i) => ({
      name: `Lang${i}`,
      color: null,
      size: 1000 - i,
    }));
    const result = transformProfile({ languages });
    expect(result.languages).toHaveLength(8);
  });
});
