// ─── MENDORA AI — MAIN APP ────────────────────────────────────────────────────
// Properly split into source files for stability and maintainability.
// Entry point: src/App.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Theme
import { useTheme } from "./lib/theme";

// Layout
import { Sidebar, TopNav, FloatingAIWidget } from "./components/Layout";

// Auth & Landing
import AuthPage    from "./components/AuthPage";
import LandingPage from "./pages/LandingPage";

// App pages
import DashboardPage from "./pages/DashboardPage";
import ChatPage      from "./pages/ChatPage";
import { MoodPage, AnalyticsPage, CalmPage, FocusPage } from "./pages/WellnessPages";
import ExamPage from "./pages/ExamPage";
import { CounselorPage, AdminPage, ProfilePage }         from "./pages/AdminPages";

// ── Page transition variants ──────────────────────────────────────────────────
const pageVariants = {
  initial:  { opacity: 0, y: 16 },
  animate:  { opacity: 1, y: 0  },
  exit:     { opacity: 0, y: -16 },
};

// ── Auth-only pages (no sidebar/topbar) ───────────────────────────────────────
const AUTH_PAGES = ["landing", "login", "signup", "forgot"];

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page,      setPage]      = useState("landing");
  const [collapsed, setCollapsed] = useState(false);
  const [dark,      setDark]      = useState(true);
  const [role,      setRole]      = useState("student"); // "student" | "counselor" | "admin"

  const t = useTheme(dark);
  const isAuth = AUTH_PAGES.includes(page);

  // ── Page renderer ──────────────────────────────────────────────────────────
  const renderPage = () => {
    switch (page) {
      // Auth / landing
      case "landing":   return <LandingPage setPage={setPage} dark={dark} setDark={setDark} />;
      case "login":     return <AuthPage mode="login"  setPage={setPage} setRole={setRole} dark={dark} />;
      case "signup":    return <AuthPage mode="signup" setPage={setPage} setRole={setRole} dark={dark} />;
      case "forgot":    return <AuthPage mode="forgot" setPage={setPage} dark={dark} />;

      // Student pages
      case "dashboard": return <DashboardPage setPage={setPage} dark={dark} />;
      case "chat":      return <ChatPage dark={dark} />;
      case "mood":      return <MoodPage dark={dark} />;
      case "analytics": return <AnalyticsPage dark={dark} />;
      case "calm":      return <CalmPage dark={dark} />;
      case "focus":     return <FocusPage dark={dark} />;
      case "exam":      return <ExamPage dark={dark} />;

      // Counselor / Admin pages
      case "counselor": return <CounselorPage dark={dark} />;
      case "admin":     return <AdminPage dark={dark} />;
      case "profile":   return <ProfilePage dark={dark} setDark={setDark} />;

      // Fallback
      default:          return <DashboardPage setPage={setPage} dark={dark} />;
    }
  };

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: t.bg,
      minHeight: "100vh",
      color: t.textPrimary,
      transition: "background 0.3s, color 0.3s",
    }}>
      {/* ── Global styles ── */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 4px; }
        input, textarea, select, button { font-family: inherit; }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        a { color: inherit; text-decoration: none; }
      `}</style>

      {/* ── Auth pages (no sidebar) ── */}
      {isAuth ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>

      ) : (
        /* ── Authenticated shell with sidebar ── */
        <div style={{ display: "flex" }}>
          <Sidebar
            page={page}
            setPage={setPage}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            dark={dark}
            role={role}
          />

          <div style={{
            marginLeft: collapsed ? 70 : 240,
            flex: 1,
            minHeight: "100vh",
            transition: "margin-left 0.3s ease",
          }}>
            <TopNav
              page={page}
              setPage={setPage}
              dark={dark}
              setDark={setDark}
              role={role}
            />

            <div style={{ padding: 24 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={page}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                >
                  {renderPage()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Floating AI quick-action widget (student only) */}
          {role === "student" && (
            <FloatingAIWidget setPage={setPage} dark={dark} />
          )}
        </div>
      )}
    </div>
  );
}
