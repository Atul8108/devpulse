export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface ContribDay {
  date: string;
  count: number;
}

export interface LanguageStat {
  name: string;
  count: number;
  color: string | null;
}

export interface ActivityPoint {
  week: string;
  commits: number;
}

export interface NormalisedData {
  user: GitHubUser;
  totalContributions: number;
  contributionCalendar: ContribDay[];
  languages: LanguageStat[];
  activity: ActivityPoint[];
  stars: number;
  forks: number;
}

export interface TrendingItem {
  username: string;
  name: string | null;
  avatar_url: string;
  searchCount: number;
  stars: number;
}
