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

interface Props {
  profile: Profile | null | undefined;
}

export default function ProfileCard({ profile }: Props) {
  if (!profile) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-5 bg-gray-800 rounded-xl p-5 border border-gray-700">
      <img
        src={profile?.avatar_url}
        alt={profile?.login}
        className="w-24 h-24 rounded-full border-2 border-gray-600 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h2 className="text-xl font-bold text-white">{profile?.name ?? profile?.login}</h2>
          <a
            href={`https://github.com/${profile?.login}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            @{profile?.login}
          </a>
        </div>

        {profile?.bio && <p className="text-gray-400 text-sm mb-3">{profile?.bio}</p>}

        <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
          {profile?.location && <span>📍 {profile?.location}</span>}
        </div>

        <div className="flex flex-wrap gap-2">
          <Pill label="Followers" value={profile?.followers ?? 0} />
          <Pill label="Following" value={profile?.following ?? 0} />
          <Pill label="Repos" value={profile?.public_repos ?? 0} />
        </div>
      </div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: number }) {
  return (
    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
      <span className="text-white font-semibold">{value.toLocaleString()}</span> {label}
    </span>
  );
}
