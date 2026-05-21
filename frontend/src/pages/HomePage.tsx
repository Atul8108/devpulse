import SearchBar from '../components/SearchBar';
import TrendingList from '../components/TrendingList';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center pt-24 px-4">
      <h1 className="text-4xl font-bold text-white mb-2">DevPulse</h1>
      <p className="text-gray-400 mb-8">GitHub developer analytics at a glance</p>
      <SearchBar />
      <TrendingList />
    </div>
  );
}
