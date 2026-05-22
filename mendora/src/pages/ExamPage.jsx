import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { C, useTheme } from "../lib/theme";
import { GlassCard, StatCard, GlowButton, ProgressBar, EmotionBadge } from "../components/ui";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const EXAMS = [
  { id: 1, subject: "Calculus",        date: "2026-05-21", daysLeft: 2,  readiness: 62, stress: 74, icon: "📐", color: C.purple },
  { id: 2, subject: "Physics",         date: "2026-05-24", daysLeft: 5,  readiness: 71, stress: 58, icon: "⚛️", color: C.cyan   },
  { id: 3, subject: "Data Structures", date: "2026-05-27", daysLeft: 8,  readiness: 55, stress: 65, icon: "🧮", color: C.indigo },
  { id: 4, subject: "Biology",         date: "2026-05-30", daysLeft: 11, readiness: 80, stress: 38, icon: "🧬", color: C.green  },
  { id: 5, subject: "English",         date: "2026-06-02", daysLeft: 14, readiness: 88, stress: 22, icon: "📖", color: C.pink   },
];

const SUBJECTS_ANALYSIS = [
  { name: "Mathematics",     confidence: 62, weakness: 55, revision: 48, stress: 74, hours: 14, topics: 60, icon: "📐", color: C.purple, weakTopics: ["Integration", "Differential Equations", "Series"] },
  { name: "Physics",         confidence: 71, weakness: 38, revision: 65, stress: 58, hours: 11, topics: 72, icon: "⚛️", color: C.cyan,   weakTopics: ["Optics", "Quantum Mechanics"]                   },
  { name: "Programming",     confidence: 85, weakness: 20, revision: 80, stress: 30, hours: 18, topics: 88, icon: "💻", color: C.green,  weakTopics: ["Recursion"]                                     },
  { name: "Biology",         confidence: 78, weakness: 30, revision: 70, stress: 40, hours:  9, topics: 75, icon: "🧬", color: C.pink,   weakTopics: ["Genetics", "Immune Response"]                   },
  { name: "English",         confidence: 90, weakness: 12, revision: 85, stress: 18, hours:  6, topics: 92, icon: "📖", color: C.amber,  weakTopics: []                                                },
  { name: "Data Structures", confidence: 55, weakness: 68, revision: 40, stress: 80, hours: 12, topics: 52, icon: "🧮", color: C.indigo, weakTopics: ["Graphs", "Dynamic Programming", "Trees", "Hashing"] },
];

const EXAM_STRESS_TREND = [
  { day: "Mon", stress: 45, readiness: 55, focus: 65 },
  { day: "Tue", stress: 62, readiness: 58, focus: 52 },
  { day: "Wed", stress: 70, readiness: 62, focus: 48 },
  { day: "Thu", stress: 58, readiness: 68, focus: 60 },
  { day: "Fri", stress: 74, readiness: 65, focus: 44 },
  { day: "Sat", stress: 66, readiness: 70, focus: 55 },
  { day: "Sun", stress: 55, readiness: 75, focus: 68 },
];

