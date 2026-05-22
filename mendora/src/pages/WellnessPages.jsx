import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { C, useTheme } from "../lib/theme";
import { GlassCard, StatCard, GlowButton, ProgressBar, EmotionBadge } from "../components/ui";
import {
  moodData, weeklyWellness, burnoutData, productivityData,
  wellnessPieData, pieColors, moods, moodHistory,
} from "../data/mockData";

// ─── MOOD PAGE ────────────────────────────────────────────────────────────────
export const MoodPage = ({ dark }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [stress, setStress]   = useState(42);
  const [sleep, setSleep]     = useState(7);
  const [energy, setEnergy]   = useState(68);
  const [journal, setJournal] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const t = useTheme(dark);

  const handleSubmit = () => {
    if (!selectedMood && !journal.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setJournal("");
    setSelectedMood(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Mood selector */}
        <GlassCard dark={dark}>
          <div style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary, marginBottom: 20 }}>How are you feeling today?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {moods.map(m => (
              <motion.button key={m.value} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMood(m.value)}
                style={{ padding: "14px 8px", borderRadius: 12, border: `1px solid ${selectedMood === m.value ? m.color : t.border}`, background: selectedMood === m.value ? `${m.color}20` : "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, boxShadow: selectedMood === m.value ? `0 0 20px ${m.color}40` : "none", fontFamily: "inherit" }}>
                <span style={{ fontSize: 28 }}>{m.emoji}</span>
                <span style={{ fontSize: 11, color: selectedMood === m.value ? m.color : t.textSecondary }}>{m.label}</span>
              </motion.button>
            ))}
          </div>
        </GlassCard>

        {/* Sliders */}
        <GlassCard dark={dark}>
          <div style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary, marginBottom: 20 }}>Daily Metrics</div>
          {[
            { label: "Stress Level", value: stress, set: setStress, color: C.red,    icon: "⚡" },
            { label: "Sleep Hours",  value: sleep,  set: setSleep,  color: C.indigo, icon: "🌙", max: 12 },
            { label: "Energy Level", value: energy, set: setEnergy, color: C.amber,  icon: "☀️" },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: t.textSecondary }}>{item.icon} {item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.value}{item.max ? "h" : "%"}</span>
              </div>
              <input type="range" min={0} max={item.max || 100} value={item.value} onChange={e => item.set(Number(e.target.value))}
                style={{ width: "100%", accentColor: item.color, cursor: "pointer" }} />
            </div>
          ))}
        </GlassCard>

        {/* Journal */}
        <GlassCard dark={dark} style={{ gridColumn: "1 / -1" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>📝 Daily Journal</div>
          <textarea value={journal} onChange={e => setJournal(e.target.value)}
            placeholder="Write about your day, thoughts, or anything on your mind..."
            rows={4}
            style={{ width: "100%", padding: 14, borderRadius: 10, border: `1px solid ${t.border}`, background: t.inputBg, color: t.textPrimary, fontSize: 14, outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box", fontFamily: "inherit" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <span style={{ fontSize: 12, color: t.textMuted }}>{journal.length} characters</span>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(16,185,129,0.2)", border: `1px solid ${C.green}`, color: C.green, fontSize: 14 }}>
                  ✓ Mood logged successfully!
                </motion.div>
              ) : (
                <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <GlowButton dark={dark} onClick={handleSubmit} small>Log Mood ↗</GlowButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </div>

      {/* Timeline */}
      <GlassCard dark={dark} style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary, marginBottom: 20 }}>📅 Emotional History Timeline</div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, ${C.purple}, ${C.cyan})`, borderRadius: 1 }} />
          {moodHistory.map((entry, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              style={{ display: "flex", gap: 20, marginBottom: 20, paddingLeft: 48, position: "relative" }}>
              <div style={{ position: "absolute", left: 10, width: 20, height: 20, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, border: `2px solid ${dark ? C.bgDark : C.bgLight}` }}>
                {entry.emoji}
              </div>
              <GlassCard dark={dark} style={{ flex: 1, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary }}>{entry.date}</span>
                  <EmotionBadge emotion={entry.mood} />
                </div>
                <div style={{ fontSize: 13, color: t.textSecondary }}>{entry.note}</div>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: t.textMuted }}>Stress:</span>
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)" }}>
                    <div style={{ width: `${entry.stress}%`, height: "100%", borderRadius: 2, background: entry.stress > 60 ? C.red : entry.stress > 40 ? C.amber : C.green }} />
                  </div>
                  <span style={{ fontSize: 11, color: t.textSecondary }}>{entry.stress}%</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Mood chart */}
      <GlassCard dark={dark}>
        <div style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>Weekly Emotional Chart</div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.textPrimary }} />
            <Line type="monotone" dataKey="mood"   stroke={C.purple} strokeWidth={2} dot={{ fill: C.purple, r: 4 }} name="Mood" />
            <Line type="monotone" dataKey="energy" stroke={C.cyan}   strokeWidth={2} dot={{ fill: C.cyan, r: 4 }}   name="Energy" />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>
    </motion.div>
  );
};

// ─── ANALYTICS PAGE ────────────────────────────────────────────────────────────
export const AnalyticsPage = ({ dark }) => {
  const t = useTheme(dark);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 16 }}>
        {[
          { label: "AI Wellness Score", value: "78/100", icon: "💎", color: C.purple },
          { label: "Burnout Risk",       value: "24%",    icon: "🔥", color: C.amber  },
          { label: "Productivity",       value: "82%",    icon: "⚡", color: C.cyan   },
          { label: "Emotional Balance",  value: "71%",    icon: "⚖️", color: C.green  },
        ].map(card => <StatCard dark={dark} key={card.label} {...card} />)}
      </div>

      {/* AI Insight banner */}
      <GlassCard dark={dark} style={{ marginBottom: 16, background: dark ? "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.1))" : "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(79,70,229,0.05))" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🧠</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary, marginBottom: 6 }}>AI Daily Insight — May 22, 2026</div>
            <div style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.7 }}>
              Your mood trend improved by <span style={{ color: C.green, fontWeight: 600 }}>+8%</span> this week. Stress peaked on Tuesday but recovered well. The nights you slept 7.5h+ showed significantly higher mood the next day. <span style={{ color: C.purpleLight, fontWeight: 500 }}>Protect your sleep schedule this week.</span>
            </div>
          </div>
        </div>
      </GlassCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <GlassCard dark={dark}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>8-Week Wellness Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyWellness}>
              <defs>
                <linearGradient id="wellGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.cyan} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} domain={[50, 100]} />
              <Tooltip contentStyle={{ background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.textPrimary }} />
              <Area type="monotone" dataKey="score" stroke={C.cyan} fill="url(#wellGrad)" strokeWidth={2.5} dot={{ fill: C.cyan, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard dark={dark}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>Burnout Risk Radar</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={burnoutData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: t.textSecondary, fontSize: 11 }} />
              <Radar name="Risk" dataKey="value" stroke={C.red} fill={C.red} fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard dark={dark}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>Sleep vs Stress Analysis</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.textPrimary }} />
              <Bar dataKey="sleep"  fill={C.indigo} radius={[4, 4, 0, 0]} name="Sleep (h)" />
              <Bar dataKey="stress" fill={C.red}    radius={[4, 4, 0, 0]} name="Stress %" opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard dark={dark} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>Campus Wellness Distribution</div>
          <PieChart width={200} height={180}>
            <Pie data={wellnessPieData} cx={100} cy={90} innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
              {wellnessPieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.textPrimary }} />
          </PieChart>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {wellnessPieData.map((d, i) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: pieColors[i] }} />
                <span style={{ fontSize: 11, color: t.textSecondary }}>{d.name} {d.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

// ─── CALM PAGE ────────────────────────────────────────────────────────────────
const CALM_PHASES = {
  inhale:  { label: "Breathe In",  dur: 4, next: "hold"   },
  hold:    { label: "Hold",        dur: 4, next: "exhale"  },
  exhale:  { label: "Breathe Out", dur: 6, next: "inhale"  },
};

export const CalmPage = ({ dark }) => {
  const [phase, setPhase]   = useState("inhale");
  const [active, setActive] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const t = useTheme(dark);

  // Breathing cycle effect
  
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => setPhase(CALM_PHASES[phase].next), CALM_PHASES[phase].dur * 1000);
    return () => clearTimeout(timer);
  }, [phase, active]);

  const phaseColor = { inhale: C.cyan, hold: C.purple, exhale: C.green }[phase];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: t.textPrimary, marginBottom: 8 }}>🕊️ Emergency Calm Mode</div>
        <div style={{ color: t.textSecondary }}>Take a moment. You are safe. Let's breathe together.</div>
      </div>

      {/* Breathing orb */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {active && [1, 2, 3].map(i => (
          <motion.div key={i}
            animate={{ scale: [1, 1.4 + i * 0.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: (CALM_PHASES[phase].dur), repeat: Infinity, delay: i * 0.3 }}
            style={{ position: "absolute", width: 200 + i * 40, height: 200 + i * 40, borderRadius: "50%", border: `1px solid ${phaseColor}40`, pointerEvents: "none" }}
          />
        ))}
        <motion.div
          animate={active ? {
            scale: phase === "inhale" ? [1, 1.4] : phase === "hold" ? 1.4 : [1.4, 1],
            boxShadow: [`0 0 40px ${phaseColor}40`, `0 0 80px ${phaseColor}60`],
          } : { scale: 1 }}
          transition={{ duration: CALM_PHASES[phase].dur, ease: "easeInOut" }}
          style={{ width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${phaseColor}30, ${phaseColor}10)`, border: `2px solid ${phaseColor}60`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 1 }}
          onClick={() => setActive(!active)}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>{active ? (phase === "inhale" ? "🌬️" : phase === "hold" ? "⏸️" : "😮‍💨") : "▶"}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary }}>
            {active ? CALM_PHASES[phase].label : "Tap to Start"}
          </div>
          {active && <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 4 }}>{CALM_PHASES[phase].dur}s</div>}
        </motion.div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, position: "relative", zIndex: 10 }}>
        <GlowButton dark={dark} onClick={() => setActive(!active)} style={{ minWidth: 140, justifyContent: "center" }}>
          {active ? "⏸ Pause" : "▶ Start Breathing"}
        </GlowButton>
        <GlowButton dark={dark} secondary onClick={() => { setActive(false); setPhase("inhale"); }}>Reset</GlowButton>
      </div>

      {/* Calm techniques grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, maxWidth: 800, width: "100%" }}>
        {[
          { icon: "🧘", title: "Body Scan", desc: "Close your eyes. Slowly notice each part of your body, releasing tension as you go." },
          { icon: "🌊", title: "5-4-3-2-1 Grounding", desc: "5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste." },
          { icon: "📖", title: "Gratitude Pause", desc: "Name 3 things you're grateful for right now, no matter how small." },
          { icon: "💧", title: "Cold Water Reset", desc: "Splash cold water on your wrists or face to activate the vagal nerve." },
        ].map(tip => (
          <GlassCard key={tip.title} dark={dark} hover>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{tip.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 6 }}>{tip.title}</div>
            <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.6 }}>{tip.desc}</div>
          </GlassCard>
        ))}
      </div>

      {/* Emergency support */}
      <GlassCard dark={dark} style={{ maxWidth: 500, width: "100%", textAlign: "center", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary, marginBottom: 8 }}>🆘 Need Immediate Help?</div>
        <div style={{ fontSize: 13, color: t.textSecondary, marginBottom: 12 }}>Umang Helpline — <strong style={{ color: C.red }}>0311-7786264</strong> • Available 24/7</div>
        <GlowButton dark={dark} small onClick={() => setSosOpen(true)}>Open Crisis Support</GlowButton>
      </GlassCard>
    </motion.div>
  );
};

