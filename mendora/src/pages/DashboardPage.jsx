import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { C, useTheme } from "../lib/theme";
import { GlassCard, StatCard, CircularProgress, ProgressBar, LoadingSkeleton } from "../components/ui";
import { wellnessAPI, focusAPI, chatAPI, getUser } from "../lib/api";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const BADGES = {
  thriving:   { label: "Thriving",     icon: "🌟", color: "#10B981", bg: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.4)"  },
  recovering: { label: "Recovering",   icon: "🌱", color: "#06B6D4", bg: "rgba(6,182,212,0.15)",   border: "rgba(6,182,212,0.4)"   },
  stressed:   { label: "Stressed",     icon: "⚡", color: "#F59E0B", bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.4)"  },
  burnout:    { label: "Burnout Risk", icon: "🔥", color: "#EF4444", bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.4)"   },
  neutral:    { label: "Steady",       icon: "😐", color: "#7C3AED", bg: "rgba(124,58,237,0.15)",  border: "rgba(124,58,237,0.4)"  },
};

const EmotionalStatusBadge = ({ mood = 50, stress = 50, energy = 50, dark, large = false }) => {
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
      <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>⏱ Pomodoro Timer</div>
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

// ── DASHBOARD PAGE ──
const DashboardPage = ({ setPage, dark }) => {
  const [loading, setLoading]       = useState(true);
  const [stats, setStats]           = useState(null);
  const [moodChart, setMoodChart]   = useState([]);
  const [focusStats, setFocusStats] = useState(null);
  const [chatCount, setChatCount]   = useState(0);
  const t = useTheme(dark);
  const user = getUser();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [moodStats, chart, focus, sessions] = await Promise.allSettled([
          wellnessAPI.getMoodStats(),
          wellnessAPI.getMoodChart(),
          focusAPI.getStats(),
          chatAPI.getSessions(),
        ]);
        if (moodStats.status === "fulfilled") setStats(moodStats.value);
        if (chart.status === "fulfilled") setMoodChart(chart.value || []);
        if (focus.status === "fulfilled") setFocusStats(focus.value);
        if (sessions.status === "fulfilled") setChatCount((sessions.value || []).length);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const moodScore   = stats?.avg_mood_score || 0;
  const stressLevel = stats?.avg_stress || 0;
  const sleepHours  = stats?.avg_sleep || 0;
  const focusHours  = focusStats?.total_hours || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: t.textPrimary }}>
            {greeting()}, {user?.first_name || "there"} ✨
          </div>
          <div style={{ color: t.textSecondary, marginTop: 4, marginBottom: 10 }}>
            Your personal wellness dashboard — log mood daily for live stats.
          </div>
          <EmotionalStatusBadge mood={moodScore} stress={stressLevel} energy={50} dark={dark} large />
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
        {loading
          ? Array(4).fill(0).map((_, i) => <LoadingSkeleton key={i} height={120} style={{ borderRadius: 16 }} />)
          : <>
              <StatCard dark={dark} label="Mood Score"    value={moodScore ? Math.round(moodScore) : "—"}   icon="💜" color={C.green}  />
              <StatCard dark={dark} label="Avg Stress"    value={stressLevel ? `${Math.round(stressLevel)}%` : "—"} icon="⚡" color={C.amber}  />
              <StatCard dark={dark} label="Avg Sleep"     value={sleepHours ? `${sleepHours.toFixed(1)}h` : "—"} icon="🌙" color={C.indigo} />
              <StatCard dark={dark} label="Focus Hours"   value={focusHours ? `${focusHours}h` : "—"}       icon="⏱" color={C.cyan}   />
            </>
        }
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <GlassCard dark={dark}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>Weekly Mood & Stress Trends</div>
          {moodChart.length === 0 ? (
            <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: t.textMuted, fontSize: 13 }}>
              Log your mood daily to see trends here 💜
            </div>
          ) : (
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <AreaChart data={moodChart}>
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
                  <XAxis dataKey="date" tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.textPrimary }} />
                  <Area type="monotone" dataKey="mood_score" stroke={C.purple} fill="url(#moodGrad)" strokeWidth={2} dot={false} name="Mood" />
                  <Area type="monotone" dataKey="stress"     stroke={C.red}    fill="url(#stressGrad)" strokeWidth={2} dot={false} name="Stress" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        <GlassCard dark={dark} style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary }}>Wellness Overview</div>
          <div style={{ display: "flex", gap: 20 }}>
            <CircularProgress dark={dark} value={moodScore || 0} color={C.green}  label="Mood" />
            <CircularProgress dark={dark} value={stressLevel || 0} color={C.amber} label="Stress" />
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <CircularProgress dark={dark} value={Math.min((sleepHours / 8) * 100, 100) || 0} size={60} color={C.cyan}  label="Sleep" />
            <CircularProgress dark={dark} value={Math.min(focusHours * 10, 100) || 0} size={60} color={C.purple} label="Focus" />
          </div>
        </GlassCard>
      </div>

      {/* Widgets row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 16 }}>
        <HydrationWidget dark={dark} />
        <PomodoroWidget dark={dark} />

        <GlassCard dark={dark}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>📊 Your Stats</div>
          {[
            { label: "Mood Logs (7 days)", value: stats?.count || 0 },
            { label: "Chat Sessions", value: chatCount },
            { label: "Focus Sessions", value: focusStats?.total_sessions || 0 },
            { label: "Focus Completions", value: focusStats?.completions || 0 },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontSize: 12, color: t.textSecondary }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.textPrimary }}>{s.value}</span>
            </div>
          ))}
        </GlassCard>

        <GlassCard dark={dark}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>⚡ Quick Actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Log Today's Mood", icon: "💡", action: "mood" },
              { label: "Talk to AI",        icon: "💛", action: "chat" },
              { label: "Start Calm",        icon: "🌈", action: "calm" },
              { label: "Focus Zone",        icon: "⏱", action: "focus" },
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
        </GlassCard>

        <GlassCard dark={dark}>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>🧠 AI Recommendations</div>
          {stats?.count === 0 || !stats ? (
            <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
              Log your mood daily to get personalized AI recommendations based on your real data 💜
            </div>
          ) : [
            "Try box breathing: 4s in, 4s hold, 4s out",
            "Take a 10-min walk between sessions",
            "Write in your journal before sleeping",
            stressLevel > 60 ? "Your stress is high — talk to the AI companion" : "Keep up the great wellness habits!",
          ].map((tip, i) => (
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
