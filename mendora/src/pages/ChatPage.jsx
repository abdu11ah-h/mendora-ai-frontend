import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, useTheme } from "../lib/theme";
import { detectCrisis, detectHardBlock, detectEmotion, HIGH_STRESS_THRESHOLD, getBreakRecommendation, COMMUNITY_GUIDELINES } from "../lib/aiEngine";
import { GlassCard, GlowButton, EmotionBadge } from "../components/ui";
import { suggestions } from "../data/mockData";
import { chatAPI } from "../lib/api";

const TONE_OPTIONS = [
  { key: "calm",         label: "Calm",        icon: "🌿" },
  { key: "motivational", label: "Motivational", icon: "🔥" },
  { key: "direct",       label: "Direct",       icon: "⚡" },
];

const SUBJECT_OPTIONS = [
  { key: null,         label: "Any",        icon: "📚" },
  { key: "math",       label: "Math",       icon: "📐" },
  { key: "physics",    label: "Physics",    icon: "⚛️" },
  { key: "chemistry",  label: "Chemistry",  icon: "🧪" },
  { key: "biology",    label: "Biology",    icon: "🧬" },
  { key: "cs",         label: "CS",         icon: "💻" },
  { key: "english",    label: "English",    icon: "📝" },
  { key: "history",    label: "History",    icon: "🏛️" },
  { key: "economics",  label: "Economics",  icon: "📊" },
  { key: "psychology", label: "Psychology", icon: "🧠" },
];

const INACTIVITY_MINUTES = 3;

// ── SOS Modal ──
const SOSModal = ({ onClose, dark }) => {
  const t = useTheme(dark);
  const [alertSent, setAlertSent] = useState(false);
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }}
        onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000", zIndex: 900 }} />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
        style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 901, width: "min(520px,90vw)", maxHeight: "90vh", overflowY: "auto", background: dark ? "#0d0d1a" : "#fff", border: "1px solid rgba(239,68,68,0.5)", borderRadius: 20, padding: 28, boxShadow: "0 0 80px rgba(239,68,68,0.25)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ fontSize: 48, marginBottom: 10 }}>🆘</motion.div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.red, marginBottom: 6 }}>Crisis Support</div>
          <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.7 }}>You are not alone. Help is available right now.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Umang Helpline (Pakistan)", number: "0311-7786264", icon: "📞", color: C.green },
            { label: "Rozan Counseling",           number: "051-2890505", icon: "🏥", color: C.cyan  },
            { label: "Umang 24/7 WhatsApp",        number: "0317-4288665",icon: "📱", color: C.purple},
            { label: "Emergency Services",          number: "1122",        icon: "🚨", color: C.red   },
          ].map(h => (
            <motion.div key={h.label} whileHover={{ x: 4 }}
              style={{ padding: "12px 16px", borderRadius: 12, background: `${h.color}10`, border: `1px solid ${h.color}30`, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>{h.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary }}>{h.label}</div>
                <div style={{ fontSize: 12, color: h.color, fontWeight: 700 }}>{h.number}</div>
              </div>
            </motion.div>
          ))}
        </div>
        {!alertSent ? (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setAlertSent(true)}
            style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${C.red}, #DC2626)`, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700, marginBottom: 10, fontFamily: "inherit" }}>
            🚨 Alert My Counselor Now
          </motion.button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: 13, borderRadius: 12, background: "rgba(16,185,129,0.12)", border: `1px solid rgba(16,185,129,0.4)`, textAlign: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>✅ Counselor Alerted — help is coming. 💜</div>
          </motion.div>
        )}
        <motion.button whileHover={{ scale: 1.01 }} onClick={onClose}
          style={{ width: "100%", padding: 11, borderRadius: 12, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
          I'm okay for now — close
        </motion.button>
      </motion.div>
    </>
  );
};

