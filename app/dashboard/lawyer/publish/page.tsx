"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LawyerPublishPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      // Create checkout session
      const { url } = await api.post<{ url: string }>("/api/payments/publish-fee", {
        lawyerId: user?.id
      });
      // Redirect to Stripe
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="bg-base-100 p-10 rounded-2xl shadow-sm border border-base-200 text-center relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-primary/10 text-primary flex items-center justify-center rounded-full mx-auto mb-6">
            <CreditCard className="w-10 h-10" />
          </div>

          <h1 className="text-4xl font-extrabold mb-4">Go Live on LegalEase</h1>
          <p className="text-xl text-base-content/70 mb-8 max-w-xl mx-auto">
            Get your profile in front of thousands of potential clients. Pay a one-time publishing fee to activate your public listing.
          </p>

          {error && (
            <div className="alert alert-error mb-6 text-sm max-w-md mx-auto">
              <span>{error}</span>
            </div>
          )}

          <div className="bg-base-200/50 p-6 rounded-xl inline-block text-left mb-8">
            <h3 className="font-bold text-lg border-b border-base-300 pb-2 mb-4">What's included:</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>Featured in public search results</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>Accept unlimited client hiring requests</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span>Build your reputation with verified reviews</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-3xl font-black mb-6">$99 <span className="text-lg text-base-content/50 font-normal">one-time</span></div>
            <button 
              onClick={handleCheckout} 
              disabled={loading}
              className="btn btn-primary btn-lg px-12 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Pay $99 and Go Live"
              )}
            </button>
          </div>
          <p className="text-xs text-base-content/50 mt-6 flex items-center justify-center gap-1">
            Secure payments powered by <strong>Stripe</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
