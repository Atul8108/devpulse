export function transformProfile(raw: any) {
  const user = raw.user ?? {};
  const calendar = raw.contributionCalendar ?? { totalContributions: 0, weeks: [] };
  const languages = Array.isArray(raw.languages) ? raw.languages : [];
  const totalStars = raw.totalStars ?? 0;
  const weeks = Array.isArray(calendar.weeks) ? calendar.weeks : [];

  const allDays = weeks.flatMap((w: any) =>
    Array.isArray(w.contributionDays) ? w.contributionDays : []
  );

  const streaks = calcStreak(allDays);

  const languageData = languages
    .slice(0, 8)
    .map((l: any) => ({
      language: l.name ?? l.language ?? 'Unknown',
      percentage: Math.round(l.size ?? l.percentage ?? 0),
    }));

  const activityData = buildActivityFromCalendar(weeks);

  return {
    profile: {
      login: user.login ?? '',
      name: user.name ?? user.login ?? '',
      avatar_url: user.avatarUrl ?? user.avatar_url ?? '',
      bio: user.bio ?? '',
      location: user.location ?? '',
      public_repos: user.repositories?.totalCount ?? user.public_repos ?? 0,
      followers: user.followers?.totalCount ?? user.followers ?? 0,
      following: user.following?.totalCount ?? user.following ?? 0,
    },
    stats: {
      totalStars,
      totalForks: 0,
      currentStreak: streaks.currentStreak,
      longestStreak: streaks.longestStreak,
      totalContributions: calendar.totalContributions ?? 0,
    },
    languages: languageData,
    contributions: calendar,
    activity: activityData,
  };
}

export function buildActivityFromCalendar(weeks: any[]) {
  const monthMap: Record<string, number> = {};
  weeks.forEach((week) => {
    (week.contributionDays ?? []).forEach((day: any) => {
      if (!day.date) return;
      const d = new Date(day.date);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthMap[key] = (monthMap[key] ?? 0) + (day.contributionCount ?? 0);
    });
  });
  return Object.entries(monthMap).map(([month, commits]) => ({ month, commits }));
}

export function calcStreak(days: any[]) {
  if (!days.length) return { currentStreak: 0, longestStreak: 0 };
  let current = 0, longest = 0, running = 0, currentSet = false;
  const sorted = [...days].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  for (const day of sorted) {
    if ((day.contributionCount ?? 0) > 0) {
      running++;
      longest = Math.max(longest, running);
    } else {
      if (!currentSet) { current = running; currentSet = true; }
      running = 0;
    }
  }
  if (!currentSet) current = running;
  return { currentStreak: current, longestStreak: longest };
}
