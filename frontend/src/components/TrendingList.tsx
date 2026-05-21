import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

interface TrendingEntry {
  username: string;
  searches: number;
}

export default function TrendingList() {
  const [trending, setTrending] = useState<TrendingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/trending');
        console.log('trending raw response:', JSON.stringify(res.data));
        setTrending(res.data.trending ?? res.data ?? []);
      } catch {
        setTrending([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-sm mt-8 animate-pulse">Loading trending…</p>;
  }

  console.log('trending state:', trending, 'length:', trending?.length);
  if (!Array.isArray(trending) || trending.length === 0) {
    return (
      <p className="text-gray-500 text-sm mt-8">No trending developers yet.</p>
    );
  }

  return (
    <div className="mt-10 w-full max-w-xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-300 mb-3">Trending this week</h2>
      <ul className="space-y-2">
        {trending.map((item, idx) => (
          <li
            key={item.username}
            onClick={() => navigate(`/user/${item.username}`)}
            className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors border border-gray-700"
          >
            <span className="w-6 text-center text-sm font-bold text-gray-500 shrink-0">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">@{item.username}</p>
            </div>
            <span className="text-xs text-gray-400 shrink-0">
              🔍 {(item.searches ?? 0).toLocaleString()} searches
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
