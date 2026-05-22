# ✦ Mendora AI — University Mental Wellness Platform

> **Version 2.0** — Fully split source code (no more single-file crash risk)

---

## 📁 Project Structure

```
mendora-ai/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              ← React entry point
    ├── App.jsx               ← Root router + layout shell
    │
    ├── lib/
    │   ├── theme.js          ← Design tokens, useTheme hook, ROLES config
    │   └── aiEngine.js       ← AI response engine, crisis detection, safety filters
    │
    ├── data/
    │   └── mockData.js       ← All mock data (charts, students, chat history…)
    │
    ├── components/
    │   ├── ui.jsx            ← Shared primitives: GlassCard, GlowButton, StatCard…
    │   ├── Layout.jsx        ← Sidebar, TopNav, FloatingAIWidget, NotificationsPanel
    │   └── AuthPage.jsx      ← Login/Signup/ForgotPassword — 3-ROLE SELECTOR ✨
    │
    └── pages/
        ├── LandingPage.jsx   ← Marketing landing page
        ├── DashboardPage.jsx ← Student dashboard with charts & widgets
        ├── ChatPage.jsx      ← AI companion chat with safety layer
        ├── WellnessPages.jsx ← MoodPage, AnalyticsPage, CalmPage, FocusPage
        └── AdminPages.jsx    ← CounselorPage, AdminPage, ProfilePage
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run dev server
```bash
npm run dev
```
App opens at **http://localhost:3000**

### 3. Build for production
```bash
npm run build
```

---

## 🔑 Key Changes in v2.0

### ✅ 1. 3-Role Login Page (NEW)
The login page now has **three distinct portals**:

| Role | Portal | Default page after login |
|------|--------|--------------------------|
| 🎓 **Student / User** | Purple | Dashboard |
| 👨‍⚕️ **Counselor** | Cyan | Counselor panel |
| ⚙️ **Admin** | Pink | Admin dashboard |

Each role shows:
- A distinct colour theme on the login button
- Role-specific email placeholder
- A description card on the left panel
- After login, routes to the correct default page
- Sidebar shows only the pages relevant to that role

### ✅ 2. Source Code Split (No More Single File)
The original `all_chunk_mendora.jsx` was **3,831 lines in one file** — any large component will cause React to re-render the entire tree on every state change. Now split into **10 focused files** so:
- Hot reload is instant
- Each file is independently editable
- Bugs are easy to locate

### ✅ 3. All Buttons Verified & Working
Every interactive element was audited:
- ✅ Login/Signup submit — routes correctly
- ✅ Role selector — updates button label, color, default page
- ✅ Sidebar nav — role-filtered, all routes connected
- ✅ Floating AI widget — all 4 quick actions navigate correctly
- ✅ Notifications bell — opens/closes panel
- ✅ Theme toggle (☀️/🌙) — animates, persists in session
- ✅ Calm Mode breathing — starts/pauses/resets
- ✅ Pomodoro timer — modes switch, pause/resume/reset work
- ✅ Mood log — selection + sliders + journal → success state
- ✅ Chat send — Enter key + Send button both work
- ✅ Chat history — switching sessions works
- ✅ New Chat — saves old session to history list
- ✅ SOS crisis modal — counselor alert state changes
- ✅ Guidelines modal — accept flow works
- ✅ Weekly Report modal — download generates a .txt file
- ✅ Burnout alert — expand/collapse + dismiss
- ✅ High stress auto-alert — fires after threshold, links to SOS
- ✅ Counselor Notes modal — save/cancel work
- ✅ Profile — all toggles, dropdowns, save confirm
- ✅ Focus timer — all 3 modes, distraction log
- ✅ Back to landing link on auth pages

### ✅ 4. AI Safety Layer
- Crisis keyword detection → opens SOS modal
- Hard-block keywords → polite refusal (no academic cheating, weapons, etc.)
- Unsafe content filter → redirects to wellness topics
- Late-night nudge (after 11pm)
- Inactivity check-in (after 3 min silence)
- Running stress score with auto-alert at 80%

---

## 🎨 Design System

Tokens are in `src/lib/theme.js`. Role accent colours:

```js
student:   purple  #7C3AED
counselor: cyan    #06B6D4
admin:     pink    #EC4899
```

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `react` + `react-dom` | UI framework |
| `framer-motion` | Animations & transitions |
| `recharts` | All charts (Area, Bar, Radar, Pie, Line) |
| `vite` | Build tool & dev server |

---

## 🔒 Crisis Support Numbers (Pakistan)
- **Umang:** 0311-7786264 (24/7)
- **Rozan Counseling:** 051-2890505
- **Umang WhatsApp:** 0317-4288665
- **Emergency:** 1122

---

Built with 💜 for student mental wellness.
