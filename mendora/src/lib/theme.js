// ─── MENDORA DESIGN TOKENS ────────────────────────────────────────────────────
export const C = {
  purple: "#7C3AED", purpleLight: "#A78BFA", purpleDark: "#5B21B6",
  indigo: "#4F46E5", indigoLight: "#818CF8",
  cyan: "#06B6D4", cyanLight: "#67E8F9",
  blue: "#3B82F6", blueLight: "#93C5FD",
  pink: "#EC4899", green: "#10B981", amber: "#F59E0B", red: "#EF4444",
  bgDark: "#0A0A14", bgLight: "#F0F0FA",
  cardDark: "rgba(255,255,255,0.04)", cardLight: "rgba(255,255,255,0.85)",
  borderDark: "rgba(255,255,255,0.08)", borderLight: "rgba(100,100,180,0.15)",
  textPrimaryDark: "#F1F0FF", textPrimaryLight: "#1a1a2e",
  textSecondaryDark: "#9CA3AF", textSecondaryLight: "#5a5a8a",
  textMutedDark: "#6B7280", textMutedLight: "#8888aa",
};

export const useTheme = (dark) => ({
  bg: dark ? C.bgDark : C.bgLight,
  card: dark ? C.cardDark : C.cardLight,
  border: dark ? C.borderDark : C.borderLight,
  textPrimary: dark ? C.textPrimaryDark : C.textPrimaryLight,
  textSecondary: dark ? C.textSecondaryDark : C.textSecondaryLight,
  textMuted: dark ? C.textMutedDark : C.textMutedLight,
  sidebar: dark ? "rgba(10,10,20,0.97)" : "rgba(240,240,250,0.97)",
  topbar: dark ? "rgba(10,10,20,0.85)" : "rgba(240,240,250,0.85)",
  inputBg: dark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.7)",
  tooltipBg: dark ? "#1a1a2e" : "#ffffff",
});

// Role config used across login + sidebar routing
export const ROLES = {
  student: {
    id: "student",
    label: "Student / User",
    icon: "🎓",
    color: C.purple,
    gradient: `linear-gradient(135deg, ${C.purple}, ${C.indigo})`,
    description: "Track your mood, talk to AI, and manage your wellness journey.",
    defaultPage: "dashboard",
  },
  counselor: {
    id: "counselor",
    label: "Counselor",
    icon: "👨‍⚕️",
    color: C.cyan,
    gradient: `linear-gradient(135deg, ${C.cyan}, ${C.blue})`,
    description: "Monitor student wellness, manage sessions, and view risk alerts.",
    defaultPage: "counselor",
  },
  admin: {
    id: "admin",
    label: "Admin",
    icon: "⚙️",
    color: C.pink,
    gradient: `linear-gradient(135deg, ${C.pink}, ${C.red})`,
    description: "Full platform control — users, analytics, system configuration.",
    defaultPage: "admin",
  },
};
