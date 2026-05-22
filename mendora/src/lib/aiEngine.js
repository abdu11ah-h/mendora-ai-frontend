// ─── MENDORA AI ENGINE ────────────────────────────────────────────────────────

export const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end my life", "want to die", "don't want to live",
  "self harm", "self-harm", "cut myself", "hurt myself", "no reason to live",
  "can't go on", "give up on life", "disappear forever", "not worth living",
];

export const HARD_BLOCK_KEYWORDS = [
  "write my essay", "do my assignment", "complete my homework", "solve my exam",
  "cheat", "plagiarize", "fake certificate", "hack", "ddos", "bomb",
  "make drugs", "synthesize", "buy weapons",
];

const UNSAFE_KEYWORDS = [
  "porn", "sex", "nude", "naked", "nsfw", "xxx",
  "illegal", "drug", "weapon", "harm", "kill", "suicide",
];

export const HIGH_STRESS_THRESHOLD = 80;

export const detectCrisis = (text) => {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
};

export const detectHardBlock = (text) => {
  const lower = text.toLowerCase();
  return HARD_BLOCK_KEYWORDS.some((kw) => lower.includes(kw));
};

export const detectEmotion = (text) => {
  const lower = text.toLowerCase();
  if (["anxious","nervous","worried","scared","fear","panic"].some(w => lower.includes(w))) return "Anxious";
  if (["sad","depressed","hopeless","lonely","cry","unhappy"].some(w => lower.includes(w))) return "Sad";
  if (["stress","overwhelm","pressure","burden","too much"].some(w => lower.includes(w))) return "Stressed";
  if (["tired","exhausted","burnout","no energy","drained"].some(w => lower.includes(w))) return "Burnout";
  if (["happy","great","amazing","wonderful","excited","good"].some(w => lower.includes(w))) return "Positive";
  if (["focus","concentrate","distract","procrastinat"].some(w => lower.includes(w))) return "Unfocused";
  if (["sleep","insomnia","awake","night","rest"].some(w => lower.includes(w))) return "Sleep-deprived";
  if (["exam","test","assignment","deadline","study","grade"].some(w => lower.includes(w))) return "Academic Stress";
  return "Neutral";
};

const SUBJECT_ADVICE = {
  math:       { icon: "📐", tips: ["Break proofs into small lemmas and tackle one at a time.", "Practice 3 problems per concept before moving on.", "Errors are data — review what went wrong, not just the answer."] },
  physics:    { icon: "⚛️", tips: ["Draw a free-body diagram before every mechanics problem.", "Dimensional analysis catches ~80% of formula mistakes.", "Link equations to physical intuition, not just symbols."] },
  chemistry:  { icon: "🧪", tips: ["Memorise periodic trends first — they unlock hundreds of predictions.", "Reaction mechanisms flow like stories; visualise electron movement.", "Past papers + mark schemes are the single best revision tool."] },
  biology:    { icon: "🧬", tips: ["Use spaced repetition for terminology — Anki works brilliantly.", "Learn systems (e.g. immune response) as flowcharts.", "Diagrams you draw yourself stick better than ones you just read."] },
  cs:         { icon: "💻", tips: ["Code the concept, don't just read it — muscle memory matters.", "Debug methodically: isolate, hypothesise, test, repeat.", "Rubber-duck debugging (explain your code aloud) surfaces 90% of bugs."] },
  english:    { icon: "📖", tips: ["Quote sparingly but analyse deeply — quality over quantity.", "Structure: Point → Evidence → Explain → Link back to question.", "Read your essay aloud — your ear catches what your eye misses."] },
  history:    { icon: "🏛️", tips: ["Argument first, then evidence — never the reverse.", "PEEL paragraphs keep analysis tight and markers happy.", "Compare historiographical views to hit the top mark bands."] },
  economics:  { icon: "📈", tips: ["Every answer needs a diagram — draw it before you write.", "Chain your analysis: cause → mechanism → consequence.", "Evaluation = 'However…' — always consider counterarguments."] },
  psychology: { icon: "🧠", tips: ["Learn studies as: Aim, Method, Results, Conclusion, Evaluation.", "Apply theories to real-world examples to cement understanding.", "Ethics and replication crisis points earn high marks in essays."] },
  default:    { icon: "📚", tips: ["Pomodoro 25/5 cycles protect focus without burnout.", "Teach what you learn to someone else — the ultimate comprehension test.", "Start with your most difficult topic when energy is highest."] },
};

const getSubjectKey = (text) => {
  const lower = text.toLowerCase();
  if (["math","calculus","algebra","statistics","maths"].some(w => lower.includes(w))) return "math";
  if (["physics","mechanics","thermodynamics","optics"].some(w => lower.includes(w))) return "physics";
  if (["chemistry","organic","titration","mole"].some(w => lower.includes(w))) return "chemistry";
  if (["biology","cells","genetics","anatomy","ecology"].some(w => lower.includes(w))) return "biology";
  if (["programming","coding","computer science","algorithm","python","java"," cs "].some(w => lower.includes(w))) return "cs";
  if (["english","literature","essay","novel","poem"].some(w => lower.includes(w))) return "english";
  if (["history","historian","revolution","war","empire"].some(w => lower.includes(w))) return "history";
  if (["economics","macro","micro","gdp","inflation"].some(w => lower.includes(w))) return "economics";
  if (["psychology","behaviour","cognition","freud","piaget"].some(w => lower.includes(w))) return "psychology";
  return null;
};

