import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { C, useTheme, ROLES } from "../lib/theme";
import { GlassCard, GlowButton } from "./ui";

// ─── ROLE SELECTOR CARD ───────────────────────────────────────────────────────
const RoleCard = ({ role, selected, onSelect, dark }) => {
  const t = useTheme(dark);
  const cfg = ROLES[role];
  const isSelected = selected === role;

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(role)}
      style={{
        flex: 1,
        minWidth: 110,
        padding: "18px 12px",
        borderRadius: 16,
        border: isSelected ? `2px solid ${cfg.color}` : `1px solid ${t.border}`,
        background: isSelected
          ? `${cfg.color}18`
          : dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.6)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        transition: "all 0.2s",
        position: "relative",
        overflow: "hidden",
        boxShadow: isSelected ? `0 0 24px ${cfg.color}30` : "none",
      }}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: "absolute", top: 8, right: 8,
            width: 18, height: 18, borderRadius: "50%",
            background: cfg.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, color: "white", fontWeight: 700,
          }}
        >✓</motion.div>
      )}
      <motion.div
        animate={{ scale: isSelected ? 1.15 : 1 }}
        style={{
          width: 48, height: 48, borderRadius: 14,
          background: isSelected ? cfg.gradient : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, boxShadow: isSelected ? `0 4px 16px ${cfg.color}40` : "none",
          transition: "all 0.3s",
        }}
      >
        {cfg.icon}
      </motion.div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? cfg.color : t.textPrimary, textAlign: "center" }}>
          {cfg.label}
        </div>
      </div>
    </motion.button>
  );
};

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
const AuthPage = ({ mode, setPage, setRole, dark }) => {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const t = useTheme(dark);
  const roleCfg = ROLES[selectedRole];

  const handleSubmit = () => {
    if (!email) { setError("Please enter your email."); return; }
    if (mode !== "forgot" && !password) { setError("Please enter your password."); return; }
    if (mode !== "forgot" && password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    setLoading(true);
    // Simulate auth delay then navigate
    setTimeout(() => {
      setLoading(false);
      if (setRole) setRole(selectedRole);
      setPage(ROLES[selectedRole].defaultPage);
    }, 900);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const inputStyle = (focused) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1.5px solid ${focused ? roleCfg.color : t.border}`,
    background: t.inputBg,
    color: t.textPrimary,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  });

  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", fontFamily: "inherit" }}>
      {/* ── Left decorative panel ── */}
      <div style={{
        flex: 1,
        background: dark
          ? `linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))`
          : `linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "60px 40px",
        borderRight: `1px solid ${t.border}`,
        position: "relative", overflow: "hidden",
      }}>
        {/* Ambient glows */}
        <div style={{ position: "absolute", top: "20%", left: "30%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}20, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "25%", right: "20%", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${C.cyan}15, transparent 70%)`, pointerEvents: "none" }} />

        {/* Logo */}
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
          style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: `0 8px 32px ${C.purple}50` }}>✦</div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: t.textPrimary, letterSpacing: "-0.5px" }}>Mendora</div>
            <div style={{ fontSize: 12, color: t.textSecondary }}>AI Wellness Platform</div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}
          style={{ fontSize: 30, fontWeight: 900, color: t.textPrimary, textAlign: "center", marginBottom: 16, lineHeight: 1.2 }}
        >
          Your Wellbeing<br />Matters
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
          style={{ color: t.textSecondary, textAlign: "center", maxWidth: 320, lineHeight: 1.7, fontSize: 15, marginBottom: 48 }}
        >
          Mendora AI supports every stakeholder in the student wellness ecosystem — with compassion, intelligence, and care.
        </motion.p>

        {/* Animated emoji row */}
        <div style={{ display: "flex", gap: 20 }}>
          {["😊", "🧘", "📊", "🤖", "🕊️"].map((e, i) => (
            <motion.div key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.5, delay: i * 0.35, repeat: Infinity }}
              style={{ fontSize: 28 }}
            >{e}</motion.div>
          ))}
        </div>

        {/* Role-specific description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRole}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: 40, padding: "16px 24px", borderRadius: 14,
              background: `${roleCfg.color}15`,
              border: `1px solid ${roleCfg.color}30`,
              maxWidth: 340, textAlign: "center",
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 8 }}>{roleCfg.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: roleCfg.color, marginBottom: 4 }}>{roleCfg.label} Portal</div>
            <div style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.6 }}>{roleCfg.description}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 40px" }}>
        <div style={{ width: "100%", maxWidth: 460 }}>
          {/* Header */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
            style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: t.textPrimary, marginBottom: 6 }}>
              {mode === "login" ? "Welcome back 👋" : mode === "signup" ? "Create account ✨" : "Reset password 🔑"}
            </h1>
            <p style={{ color: t.textSecondary, fontSize: 14 }}>
              {mode === "login" ? "Choose your role and sign in to continue" : mode === "signup" ? "Select your role to get started" : "We'll send you a reset link"}
            </p>
          </motion.div>

          {/* ── ROLE SELECTOR ── */}
          {mode !== "forgot" && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }}
              style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.textSecondary, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Sign in as
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {Object.keys(ROLES).map(role => (
                  <RoleCard key={role} role={role} selected={selectedRole} onSelect={setSelectedRole} dark={dark} />
                ))}
              </div>
            </motion.div>
          )}

          <GlassCard dark={dark} style={{ padding: 28 }}>
            {/* Social login */}
            {mode !== "forgot" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                  {[{ label: "Google", icon: "G" }, { label: "Microsoft", icon: "M" }].map(s => (
                    <motion.button key={s.label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      style={{ padding: "10px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.inputBg, color: t.textSecondary, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
                      <span style={{ width: 18, height: 18, borderRadius: 4, background: roleCfg.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", fontWeight: 700 }}>{s.icon}</span>
                      {s.label}
                    </motion.button>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: t.border }} />
                  <span style={{ fontSize: 12, color: t.textMuted }}>or continue with email</span>
                  <div style={{ flex: 1, height: 1, background: t.border }} />
                </div>
              </>
            )}

            {/* Signup name fields */}
            {mode === "signup" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                {["First Name", "Last Name"].map(p => (
                  <div key={p}>
                    <label style={{ fontSize: 12, color: t.textSecondary, display: "block", marginBottom: 6 }}>{p}</label>
                    <input placeholder={p} onKeyDown={handleKeyDown}
                      style={inputStyle(false)} />
                  </div>
                ))}
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: t.textSecondary, display: "block", marginBottom: 6 }}>Email</label>
              <input
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
                placeholder={selectedRole === "student" ? "you@university.edu.pk" : selectedRole === "admin" ? "admin@mendora.pk" : "counselor@university.edu.pk"}
                style={inputStyle(!!email)}
              />
            </div>

            {/* Password */}
            {mode !== "forgot" && (
              <div style={{ marginBottom: error ? 12 : 24, position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: 12, color: t.textSecondary }}>Password</label>
                  {mode === "login" && (
                    <span style={{ fontSize: 12, color: roleCfg.color, cursor: "pointer" }} onClick={() => setPage("forgot")}>
                      Forgot password?
                    </span>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"} value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••"
                    style={{ ...inputStyle(!!password), paddingRight: 44 }}
                  />
                  <button onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: t.textSecondary, cursor: "pointer", fontSize: 16 }}>
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
            )}

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: C.red, fontSize: 13, marginBottom: 16 }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: `0 8px 30px ${roleCfg.color}50` }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%", padding: "14px", borderRadius: 12, border: "none",
                background: loading ? "rgba(124,58,237,0.4)" : roleCfg.gradient,
                color: "white", cursor: loading ? "not-allowed" : "pointer",
                fontSize: 15, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: "inherit",
                boxShadow: `0 4px 20px ${roleCfg.color}30`,
              }}
            >
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                  Signing in...
                </>
              ) : (
                <>
                  {roleCfg.icon} {mode === "login" ? `Sign In as ${roleCfg.label}` : mode === "signup" ? "Create Account" : "Send Reset Link"} →
                </>
              )}
            </motion.button>

            {/* Footer links */}
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${t.border}`, textAlign: "center", fontSize: 13, color: t.textSecondary }}>
              {mode === "login" ? (
                <>Don't have an account?{" "}
                  <span style={{ color: roleCfg.color, cursor: "pointer", fontWeight: 600 }} onClick={() => setPage("signup")}>Sign up</span>
                </>
              ) : mode === "signup" ? (
                <>Already have an account?{" "}
                  <span style={{ color: roleCfg.color, cursor: "pointer", fontWeight: 600 }} onClick={() => setPage("login")}>Sign in</span>
                </>
              ) : (
                <>Remember your password?{" "}
                  <span style={{ color: roleCfg.color, cursor: "pointer", fontWeight: 600 }} onClick={() => setPage("login")}>Sign in</span>
                </>
              )}
            </div>
          </GlassCard>

          {/* Back to landing */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <span style={{ fontSize: 13, color: t.textMuted, cursor: "pointer" }} onClick={() => setPage("landing")}>
              ← Back to home
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
