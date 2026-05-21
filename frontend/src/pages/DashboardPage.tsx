import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useProfileStore } from '../store/useProfileStore';
import type { NormalisedData } from '../types/github';
import ProfileCard from '../components/ProfileCard';
import StatCards from '../components/StatCards';
import ContribHeatmap from '../components/ContribHeatmap';
import LanguageChart from '../components/LanguageChart';
import ActivityChart from '../components/ActivityChart';
import SkeletonDash from '../components/SkeletonDash';

const api = axios.create({ baseURL: 'http://localhost:5000' });

interface Profile {
  login: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
}

interface Contributions {
  totalContributions: number;
  weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
}

interface DashData {
  profile: Profile | null;
  normalisedForCards: NormalisedData;
  contributions: Contributions | null;
  activity: { month?: string; week?: string; commits: number }[];
}

export default function DashboardPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { addRecentSearch, setLoading, setError } = useProfileStore();
  const [data, setData] = useState<DashData | null>(null);
  const [error, setLocalError] = useState<string | null>(null);
  const [loading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    setLocalLoading(true);
    setLocalError(null);
    setLoading(true);
    setError(null);

    api.get(`/api/user/${username}`)
      .then((res) => {
        const { profile, stats, languages, contributions, activity } = res.data;

        const normalisedForCards: NormalisedData = {
          user: profile,
          stars: stats?.totalStars ?? 0,
          forks: stats?.totalForks ?? 0,
          totalContributions: contributions?.totalContributions ?? 0,
          contributionCalendar: contributions,
          languages: (languages ?? []).map((l: { language: string; percentage: number }) => ({
            name: l.language,
            count: l.percentage,
            color: null,
          })),
          activity: activity ?? [],
        };

        setData({ profile, normalisedForCards, contributions, activity });
        addRecentSearch(username);
      })
      .catch((err) => {
        const msg = err?.response?.data?.error ?? 'Failed to load user';
        setLocalError(msg);
        setError(msg);
      })
      .finally(() => {
        setLocalLoading(false);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <SkeletonDash />;

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-lg">{error ?? 'User not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          ← Back to search
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto space-y-5">
      <button
        onClick={() => navigate('/')}
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        ← Back
      </button>
      <ProfileCard profile={data.profile} />
      <StatCards data={data.normalisedForCards} />
      <ContribHeatmap days={data.contributions ?? undefined} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LanguageChart languages={data.normalisedForCards.languages} />
        <ActivityChart activity={data.activity} />
      </div>
    </div>
  );
}
