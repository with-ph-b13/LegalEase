"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Star, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/context/AuthContext";

export function CommentList({ lawyerId, refreshTrigger }: { lawyerId: string, refreshTrigger: number }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchComments(1);
  }, [lawyerId, refreshTrigger]);

  const fetchComments = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await api.get<{ data: any[], totalPages: number }>(`/api/comments/lawyer/${lawyerId}?page=${pageNum}&limit=5`);
      setComments(res.data);
      setTotalPages(res.totalPages);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoading(false);
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
      fetchComments(page); // Revert on failure
    }
  };

  if (loading && comments.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-base-100 p-6 rounded-xl border border-base-200 animate-pulse h-32"></div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="bg-base-100 p-8 rounded-xl border border-base-200 text-center">
        <p className="text-base-content/60">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const isOwnerOrAdmin = user && (user.id === comment.userId || user.role === "admin");
        
        return (
          <div key={comment._id || comment.id} className="bg-base-100 p-6 rounded-xl border border-base-200 shadow-sm relative group">
            {isOwnerOrAdmin && (
              <button 
                onClick={() => handleDelete(comment._id || comment.id)}
                className="absolute top-4 right-4 text-base-content/40 hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Delete review"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            
            <div className="flex items-center gap-4 mb-4">
              <div className="avatar">
                <div className="w-10 h-10 rounded-full bg-base-300">
                  {comment.user?.avatar ? (
                    <img src={comment.user.avatar} alt={comment.user.name} />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-base-content/50 font-bold text-sm">
                      {(comment.user?.name || "U")[0].toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="font-bold">{comment.user?.name || "Anonymous User"}</div>
                <div className="text-xs opacity-60">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
            
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= comment.rating ? "fill-warning text-warning" : "text-base-300 fill-base-300"
                  }`}
                />
              ))}
            </div>
            
            <p className="text-base-content/80 whitespace-pre-wrap">{comment.text}</p>
          </div>
        );
      })}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button 
              className="join-item btn btn-sm" 
              disabled={page === 1}
              onClick={() => fetchComments(page - 1)}
            >
              «
            </button>
            <button className="join-item btn btn-sm pointer-events-none">
              Page {page} of {totalPages}
            </button>
            <button 
              className="join-item btn btn-sm" 
              disabled={page === totalPages}
              onClick={() => fetchComments(page + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
