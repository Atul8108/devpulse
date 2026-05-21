export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface LanguageStat {
  name: string;
  color: string | null;
  size: number;
}

export interface GitHubProfile {
  user: GitHubUser;
  contributionCalendar: ContributionCalendar;
  languages: LanguageStat[];
  totalStars: number;
  pinnedRepos: PinnedRepo[];
}

export interface PinnedRepo {
  name: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string; color: string | null } | null;
  url: string;
}

export interface TrendingEntry {
  username: string;
  count: number;
}
