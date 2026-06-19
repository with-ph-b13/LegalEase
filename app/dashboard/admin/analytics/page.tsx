"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StatCard } from "@/components/admin/stat-card";
import { Users, Briefcase, Handshake, DollarSign } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await api.get<any>("/api/admin/analytics");
        setData(res);
      } catch (err: any) {
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold">Analytics Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={data.totalUsers.toLocaleString()} 
          icon={Users} 
          description="Registered client accounts"
        />
        <StatCard 
          title="Total Lawyers" 
          value={data.totalLawyers.toLocaleString()} 
          icon={Briefcase} 
          description="Published & unpublished profiles"
        />
        <StatCard 
          title="Total Hires" 
          value={data.totalHires.toLocaleString()} 
          icon={Handshake} 
          description="Total consultation requests"
        />
        <StatCard 
          title="Total Platform Revenue" 
          value={`$${(data.totalRevenue / 100).toFixed(2)}`} 
          icon={DollarSign} 
          description="From publish fees & hire fees"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hires Over Time */}
        <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200">
          <h3 className="text-lg font-bold mb-6">Hiring Requests (Last 30 Days)</h3>
          <div className="h-[300px] w-full">
            {data.hiresOverTime && data.hiresOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.hiresOverTime}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="_id" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="currentColor" className="text-primary" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-base-content/50">
                No hiring data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Revenue By Category */}
        <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200">
          <h3 className="text-lg font-bold mb-6">Revenue By Legal Category</h3>
          <div className="h-[300px] w-full">
            {data.revenueByCategory && data.revenueByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.revenueByCategory}
                    dataKey="total"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                  >
                    {data.revenueByCategory.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: any) => `$${(Number(value) / 100).toFixed(2)}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-base-content/50">
                No revenue data available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