export const getBreakRecommendation = (sessions) => {
  if (sessions >= 4) return { type: "long",   msg: "🌿 You've completed 4 Pomodoro sessions — take a proper 20-30 min break: step outside, have a meal, or lie down. Your brain consolidates learning during rest.", color: "#10B981" };
  if (sessions >= 2) return { type: "medium", msg: "☕ Two sessions down! A 10-minute break now will boost your next session. Stretch, grab water, look away from the screen. You're doing brilliantly.",           color: "#06B6D4" };
  return null;
};

export const getAIResponse = (userText, tone = "calm") => {
  const lower = userText.toLowerCase();

  if (UNSAFE_KEYWORDS.some(w => lower.includes(w))) {
    return "I'm designed to support your emotional wellness and academic journey. I'm not able to help with that topic, but I'm here whenever you'd like to talk about your studies, stress, sleep, or mental wellbeing. 💜";
  }

  if (detectHardBlock(userText)) {
    return "That's outside what I'm able to help with here. Mendora AI is built to support your mental wellbeing and academic journey — not to complete work on your behalf. I'm always here to help you understand topics, build study plans, or work through stress. What would you like support with?";
  }

  const subjectKey = getSubjectKey(lower);
  if (subjectKey && ["study","help","understand","struggling","confus","revision","exam","test","learn","explain"].some(w => lower.includes(w))) {
    const s = SUBJECT_ADVICE[subjectKey] || SUBJECT_ADVICE.default;
    const tip = s.tips[Math.floor(Math.random() * s.tips.length)];
    const prefix = { calm: `Let's work through this calmly. ${s.icon}`, motivational: `You've got this! ${s.icon}`, direct: `${s.icon} Here's exactly what to do:` }[tone] || s.icon;
    return `${prefix} ${tip} Would you like me to break down a specific concept or build a study plan?`;
  }

  if (["time","schedule","plan","deadline","manage","organise","organize","priorit","procrastinat","behind on"].some(w => lower.includes(w))) {
    return "Managing time starts with clarity. Try this: list every task, estimate how long each takes, then block them into your calendar starting with fixed deadlines. Leave 20% buffer — life always adds surprises. Which task feels most urgent right now?";
  }

  if (["anxious","nervous","worried","scared","panic","fear"].some(w => lower.includes(w))) {
    return "Anxiety makes the mind spin through worst-case scenarios. Let's interrupt that cycle. Try box breathing: inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4 times. Then tell me — what's the specific thought that's worrying you most?";
  }

  if (["sad","depress","hopeless","lonely","alone","cry","unhappy"].some(w => lower.includes(w))) {
    return "What you're feeling is real and valid. Sometimes sadness doesn't need a reason — it just needs to be acknowledged. I'm here with you. You don't have to navigate this alone. When did these feelings start, and have you been able to talk to anyone about them?";
  }

  if (["sleep","insomnia","can't sleep","awake","tired","restless"].some(w => lower.includes(w))) {
    return "Poor sleep and stress create a cycle that's hard to break. Tonight, try: no screens 30 minutes before bed, write down 3 things you're grateful for, and keep your room cool and dark. The 4-7-8 breathing technique (inhale 4s, hold 7s, exhale 8s) is clinically shown to help. Want me to guide you through it?";
  }

  if (["burnout","exhausted","drained","empty","overwhelm","too much"].some(w => lower.includes(w))) {
    return "Burnout isn't laziness — it's your mind and body signalling that you've been running on empty for too long. The most important thing right now is to stop pushing harder and start recovering smarter. What's one thing you can delegate, postpone, or drop entirely this week?";
  }

  if (["motivat","focus","concentrate","distract","procrastinat"].some(w => lower.includes(w))) {
    return "Motivation follows action, not the other way around. The trick is to make starting so easy it's impossible to say no. Try the 2-minute rule: if a task takes less than 2 minutes, do it now. For longer tasks, just commit to 5 minutes — you'll usually keep going. What's the first tiny step you can take in the next 5 minutes?";
  }

  if (["breath","calm","relax","ground","meditat"].some(w => lower.includes(w))) {
    return "Let's ground you right now. Try this: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. This 5-4-3-2-1 technique activates your parasympathetic nervous system and brings you back to the present moment. How do you feel after trying that?";
  }

  if (["hello","hi","hey","how are you","start"].some(w => lower.includes(w))) {
    return "Hi there! I'm Mendora, your AI wellness companion. 💜 I'm here to listen, support you through stress, help you sleep better, guide you through breathing exercises, or just be a space where you can express what's on your mind. What's going on for you today?";
  }

  return "Thank you for sharing that with me. I want to make sure I understand what you're going through so I can help as best I can. Could you tell me a bit more about what's been on your mind lately?";
};

export const COMMUNITY_GUIDELINES = [
  { icon: "💜", title: "Be kind to yourself",  rule: "This is a safe space. Speak to yourself with the same compassion you'd offer a friend." },
  { icon: "🤝", title: "Honest sharing",        rule: "Share genuinely. The AI responds to what you actually feel, not what you think you should feel." },
  { icon: "🚫", title: "No harmful content",   rule: "Requests for harmful, explicit, or dangerous information will be blocked to keep this space safe." },
  { icon: "🆘", title: "Crisis situations",     rule: "If you're in immediate danger, please contact emergency services or a crisis helpline directly." },
  { icon: "🔒", title: "Your privacy",          rule: "Your conversations are private. You are safe to express yourself here without judgment." },
  { icon: "🎓", title: "Academic integrity",    rule: "Mendora AI supports your learning — it won't complete assignments or exams on your behalf." },
];
