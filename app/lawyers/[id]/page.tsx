"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { DetailsHeader } from "@/components/lawyer/details-header";
import { CommentForm } from "@/components/lawyer/comment-form";
import { CommentList } from "@/components/lawyer/comment-list";

export default function LawyerDetailsPage() {
  const params = useParams() as { id: string };
  const [lawyer, setLawyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshComments, setRefreshComments] = useState(0);

  useEffect(() => {
    async function fetchLawyer() {
      try {
        const res = await api.get<any>(`/api/lawyers/${params.id}`);
        if (!res.data) throw new Error("Not found");
        setLawyer(res.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchLawyer();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl animate-pulse">
        <div className="h-64 bg-base-300 rounded-xl mb-8"></div>
        <div className="h-40 bg-base-300 rounded-xl mb-8"></div>
        <div className="h-64 bg-base-300 rounded-xl"></div>
      </div>
    );
  }

  if (error || !lawyer) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-2xl">
        <h1 className="text-6xl font-bold text-base-content/20 mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">Lawyer Not Found</h2>
        <p className="text-base-content/70 mb-8">The lawyer profile you are looking for doesn't exist or has been removed.</p>
        <a href="/browse" className="btn btn-primary">Back to Browse</a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <DetailsHeader lawyer={lawyer} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <div className="prose max-w-none text-base-content/80 whitespace-pre-line">
              {lawyer.bio || "No biography provided."}
            </div>
          </section>

          <section id="reviews" className="scroll-mt-24">
            <h2 className="text-2xl font-bold mb-6">Comments & Reviews</h2>
            <CommentForm lawyerId={lawyer.id || lawyer._id} onCommentAdded={() => setRefreshComments(prev => prev + 1)} />
            <div className="mt-8">
              <CommentList lawyerId={lawyer.id || lawyer._id} refreshTrigger={refreshComments} />
            </div>
          </section>
        </div>

        <div>
          <section className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200 sticky top-24">
            <h3 className="font-bold mb-4 text-lg border-b border-base-200 pb-2">Quick Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between">
                <span className="text-base-content/60">Specialization</span>
                <span className="font-medium">{lawyer.specialization}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-base-content/60">Hourly Rate</span>
                <span className="font-medium">${lawyer.fee}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-base-content/60">Status</span>
                <span className={`badge ${lawyer.status === 'busy' ? 'badge-warning' : 'badge-success'}`}>
                  {lawyer.status}
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
