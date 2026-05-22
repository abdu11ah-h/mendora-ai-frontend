import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { C, useTheme } from "../lib/theme";
import { GlassCard, StatCard, CircularProgress, ProgressBar, LoadingSkeleton } from "../components/ui";
import {
  moodData, productivityData,
  THREE_DAY_TREND, WEEKLY_REPORT_DATA,
} from "../data/mockData";

// ── Emotional Status Badge ─────────────────────────────────────────────────────
const BADGES = {
  thriving:   { label: "Thriving",     icon: "🌟", color: "#10B981", bg: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.4)"  },
  recovering: { label: "Recovering",   icon: "🌱", color: "#06B6D4", bg: "rgba(6,182,212,0.15)",   border: "rgba(6,182,212,0.4)"   },
  stressed:   { label: "Stressed",     icon: "⚡", color: "#F59E0B", bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.4)"  },
  burnout:    { label: "Burnout Risk", icon: "🔥", color: "#EF4444", bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.4)"   },
  neutral:    { label: "Steady",       icon: "😌", color: "#7C3AED", bg: "rgba(124,58,237,0.15)",  border: "rgba(124,58,237,0.4)"  },
};

const EmotionalStatusBadge = ({ mood = 78, stress = 42, energy = 74, dark, large = false }) => {
  const key =
    mood >= 75 && stress <= 40 ? "thriving" :
    stress >= 75 || (stress >= 65 && energy <= 35) ? "burnout" :
    stress >= 55 ? "stressed" :
    mood >= 60 ? "recovering" : "neutral";
  const badge = BADGES[key];
  return (
    <motion.div whileHover={{ scale: 1.04 }} animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 3, repeat: Infinity }}
      style={{ display: "inline-flex", alignItems: "center", gap: large ? 10 : 7, padding: large ? "10px 18px" : "6px 12px", borderRadius: 30, background: badge.bg, border: `1px solid ${badge.border}`, boxShadow: `0 0 20px ${badge.color}20` }}>
      <span style={{ fontSize: large ? 22 : 16 }}>{badge.icon}</span>
      <div>
        <div style={{ fontSize: large ? 14 : 11, fontWeight: 700, color: badge.color }}>{badge.label}</div>
        {large && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>Emotional status · updated now</div>}
      </div>
    </motion.div>
  );
};

// ── Trend Arrow ───────────────────────────────────────────────────────────────
const TrendArrow = ({ value, lowerIsBetter = false, label, unit = "%", dark }) => {
  const t = useTheme(dark);
  const improving = lowerIsBetter ? value < 0 : value > 0;
  const neutral   = value === 0;
  const color = neutral ? "#9CA3AF" : improving ? C.green : C.red;
  const arrow = neutral ? "→" : improving ? "↑" : "↓";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <motion.span animate={{ y: improving ? [0, -2, 0] : neutral ? 0 : [0, 2, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
        style={{ fontSize: 16, color, fontWeight: 800 }}>{arrow}</motion.span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color }}>{improving ? "+" : ""}{Math.abs(value)}{unit} vs 3 days ago</div>
        <div style={{ fontSize: 10, color: t.textMuted }}>{label}</div>
      </div>
    </div>
  );
};

