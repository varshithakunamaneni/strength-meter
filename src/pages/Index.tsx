import { useState, useCallback } from "react";
import { Shield } from "lucide-react";
import PasswordChecker from "@/components/PasswordChecker";
import UsageStats from "@/components/UsageStats";
import SecurityInsights from "@/components/SecurityInsights";

const Index = () => {
  const [statsKey, setStatsKey] = useState(0);
  const refreshStats = useCallback(() => setStatsKey((k) => k + 1), []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Grid background effect */}
      <div className="fixed inset-0 bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono mb-6">
            <Shield className="w-3.5 h-3.5" />
            Security Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-mono text-foreground glow-text mb-3">
            Password Strength<br />Analyzer
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            A strong password is your first line of defense. Test yours instantly.
          </p>
        </div>

        <PasswordChecker onCheckLogged={refreshStats} />
        <UsageStats key={statsKey} />
        <SecurityInsights />
      </div>
    </div>
  );
};

export default Index;
