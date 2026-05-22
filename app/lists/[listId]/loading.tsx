export default function ListLoading() {
  return (
    <div className="flex h-screen overflow-hidden bg-background animate-in fade-in duration-300">
      {/* Sidebar Skeleton */}
      <div className="hidden md:flex w-64 h-full flex-shrink-0 flex-col border-r border-border/40 bg-card/50 p-4 gap-4">
        <div className="w-full h-6 rounded bg-muted animate-pulse mb-2" />
        <div className="w-3/4 h-4 rounded bg-muted/60 animate-pulse" />
        <div className="border-t border-border/40 my-2" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 py-1.5">
            <div className="w-5 h-5 rounded bg-muted animate-pulse" />
            <div className="w-24 h-4 rounded bg-muted animate-pulse" style={{ width: `${60 + i * 10}%` }} />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-border/40 py-3 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          </div>
        </div>

        <main className="max-w-5xl mx-auto p-4 md:p-8 lg:p-12 pt-0">
          {/* Title */}
          <header className="mb-12 mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="w-64 h-8 rounded-lg bg-muted animate-pulse" />
              <div className="w-96 max-w-full h-4 rounded bg-muted/60 animate-pulse mt-3" />
            </div>
            <div className="w-32 h-10 rounded-lg bg-muted animate-pulse" />
          </header>

          {/* Category Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-card border border-border/60 rounded-xl p-5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
                  <div className="w-24 h-5 rounded bg-muted animate-pulse" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded bg-muted animate-pulse" />
                      <div className="h-4 rounded bg-muted/60 animate-pulse" style={{ width: `${50 + j * 12}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
