"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function CommentForm({ lawyerId, onCommentAdded }: { lawyerId: string, onCommentAdded: () => void }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError("");

    try {
      await api.post("/api/comments", { lawyerId, text, rating });
      setText("");
      setRating(5);
      onCommentAdded();
    } catch (err: any) {
      // 403 usually means they haven't hired the lawyer
      setError(err.message || "You must hire this lawyer first to leave a review.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-base-200 p-6 rounded-xl text-center">
        <h3 className="font-bold mb-2">Leave a Review</h3>
        <p className="text-base-content/70 mb-4">Please sign in and hire this lawyer to leave a review.</p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 border border-base-200 p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>
      
      {error && (
        <div className="alert alert-error mb-4 text-sm py-2">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset mb-4">
          <legend className="fieldset-legend text-sm font-medium mb-2">Rating</legend>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? "fill-warning text-warning"
                      : "text-base-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="fieldset mb-4">
          <legend className="fieldset-legend text-sm font-medium mb-2">Your Experience</legend>
          <textarea
            className="textarea textarea-bordered w-full h-24"
            placeholder="Share details of your experience with this lawyer..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            disabled={loading}
          />
        </fieldset>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !text.trim()}
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Post Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
