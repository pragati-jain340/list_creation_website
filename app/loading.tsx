export default function Loading() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-muted-foreground font-medium animate-pulse">Loading Packing List...</p>
    </div>
  );
}
