import { ShieldAlert, KeyRound, BookOpen } from "lucide-react";

const sections = [
  {
    icon: ShieldAlert,
    title: "Why Strong Passwords Matter",
    points: [
      "Weak passwords are the #1 cause of data breaches",
      "Hackers can crack simple passwords in seconds",
      "A strong password protects your identity and finances",
    ],
  },
  {
    icon: KeyRound,
    title: "Common Password Mistakes",
    points: [
      'Using "123456", "password", or your name',
      "Reusing the same password across sites",
      "Using short passwords under 8 characters",
    ],
  },
  {
    icon: BookOpen,
    title: "Tips for Secure Passwords",
    points: [
      "Use 12+ characters mixing letters, numbers & symbols",
      "Use a unique password for every account",
      "Consider a password manager for storage",
    ],
  },
];

export default function SecurityInsights() {
  return (
    <section className="w-full max-w-md mx-auto mt-8">
      <h3 className="text-sm font-mono font-semibold text-muted-foreground mb-4 text-center tracking-wider uppercase">
        Security Insights
      </h3>
      <div className="space-y-3">
        {sections.map((s) => (
          <div
            key={s.title}
            className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-1.5 rounded-md bg-primary/10">
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
            </div>
            <ul className="space-y-1.5">
              {s.points.map((p) => (
                <li key={p} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-px">•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
