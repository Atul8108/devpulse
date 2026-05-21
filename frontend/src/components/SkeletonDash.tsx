function Bone({ className }: { className: string }) {
  return <div className={`bg-gray-700 rounded animate-pulse ${className}`} />;
}

export default function SkeletonDash() {
  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto space-y-5">
      {/* back button */}
      <Bone className="h-4 w-16" />

      {/* ProfileCard */}
      <div className="flex gap-5 bg-gray-800 rounded-xl p-5 border border-gray-700">
        <Bone className="w-24 h-24 rounded-full shrink-0" />
        <div className="flex-1 space-y-3">
          <Bone className="h-6 w-40" />
          <Bone className="h-4 w-64" />
          <Bone className="h-4 w-32" />
          <div className="flex gap-2">
            <Bone className="h-6 w-20 rounded-full" />
            <Bone className="h-6 w-20 rounded-full" />
            <Bone className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>

      {/* StatCards — 4 cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col items-center gap-2">
            <Bone className="h-8 w-8 rounded" />
            <Bone className="h-6 w-16" />
            <Bone className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* ContribHeatmap */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-3">
        <Bone className="h-4 w-36" />
        <div className="flex gap-0.5">
          {Array.from({ length: 52 }).map((_, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {Array.from({ length: 7 }).map((_, di) => (
                <Bone key={di} className="w-3 h-3 rounded-sm" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-3">
          <Bone className="h-4 w-28" />
          <Bone className="h-48 w-full rounded-lg" />
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-3">
          <Bone className="h-4 w-36" />
          <Bone className="h-48 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
