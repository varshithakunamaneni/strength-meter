import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3 } from "lucide-react";

interface Stats {
  total: number;
  weak: number;
  moderate: number;
  strong: number;
  veryStrong: number;
}

export default function UsageStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const { data, error } = await supabase
      .from("strength_checks" as any)
      .select("strength_level");

    if (error || !data) return;

    const rows = data as unknown as { strength_level: string }[];
    const total = rows.length;
    if (total === 0) return;

    setStats({
      total,
      weak: rows.filter((r) => r.strength_level === "weak").length,
      moderate: rows.filter((r) => r.strength_level === "moderate").length,
      strong: rows.filter((r) => r.strength_level === "strong").length,
      veryStrong: rows.filter((r) => r.strength_level === "very-strong").length,
    });
  }

  if (!stats || stats.total === 0) return null;

  const bars = [
    { label: "Weak", count: stats.weak, colorClass: "bg-strength-weak" },
    { label: "Moderate", count: stats.moderate, colorClass: "bg-strength-moderate" },
    { label: "Strong", count: stats.strong, colorClass: "bg-strength-strong" },
    { label: "Very Strong", count: stats.veryStrong, colorClass: "bg-strength-very-strong" },
  ];

  return (
    <section className="w-full max-w-md mx-auto mt-6">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold font-mono text-foreground">
            Community Stats
          </h4>
          <span className="ml-auto text-xs text-muted-foreground">
            {stats.total} checks
          </span>
        </div>
        <div className="space-y-2.5">
          {bars.map((b) => {
            const pct = Math.round((b.count / stats.total) * 100);
            return (
              <div key={b.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{b.label}</span>
                  <span className="text-foreground font-mono">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${b.colorClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