// ── Guidelines Modal ──
const GuidelinesModal = ({ onClose, dark }) => {
  const t = useTheme(dark);
  const [accepted, setAccepted] = useState(false);
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
        onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000", zIndex: 900 }} />
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
        style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 901, width: "min(520px,90vw)", maxHeight: "85vh", overflowY: "auto", background: dark ? "#0d0d1a" : "#fff", border: "1px solid rgba(124,58,237,0.4)", borderRadius: 20, padding: 28 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: t.textPrimary, marginBottom: 6 }}>Community Guidelines</div>
          <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.6 }}>Mendora AI is a safe, supportive space.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
          {COMMUNITY_GUIDELINES.map((g, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              style={{ padding: "12px 16px", borderRadius: 12, background: dark ? "rgba(255,255,255,0.03)" : "rgba(124,58,237,0.04)", border: `1px solid ${t.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{g.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 3 }}>{g.title}</div>
                <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.6 }}>{g.rule}</div>
              </div>
            </motion.div>
          ))}
        </div>
        {!accepted ? (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setAccepted(true)}
            style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${C.purple}, ${C.indigo})`, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}>
            ✔ I understand and agree
          </motion.button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ padding: 13, borderRadius: 12, background: "rgba(16,185,129,0.1)", border: `1px solid rgba(16,185,129,0.4)`, textAlign: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>✅ Thank you — you're all set 💜</div>
            </div>
            <motion.button whileHover={{ scale: 1.01 }} onClick={onClose}
              style={{ width: "100%", padding: 11, borderRadius: 12, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
              Continue to Mendora AI
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

// ── High Stress Alert ──
const HighStressAlert = ({ onDismiss, onSOS, dark }) => {
  const t = useTheme(dark);
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      style={{ position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", zIndex: 800, width: "min(520px,90vw)", padding: "14px 18px", borderRadius: 14, background: dark ? "#1a0a0a" : "#fff0f0", border: "1px solid rgba(239,68,68,0.6)", boxShadow: "0 8px 40px rgba(239,68,68,0.3)", display: "flex", alignItems: "center", gap: 14 }}>
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ fontSize: 28, flexShrink: 0 }}>🚨</motion.div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 3 }}>High Stress Detected</div>
        <div style={{ fontSize: 12, color: t.textSecondary, lineHeight: 1.5 }}>Your stress indicators are very high. Please take a moment.</div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <motion.button whileHover={{ scale: 1.05 }} onClick={onSOS}
          style={{ padding: "8px 14px", borderRadius: 10, border: "none", background: C.red, color: "white", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>Get Help</motion.button>
        <motion.button whileHover={{ scale: 1.05 }} onClick={onDismiss}
          style={{ padding: "8px 12px", borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Dismiss</motion.button>
      </div>
    </motion.div>
  );
};

// ── CHAT PAGE ──
const ChatPage = ({ dark }) => {
  const [messages, setMessages]         = useState([{ id: Date.now(), role: "ai", text: "Hi! I'm Mendora 💜 How are you feeling today?", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), emotion: "Welcoming" }]);
  const [input, setInput]               = useState("");
  const [typing, setTyping]             = useState(false);
  const [emotion, setEmotion]           = useState("Welcoming");
  const [chatSessions, setChatSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [tone, setTone]                 = useState("calm");
  const [subject, setSubject]           = useState(null);
  const [showSOS, setShowSOS]           = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showStressAlert, setShowStressAlert] = useState(false);
  const [stressAlertDismissed, setStressAlertDismissed] = useState(false);
  const [stressScore, setStressScore]   = useState(40);
  const [lateNightNudgeSent, setLateNightNudgeSent] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const inactivityTimer = useRef(null);
  const endRef = useRef(null);
  const t = useTheme(dark);

  // Load chat sessions on mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessions = await chatAPI.getSessions();
        setChatSessions(sessions || []);
      } catch (e) {
        console.error("Failed to load sessions", e);
      } finally {
        setLoadingHistory(false);
      }
    };
    loadSessions();
  }, []);

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(), role: "ai",
        text: "💜 Just checking in — it's been a little while. How are you feeling right now?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        emotion: "Empathetic", isCheckin: true,
      }]);
    }, INACTIVITY_MINUTES * 60 * 1000);
  };

  useEffect(() => { resetInactivityTimer(); return () => clearTimeout(inactivityTimer.current); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const startNewChat = async () => {
    try {
      const session = await chatAPI.createSession(null);
      setActiveSession(session.id);
      setChatSessions(prev => [session, ...prev]);
      setMessages([{ id: Date.now(), role: "ai", text: "Hello again! 💜 What's on your mind right now?", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), emotion: "Welcoming" }]);
      setInput(""); setEmotion("Welcoming"); setStressScore(40);
      setStressAlertDismissed(false); setLateNightNudgeSent(false);
    } catch (e) {
      console.error(e);
    }
  };

  const switchSession = async (id) => {
    try {
      const session = await chatAPI.getSession(id);
      setActiveSession(id);
      const mapped = session.messages.map(m => ({
        id: m.id, role: m.role === "ai" ? "ai" : "user",
        text: m.content,
        time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        emotion: m.detected_emotion || "Neutral",
      }));
      setMessages(mapped.length > 0 ? mapped : [{ id: Date.now(), role: "ai", text: "Continuing this session 💜 What's on your mind?", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), emotion: "Welcoming" }]);
    } catch (e) {
      console.error(e);
    }
  };

  const send = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    resetInactivityTimer();

    const detectedEmotion = detectEmotion(trimmed);
    setEmotion(detectedEmotion);

    // Add user message to UI immediately
    setMessages(prev => [...prev, { id: Date.now(), role: "user", text: trimmed, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), emotion: detectedEmotion }]);
    setInput("");
    setTyping(true);

    // Stress tracking
    const stressWords = ["stress","overwhelm","panic","anxious","scared","can't","failing","tired","burnout","pressure"];
    const hits = stressWords.filter(w => trimmed.toLowerCase().includes(w)).length;
    setStressScore(prev => {
      const next = Math.min(100, prev + hits * 12);
      if (next >= HIGH_STRESS_THRESHOLD && !stressAlertDismissed) setTimeout(() => setShowStressAlert(true), 1800);
      return next;
    });

    try {
      // Create session if none exists
      let sessionId = activeSession;
      if (!sessionId) {
        const session = await chatAPI.createSession(trimmed.slice(0, 60));
        sessionId = session.id;
        setActiveSession(sessionId);
        setChatSessions(prev => [session, ...prev]);
      }

      // Send to real Gemini backend
      const result = await chatAPI.sendMessage(sessionId, trimmed);
      setTyping(false);

      if (result.crisis) {
        setMessages(prev => [...prev, { id: Date.now(), role: "ai", text: result.ai_response, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), emotion: "Empathetic" }]);
        setTimeout(() => setShowSOS(true), 800);
      } else {
        setMessages(prev => [...prev, { id: Date.now(), role: "ai", text: result.ai_response, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), emotion: "Supportive" }]);
      }

      // Late night nudge
      const hour = new Date().getHours();
      if ((hour >= 23 || hour < 4) && !lateNightNudgeSent) {
        setLateNightNudgeSent(true);
        setTimeout(() => setMessages(prev => [...prev, { id: Date.now(), role: "ai", text: "🌙 I noticed it's late. Your brain retains information better after sleep. Take care of yourself 💜", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), emotion: "Supportive", isNudge: true }]), 2000);
      }
    } catch (e) {
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), role: "ai", text: "I'm having trouble connecting right now. Please try again in a moment 💜", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), emotion: "Supportive" }]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ display: "grid", gridTemplateColumns: "220px 1fr 260px", gap: 16, height: "calc(100vh - 140px)", minHeight: 0 }}>

      <AnimatePresence>
        {showSOS && <SOSModal dark={dark} onClose={() => setShowSOS(false)} />}
        {showGuidelines && <GuidelinesModal dark={dark} onClose={() => setShowGuidelines(false)} />}
        {showStressAlert && (
          <HighStressAlert dark={dark}
            onDismiss={() => { setShowStressAlert(false); setStressAlertDismissed(true); }}
            onSOS={() => { setShowStressAlert(false); setShowSOS(true); }} />
        )}
      </AnimatePresence>

      {/* History Panel */}
      <GlassCard dark={dark} style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", minHeight: 0 }}>
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${t.border}`, fontSize: 13, fontWeight: 600, color: t.textPrimary }}>Chat History</div>
        <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
          {loadingHistory ? (
            <div style={{ padding: 12, fontSize: 12, color: t.textMuted }}>Loading...</div>
          ) : chatSessions.length === 0 ? (
            <div style={{ padding: 12, fontSize: 12, color: t.textMuted }}>No previous chats</div>
          ) : chatSessions.map(h => (
            <motion.div key={h.id} whileHover={{ x: 2 }} onClick={() => switchSession(h.id)}
              style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 4, background: activeSession === h.id ? "rgba(124,58,237,0.2)" : "transparent", border: `1px solid ${activeSession === h.id ? C.purple : "transparent"}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.textPrimary, marginBottom: 2 }}>{h.title || "Untitled"}</div>
              <div style={{ fontSize: 11, color: t.textMuted }}>{new Date(h.created_at).toLocaleDateString()}</div>
            </motion.div>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: `1px solid ${t.border}` }}>
          <GlowButton dark={dark} small onClick={startNewChat} style={{ width: "100%", justifyContent: "center" }}>+ New Chat</GlowButton>
        </div>
      </GlassCard>

      {/* Main Chat */}
      <GlassCard dark={dark} style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden", minHeight: 0 }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💛</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary }}>Mendora AI</div>
            <div style={{ fontSize: 12, color: C.green }}>● Online · Powered by Gemini</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ padding: "4px 10px", borderRadius: 20, background: stressScore >= HIGH_STRESS_THRESHOLD ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${stressScore >= HIGH_STRESS_THRESHOLD ? "rgba(239,68,68,0.5)" : t.border}`, fontSize: 11, color: stressScore >= HIGH_STRESS_THRESHOLD ? C.red : t.textMuted, fontWeight: 600 }}>
              ⚡ Stress {stressScore}%
            </div>
            <EmotionBadge emotion={emotion} />
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowGuidelines(true)}
              style={{ padding: "5px 10px", borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>
              📋 Guidelines
            </motion.button>
          </div>
        </div>

        {/* Tone bar */}
        <div style={{ padding: "7px 14px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: t.textMuted, whiteSpace: "nowrap", fontWeight: 600, textTransform: "uppercase" }}>Tone</span>
          {TONE_OPTIONS.map(opt => (
            <motion.button key={opt.key} whileTap={{ scale: 0.95 }} onClick={() => setTone(opt.key)}
              style={{ padding: "4px 10px", borderRadius: 20, flexShrink: 0, border: `1px solid ${tone === opt.key ? C.purple : t.border}`, background: tone === opt.key ? "rgba(124,58,237,0.22)" : "transparent", color: tone === opt.key ? C.purpleLight : t.textSecondary, fontSize: 11, cursor: "pointer", fontWeight: tone === opt.key ? 600 : 400, fontFamily: "inherit" }}>
              {opt.icon} {opt.label}
            </motion.button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-end" }}>
              {msg.role === "ai" && (
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>
                  {msg.isNudge ? "🌙" : msg.isCheckin ? "💜" : "💛"}
                </div>
              )}
              <div>
                {msg.role === "ai" && msg.emotion && <div style={{ marginBottom: 4 }}><EmotionBadge emotion={msg.emotion} /></div>}
                <div style={{ maxWidth: "85%", padding: "13px 17px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role === "user" ? `linear-gradient(135deg, ${C.purple}, ${C.indigo})` : (dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)"), border: msg.role === "ai" ? `1px solid ${t.border}` : "none", color: t.textPrimary, fontSize: 14, lineHeight: 1.75, boxShadow: msg.role === "user" ? `0 4px 20px rgba(124,58,237,0.3)` : "none" }}>
                  {msg.text}
                  <div style={{ fontSize: 11, color: msg.role === "user" ? "rgba(255,255,255,0.45)" : t.textMuted, marginTop: 6 }}>{msg.time}</div>
                </div>
              </div>
            </motion.div>
          ))}
          {typing && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>💛</div>
              <div style={{ padding: "13px 17px", borderRadius: "18px 18px 18px 4px", background: dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.9)", border: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(i => <motion.div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.purple }} animate={{ y: [0, -6, 0] }} transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick suggestions */}
        <div style={{ padding: "8px 16px", display: "flex", gap: 6, flexWrap: "wrap", borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
          {suggestions.slice(0, 3).map(s => (
            <motion.button key={s} whileHover={{ scale: 1.02 }} onClick={() => send(s)}
              style={{ padding: "5px 11px", borderRadius: 20, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{s}</motion.button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${t.border}`, display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Share what's on your mind..."
            style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: `1px solid ${t.border}`, background: t.inputBg, color: t.textPrimary, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          <GlowButton dark={dark} small onClick={() => send()}>Send →</GlowButton>
        </div>
      </GlassCard>

      {/* Right panel */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowSOS(true)}
          style={{ width: "100%", padding: "12px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.5)", background: "rgba(239,68,68,0.1)", color: C.red, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
          🆘 Crisis Support
        </motion.button>

        <GlassCard dark={dark} style={{ padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: t.textPrimary, marginBottom: 10 }}>💼 More Prompts</div>
          {suggestions.slice(3).map(s => (
            <motion.button key={s} whileHover={{ x: 3 }} onClick={() => send(s)}
              style={{ width: "100%", textAlign: "left", padding: "8px 0", border: "none", borderBottom: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, cursor: "pointer", fontSize: 12, display: "flex", gap: 6, fontFamily: "inherit" }}>
              <span style={{ color: C.purple }}>→</span> {s}
            </motion.button>
          ))}
        </GlassCard>

        <GlassCard dark={dark} style={{ padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary, marginBottom: 10 }}>📈 Session Stats</div>
          {[
            { label: "Messages Today", value: messages.filter(m => m.role === "user").length },
            { label: "Active Sessions", value: chatSessions.length },
            { label: "Current Stress", value: `${stressScore}%` },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: t.textSecondary }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.textPrimary }}>{s.value}</span>
            </div>
          ))}
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default ChatPage;