// ── Burnout Alert ─────────────────────────────────────────────────────────────
const BurnoutAlert = ({ dark, onDismiss }) => {
  const t = useTheme(dark);
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} layout
      style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.35)", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: 24 }}>🔥</motion.span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.red }}>Burnout Risk Detected</div>
          <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 2 }}>Your stress has been elevated for 3+ days.</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => setExpanded(!expanded)}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.1)", color: C.red, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>
            {expanded ? "Less" : "What to do"}
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={onDismiss}
            style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#9CA3AF", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>✕</motion.button>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(239,68,68,0.2)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 10 }}>
              {[
                { icon: "😴", tip: "Prioritise 7-8h sleep tonight." },
                { icon: "🚶", tip: "Step away from screens for 30 min." },
                { icon: "🤖", tip: "Talk to the AI Companion." },
                { icon: "📵", tip: "No study after 9 PM today." },
              ].map((item, i) => (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 12, color: "#CBD5E1", lineHeight: 1.5 }}>{item.tip}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Hydration Widget ───────────────────────────────────────────────────────────
const HydrationWidget = ({ dark }) => {
  const [glasses, setGlasses] = useState(4);
  const t = useTheme(dark);
  return (
    <GlassCard dark={dark}>
      <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>💧 Hydration</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 12 }}>
        {Array(8).fill(0).map((_, i) => (
          <motion.div key={i} whileHover={{ scale: 1.1 }} onClick={() => setGlasses(i + 1)}
            style={{ height: 32, borderRadius: 8, cursor: "pointer", background: i < glasses ? `linear-gradient(135deg, ${C.cyan}, ${C.blue})` : "rgba(255,255,255,0.06)", border: `1px solid ${i < glasses ? C.cyan : t.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "all 0.2s" }}>
            {i < glasses ? "💧" : "○"}
          </motion.div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: t.textSecondary }}>{glasses}/8 glasses today</div>
      <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)" }}>
        <motion.div animate={{ width: `${(glasses / 8) * 100}%` }} transition={{ duration: 0.4 }}
          style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${C.cyan}, ${C.blue})` }} />
      </div>
    </GlassCard>
  );
};

// ── Pomodoro Widget ────────────────────────────────────────────────────────────
const PomodoroWidget = ({ dark }) => {
  const t = useTheme(dark);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [mode, setMode] = useState("focus");
  const modes = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(id);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const progress = 1 - seconds / modes[mode];

  return (
    <GlassCard dark={dark} style={{ textAlign: "center" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>🎯 Pomodoro Timer</div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16 }}>
        {Object.keys(modes).map(m => (
          <motion.button key={m} whileHover={{ scale: 1.05 }}
            onClick={() => { setMode(m); setSeconds(modes[m]); setRunning(false); }}
            style={{ padding: "4px 10px", borderRadius: 20, border: `1px solid ${mode === m ? C.purple : t.border}`, background: mode === m ? "rgba(124,58,237,0.2)" : "transparent", color: mode === m ? C.purpleLight : t.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
            {m === "focus" ? "Focus" : m === "short" ? "Short" : "Long"}
          </motion.button>
        ))}
      </div>
      <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 16px" }}>
        <svg width={100} height={100} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={50} cy={50} r={42} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
          <motion.circle cx={50} cy={50} r={42} fill="none" stroke={C.purple} strokeWidth={8}
            strokeDasharray={`${progress * 263.9} 263.9`} strokeLinecap="round" transition={{ duration: 0.5 }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: t.textPrimary }}>
          {mm}:{ss}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setRunning(!running)}
          style={{ padding: "8px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.purple}, ${C.indigo})`, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
          {running ? "⏸ Pause" : "▶ Start"}
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setSeconds(modes[mode]); setRunning(false); }}
          style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>↺</motion.button>
      </div>
    </GlassCard>
  );
};

// ── Weekly Report Modal ────────────────────────────────────────────────────────
const WeeklyReportModal = ({ dark, onClose }) => {
  const t = useTheme(dark);
  const r = WEEKLY_REPORT_DATA;
  const scoreDiff = r.overallScore - r.previousScore;

  const downloadReport = () => {
    const lines = [
      "MENDORA AI — WEEKLY WELLNESS REPORT",
      `Week: ${r.week}`,
      "─".repeat(40),
      `Overall Score: ${r.overallScore}% (${scoreDiff > 0 ? "+" : ""}${scoreDiff}% vs last week)`,
      "",
      "METRICS",
      ...r.metrics.map(m => {
        const diff = m.value - m.prev;
        const improving = m.lowerIsBetter ? diff < 0 : diff > 0;
        return `  ${m.icon} ${m.label}: ${m.value}${m.unit} (${improving ? "↑" : "↓"} ${Math.abs(diff).toFixed(1)}${m.unit})`;
      }),
      "",
      `TOP INSIGHT\n  ${r.topInsight}`,
      "",
      `NEXT WEEK\n  ${r.recommendation}`,
      "",
      `BADGES: ${r.badges.join("  ")}`,
      "",
      `Generated by Mendora AI • ${new Date().toLocaleString()}`,
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "mendora-wellness-report.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.65 }} exit={{ opacity: 0 }}
        onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000", zIndex: 900 }} />
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
        style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 901, width: "min(600px,92vw)", maxHeight: "88vh", overflowY: "auto", background: dark ? "#0d0d1a" : "#fff", border: `1px solid rgba(124,58,237,0.4)`, borderRadius: 22, padding: 28, boxShadow: "0 0 80px rgba(124,58,237,0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: t.textPrimary }}>📋 Weekly Wellness Report</div>
            <div style={{ fontSize: 13, color: t.textSecondary }}>{r.week}</div>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} onClick={onClose}
            style={{ background: "transparent", border: `1px solid ${t.border}`, color: t.textSecondary, width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>✕</motion.button>
        </div>

        {/* Score */}
        <div style={{ padding: 20, borderRadius: 16, background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))", border: "1px solid rgba(124,58,237,0.3)", marginBottom: 20, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: t.textPrimary }}>{r.overallScore}</div>
            <div style={{ fontSize: 12, color: t.textSecondary }}>Wellness Score</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.green, marginBottom: 4 }}>↑ +{scoreDiff}% vs last week</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {r.badges.map(b => <span key={b} style={{ padding: "4px 10px", borderRadius: 20, background: "rgba(124,58,237,0.2)", color: C.purpleLight, fontSize: 12 }}>{b}</span>)}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {r.metrics.map(m => {
            const diff = m.value - m.prev;
            const improving = m.lowerIsBetter ? diff < 0 : diff > 0;
            return (
              <motion.div key={m.label} whileHover={{ scale: 1.02 }}
                style={{ padding: "12px 14px", borderRadius: 12, background: `${m.color}10`, border: `1px solid ${m.color}25` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: t.textSecondary }}>{m.icon} {m.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: improving ? C.green : C.red }}>
                    {improving ? "↑" : "↓"} {Math.abs(diff).toFixed(1)}{m.unit}
                  </span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: m.color }}>{m.value}{m.unit}</div>
                <ProgressBar value={m.value} color={m.color} height={3} />
              </motion.div>
            );
          })}
        </div>

        <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)", marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.purpleLight, marginBottom: 6 }}>💡 Top Insight</div>
          <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.7 }}>{r.topInsight}</div>
        </div>
        <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.green, marginBottom: 6 }}>🎯 Next Week's Focus</div>
          <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.7 }}>{r.recommendation}</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={downloadReport}
            style={{ flex: 1, padding: 13, borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${C.purple}, ${C.indigo})`, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}>
            ⬇ Download Report
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} onClick={onClose}
            style={{ padding: "13px 20px", borderRadius: 12, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
            Close
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

// ─── DASHBOARD PAGE ────────────────────────────────────────────────────────────
const DashboardPage = ({ setPage, dark }) => {
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showBurnout, setShowBurnout] = useState(true);
  const t = useTheme(dark);

  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);

  const TREND_MOOD   = THREE_DAY_TREND[2].mood   - THREE_DAY_TREND[0].mood;
  const TREND_STRESS = THREE_DAY_TREND[2].stress - THREE_DAY_TREND[0].stress;
  const TREND_ENERGY = THREE_DAY_TREND[2].energy - THREE_DAY_TREND[0].energy;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <AnimatePresence>
        {showReport && <WeeklyReportModal dark={dark} onClose={() => setShowReport(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showBurnout && <BurnoutAlert dark={dark} onDismiss={() => setShowBurnout(false)} />}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: t.textPrimary }}>Good morning, Sara ✨</div>
          <div style={{ color: t.textSecondary, marginTop: 4, marginBottom: 10 }}>Your wellness score is looking good today.</div>
          <EmotionalStatusBadge mood={78} stress={42} energy={74} dark={dark} large />
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 16, padding: "10px 16px", borderRadius: 14, background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${t.border}` }}>
            <TrendArrow value={TREND_MOOD}   label="Mood"   dark={dark} />
            <TrendArrow value={TREND_STRESS} label="Stress" dark={dark} lowerIsBetter />
            <TrendArrow value={TREND_ENERGY} label="Energy" dark={dark} />
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setShowReport(true)}
            style={{ padding: "10px 18px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${C.purple}, ${C.indigo})`, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700, boxShadow: "0 4px 20px rgba(124,58,237,0.35)", fontFamily: "inherit" }}>
            📋 Weekly Report
          </motion.button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
        {loading
          ? Array(4).fill(0).map((_, i) => <LoadingSkeleton key={i} height={120} style={{ borderRadius: 16 }} />)
          : <>
              <StatCard dark={dark} label="Wellness Score" value="78"   change="+5%"  icon="💚" color={C.green} />
              <StatCard dark={dark} label="Stress Level"   value="42%"  change="-8%"  icon="⚡" color={C.amber} />
              <StatCard dark={dark} label="Sleep Quality"  value="7.5h" change="+0.5h"icon="🌙" color={C.indigo} />
              <StatCard dark={dark} label="Focus Time"     value="4.2h" change="+12%" icon="🎯" color={C.cyan} />
            </>
        }
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <GlassCard dark={dark}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>Weekly Mood & Stress Trends</div>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <AreaChart data={moodData}>
                <defs>
                  <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.purple} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={C.purple} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.red} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={C.red} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.textPrimary }} />
                <Area type="monotone" dataKey="mood"   stroke={C.purple} fill="url(#moodGrad)"   strokeWidth={2} dot={false} name="Mood" />
                <Area type="monotone" dataKey="stress" stroke={C.red}    fill="url(#stressGrad)" strokeWidth={2} dot={false} name="Stress" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard dark={dark} style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary }}>Wellness Overview</div>
          <div style={{ display: "flex", gap: 20 }}>
            <CircularProgress dark={dark} value={78} color={C.green}  label="Overall" />
            <CircularProgress dark={dark} value={42} color={C.amber}  label="Burnout Risk" />
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <CircularProgress dark={dark} value={85} size={60} color={C.cyan}  label="Focus" />
            <CircularProgress dark={dark} value={71} size={60} color={C.pink}  label="Social" />
          </div>
        </GlassCard>
      </div>

      {/* Widgets row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 16 }}>
        <HydrationWidget dark={dark} />
        <PomodoroWidget dark={dark} />

        <GlassCard dark={dark}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>📈 Focus Sessions</div>
          <div style={{ width: "100%", height: 120 }}>
            <ResponsiveContainer>
              <BarChart data={productivityData}>
                <XAxis dataKey="day" tick={{ fill: t.textSecondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.textPrimary }} />
                <Bar dataKey="focus" fill={C.indigo} radius={[4, 4, 0, 0]} name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard dark={dark}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>⚡ Quick Actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Log Today's Mood", icon: "💭", action: "mood" },
              { label: "Talk to AI",        icon: "🤖", action: "chat" },
              { label: "Start Calm",        icon: "🕊️", action: "calm" },
              { label: "Focus Zone",        icon: "🎯", action: "focus" },
            ].map(item => (
              <motion.button key={item.label} whileHover={{ x: 4 }} onClick={() => setPage(item.action)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, cursor: "pointer", fontSize: 12, textAlign: "left", fontFamily: "inherit" }}>
                <span>{item.icon}</span> {item.label}
              </motion.button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <GlassCard dark={dark} style={{ background: dark ? "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))" : "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>✨ Daily Motivation</div>
          <div style={{ fontSize: 15, color: t.textSecondary, lineHeight: 1.7, fontStyle: "italic" }}>
            "Progress is not linear. Every step forward, no matter how small, is still progress. You're doing better than you think."
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <div style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(124,58,237,0.2)", color: C.purpleLight, fontSize: 11 }}>Resilience</div>
            <div style={{ padding: "5px 12px", borderRadius: 20, background: "rgba(6,182,212,0.2)", color: C.cyanLight, fontSize: 11 }}>Growth</div>
          </div>
        </GlassCard>

        <GlassCard dark={dark}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>🧠 AI Recommendations</div>
          {["Try box breathing: 4s in, 4s hold, 4s out", "Take a 10-min walk between sessions", "Write in your journal before sleeping", "Low hydration detected — drink water 💧"].map((tip, i) => (
            <motion.div key={tip} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              style={{ padding: "8px 0", borderBottom: i < 3 ? `1px solid ${t.border}` : "none", fontSize: 12, color: t.textSecondary, display: "flex", gap: 8 }}>
              <span style={{ color: C.purple }}>→</span> {tip}
            </motion.div>
          ))}
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
