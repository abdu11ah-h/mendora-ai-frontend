// ─── MENDORA AI — MAIN APP ────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useTheme } from "./lib/theme";
import { authAPI, getToken, getUser, setUser, clearTokens } from "./lib/api";

import { Sidebar, TopNav, FloatingAIWidget } from "./components/Layout";
import AuthPage from "./components/AuthPage";
import LandingPage from "./pages/LandingPage";

import DashboardPage from "./pages/DashboardPage";
import ChatPage from "./pages/ChatPage";
import { MoodPage, AnalyticsPage, CalmPage, FocusPage } from "./pages/WellnessPages";
import ExamPage from "./pages/ExamPage";
import { CounselorPage, AdminPage, ProfilePage } from "./pages/AdminPages";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const AUTH_PAGES = ["landing", "login", "signup", "forgot"];

export default function App() {
  const [page, setPage] = useState("landing");
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(true);
  const [role, setRole] = useState("student");
  const [user, setUserState] = useState(() => getUser());
  const [sessionReady, setSessionReady] = useState(false);

  const t = useTheme(dark);
  const isAuth = AUTH_PAGES.includes(page);

  const applyUser = useCallback((u) => {
    setUserState(u);
    if (u) {
      setUser(u);
      if (u.role) setRole(u.role);
    }
  }, []);

  const logout = useCallback(async () => {
    await authAPI.logout().catch(() => {});
    clearTokens();
    setUserState(null);
    setPage("login");
  }, []);

  // Restore session from saved token
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getToken();
      if (!token) {
        setSessionReady(true);
        return;
      }
      try {
        const me = await authAPI.me();
        if (!cancelled) {
          applyUser(me);
          if (AUTH_PAGES.includes(page)) setPage(me.role === "admin" ? "admin" : me.role === "counselor" ? "counselor" : "dashboard");
        }
      } catch {
        clearTokens();
        if (!cancelled) setUserState(null);
      } finally {
        if (!cancelled) setSessionReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Email verification link: /verify-email?token=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token || !window.location.pathname.includes("verify-email")) return;

    (async () => {
      try {
        await authAPI.verifyEmail(token);
        window.history.replaceState({}, "", "/");
        setPage("login");
        alert("Email verified! You can sign in now.");
      } catch (e) {
        alert(e.message || "Verification failed.");
      }
    })();
  }, []);

  // Block app pages without a real login
  useEffect(() => {
    if (!sessionReady) return;
    if (!AUTH_PAGES.includes(page) && !getToken()) {
      setPage("login");
    }
  }, [page, sessionReady]);

  const guardedSetPage = (next) => {
    if (!AUTH_PAGES.includes(next) && !getToken()) {
      setPage("login");
      return;
    }
    setPage(next);
  };

  const renderPage = () => {
    switch (page) {
      case "landing":
        return <LandingPage setPage={guardedSetPage} dark={dark} setDark={setDark} />;
      case "login":
        return (
          <AuthPage
            mode="login"
            setPage={guardedSetPage}
            setRole={setRole}
            dark={dark}
            onAuth={applyUser}
          />
        );
      case "signup":
        return (
          <AuthPage
            mode="signup"
            setPage={guardedSetPage}
            setRole={setRole}
            dark={dark}
            onAuth={applyUser}
          />
        );
      case "forgot":
        return <AuthPage mode="forgot" setPage={guardedSetPage} dark={dark} />;

      case "dashboard":
        return <DashboardPage setPage={guardedSetPage} dark={dark} user={user} />;
      case "chat":
        return <ChatPage dark={dark} user={user} />;
      case "mood":
        return <MoodPage dark={dark} user={user} />;
      case "analytics":
        return <AnalyticsPage dark={dark} user={user} />;
      case "calm":
        return <CalmPage dark={dark} />;
      case "focus":
        return <FocusPage dark={dark} />;
      case "exam":
        return <ExamPage dark={dark} />;

      case "counselor":
        return <CounselorPage dark={dark} />;
      case "admin":
        return <AdminPage dark={dark} />;
      case "profile":
        return <ProfilePage dark={dark} setDark={setDark} user={user} onUserUpdate={applyUser} onLogout={logout} />;

      default:
        return <DashboardPage setPage={guardedSetPage} dark={dark} user={user} />;
    }
  };

  if (!sessionReady && getToken()) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: t.bg, color: t.textSecondary, fontFamily: "Inter, system-ui, sans-serif" }}>
        Loading your account…
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      background: t.bg,
      minHeight: "100vh",
      color: t.textPrimary,
      transition: "background 0.3s, color 0.3s",
    }}>
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

      {isAuth ? (
        <AnimatePresence mode="wait">
          <motion.div key={page} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div style={{ display: "flex" }}>
          <Sidebar page={page} setPage={guardedSetPage} collapsed={collapsed} setCollapsed={setCollapsed} dark={dark} role={role} user={user} onLogout={logout} />
          <div style={{ marginLeft: collapsed ? 70 : 240, flex: 1, minHeight: "100vh", transition: "margin-left 0.3s ease" }}>
            <TopNav page={page} setPage={guardedSetPage} dark={dark} setDark={setDark} role={role} user={user} />
            <div style={{ padding: 24 }}>
              <AnimatePresence mode="wait">
                <motion.div key={page} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
                  {renderPage()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          {role === "student" && <FloatingAIWidget setPage={guardedSetPage} dark={dark} />}
        </div>
      )}
    </div>
  );
}
