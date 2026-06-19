export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-base-100">
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-base-content/60 animate-pulse font-medium">Loading LegalEase...</p>
      </div>
    </div>
  );
}
