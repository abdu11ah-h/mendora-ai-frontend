import { C } from "../lib/theme";

export const moodData = [
  { day: "Mon", mood: 72, stress: 45, sleep: 7.2, energy: 68 },
  { day: "Tue", mood: 58, stress: 62, sleep: 6.1, energy: 52 },
  { day: "Wed", mood: 65, stress: 55, sleep: 6.8, energy: 60 },
  { day: "Thu", mood: 80, stress: 38, sleep: 8.0, energy: 78 },
  { day: "Fri", mood: 75, stress: 42, sleep: 7.5, energy: 72 },
  { day: "Sat", mood: 88, stress: 25, sleep: 8.5, energy: 85 },
  { day: "Sun", mood: 70, stress: 48, sleep: 7.0, energy: 65 },
];

export const weeklyWellness = [
  { week: "W1", score: 68 }, { week: "W2", score: 72 },
  { week: "W3", score: 65 }, { week: "W4", score: 78 },
  { week: "W5", score: 82 }, { week: "W6", score: 75 },
  { week: "W7", score: 85 }, { week: "W8", score: 80 },
];

export const burnoutData = [
  { subject: "Emotional", value: 42 }, { subject: "Physical", value: 58 },
  { subject: "Mental", value: 35 },   { subject: "Social", value: 70 },
  { subject: "Academic", value: 55 }, { subject: "Purpose", value: 65 },
];

export const productivityData = [
  { day: "Mon", focus: 4.5, tasks: 8,  breaks: 3  },
  { day: "Tue", focus: 3.2, tasks: 5,  breaks: 5  },
  { day: "Wed", focus: 5.0, tasks: 10, breaks: 2  },
  { day: "Thu", focus: 6.1, tasks: 12, breaks: 4  },
  { day: "Fri", focus: 4.8, tasks: 9,  breaks: 3  },
  { day: "Sat", focus: 2.0, tasks: 3,  breaks: 8  },
  { day: "Sun", focus: 1.5, tasks: 2,  breaks: 10 },
];

export const students = [
  { id: 1, name: "Aisha Khan",    risk: "high",   mood: 35, sessions: 3,  lastSeen: "2h ago",  status: "At Risk"   },
  { id: 2, name: "Omar Farooq",   risk: "medium", mood: 62, sessions: 7,  lastSeen: "1d ago",  status: "Monitoring"},
  { id: 3, name: "Sara Malik",    risk: "low",    mood: 81, sessions: 12, lastSeen: "3h ago",  status: "Stable"    },
  { id: 4, name: "Hamza Ali",     risk: "high",   mood: 28, sessions: 2,  lastSeen: "5h ago",  status: "At Risk"   },
  { id: 5, name: "Zara Hussain",  risk: "low",    mood: 88, sessions: 15, lastSeen: "30m ago", status: "Thriving"  },
];

export const initialChatMessages = [
  { id: 1, role: "ai",   text: "Hello! I'm Mendora, your AI wellness companion. How are you feeling today? Remember, this is a safe, judgment-free space. 💜", time: "09:00", emotion: "Welcoming"   },
  { id: 2, role: "user", text: "I've been really stressed about my exams and can't sleep well.",                                                               time: "09:01", emotion: "Anxious"     },
  { id: 3, role: "ai",   text: "I hear you — exam stress and sleep disruption often feed each other. That sounds really exhausting. Can you tell me more about what's been keeping your mind busy at night?", time: "09:01", emotion: "Empathetic" },
  { id: 4, role: "user", text: "I keep thinking about failing even though I study a lot.",                                                                     time: "09:02", emotion: "Worried"     },
  { id: 5, role: "ai",   text: "That pattern — studying hard but fearing failure — is something many students experience. It's called performance anxiety, and it doesn't reflect your actual ability at all. Let's try a quick breathing exercise together to calm your nervous system.", time: "09:02", emotion: "Supportive" },
];

export const chatHistory = [
  { id: "h1", title: "Exam stress & sleep",   time: "Today",     preview: "I keep thinking about failing..."       },
  { id: "h2", title: "Feeling overwhelmed",   time: "Yesterday", preview: "Too many assignments at once..."        },
  { id: "h3", title: "Breathing exercise",    time: "2 days ago",preview: "The 4-7-8 technique really helped"     },
  { id: "h4", title: "Motivation boost",      time: "Last week", preview: "I need help staying focused..."        },
];

export const suggestions = [
  "I'm feeling anxious about exams",
  "Help me with a breathing exercise",
  "I can't sleep properly",
  "I feel overwhelmed with tasks",
  "Give me a confidence boost",
  "Help me make a study plan",
];

export const moods = [
  { emoji: "😊", label: "Happy",   color: C.green,     value: "happy"   },
  { emoji: "😌", label: "Calm",    color: C.cyan,      value: "calm"    },
  { emoji: "😰", label: "Anxious", color: C.amber,     value: "anxious" },
  { emoji: "😔", label: "Sad",     color: C.blue,      value: "sad"     },
  { emoji: "😤", label: "Stressed",color: C.red,       value: "stressed"},
  { emoji: "😴", label: "Tired",   color: C.purple,    value: "tired"   },
  { emoji: "🤩", label: "Excited", color: C.pink,      value: "excited" },
  { emoji: "😐", label: "Neutral", color: "#9CA3AF",   value: "neutral" },
];

