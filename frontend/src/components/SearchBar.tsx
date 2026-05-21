import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/useProfileStore';

export default function SearchBar() {
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const { recentSearches, addRecentSearch } = useProfileStore();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const username = input.trim();
    if (!username) return;
    addRecentSearch(username);
    navigate(`/user/${username}`);
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter GitHub username…"
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          Search
        </button>
      </form>

      {recentSearches.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 self-center">Recent:</span>
          {recentSearches.map((u) => (
            <button
              key={u}
              onClick={() => navigate(`/user/${u}`)}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full transition-colors"
            >
              {u}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