// ─── AI ENGINE ────────────────────────────────────────────────────────────────
const getExamAIResponse = (userText, stressLevel, panicMode) => {
  const lower = userText.toLowerCase();

  if (panicMode || stressLevel > 80) {
    if (["can't", "cant", "fail", "doomed", "hopeless", "give up"].some(w => lower.includes(w)))
      return "Hey — stop for a moment. Take one slow breath with me. You are not going to fail. The fact that you're still here, trying to prepare, already puts you ahead of doing nothing. Let's focus on the very next small thing you can do, not the whole exam. What's one topic you feel okay about?";
    return "I can hear how overwhelmed you feel right now. That's completely valid — exams are genuinely hard. But panic makes everything seem impossible when it isn't. Let's slow down together. Tell me what's worrying you most, and we'll break it into something manageable. One step at a time. You've got this. 💜";
  }
  if (stressLevel > 60) {
    if (["revision","plan","study","prepare","strategy"].some(w => lower.includes(w)))
      return "With your stress this high, the last thing you need is a 10-hour study marathon. Here's what actually works: study in tight 25-minute blocks, one topic per block, with real 5-minute breaks in between. Pick your 3 most important topics for today — just 3. Everything else is bonus. What's your exam subject?";
    if (["sleep","tired","exhausted"].some(w => lower.includes(w)))
      return "This is important: sleep is not a waste of exam time. A rested brain retains information 40% better than an exhausted one. You will perform better on 7 hours of sleep with less revision than on 10 hours of revision with no sleep.";
  }
  if (["tomorrow","tonight","few hours","last minute"].some(w => lower.includes(w)))
    return "Okay, exam is very close. Don't try to learn anything new tonight — consolidate what you already know. Review your notes once through, focus on definitions and key formulas, then sleep by 11 PM. Your brain needs rest more than more content right now. What subject is it?";
  if (["weak","don't understand","confused","struggling","hard"].some(w => lower.includes(w)))
    return "Struggling with something hard this close to the exam is actually normal. Tell me the topic and I'll help you find the fastest path to understanding it. Sometimes just 20 minutes of the right explanation unlocks something that hours of re-reading couldn't.";
  if (["confident","ready","prepared","good"].some(w => lower.includes(w)))
    return "That's genuinely great to hear! Confidence going into an exam makes a real difference. Now channel that into one final review: scan your weak spots, do 5 practice questions under timed conditions, and trust the preparation you've put in. You've earned this confidence. 🌟";
  if (["break","rest","tired","burnout"].some(w => lower.includes(w)))
    return "Yes — take the break. Guilt-free. Your brain processes and consolidates information during rest, not while you're staring at a textbook. Set a timer for 20-30 minutes, do something completely unrelated, then come back. You'll be sharper for it. ☕";
  if (["plan","schedule","how to","where to start"].some(w => lower.includes(w)))
    return "Let's build your plan. How many days until your exam? Which topics do you feel least prepared on? We'll rank by importance × weakness and build a session schedule that's realistic, not overwhelming.";
  if (["anxious","nervous","scared","worried"].some(w => lower.includes(w)))
    return "Exam nerves are your body preparing you — it's not a sign you'll fail, it's a sign you care. The students who feel nothing are usually the ones who haven't prepared. Your anxiety means you're engaged. What's one topic you could review right now that would make you feel slightly more ready?";
  const defaults = [
    "You're doing the right thing by reaching out instead of spiralling alone. What's on your mind right now?",
    "Tell me more. Are you worried about time, specific topics, or just the general feeling of pressure?",
    "I'm right here with you. Whether you need a study plan, emotional support, or just someone to think with — let's work through this together. What do you need most right now?",
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
};

// ─── EMERGENCY PLAN GENERATOR ─────────────────────────────────────────────────
const generateEmergencyPlan = (subject, daysLeft) => {
  if (daysLeft <= 1) return {
    title: "⚡ Exam Tomorrow — Survival Strategy", color: C.red,
    sessions: [
      { time: "Now → +1h",     task: "Read through ALL your notes once — don't stop to memorise, just refresh.", priority: "critical" },
      { time: "+1h → +1.5h",   task: "List every formula / definition you need. One page only.",                  priority: "critical" },
      { time: "+1.5h → +2h",   task: "Do 5 past exam questions (hardest topics first). Check answers.",           priority: "high"     },
      { time: "+2h → +2.25h",  task: "Review only the formulas you got wrong.",                                   priority: "high"     },
      { time: "+2.25h → 10PM", task: "Stop studying. Pack your bag, eat, and sleep. Brain needs rest.",           priority: "rest"     },
    ],
  };
  if (daysLeft <= 3) return {
    title: `🔥 ${daysLeft}-Day Intensive Plan`, color: C.amber,
    sessions: [
      { time: "Day 1 AM", task: "Complete notes review — mark anything you don't understand clearly.",  priority: "critical" },
      { time: "Day 1 PM", task: "Focus exclusively on your 3 weakest topics. 25-min blocks each.",     priority: "high"     },
      { time: "Day 2 AM", task: "Practice questions on all topics. Time yourself properly.",             priority: "high"     },
      { time: "Day 2 PM", task: "Mark scheme review — understand every lost mark.",                     priority: "high"     },
      { time: "Day 3",    task: "Light review only. Formulas, key concepts. Early sleep tonight.",      priority: "rest"     },
    ],
  };
  return {
    title: `📅 ${daysLeft}-Day Smart Revision Plan`, color: C.green,
    sessions: [
      { time: "Days 1-2",  task: "Cover all topics at surface level — identify gaps.",                  priority: "normal" },
      { time: "Days 3-4",  task: "Deep focus on weak topics. 3 Pomodoro blocks per topic.",            priority: "high"   },
      { time: "Days 5-6",  task: "Practice under exam conditions. Past papers, timed.",                priority: "high"   },
      { time: "Final Day", task: "Formula review, rest, confidence. Sleep by 10 PM.",                  priority: "rest"   },
    ],
  };
};

// ─── PANIC BREATHING OVERLAY ──────────────────────────────────────────────────
const PANIC_PHASES = [
  { label: "Breathe In",  duration: 4, color: C.cyan,   scale: 1.4 },
  { label: "Hold",        duration: 4, color: C.purple, scale: 1.4 },
  { label: "Breathe Out", duration: 4, color: C.indigo, scale: 0.7 },
  { label: "Hold",        duration: 4, color: C.purple, scale: 0.7 },
];

const PanicBreathingOverlay = ({ onClose }) => {
  const [phase,  setPhase]  = useState(0);
  const [count,  setCount]  = useState(PANIC_PHASES[0].duration);
  const [cycles, setCycles] = useState(0);
  const current = PANIC_PHASES[phase];

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          setPhase(p => {
            const next = (p + 1) % 4;
            if (next === 0) setCycles(cy => cy + 1);
            return next;
          });
          return PANIC_PHASES[(phase + 1) % 4].duration;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const calming = [
    "You are safe. This feeling will pass.",
    "Your brain is just reacting to stress — it doesn't mean danger.",
    "Every breath brings more calm. You're doing great.",
    "Exam stress is temporary. You are capable of more than you know.",
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(5,5,15,0.97)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
      <motion.button onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{ position: "absolute", top: 24, right: 32, background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
        Exit Panic Mode
      </motion.button>

      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Panic Control Mode • Cycle {cycles + 1}
      </div>

      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {[1.6, 1.9, 2.2].map((s, i) => (
          <motion.div key={i}
            animate={{ scale: [1, s, 1], opacity: [0.15, 0, 0.15] }}
            transition={{ duration: current.duration, repeat: Infinity, delay: i * 0.3 }}
            style={{ position: "absolute", width: 160, height: 160, borderRadius: "50%", border: `1px solid ${current.color}` }} />
        ))}
        <motion.div
          animate={{ scale: current.scale }}
          transition={{ duration: current.duration - 0.2, ease: "easeInOut" }}
          style={{ width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${current.color}50, ${current.color}15)`, border: `2px solid ${current.color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${current.color}40` }}>
          <div style={{ fontSize: 40, fontWeight: 800, color: "white" }}>{count}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{current.label}</div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={cycles} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", fontStyle: "italic", textAlign: "center", maxWidth: 380, lineHeight: 1.7 }}>
          "{calming[cycles % calming.length]}"
        </motion.div>
      </AnimatePresence>

      <div style={{ display: "flex", gap: 8 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: i === phase ? 24 : 8, height: 8, borderRadius: 4, background: i === phase ? current.color : "rgba(255,255,255,0.15)", transition: "all 0.3s" }} />
        ))}
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center", maxWidth: 320 }}>
        Box breathing (4-4-4-4) activates your parasympathetic nervous system and reduces stress hormones within minutes.
      </div>
    </motion.div>
  );
};

// ─── EMERGENCY PLAN MODAL ─────────────────────────────────────────────────────
const EmergencyPlanModal = ({ plan, exam, onClose, dark }) => {
  const t = useTheme(dark);
  const priorityColor = { critical: C.red, high: C.amber, normal: C.purple, rest: C.green };
  const priorityIcon  = { critical: "🚨", high: "🔥", normal: "📚", rest: "😴" };

  const downloadPlan = () => {
    const lines = [
      `MENDORA — ${plan.title}`,
      `Subject: ${exam.subject} | Days Left: ${exam.daysLeft}`,
      "─".repeat(40),
      ...plan.sessions.map((s, i) => `${i+1}. [${s.time}]\n   ${s.task}`),
      "",
      `Generated by Mendora AI • ${new Date().toLocaleString()}`,
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `${exam.subject}-revision-plan.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.65 }} exit={{ opacity: 0 }}
        onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000", zIndex: 900 }} />
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
        style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 901, width: "min(560px,92vw)", maxHeight: "88vh", overflowY: "auto", background: dark ? "#0d0d1a" : "#fff", border: `1px solid ${plan.color}50`, borderRadius: 22, padding: 28, boxShadow: `0 0 60px ${plan.color}25` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: t.textPrimary }}>{plan.title}</div>
            <div style={{ fontSize: 13, color: t.textSecondary }}>{exam.subject} • {exam.daysLeft} day{exam.daysLeft !== 1 ? "s" : ""} to go</div>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} onClick={onClose}
            style={{ background: "transparent", border: `1px solid ${t.border}`, color: t.textSecondary, width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>✕</motion.button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {plan.sessions.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              style={{ padding: "14px 16px", borderRadius: 12, background: `${priorityColor[s.priority]}0d`, border: `1px solid ${priorityColor[s.priority]}30`, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{priorityIcon[s.priority]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: priorityColor[s.priority], marginBottom: 4 }}>{s.time}</div>
                <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.6 }}>{s.task}</div>
              </div>
              <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 10, background: `${priorityColor[s.priority]}20`, color: priorityColor[s.priority], fontWeight: 700, flexShrink: 0 }}>{s.priority.toUpperCase()}</span>
            </motion.div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={downloadPlan}
            style={{ flex: 1, padding: 13, borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${plan.color}, ${plan.color}90)`, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}>
            ⬇ Download Plan
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

// ─── EXAM PAGE ────────────────────────────────────────────────────────────────
const ExamPage = ({ dark }) => {
  const t = useTheme(dark);
  const [activeTab,           setActiveTab]           = useState("dashboard");
  const [stressLevel,         setStressLevel]         = useState(68);
  const [panicMode,           setPanicMode]           = useState(false);
  const [showPanic,           setShowPanic]           = useState(false);
  const [examMessages,        setExamMessages]        = useState([
    { id: 1, role: "ai", text: "Hi! I'm your Exam Companion 🎓 I'm here to help you prepare smarter, manage exam stress, and stay focused. Tell me — which exam is coming up and how are you feeling about it?", time: "Now", emotion: "Welcoming" },
  ]);
  const [examInput,           setExamInput]           = useState("");
  const [examTyping,          setExamTyping]          = useState(false);
  const [selectedExamForPlan, setSelectedExamForPlan] = useState(null);
  const [showEmergencyPlan,   setShowEmergencyPlan]   = useState(false);
  const [emergencyPlan,       setEmergencyPlan]       = useState(null);
  const [expandedSubject,     setExpandedSubject]     = useState(null);
  const [studyMinutes,        setStudyMinutes]        = useState(0);
  const [studyRunning,        setStudyRunning]        = useState(false);
  const studyTimerRef = useRef(null);
  const chatEndRef    = useRef(null);

  // Study fatigue timer
  useEffect(() => {
    if (studyRunning) {
      studyTimerRef.current = setInterval(() => setStudyMinutes(m => m + 1), 60000);
    } else {
      clearInterval(studyTimerRef.current);
    }
    return () => clearInterval(studyTimerRef.current);
  }, [studyRunning]);

  const fatigueLevel = studyMinutes >= 90 ? "critical" : studyMinutes >= 60 ? "high" : studyMinutes >= 30 ? "moderate" : "ok";

  // Auto-scroll chat
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [examMessages, examTyping]);

  const urgencyColor = (d) => d <= 2 ? C.red : d <= 5 ? C.amber : d <= 8 ? C.purple : C.green;
  const urgencyLabel = (d) => d <= 2 ? "URGENT" : d <= 5 ? "Soon" : d <= 8 ? "Upcoming" : "Scheduled";

  const sendExamMessage = (text) => {
    if (!text.trim()) return;
    setExamMessages(prev => [...prev, { id: Date.now(), role: "user", text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), emotion: "Academic Stress" }]);
    setExamInput("");
    setExamTyping(true);
    setTimeout(() => {
      setExamTyping(false);
      setExamMessages(prev => [...prev, {
        id: Date.now() + 1, role: "ai",
        text: getExamAIResponse(text, stressLevel, panicMode),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        emotion: stressLevel > 70 ? "Empathetic" : "Supportive",
      }]);
    }, 1800);
  };

  const TABS = [
    { id: "dashboard", label: "Dashboard",        icon: "📊" },
    { id: "subjects",  label: "Subject Analysis", icon: "📚" },
    { id: "companion", label: "AI Companion",      icon: "🤖" },
    { id: "analytics", label: "Analytics",         icon: "📈" },
  ];

  // ── DASHBOARD TAB ──────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div>
      {/* Banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 20, padding: "14px 20px", borderRadius: 14, background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.15))", border: "1px solid rgba(124,58,237,0.4)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 32 }}>🎓</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.textPrimary }}>Mid Exams Active</div>
            <div style={{ fontSize: 13, color: t.textSecondary }}>5 exams this session • Next: Calculus in 2 days</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <motion.button whileHover={{ scale: 1.04 }} onClick={() => setShowPanic(true)}
            style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.5)", background: "rgba(239,68,68,0.12)", color: C.red, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
            😰 Panic Mode
          </motion.button>
          <GlowButton dark={dark} small onClick={() => setActiveTab("companion")}>Chat with AI ↗</GlowButton>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Overall Readiness",  value: "68%", icon: "🎯", color: C.purple, change: "+4%"  },
          { label: "Avg Stress Level",   value: "62%", icon: "⚡", color: C.amber,  change: "-3%"  },
          { label: "Study Consistency",  value: "81%", icon: "📅", color: C.green,  change: "+7%"  },
          { label: "Productivity Score", value: "74%", icon: "🔥", color: C.cyan,   change: "+2%"  },
          { label: "Exams This Week",    value: "3",   icon: "📋", color: C.indigo                 },
          { label: "Weak Topics",        value: "8",   icon: "⚠️", color: C.red,    change: "-2"   },
        ].map(s => <StatCard key={s.label} dark={dark} {...s} />)}
      </div>

      {/* Countdown cards */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, marginBottom: 14 }}>📅 Exam Countdown</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 12 }}>
          {EXAMS.map((exam, i) => {
            const uc = urgencyColor(exam.daysLeft);
            const ul = urgencyLabel(exam.daysLeft);
            return (
              <motion.div key={exam.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3 }}
                style={{ padding: 16, borderRadius: 14, background: t.card, backdropFilter: "blur(20px)", border: `1px solid ${exam.daysLeft <= 2 ? uc + "60" : t.border}`, boxShadow: exam.daysLeft <= 2 ? `0 0 24px ${uc}25` : "none", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -16, right: -10, fontSize: 60, opacity: 0.07 }}>{exam.icon}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>{exam.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: `${uc}20`, color: uc }}>{ul}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary, marginBottom: 4 }}>{exam.subject}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: uc, marginBottom: 6 }}>
                  {exam.daysLeft === 0 ? "TODAY" : exam.daysLeft === 1 ? "Tomorrow" : `${exam.daysLeft}d`}
                </div>
                <ProgressBar value={exam.readiness} color={exam.color} height={5} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: t.textMuted }}>Readiness {exam.readiness}%</span>
                  <span style={{ fontSize: 11, color: uc }}>Stress {exam.stress}%</span>
                </div>
                <motion.button whileHover={{ scale: 1.03 }}
                  onClick={() => { setSelectedExamForPlan(exam); setEmergencyPlan(generateEmergencyPlan(exam.subject, exam.daysLeft)); setShowEmergencyPlan(true); }}
                  style={{ marginTop: 10, width: "100%", padding: "7px", borderRadius: 8, border: `1px solid ${exam.color}40`, background: `${exam.color}12`, color: exam.color, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>
                  ⚡ Generate Plan
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* AI Insights + Fatigue Tracker */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <GlassCard dark={dark}>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary, marginBottom: 14 }}>🧠 AI Exam Insights</div>
          {[
            { icon: "⚠️", text: "Calculus exam in 2 days — prioritise Integration and Series today.", color: C.red    },
            { icon: "💡", text: "Your readiness improves most when you study in the morning (8-11 AM).", color: C.amber  },
            { icon: "🔥", text: "Data Structures has your highest stress — break it into micro-topics.", color: C.purple },
            { icon: "✅", text: "English is exam-ready. Spend minimal time here and redistribute hours.", color: C.green  },
            { icon: "😴", text: "Sleep score dropped this week. Aim for 7h tonight — it boosts recall.", color: C.cyan   },
          ].map((ins, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "9px 0", borderBottom: i < 4 ? `1px solid ${t.border}` : "none", alignItems: "flex-start" }}>
              <span style={{ fontSize: 16 }}>{ins.icon}</span>
              <span style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.6 }}>{ins.text}</span>
            </div>
          ))}
        </GlassCard>

        <GlassCard dark={dark}>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary, marginBottom: 14 }}>🧪 Study Fatigue Monitor</div>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <motion.div animate={{ scale: fatigueLevel === "critical" ? [1, 1.05, 1] : 1 }} transition={{ duration: 1.5, repeat: fatigueLevel === "critical" ? Infinity : 0 }}
              style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", padding: "20px 28px", borderRadius: 16, background: fatigueLevel === "critical" ? "rgba(239,68,68,0.12)" : fatigueLevel === "high" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.08)", border: `1px solid ${fatigueLevel === "critical" ? C.red + "50" : fatigueLevel === "high" ? C.amber + "40" : C.green + "30"}` }}>
              <div style={{ fontSize: 36, marginBottom: 6 }}>{fatigueLevel === "critical" ? "🚨" : fatigueLevel === "high" ? "😓" : fatigueLevel === "moderate" ? "⚡" : "✅"}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: fatigueLevel === "critical" ? C.red : fatigueLevel === "high" ? C.amber : C.green }}>{studyMinutes}m</div>
              <div style={{ fontSize: 12, color: t.textSecondary }}>Study Time</div>
            </motion.div>
          </div>
          {fatigueLevel !== "ok" && (
            <div style={{ padding: "10px 14px", borderRadius: 10, background: fatigueLevel === "critical" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", border: `1px solid ${fatigueLevel === "critical" ? C.red + "40" : C.amber + "40"}`, fontSize: 12, color: t.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>
              {fatigueLevel === "critical" ? "🚨 You've been studying for 90+ minutes. Take a 20-min break — cognitive performance drops sharply now." : "😓 Over an hour of study. A 10-min break will sharpen your focus significantly."}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <motion.button whileHover={{ scale: 1.04 }} onClick={() => setStudyRunning(!studyRunning)}
              style={{ flex: 1, padding: "9px", borderRadius: 10, border: "none", background: studyRunning ? "rgba(239,68,68,0.15)" : `linear-gradient(135deg, ${C.purple}, ${C.indigo})`, color: studyRunning ? C.red : "white", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
              {studyRunning ? "⏸ Pause Study" : "▶ Start Study"}
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} onClick={() => { setStudyMinutes(0); setStudyRunning(false); }}
              style={{ padding: "9px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>↺</motion.button>
          </div>
        </GlassCard>
      </div>

      {/* Weak Topics */}
      <GlassCard dark={dark}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary }}>⚠️ Weak Topic Detection</div>
          <span style={{ fontSize: 11, color: C.red, fontWeight: 600 }}>8 areas need attention</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 10 }}>
          {SUBJECTS_ANALYSIS.filter(s => s.weakTopics.length > 0).flatMap(s => s.weakTopics.map(wt => ({ topic: wt, subject: s.name, color: s.color, icon: s.icon }))).map((item, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }}
              style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: t.textPrimary }}>{item.topic}</div>
                <div style={{ fontSize: 11, color: item.color }}>{item.subject}</div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 10, color: C.red, fontWeight: 700 }}>⚠ WEAK</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );

  // ── SUBJECTS TAB ───────────────────────────────────────────────────────────
  const renderSubjects = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {SUBJECTS_ANALYSIS.map((s, i) => (
        <motion.div key={s.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
          <GlassCard dark={dark} style={{ cursor: "pointer" }} onClick={() => setExpandedSubject(expandedSubject === s.name ? null : s.name)}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}20`, border: `1px solid ${s.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary }}>{s.name}</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>Confidence {s.confidence}%</span>
                    <span style={{ fontSize: 12, color: s.stress > 60 ? C.red : C.amber, fontWeight: 600 }}>Stress {s.stress}%</span>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[["Confidence", s.confidence, s.color], ["Revision", s.revision, C.cyan], ["Topics Done", s.topics, C.green]].map(([label, val, color]) => (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: t.textMuted }}>{label}</span>
                        <span style={{ fontSize: 10, color, fontWeight: 600 }}>{val}%</span>
                      </div>
                      <ProgressBar value={val} color={color} height={4} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 18, color: t.textMuted }}>{expandedSubject === s.name ? "▲" : "▼"}</div>
            </div>

            <AnimatePresence>
              {expandedSubject === s.name && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${t.border}` }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: t.textSecondary, marginBottom: 8 }}>📊 Study Stats</div>
                      {[["Study Hours", s.hours + "h", C.purple], ["Topics Covered", s.topics + "%", C.cyan], ["Weakness Score", s.weakness + "%", C.red]].map(([l, v, c]) => (
                        <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${t.border}` }}>
                          <span style={{ fontSize: 12, color: t.textSecondary }}>{l}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: c }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    {s.weakTopics.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.red, marginBottom: 8 }}>⚠️ Weak Topics</div>
                        {s.weakTopics.map(wt => (
                          <div key={wt} style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 6, fontSize: 12, color: t.textSecondary }}>
                            ⚠ {wt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }}
                    onClick={e => { e.stopPropagation(); const exam = EXAMS.find(ex => ex.subject.includes(s.name.split(" ")[0])) || EXAMS[0]; setSelectedExamForPlan(exam); setEmergencyPlan(generateEmergencyPlan(s.name, exam.daysLeft)); setShowEmergencyPlan(true); }}
                    style={{ marginTop: 12, padding: "9px 18px", borderRadius: 10, border: `1px solid ${s.color}40`, background: `${s.color}12`, color: s.color, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                    ⚡ Generate Revision Plan for {s.name}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );

  // ── AI COMPANION TAB ───────────────────────────────────────────────────────
  const renderCompanion = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16, height: "60vh", minHeight: 0 }}>
      <GlassCard dark={dark} style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎓</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary }}>Exam AI Companion</div>
            <div style={{ fontSize: 12, color: C.green }}>● Online • Exam-specialist mode</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <div style={{ padding: "4px 10px", borderRadius: 20, background: stressLevel > 70 ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.1)", color: stressLevel > 70 ? C.red : C.amber, fontSize: 11, fontWeight: 600 }}>
              ⚡ Stress {stressLevel}%
            </div>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowPanic(true)}
              style={{ padding: "5px 12px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.4)", background: "rgba(239,68,68,0.1)", color: C.red, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>
              😰 Panic Mode
            </motion.button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {examMessages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
              {msg.role === "ai" && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🎓</div>
              )}
              <div>
                {msg.role === "ai" && msg.emotion && <div style={{ marginBottom: 4 }}><EmotionBadge emotion={msg.emotion} /></div>}
                <div style={{ maxWidth: 420, padding: "12px 16px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role === "user" ? `linear-gradient(135deg, ${C.purple}, ${C.indigo})` : dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)", border: msg.role === "ai" ? `1px solid ${t.border}` : "none", color: t.textPrimary, fontSize: 13, lineHeight: 1.7 }}>
                  {msg.text}
                  <div style={{ fontSize: 10, color: msg.role === "user" ? "rgba(255,255,255,0.4)" : t.textMuted, marginTop: 5 }}>{msg.time}</div>
                </div>
              </div>
            </motion.div>
          ))}
          {examTyping && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🎓</div>
              <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)", border: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(i => <motion.div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.purple }} animate={{ y: [0, -6, 0] }} transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick prompts */}
        <div style={{ padding: "8px 14px", display: "flex", gap: 6, flexWrap: "wrap", borderTop: `1px solid ${t.border}` }}>
          {["I'm panicking about tomorrow", "Help me make a study plan", "I can't focus", "What should I revise first?"].map(s => (
            <motion.button key={s} whileHover={{ scale: 1.02 }} onClick={() => sendExamMessage(s)}
              style={{ padding: "5px 10px", borderRadius: 20, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{s}</motion.button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${t.border}`, display: "flex", gap: 8 }}>
          <input value={examInput} onChange={e => setExamInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendExamMessage(examInput)}
            placeholder="Ask your exam companion anything..."
            style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.inputBg, color: t.textPrimary, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
          <GlowButton dark={dark} small onClick={() => sendExamMessage(examInput)}>Send ↗</GlowButton>
        </div>
      </GlassCard>

      {/* Right panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
        <GlassCard dark={dark} style={{ padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.textPrimary, marginBottom: 10 }}>⚡ Stress Level</div>
          <input type="range" min={0} max={100} value={stressLevel} onChange={e => setStressLevel(Number(e.target.value))} style={{ width: "100%", accentColor: stressLevel > 70 ? C.red : C.purple, cursor: "pointer" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 11, color: t.textMuted }}>Calm</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: stressLevel > 70 ? C.red : stressLevel > 50 ? C.amber : C.green }}>{stressLevel}%</span>
            <span style={{ fontSize: 11, color: t.textMuted }}>Panic</span>
          </div>
        </GlassCard>

        <GlassCard dark={dark} style={{ padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.textPrimary, marginBottom: 10 }}>📅 Upcoming Exams</div>
          {EXAMS.slice(0, 3).map(exam => (
            <div key={exam.id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontSize: 16 }}>{exam.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: t.textPrimary }}>{exam.subject}</div>
                <div style={{ fontSize: 11, color: urgencyColor(exam.daysLeft), fontWeight: 600 }}>{exam.daysLeft}d left</div>
              </div>
            </div>
          ))}
        </GlassCard>

        <motion.button whileHover={{ scale: 1.03 }} onClick={() => setShowPanic(true)}
          style={{ padding: "12px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.5)", background: "rgba(239,68,68,0.1)", color: C.red, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
          😰 Activate Panic Mode
        </motion.button>
      </div>
    </div>
  );

  // ── ANALYTICS TAB ──────────────────────────────────────────────────────────
  const renderAnalytics = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <GlassCard dark={dark}>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>📈 Stress vs Readiness (This Week)</div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={EXAM_STRESS_TREND}>
            <defs>
              <linearGradient id="readGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.green} stopOpacity={0.4} />
                <stop offset="100%" stopColor={C.green} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="stressGradE" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.red} stopOpacity={0.3} />
                <stop offset="100%" stopColor={C.red} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.textPrimary }} />
            <Legend />
            <Area type="monotone" dataKey="readiness" stroke={C.green} fill="url(#readGrad)"    strokeWidth={2} name="Readiness %" />
            <Area type="monotone" dataKey="stress"    stroke={C.red}   fill="url(#stressGradE)" strokeWidth={2} name="Stress %"    />
            <Line  type="monotone" dataKey="focus"    stroke={C.cyan}  strokeWidth={2} dot={false} name="Focus %" />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <GlassCard dark={dark}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>📚 Subject Readiness</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SUBJECTS_ANALYSIS.map(s => ({ name: s.icon + " " + s.name.split(" ")[0], readiness: s.confidence, stress: s.stress }))}>
              <XAxis dataKey="name" tick={{ fill: t.textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: t.textSecondary, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.textPrimary }} />
              <Bar dataKey="readiness" fill={C.purple} radius={[4, 4, 0, 0]} name="Readiness %" />
              <Bar dataKey="stress"    fill={C.red}    radius={[4, 4, 0, 0]} name="Stress %"    opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard dark={dark}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>⏱️ Study Hours by Subject</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SUBJECTS_ANALYSIS.map(s => ({ name: s.name.split(" ")[0], hours: s.hours }))} layout="vertical">
              <XAxis type="number" tick={{ fill: t.textSecondary, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: t.textSecondary, fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.textPrimary }} />
              <Bar dataKey="hours" fill={C.cyan} radius={[0, 4, 4, 0]} name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Panic overlay */}
      <AnimatePresence>
        {showPanic && <PanicBreathingOverlay onClose={() => setShowPanic(false)} />}
      </AnimatePresence>

      {/* Emergency Plan modal */}
      <AnimatePresence>
        {showEmergencyPlan && emergencyPlan && selectedExamForPlan && (
          <EmergencyPlanModal plan={emergencyPlan} exam={selectedExamForPlan} dark={dark} onClose={() => setShowEmergencyPlan(false)} />
        )}
      </AnimatePresence>

      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: t.textPrimary }}>🎓 Exam Mode</div>
          <div style={{ fontSize: 13, color: t.textSecondary }}>AI-powered exam preparation & emotional support</div>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} onClick={() => setShowPanic(true)}
          style={{ padding: "10px 20px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.5)", background: "rgba(239,68,68,0.1)", color: C.red, cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}>
          😰 Emergency Panic Mode
        </motion.button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", padding: 6, borderRadius: 14, border: `1px solid ${t.border}`, width: "fit-content" }}>
        {TABS.map(tab => (
          <motion.button key={tab.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab(tab.id)}
            style={{ padding: "9px 18px", borderRadius: 10, border: "none", cursor: "pointer", background: activeTab === tab.id ? `linear-gradient(135deg, ${C.purple}, ${C.indigo})` : "transparent", color: activeTab === tab.id ? "white" : t.textSecondary, fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 400, display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s", fontFamily: "inherit", boxShadow: activeTab === tab.id ? `0 4px 14px rgba(124,58,237,0.4)` : "none" }}>
            {tab.icon} {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeTab === "dashboard" && renderDashboard()}
          {activeTab === "subjects"  && renderSubjects()}
          {activeTab === "companion" && renderCompanion()}
          {activeTab === "analytics" && renderAnalytics()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ExamPage;
