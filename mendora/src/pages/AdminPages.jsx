import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { C, useTheme } from "../lib/theme";
import { GlassCard, StatCard, GlowButton, RiskBadge, ProgressBar, Toggle } from "../components/ui";
import { students, adminStats, weeklyWellness } from "../data/mockData";

// ─── COUNSELOR PAGE ────────────────────────────────────────────────────────────
export const CounselorPage = ({ dark }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [note, setNote] = useState("");
  const t = useTheme(dark);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 16 }}>
        <StatCard dark={dark} label="Assigned Students" value="24"  icon="👥" color={C.blue}  />
        <StatCard dark={dark} label="High Risk"          value="3"   icon="🚨" color={C.red}   />
        <StatCard dark={dark} label="Sessions Today"     value="8"   icon="📋" color={C.green} />
        <StatCard dark={dark} label="Avg Wellness"       value="65%" icon="💚" color={C.cyan}  />
      </div>

      <GlassCard dark={dark} style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>Student Wellness Overview</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Student", "Risk Level", "Mood Score", "Sessions", "Last Active", "Status", "Action"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, color: t.textSecondary, fontWeight: 600, borderBottom: `1px solid ${t.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.indigo})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white" }}>
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span style={{ fontSize: 14, color: t.textPrimary, fontWeight: 500 }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: 12 }}><RiskBadge risk={s.risk} /></td>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 60, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)" }}>
                        <div style={{ width: `${s.mood}%`, height: "100%", borderRadius: 2, background: s.mood > 60 ? C.green : s.mood > 40 ? C.amber : C.red }} />
                      </div>
                      <span style={{ fontSize: 13, color: t.textSecondary }}>{s.mood}</span>
                    </div>
                  </td>
                  <td style={{ padding: 12, fontSize: 13, color: t.textSecondary }}>{s.sessions}</td>
                  <td style={{ padding: 12, fontSize: 13, color: t.textSecondary }}>{s.lastSeen}</td>
                  <td style={{ padding: 12 }}><RiskBadge risk={s.status === "At Risk" ? "high" : s.status === "Monitoring" ? "medium" : "low"} /></td>
                  <td style={{ padding: 12 }}>
                    <GlowButton dark={dark} small onClick={() => setSelectedStudent(s)}>Notes</GlowButton>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <GlassCard dark={dark}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>Student Mood Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={students.map(s => ({ name: s.name.split(" ")[0], mood: s.mood }))}>
              <XAxis dataKey="name" tick={{ fill: t.textSecondary, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: t.textSecondary, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.textPrimary }} />
              <Bar dataKey="mood" radius={[4, 4, 0, 0]} fill={C.purple} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard dark={dark}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 12 }}>🚨 Active Alerts</div>
          {students.filter(s => s.risk === "high").map(s => (
            <motion.div key={s.id} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              style={{ padding: 12, borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: C.red }}>Mood: {s.mood}/100 • {s.lastSeen}</div>
                </div>
                <GlowButton dark={dark} small style={{ background: `linear-gradient(135deg, ${C.red}, #DC2626)` }}>Contact</GlowButton>
              </div>
            </motion.div>
          ))}
        </GlassCard>
      </div>

      {/* Session Notes Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => setSelectedStudent(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ width: "90%", maxWidth: 500, padding: 28, borderRadius: 20, background: dark ? "#0d0d1a" : "#fff", border: `1px solid ${t.border}` }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: t.textPrimary, marginBottom: 4 }}>Session Notes — {selectedStudent.name}</div>
              <div style={{ fontSize: 13, color: t.textSecondary, marginBottom: 20 }}>
                Risk: <RiskBadge risk={selectedStudent.risk} /> • Mood: {selectedStudent.mood}/100
              </div>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="Add session notes, observations, or follow-up actions..."
                rows={5}
                style={{ width: "100%", padding: 14, borderRadius: 10, border: `1px solid ${t.border}`, background: t.inputBg, color: t.textPrimary, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6, fontFamily: "inherit" }} />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
                <GlowButton dark={dark} secondary onClick={() => setSelectedStudent(null)}>Cancel</GlowButton>
                <GlowButton dark={dark} onClick={() => setSelectedStudent(null)}>Save Notes</GlowButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── ADMIN PAGE ────────────────────────────────────────────────────────────────
export const AdminPage = ({ dark }) => {
  const t = useTheme(dark);
  const users = [
    { name: "Sara Ahmed",  role: "Student",   status: "Active",  wellness: 78 },
    { name: "Dr. Imran",   role: "Counselor", status: "Active",  wellness: 90 },
    { name: "Hamza Ali",   role: "Student",   status: "At Risk", wellness: 28 },
    { name: "Zara Hussain",role: "Student",   status: "Active",  wellness: 88 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 16 }}>
        {adminStats.map(s => <StatCard dark={dark} key={s.label} {...s} color={C.purple} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <GlassCard dark={dark}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>Platform Activity (8 Weeks)</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyWellness.map((d, i) => ({ ...d, users: 800 + i * 120 }))}>
              <defs>
                <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.purple} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={C.purple} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: t.textSecondary, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: t.tooltipBg, border: `1px solid ${t.border}`, borderRadius: 8, color: t.textPrimary }} />
              <Area type="monotone" dataKey="users" stroke={C.purple} fill="url(#usersGrad)" strokeWidth={2} name="Active Users" />
              <Line type="monotone" dataKey="score" stroke={C.cyan} strokeWidth={2} dot={false} name="Wellness Score" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard dark={dark}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>System Health</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "AI Uptime",       value: 99.8, color: C.green  },
              { label: "DB Performance",  value: 94,   color: C.cyan   },
              { label: "API Response",    value: 87,   color: C.amber  },
              { label: "Security Score",  value: 98,   color: C.purple },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: t.textSecondary }}>{item.label}</span>
                  <span style={{ fontSize: 12, color: item.color, fontWeight: 600 }}>{item.value}%</span>
                </div>
                <ProgressBar value={item.value} color={item.color} height={6} />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard dark={dark}>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>User Management</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["User", "Role", "Status", "Wellness", "Last Active", "Actions"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 12, color: t.textSecondary, fontWeight: 600, borderBottom: `1px solid ${t.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <motion.tr key={u.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                style={{ borderBottom: `1px solid ${t.border}` }}>
                <td style={{ padding: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white", fontWeight: 700 }}>
                      {u.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span style={{ fontSize: 14, color: t.textPrimary }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: 12, fontSize: 13, color: t.textSecondary }}>{u.role}</td>
                <td style={{ padding: 12 }}>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: u.status === "Active" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: u.status === "Active" ? C.green : C.red }}>
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 60, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)" }}>
                      <div style={{ width: `${u.wellness}%`, height: "100%", borderRadius: 2, background: u.wellness > 60 ? C.green : C.red }} />
                    </div>
                    <span style={{ fontSize: 12, color: t.textSecondary }}>{u.wellness}</span>
                  </div>
                </td>
                <td style={{ padding: 12, fontSize: 13, color: t.textSecondary }}>Today</td>
                <td style={{ padding: 12 }}><GlowButton dark={dark} small secondary>View</GlowButton></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </motion.div>
  );
};

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
export const ProfilePage = ({ dark, setDark }) => {
  const [notifs,     setNotifs]     = useState({ push: true, email: false, weekly: true, emergency: true });
  const [aiSettings, setAiSettings] = useState({ tone: "empathetic", language: "english", suggestions: true, nightMode: false });
  const [saved,      setSaved]      = useState(false);
  const t = useTheme(dark);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        {/* Profile card */}
        <GlassCard dark={dark} style={{ textAlign: "center" }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", margin: "0 auto 16px", background: `linear-gradient(135deg, ${C.purple}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: `0 0 40px ${C.purple}40`, color: "white", fontWeight: 700 }}>SA</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: t.textPrimary }}>Sara Ahmed</div>
          <div style={{ color: t.textSecondary, fontSize: 13, marginTop: 4 }}>Computer Science • Year 3</div>
          <div style={{ marginTop: 8 }}>
            <span style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(16,185,129,0.2)", color: C.green, fontSize: 12 }}>● Active</span>
          </div>
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[{ label: "Check-ins", v: "47" }, { label: "Streak", v: "12d" }, { label: "Sessions", v: "23" }, { label: "Score", v: "78" }].map(s => (
              <div key={s.label} style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: t.textPrimary }}>{s.v}</div>
                <div style={{ fontSize: 11, color: t.textSecondary }}>{s.label}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Edit profile */}
          <GlassCard dark={dark}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>Edit Profile</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["First Name", "Sara"], ["Last Name", "Ahmed"], ["Email", "sara@uni.edu.pk"], ["Student ID", "CS-2022-047"]].map(([label, val]) => (
                <div key={label}>
                  <label style={{ fontSize: 12, color: t.textSecondary, display: "block", marginBottom: 6 }}>{label}</label>
                  <input defaultValue={val} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.inputBg, color: t.textPrimary, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Notifications */}
          <GlassCard dark={dark}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>Notification Settings</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Push Notifications", key: "push"      },
                { label: "Email Reports",       key: "email"     },
                { label: "Weekly Reports",      key: "weekly"    },
                { label: "Emergency Alerts",    key: "emergency" },
              ].map(s => (
                <div key={s.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: t.textSecondary }}>{s.label}</span>
                  <Toggle value={notifs[s.key]} onChange={() => setNotifs(n => ({ ...n, [s.key]: !n[s.key] }))} />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* AI Personalization */}
          <GlassCard dark={dark}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary, marginBottom: 16 }}>🤖 AI Personalization</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: t.textSecondary, display: "block", marginBottom: 6 }}>AI Response Tone</label>
                <select value={aiSettings.tone} onChange={e => setAiSettings(a => ({ ...a, tone: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.inputBg, color: t.textPrimary, fontSize: 13, outline: "none", fontFamily: "inherit" }}>
                  <option value="empathetic">Empathetic & Warm</option>
                  <option value="direct">Direct & Practical</option>
                  <option value="motivational">Motivational</option>
                  <option value="calm">Calm & Gentle</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: t.textSecondary, display: "block", marginBottom: 6 }}>Preferred Language</label>
                <select value={aiSettings.language} onChange={e => setAiSettings(a => ({ ...a, language: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.inputBg, color: t.textPrimary, fontSize: 13, outline: "none", fontFamily: "inherit" }}>
                  <option value="english">English</option>
                  <option value="urdu">Urdu</option>
                  <option value="mixed">Mixed (Urdu/English)</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "AI Proactive Suggestions",  key: "suggestions" },
                { label: "Dark Mode",                 key: "darkMode",   special: true },
                { label: "Late Night Study Monitor",  key: "nightMode" },
              ].map(s => (
                <div key={s.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: t.textSecondary }}>{s.label}</span>
                  <Toggle
                    value={s.special ? dark : aiSettings[s.key]}
                    onChange={() => s.special ? setDark(!dark) : setAiSettings(a => ({ ...a, [s.key]: !a[s.key] }))} />
                </div>
              ))}
            </div>
          </GlassCard>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <GlowButton dark={dark} secondary>Cancel</GlowButton>
            <GlowButton dark={dark} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
              {saved ? "✓ Saved!" : "Save Changes"}
            </GlowButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
