import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, useTheme } from "../lib/theme";

// ─── NAV ITEMS (role-aware) ────────────────────────────────────────────────────
const ALL_NAV = [
  // Student
  { id: "dashboard", label: "Dashboard",    icon: "🏠", roles: ["student"] },
  { id: "chat",      label: "AI Companion", icon: "🤖", roles: ["student"] },
  { id: "mood",      label: "Mood Tracker", icon: "💭", roles: ["student"] },
  { id: "calm",      label: "Calm Mode",    icon: "🕊️", roles: ["student"] },
  { id: "focus",     label: "Focus Zone",   icon: "🎯", roles: ["student"] },
  { id: "analytics", label: "My Analytics", icon: "📊", roles: ["student"] },
  { id: "exam",      label: "Exam Mode",    icon: "🎓", roles: ["student"] },
  // Counselor
  { id: "counselor", label: "My Students",  icon: "👥", roles: ["counselor"] },
  { id: "analytics", label: "Analytics",    icon: "📊", roles: ["counselor"] },
  // Admin
  { id: "admin",     label: "Dashboard",    icon: "⚙️", roles: ["admin"] },
  { id: "analytics", label: "Analytics",    icon: "📊", roles: ["admin"] },
  { id: "counselor", label: "Counselors",   icon: "👨‍⚕️", roles: ["admin"] },
  // Shared
  { id: "profile",   label: "Profile",      icon: "👤", roles: ["student","counselor","admin"] },
];
// ─── NOTIFICATIONS PANEL ──────────────────────────────────────────────────────
const NotificationsPanel = ({ open, onClose, dark }) => {
  const t = useTheme(dark);
  const notifs = [
    { icon: "💚", title: "Daily Check-in Reminder",  time: "5m ago",   desc: "Don't forget to log your mood today!"              },
    { icon: "🚨", title: "High Stress Detected",     time: "1h ago",   desc: "Your stress levels were elevated yesterday."       },
    { icon: "🎯", title: "Study Streak",             time: "2h ago",   desc: "Amazing! 5-day focus streak maintained."           },
    { icon: "🤖", title: "AI Insight Ready",         time: "Today",    desc: "Your weekly wellness report is available."         },
    { icon: "👨‍⚕️", title: "Counselor Note",          time: "Yesterday",desc: "Dr. Imran left a note on your progress."          },
  ];
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200 }} />
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            style={{ position: "fixed", top: 70, right: 24, width: 320, zIndex: 201, background: t.sidebar, backdropFilter: "blur(20px)", border: `1px solid ${t.border}`, borderRadius: 16, boxShadow: `0 20px 60px rgba(0,0,0,0.3)`, overflow: "hidden" }}
          >
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary }}>Notifications</span>
              <span style={{ fontSize: 12, color: C.purpleLight, cursor: "pointer" }}>Mark all read</span>
            </div>
            {notifs.map((n, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                style={{ padding: "12px 20px", borderBottom: `1px solid ${t.border}`, cursor: "pointer" }}
                whileHover={{ background: "rgba(124,58,237,0.05)" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20 }}>{n.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: t.textSecondary, marginTop: 2 }}>{n.desc}</div>
                    <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>{n.time}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
export const Sidebar = ({ page, setPage, collapsed, setCollapsed, dark, role = "student" }) => {
  const t = useTheme(dark);
  const navItems = ALL_NAV.filter(n => n.roles.includes(role));

  return (
    <motion.div
      animate={{ width: collapsed ? 70 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ height: "100vh", background: t.sidebar, backdropFilter: "blur(20px)", borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, zIndex: 100, overflow: "hidden" }}
    >
      {/* Logo */}
      <div style={{ padding: "24px 16px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: `0 4px 16px ${C.purple}40` }}>✦</div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: t.textPrimary, letterSpacing: "-0.5px" }}>Mendora</div>
              <div style={{ fontSize: 10, color: t.textSecondary }}>AI Wellness</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 8px", overflowY: "auto" }}>
        {navItems.map((item) => {
          const active = page === item.id;
          return (
            <motion.button key={item.id} onClick={() => setPage(item.id)} whileHover={{ x: 2 }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", marginBottom: 4, borderRadius: 10, border: "none", cursor: "pointer", background: active ? `linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2))` : "transparent", borderLeft: active ? `2px solid ${C.purple}` : "2px solid transparent", color: active ? t.textPrimary : t.textSecondary, textAlign: "left", fontSize: 14, fontWeight: active ? 600 : 400, transition: "all 0.2s", fontFamily: "inherit" }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div style={{ padding: 16, borderTop: `1px solid ${t.border}` }}>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          style={{ width: "100%", padding: "8px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, cursor: "pointer", fontSize: 16, fontFamily: "inherit" }}>
          {collapsed ? "→" : "←"}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── TOP NAVBAR ───────────────────────────────────────────────────────────────
export const TopNav = ({ page, setPage, dark, setDark, role = "student" }) => {
  const t = useTheme(dark);
  const [notifOpen, setNotifOpen] = useState(false);
  const navItems = ALL_NAV.filter(n => n.roles.includes(role));
  const currentLabel = navItems.find(n => n.id === page)?.label || "Dashboard";

  return (
    <>
      <div style={{ height: 64, background: t.topbar, backdropFilter: "blur(20px)", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: t.textPrimary, textTransform: "capitalize" }}>
          {currentLabel}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {role === "student" && (
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => setPage("calm")}
              style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${C.amber}`, background: "rgba(245,158,11,0.1)", color: C.amber, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              🕊️ Calm Mode
            </motion.button>
          )}

          {/* Theme toggle */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }} onClick={() => setDark(!dark)}
            style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontFamily: "inherit" }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={dark ? "sun" : "moon"}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25 }}
                style={{ position: "absolute" }}>
                {dark ? "☀️" : "🌙"}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Notifications */}
          <motion.button whileHover={{ scale: 1.1 }} onClick={() => setNotifOpen(!notifOpen)}
            style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", fontSize: 16, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
            🔔
            <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: C.red, border: `2px solid ${t.bg}` }} />
          </motion.button>

          {/* Avatar */}
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer", fontWeight: 700, color: "white" }}>
            {role === "admin" ? "AD" : role === "counselor" ? "CR" : "SA"}
          </div>
        </div>
      </div>
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} dark={dark} />
    </>
  );
};

// ─── FLOATING AI WIDGET ───────────────────────────────────────────────────────
export const FloatingAIWidget = ({ setPage, dark }) => {
  const [open, setOpen] = useState(false);
  const t = useTheme(dark);
  const actions = [
    { label: "Talk to AI Companion", icon: "🤖", action: "chat"      },
    { label: "Log Your Mood",        icon: "💭", action: "mood"      },
    { label: "Start Calm Session",   icon: "🕊️", action: "calm"     },
    { label: "View Analytics",       icon: "📊", action: "analytics" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 999 }}>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }}
            style={{ position: "absolute", bottom: 70, right: 0, width: 260, background: t.sidebar, backdropFilter: "blur(20px)", border: `1px solid ${t.border}`, borderRadius: 16, padding: 16, boxShadow: `0 20px 60px rgba(0,0,0,0.4)` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>✦ Quick Actions</div>
            {actions.map(item => (
              <motion.button key={item.label} whileHover={{ x: 3 }} onClick={() => { setPage(item.action); setOpen(false); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer", fontSize: 13, marginBottom: 4, textAlign: "left", fontFamily: "inherit" }}>
                <span>{item.icon}</span> {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setOpen(!open)}
        animate={{ boxShadow: open ? `0 0 40px ${C.purple}80` : `0 0 20px ${C.purple}40` }}
        style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, border: "none", cursor: "pointer", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
        {open ? "✕" : "✦"}
      </motion.button>
    </div>
  );
};
