"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-base-content/70 mb-8 max-w-md">
        An unexpected error occurred while loading this page. Please try refreshing or retrying.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="btn btn-primary"
        >
          Try again
        </button>
        <a href="/" className="btn btn-ghost">
          Go back home
        </a>
      </div>
    </div>
  );
}
