import { motion } from "framer-motion";
import { C, useTheme } from "../lib/theme";

// ─── GLASS CARD ───────────────────────────────────────────────────────────────
export const GlassCard = ({ children, dark = true, style = {}, hover = false, onClick }) => {
  const t = useTheme(dark);
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: `0 12px 40px rgba(124,58,237,0.15)` } : undefined}
      onClick={onClick}
      style={{
        background: t.card,
        backdropFilter: "blur(20px)",
        border: `1px solid ${t.border}`,
        borderRadius: 16,
        padding: 20,
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

// ─── GLOW BUTTON ──────────────────────────────────────────────────────────────
export const GlowButton = ({ children, onClick, secondary = false, small = false, style = {}, dark = true, disabled = false }) => {
  const t = useTheme(dark);
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.03, boxShadow: secondary ? "none" : `0 8px 30px rgba(124,58,237,0.5)` }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={disabled ? undefined : onClick}
      style={{
        padding: small ? "8px 16px" : "12px 24px",
        borderRadius: 12,
        border: secondary ? `1px solid ${t.border}` : "none",
        background: secondary ? "transparent" : `linear-gradient(135deg, ${C.purple}, ${C.indigo})`,
        color: secondary ? t.textSecondary : "white",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: small ? 13 : 15,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s",
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, icon, color, change, dark }) => {
  const t = useTheme(dark);
  const isPositive = change && !change.startsWith("-");
  return (
    <GlassCard dark={dark} hover style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.05 }}>{icon}</div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}20`, border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          {icon}
        </div>
        {change && (
          <span style={{ fontSize: 12, fontWeight: 600, color: isPositive ? C.green : C.red, background: isPositive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", padding: "2px 8px", borderRadius: 20 }}>
            {change}
          </span>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: t.textPrimary, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: t.textSecondary }}>{label}</div>
    </GlassCard>
  );
};

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
export const ProgressBar = ({ value, color = C.purple, height = 6, animated = true }) => (
  <div style={{ width: "100%", height, borderRadius: height / 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
    <motion.div
      initial={animated ? { width: 0 } : undefined}
      animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ height: "100%", borderRadius: height / 2, background: color }}
    />
  </div>
);

// ─── RISK BADGE ───────────────────────────────────────────────────────────────
export const RiskBadge = ({ risk }) => {
  const map = {
    high:   { color: C.red,   bg: "rgba(239,68,68,0.15)",   label: "High Risk"  },
    medium: { color: C.amber, bg: "rgba(245,158,11,0.15)",  label: "Medium"     },
    low:    { color: C.green, bg: "rgba(16,185,129,0.15)",  label: "Low Risk"   },
  };
  const cfg = map[risk] || map.low;
  return (
    <span style={{ padding: "4px 10px", borderRadius: 20, background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 600 }}>
      {cfg.label}
    </span>
  );
};

// ─── CIRCULAR PROGRESS ────────────────────────────────────────────────────────
export const CircularProgress = ({ value, size = 80, color = C.purple, label, dark = true }) => {
  const t = useTheme(dark);
  const r = (size - 14) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ / 4}
          strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
        <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fill={t.textPrimary} fontSize={size / 5} fontWeight={700}>{value}</text>
      </svg>
      {label && <span style={{ fontSize: 12, color: t.textSecondary }}>{label}</span>}
    </div>
  );
};

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────
export const LoadingSkeleton = ({ height = 20, width = "100%", style = {} }) => (
  <div style={{
    height, width, borderRadius: 8,
    background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    ...style,
  }} />
);

// ─── TOGGLE ───────────────────────────────────────────────────────────────────
export const Toggle = ({ value, onChange }) => (
  <motion.div
    whileTap={{ scale: 0.95 }}
    onClick={onChange}
    style={{ width: 44, height: 24, borderRadius: 12, background: value ? C.purple : "rgba(255,255,255,0.1)", cursor: "pointer", position: "relative", transition: "background 0.2s" }}
  >
    <motion.div
      animate={{ x: value ? 22 : 2 }}
      transition={{ duration: 0.2 }}
      style={{ width: 20, height: 20, borderRadius: "50%", background: "white", position: "absolute", top: 2 }}
    />
  </motion.div>
);

// ─── EMOTION BADGE ────────────────────────────────────────────────────────────
export const EmotionBadge = ({ emotion }) => {
  const map = {
    "Anxious":         [C.amber,  "#F59E0B20"],
    "Sad":             [C.blue,   "#3B82F620"],
    "Stressed":        [C.red,    "#EF444420"],
    "Burnout":         [C.pink,   "#EC489920"],
    "Positive":        [C.green,  "#10B98120"],
    "Unfocused":       [C.indigo, "#4F46E520"],
    "Sleep-deprived":  [C.purple, "#7C3AED20"],
    "Academic Stress": [C.amber,  "#F59E0B20"],
    "Neutral":         ["#9CA3AF","rgba(156,163,175,0.1)"],
    "Welcoming":       [C.cyan,   "#06B6D420"],
    "Empathetic":      [C.purple, "#7C3AED20"],
    "Supportive":      [C.green,  "#10B98120"],
    "Worried":         [C.amber,  "#F59E0B20"],
  };
  const [fg, bg] = map[emotion] || map["Neutral"];
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, background: bg, color: fg, fontSize: 11, fontWeight: 600 }}>
      {emotion}
    </span>
  );
};

// ─── SAFE CHART WRAPPER ───────────────────────────────────────────────────────
export const SafeChart = ({ children, height = 200 }) => (
  <div style={{ width: "100%", height }}>
    {children}
  </div>
);
