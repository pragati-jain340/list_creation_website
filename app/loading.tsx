export default function Loading() {
  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl py-3.5 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
          <div className="w-28 h-5 rounded-md bg-muted animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:px-8 lg:px-12">
        {/* Hero Skeleton */}
        <div className="relative mb-10 rounded-2xl overflow-hidden bg-muted/30 p-8 md:p-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded bg-muted animate-pulse" />
            <div className="w-24 h-4 rounded bg-muted animate-pulse" />
          </div>
          <div className="w-48 h-9 rounded-lg bg-muted animate-pulse mb-2" />
          <div className="w-96 max-w-full h-4 rounded bg-muted/60 animate-pulse mt-3" />
          <div className="w-72 max-w-full h-4 rounded bg-muted/60 animate-pulse mt-2" />
          <div className="flex items-center gap-6 mt-6">
            <div className="w-20 h-7 rounded-md bg-muted animate-pulse" />
            <div className="w-20 h-7 rounded-md bg-muted animate-pulse" />
          </div>
        </div>

        {/* Section Title Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
            <div className="w-40 h-6 rounded-md bg-muted animate-pulse" />
          </div>
          <div className="w-28 h-9 rounded-lg bg-muted animate-pulse" />
        </div>

        {/* Card Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border/60 rounded-xl p-5 flex flex-col gap-3"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="w-3/4 h-5 rounded bg-muted animate-pulse" />
                  <div className="w-full h-4 rounded bg-muted/60 animate-pulse mt-2" />
                </div>
                <div className="w-7 h-7 rounded-full bg-muted animate-pulse flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border/40">
                <div className="w-10 h-6 rounded-md bg-muted animate-pulse" />
                <div className="w-16 h-6 rounded-md bg-muted animate-pulse" />
                <div className="w-16 h-5 rounded bg-muted/60 animate-pulse ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
