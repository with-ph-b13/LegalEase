"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Star, Trash2, Edit2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function UserCommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await api.get<any[]>("/api/comments/me");
      setComments(res);
    } catch (err) {
      console.error("Failed to fetch user comments", err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (comment: any) => {
    setEditingId(comment._id || comment.id);
    setEditRating(comment.rating);
    setEditText(comment.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editText.trim()) return;

    try {
      const updated = await api.patch(`/api/comments/${editingId}`, {
        text: editText,
        rating: editRating
      });
      setComments(prev => prev.map(c => (c._id || c.id) === editingId ? { ...c, ...updated as any } : c));
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    // Optimistic UI update
    setComments(prev => prev.filter(c => c._id !== id && c.id !== id));
    
    try {
      await api.delete(`/api/comments/${id}`);
    } catch (err) {
      console.error("Failed to delete comment", err);
      fetchComments(); // Revert on failure
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Reviews</h1>

      <div className="bg-base-100 rounded-xl shadow-sm border border-base-200 p-6">
        {loading ? (
          <div className="flex justify-center p-10">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
            <p className="text-base-content/70">You haven't reviewed any lawyers yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id || comment.id} className="border border-base-300 p-5 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Review for <Link href={`/lawyers/${comment.lawyer?.id}`} className="text-primary hover:underline">{comment.lawyer?.name}</Link>
                    </h3>
                    <div className="text-xs opacity-60">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(comment)}
                      className="btn btn-sm btn-ghost btn-square"
                      title="Edit review"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(comment._id || comment.id)}
                      className="btn btn-sm btn-ghost btn-square hover:text-error"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {editingId === (comment._id || comment.id) ? (
                  <form onSubmit={saveEdit} className="mt-4 border-t border-base-200 pt-4">
                    <div className="mb-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setEditRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= (hoveredRating || editRating)
                                  ? "fill-warning text-warning"
                                  : "text-base-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      className="textarea textarea-bordered w-full h-24 mb-3"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      required
                    />
                    <div className="flex justify-end gap-2">
                      <button type="button" className="btn btn-sm btn-ghost" onClick={cancelEdit}>Cancel</button>
                      <button type="submit" className="btn btn-sm btn-primary" disabled={!editText.trim()}>Save</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= comment.rating ? "fill-warning text-warning" : "text-base-300 fill-base-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-base-content/80">{comment.text}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