// ─── FOCUS PAGE ───────────────────────────────────────────────────────────────
const FOCUS_TIPS = [
  { icon: "🍅", title: "Pomodoro Technique",  desc: "25 minutes focused work + 5 minute break. After 4 cycles, take a longer 20-30 min break." },
  { icon: "📵", title: "Phone-Free Sessions", desc: "Place your phone in another room during focus blocks. Out of sight reduces urge by 60%." },
  { icon: "🎧", title: "Brown Noise",         desc: "Background brown noise masks distractions and promotes deep focus — better than silence for many." },
  { icon: "✍️", title: "Task Batching",       desc: "Group similar tasks together. Context-switching costs up to 40% of productive time." },
  { icon: "🌿", title: "Nature Micro-breaks", desc: "Even a 2-minute view of nature (window, plant) restores attention faster than scrolling." },
  { icon: "🧠", title: "Peak Hour Mapping",   desc: "Identify your 2-3 hour daily peak and protect it for your hardest cognitive work." },
];

export const FocusPage = ({ dark }) => {
  const t = useTheme(dark);
  const [running, setRunning]     = useState(false);
  const [seconds, setSeconds]     = useState(25 * 60);
  const [mode, setMode]           = useState("focus");
  const [sessions, setSessions]   = useState(0);
  const [distractions, setDistractions] = useState(0);
  const modes = { focus: 25 * 60, short: 5 * 60, long: 20 * 60 };

  
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => {
      if (s <= 1) { setSessions(n => n + 1); setRunning(false); return modes[mode]; }
      return s - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const progress = 1 - seconds / modes[mode];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 16 }}>
        {/* Pomodoro */}
        <GlassCard dark={dark} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>🎯 Focus Timer</div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
            {Object.keys(modes).map(m => (
              <motion.button key={m} whileHover={{ scale: 1.05 }}
                onClick={() => { setMode(m); setSeconds(modes[m]); setRunning(false); }}
                style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${mode === m ? C.purple : t.border}`, background: mode === m ? "rgba(124,58,237,0.2)" : "transparent", color: mode === m ? C.purpleLight : t.textSecondary, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                {m === "focus" ? "Focus 25m" : m === "short" ? "Short 5m" : "Long 20m"}
              </motion.button>
            ))}
          </div>
          <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 20px" }}>
            <svg width={160} height={160} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={80} cy={80} r={68} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
              <motion.circle cx={80} cy={80} r={68} fill="none" stroke={mode === "focus" ? C.purple : mode === "short" ? C.green : C.cyan} strokeWidth={10}
                strokeDasharray={`${progress * 427.3} 427.3`} strokeLinecap="round" transition={{ duration: 0.5 }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: t.textPrimary }}>{mm}:{ss}</div>
              <div style={{ fontSize: 11, color: t.textMuted, textTransform: "capitalize" }}>{mode}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 16 }}>
            <GlowButton dark={dark} small onClick={() => setRunning(!running)}>
              {running ? "⏸ Pause" : "▶ Start"}
            </GlowButton>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setSeconds(modes[mode]); setRunning(false); }}
              style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>↺</motion.button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ padding: 12, borderRadius: 10, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.purple }}>{sessions}</div>
              <div style={{ fontSize: 11, color: t.textSecondary }}>Sessions Done</div>
            </div>
            <div style={{ padding: 12, borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.amber }}>{distractions}</div>
              <div style={{ fontSize: 11, color: t.textSecondary }}>Distractions</div>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} onClick={() => setDistractions(d => d + 1)}
            style={{ marginTop: 10, width: "100%", padding: "8px", borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
            + Log Distraction
          </motion.button>
        </GlassCard>

        {/* Productivity chart */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <GlassCard dark={dark}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>📈 This Week's Focus Hours</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={productivityData}>
                <XAxis dataKey="day" tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.textPrimary }} />
                <Bar dataKey="focus" fill={C.indigo} radius={[4, 4, 0, 0]} name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
            {[
              { label: "Total Focus", value: "18.4h", icon: "⏱️", color: C.purple },
              { label: "Avg Session", value: "47 min", icon: "📏", color: C.cyan   },
              { label: "Distractions",value: "12",    icon: "📵", color: C.amber  },
              { label: "Deep Work",   value: "5/7",   icon: "🔥", color: C.green  },
            ].map(s => (
              <div key={s.label} style={{ padding: 14, borderRadius: 12, background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.border}`, textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: s.color, marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: t.textSecondary }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <GlassCard dark={dark}>
        <div style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary, marginBottom: 20 }}>🧪 Science-Backed Focus Strategies</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {FOCUS_TIPS.map((tip, i) => (
            <motion.div key={tip.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              style={{ padding: "14px 16px", borderRadius: 12, background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{tip.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 6 }}>{tip.title}</div>
              <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.6 }}>{tip.desc}</div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};
