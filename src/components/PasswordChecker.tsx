import { useState, useMemo, useCallback, useRef } from "react";
import { Shield, Eye, EyeOff, Check, X, Copy, RefreshCw, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type StrengthLevel = "none" | "weak" | "moderate" | "strong" | "very-strong";

interface Criteria {
  label: string;
  met: boolean;
  suggestion: string;
}

function analyzePassword(password: string): {
  level: StrengthLevel;
  score: number;
  criteria: Criteria[];
} {
  if (!password) return { level: "none", score: 0, criteria: [] };

  const criteria: Criteria[] = [
    { label: "At least 8 characters", met: password.length >= 8, suggestion: "Make it at least 8 characters long" },
    { label: "Uppercase letter", met: /[A-Z]/.test(password), suggestion: "Add an uppercase letter (A-Z)" },
    { label: "Lowercase letter", met: /[a-z]/.test(password), suggestion: "Add a lowercase letter (a-z)" },
    { label: "Number", met: /[0-9]/.test(password), suggestion: "Include a number (0-9)" },
    { label: "Special character", met: /[^A-Za-z0-9]/.test(password), suggestion: "Use a special character (!@#$%)" },
  ];

  const score = criteria.filter((c) => c.met).length;
  const level: StrengthLevel =
    score <= 1 ? "weak" : score <= 2 ? "moderate" : score <= 3 ? "strong" : "very-strong";

  return { level, score, criteria };
}

function generateStrongPassword(length = 16): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const nums = "0123456789";
  const special = "!@#$%^&*_+-=";
  const all = upper + lower + nums + special;

  let pw = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    nums[Math.floor(Math.random() * nums.length)],
    special[Math.floor(Math.random() * special.length)],
  ];

  for (let i = pw.length; i < length; i++) {
    pw.push(all[Math.floor(Math.random() * all.length)]);
  }

  return pw.sort(() => Math.random() - 0.5).join("");
}

const strengthConfig: Record<Exclude<StrengthLevel, "none">, { label: string; colorClass: string }> = {
  weak: { label: "Weak", colorClass: "bg-strength-weak" },
  moderate: { label: "Moderate", colorClass: "bg-strength-moderate" },
  strong: { label: "Strong", colorClass: "bg-strength-strong" },
  "very-strong": { label: "Very Strong", colorClass: "bg-strength-very-strong" },
};

export default function PasswordChecker({ onCheckLogged }: { onCheckLogged?: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const lastLogged = useRef<string>("");

  const analysis = useMemo(() => analyzePassword(password), [password]);
  const config = analysis.level !== "none" ? strengthConfig[analysis.level] : null;
  const suggestions = analysis.criteria.filter((c) => !c.met);

  // Log strength anonymously (debounced, only when level changes)
  const logStrength = useCallback(async (level: string, score: number) => {
    if (level === "none" || level === lastLogged.current) return;
    lastLogged.current = level;
    await supabase.from("strength_checks" as any).insert({ strength_level: level, score } as any);
    onCheckLogged?.();
  }, [onCheckLogged]);

  const handleCopy = useCallback(async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  const handleGenerate = useCallback(() => {
    const pw = generateStrongPassword();
    setPassword(pw);
    setShowPassword(true);
  }, []);

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
            <p className="text-sm text-muted-foreground">Type to analyze strength in real time</p>
          </div>
        </div>

        {/* Input */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              const a = analyzePassword(e.target.value);
              logStrength(a.level, a.score);
            }}
            placeholder="Enter password..."
            className="w-full h-12 rounded-lg border border-border bg-secondary px-4 pr-12 text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleGenerate}
            className="flex-1 h-10 rounded-lg border border-border bg-secondary text-secondary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Generate
          </button>
          <button
            onClick={handleCopy}
            disabled={!password}
            className="flex-1 h-10 rounded-lg border border-border bg-secondary text-secondary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Live Results */}
        {password.length > 0 && config && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
            <div className="space-y-2 pt-1">
              {analysis.criteria.map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-sm">
                  {c.met ? (
                    <Check className="w-4 h-4 text-strength-very-strong shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-strength-weak shrink-0" />
                  )}
                  <span className={c.met ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
                </div>
              ))}
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary font-mono">Suggestions</span>
                </div>
                <ul className="space-y-1">
                  {suggestions.map((s) => (
                    <li key={s.label} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">›</span>
                      {s.suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
