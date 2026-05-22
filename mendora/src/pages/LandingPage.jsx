import { motion } from "framer-motion";
import { C, useTheme } from "../lib/theme";
import { GlassCard, GlowButton } from "../components/ui";
import { features, howItWorks, testimonials } from "../data/mockData";

const LandingPage = ({ setPage, dark, setDark }) => {
  const t = useTheme(dark);

  return (
    <div style={{ minHeight: "100vh", background: t.bg }}>
      {/* ── Navbar ── */}
      <div style={{ padding: "20px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${t.border}`, backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, background: t.topbar }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: `0 4px 16px ${C.purple}40` }}>✦</div>
          <span style={{ fontSize: 18, fontWeight: 800, color: t.textPrimary, letterSpacing: "-0.5px" }}>Mendora AI</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <motion.button whileHover={{ scale: 1.1 }} onClick={() => setDark(!dark)}
            style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
            {dark ? "☀️" : "🌙"}
          </motion.button>
          <GlowButton dark={dark} secondary onClick={() => setPage("login")} small>Sign In</GlowButton>
          <GlowButton dark={dark} onClick={() => setPage("signup")} small>Get Started ↗</GlowButton>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ textAlign: "center", padding: "100px 24px 80px", position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-60%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}15, transparent 70%)`, pointerEvents: "none" }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: "rgba(124,58,237,0.15)", border: `1px solid rgba(124,58,237,0.3)`, marginBottom: 24 }}>
            <span style={{ fontSize: 14 }}>✨</span>
            <span style={{ fontSize: 13, color: C.purpleLight, fontWeight: 600 }}>AI-Powered University Mental Wellness</span>
          </div>

          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, color: t.textPrimary, marginBottom: 24, lineHeight: 1.1, letterSpacing: "-1px" }}>
            Your Mental Wellness,<br />
            <span style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Powered by AI
            </span>
          </h1>

          <p style={{ fontSize: 18, color: t.textSecondary, maxWidth: 580, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Mendora combines advanced AI with evidence-based wellness practices to support university students through stress, burnout, and emotional challenges.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <GlowButton dark={dark} onClick={() => setPage("signup")} style={{ fontSize: 16, padding: "14px 32px" }}>
              Start Your Journey ↗
            </GlowButton>
            <GlowButton dark={dark} secondary onClick={() => setPage("dashboard")} style={{ fontSize: 16, padding: "14px 32px" }}>
              View Demo
            </GlowButton>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
          style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 64, flexWrap: "wrap" }}>
          {[["4,800+", "Students Supported"], ["94%", "Stress Reduction"], ["24/7", "AI Availability"]].map(([val, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: t.textPrimary }}>{val}</div>
              <div style={{ fontSize: 13, color: t.textSecondary }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Features ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: t.textPrimary, marginBottom: 12 }}>Everything You Need to Thrive</h2>
          <p style={{ color: t.textSecondary }}>Comprehensive wellness tools built specifically for university students</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GlassCard dark={dark} hover>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: t.textPrimary, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.6 }}>{f.desc}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── How It Works ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: t.textPrimary, marginBottom: 12 }}>How Mendora Works</h2>
          <p style={{ color: t.textSecondary }}>Simple steps to transform your mental wellness journey</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {howItWorks.map((step, i) => (
            <motion.div key={step.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <GlassCard dark={dark} hover>
                <div style={{ fontSize: 40, fontWeight: 900, color: C.purple, opacity: 0.3, marginBottom: 8 }}>{step.step}</div>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{step.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.6 }}>{step.desc}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: t.textPrimary, textAlign: "center", marginBottom: 40 }}>What Students Say</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {testimonials.map((test, i) => (
            <motion.div key={test.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GlassCard dark={dark} hover>
                <div style={{ fontSize: 20, marginBottom: 12, color: C.amber }}>★★★★★</div>
                <p style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>"{test.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white" }}>{test.avatar}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary }}>{test.name}</div>
                    <div style={{ fontSize: 12, color: t.textSecondary }}>{test.role}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Emergency support ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>
        <GlassCard dark={dark} style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🆘</div>
          <h3 style={{ fontSize: 24, fontWeight: 800, color: t.textPrimary, marginBottom: 12 }}>Emergency Support — Always Available</h3>
          <p style={{ color: t.textSecondary, maxWidth: 500, margin: "0 auto 20px" }}>If you or someone you know is in crisis, reach out immediately. You are never alone.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <div style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: C.red, fontSize: 14, fontWeight: 600 }}>Umang: 0311-7786264</div>
            <div style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: C.red, fontSize: 14, fontWeight: 600 }}>24/7 Available</div>
          </div>
        </GlassCard>
      </div>

      {/* ── CTA ── */}
      <div style={{ textAlign: "center", padding: "0 24px 80px" }}>
        <GlassCard dark={dark} style={{ maxWidth: 600, margin: "0 auto", background: dark ? "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))" : "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.06))" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: t.textPrimary, marginBottom: 12 }}>Ready to Begin Your Wellness Journey?</h2>
          <p style={{ color: t.textSecondary, marginBottom: 24 }}>Join thousands of students already thriving with Mendora AI.</p>
          <GlowButton dark={dark} onClick={() => setPage("signup")} style={{ fontSize: 16, padding: "14px 32px" }}>Get Started Free ↗</GlowButton>
        </GlassCard>
      </div>

      {/* ── Footer ── */}
      <div style={{ borderTop: `1px solid ${t.border}`, padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: t.textPrimary }}>Mendora AI</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy Policy", "Terms of Service", "Support", "Contact"].map(item => (
            <span key={item} style={{ fontSize: 13, color: t.textSecondary, cursor: "pointer" }}>{item}</span>
          ))}
        </div>
        <div style={{ fontSize: 13, color: t.textMuted }}>© 2026 Mendora AI. Built with 💜 for students.</div>
      </div>
    </div>
  );
};

export default LandingPage;