export const adminStats = [
  { label: "Total Users",       value: "4,821",  change: "+12%", icon: "👥" },
  { label: "Active Sessions",   value: "1,203",  change: "+8%",  icon: "⚡" },
  { label: "AI Conversations",  value: "28,410", change: "+24%", icon: "🤖" },
  { label: "High Risk Alerts",  value: "47",     change: "-6%",  icon: "🚨" },
];

export const pieColors = [C.purple, C.cyan, C.pink, C.amber];

export const wellnessPieData = [
  { name: "Thriving",  value: 35 },
  { name: "Stable",    value: 42 },
  { name: "At Risk",   value: 15 },
  { name: "Critical",  value: 8  },
];

export const moodHistory = [
  { date: "Mon, May 13", mood: "happy",   emoji: "😊", stress: 30, note: "Great study session today!"         },
  { date: "Tue, May 14", mood: "anxious", emoji: "😰", stress: 68, note: "Exam tomorrow, feeling nervous."    },
  { date: "Wed, May 15", mood: "calm",    emoji: "😌", stress: 35, note: "Did breathing exercises, felt better."},
  { date: "Thu, May 16", mood: "tired",   emoji: "😴", stress: 55, note: "Late night studying caught up to me."},
  { date: "Fri, May 17", mood: "excited", emoji: "🤩", stress: 22, note: "Exam went well! Feeling relieved."  },
];

export const THREE_DAY_TREND = [
  { day: "3 days ago", mood: 58, stress: 68, energy: 52 },
  { day: "Yesterday",  mood: 70, stress: 55, energy: 64 },
  { day: "Today",      mood: 78, stress: 42, energy: 74 },
];

export const WEEKLY_REPORT_DATA = {
  week: "May 13–19, 2026",
  overallScore: 78,
  previousScore: 72,
  metrics: [
    { label: "Average Mood",  value: 73,  unit: "%", prev: 65,  color: C.purple, icon: "💭" },
    { label: "Stress Level",  value: 48,  unit: "%", prev: 58,  color: C.red,    icon: "⚡", lowerIsBetter: true },
    { label: "Sleep Quality", value: 7.2, unit: "h", prev: 6.8, color: C.indigo, icon: "🌙" },
    { label: "Focus Time",    value: 4.6, unit: "h", prev: 3.9, color: C.cyan,   icon: "🎯" },
    { label: "AI Sessions",   value: 8,   unit: "",  prev: 5,   color: C.green,  icon: "🤖" },
    { label: "Burnout Risk",  value: 38,  unit: "%", prev: 52,  color: C.amber,  icon: "🔥", lowerIsBetter: true },
  ],
  topInsight: "Your stress dropped significantly mid-week after using breathing exercises. Keep that habit going.",
  recommendation: "You're trending positively. Add one 30-min walk daily this week to strengthen the gains.",
  badges: ["🧘 Calm Streak", "📚 Study Focus", "💜 Self-Aware"],
};

export const testimonials = [
  { name: "Fatima R.",  role: "BS Psychology, 3rd Year", avatar: "FR", text: "Mendora helped me identify my anxiety triggers before my finals. I slept better, studied smarter, and actually enjoyed the process for the first time." },
  { name: "Ahmed S.",   role: "MBBS Student, 2nd Year",  avatar: "AS", text: "The AI companion is incredible. It feels like talking to someone who genuinely understands academic pressure. The panic mode saved me multiple times." },
  { name: "Sana K.",    role: "MBA Candidate",            avatar: "SK", text: "The counselor dashboard helped my university's wellness team identify at-risk students early. A must-have for any institution." },
];

export const features = [
  { icon: "🤖", title: "AI Wellness Companion",     desc: "Emotionally intelligent AI trained on mental health best practices — available 24/7 for support, guidance, and conversation." },
  { icon: "📊", title: "Advanced Analytics",         desc: "Deep insights into your mood, stress, sleep, and focus patterns with actionable recommendations." },
  { icon: "🧘", title: "Calm & Focus Modes",         desc: "Guided breathing exercises, meditation sessions, and deep focus tools designed for student life." },
  { icon: "🎓", title: "Exam Intelligence",          desc: "AI-powered exam support with panic mode, confidence tracking, and emergency revision planning." },
  { icon: "👨‍⚕️", title: "Counselor Integration",   desc: "Seamless connection between students and university counselors with real-time wellness monitoring." },
  { icon: "🔒", title: "Privacy-First Design",       desc: "Your mental health data is encrypted, private, and never shared without your explicit consent." },
];

export const howItWorks = [
  { step: "01", icon: "✨", title: "Create Your Profile", desc: "Sign up and complete a brief wellness assessment to personalise your Mendora experience." },
  { step: "02", icon: "💭", title: "Log Your Mood Daily",  desc: "A 30-second daily check-in builds your personal wellness dataset over time." },
  { step: "03", icon: "🤖", title: "Talk to Your AI",      desc: "Share what's on your mind anytime. Mendora listens, understands, and responds with evidence-based support." },
  { step: "04", icon: "📈", title: "Track & Improve",      desc: "Review your analytics, receive personalised insights, and watch your wellbeing improve week by week." },
];
