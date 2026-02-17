import { useState, useMemo } from "react";
import { Shield, Eye, EyeOff, Check, X } from "lucide-react";

type StrengthLevel = "none" | "weak" | "moderate" | "strong" | "very-strong";

interface Criteria {
  label: string;
  met: boolean;
}

function analyzePassword(password: string): {
  level: StrengthLevel;
  score: number;
  criteria: Criteria[];
} {
  if (!password) return { level: "none", score: 0, criteria: [] };

  const criteria: Criteria[] = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = criteria.filter((c) => c.met).length;
  const level: StrengthLevel =
    score <= 1 ? "weak" : score <= 2 ? "moderate" : score <= 3 ? "strong" : "very-strong";

  return { level, score, criteria };
}

const strengthConfig: Record<Exclude<StrengthLevel, "none">, { label: string; colorClass: string }> = {
  weak: { label: "Weak", colorClass: "bg-strength-weak" },
  moderate: { label: "Moderate", colorClass: "bg-strength-moderate" },
  strong: { label: "Strong", colorClass: "bg-strength-strong" },
  "very-strong": { label: "Very Strong", colorClass: "bg-strength-very-strong" },
};

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);

  const analysis = useMemo(() => analyzePassword(password), [password]);
  const showResult = checked && password.length > 0;
  const config = analysis.level !== "none" ? strengthConfig[analysis.level] : null;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 glow-primary">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-mono text-foreground">Check Your Password</h2>
            <p className="text-sm text-muted-foreground">Enter a password to analyze its strength</p>
          </div>
        </div>

        {/* Input */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setChecked(false);
            }}
            placeholder="Enter password..."
            className="w-full h-12 rounded-lg border border-border bg-secondary px-4 pr-12 text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Button */}
        <button
          onClick={() => setChecked(true)}
          disabled={!password}
          className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Check Strength
        </button>

        {/* Results */}
        {showResult && config && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Label */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Strength</span>
              <span className={`text-sm font-semibold font-mono ${config.colorClass.replace("bg-", "text-")}`}>
                {config.label}
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${config.colorClass}`}
                style={{ width: `${(analysis.score / 5) * 100}%` }}
              />
            </div>

            {/* Criteria */}
            <div className="space-y-2 pt-2">
              {analysis.criteria.map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-sm">
                  {c.met ? (
                    <Check className="w-4 h-4 text-strength-very-strong" />
                  ) : (
                    <X className="w-4 h-4 text-strength-weak" />
                  )}
                  <span className={c.met ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
