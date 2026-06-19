import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({ title, value, icon: Icon, description, trend }: StatCardProps) {
  return (
    <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-base-content/50"}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "−"}
          </span>
        )}
      </div>
      <h3 className="text-base-content/70 text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-base-content/50 mt-2">{description}</p>
      )}
    </div>
  );
}
