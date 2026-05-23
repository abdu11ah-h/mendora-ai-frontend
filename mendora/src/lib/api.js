// --- MENDORA AI API CLIENT ---
// Connects frontend to Railway backend

const API_URL = (import.meta.env.VITE_API_URL || "https://web-production-641ef.up.railway.app/api/v1").trim().replace(/\/$/, "");

// --- Token helpers ---
export const getToken = () => localStorage.getItem("mendora_token");
export const setToken = (t) => localStorage.setItem("mendora_token", t);
export const setRefreshToken = (t) => localStorage.setItem("mendora_refresh", t);
export const getRefreshToken = () => localStorage.getItem("mendora_refresh");
export const clearTokens = () => { localStorage.removeItem("mendora_token"); localStorage.removeItem("mendora_refresh"); localStorage.removeItem("mendora_user"); };
export const setUser = (u) => localStorage.setItem("mendora_user", JSON.stringify(u));
export const getUser = () => { try { return JSON.parse(localStorage.getItem("mendora_user")); } catch { return null; } };

// --- Base fetch ---
async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch (e) {
    throw new Error(
      "Cannot reach the API server. Confirm the backend is deployed, then restart the frontend (npm run dev) so VITE_API_URL is loaded."
    );
  }

  if (res.status === 401) { clearTokens(); window.location.reload(); return; }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data.detail;
    const msg = Array.isArray(detail)
      ? detail.map((d) => d.msg || JSON.stringify(d)).join(". ")
      : typeof detail === "string"
        ? detail
        : "Something went wrong";
    throw new Error(msg);
  }
  return data;
}

// --- AUTH ---
export const authAPI = {
  register: (body) => api("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: async (email, password) => {
    const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    setToken(data.access_token);
    setRefreshToken(data.refresh_token);
    return data;
  },

  me: () => api("/auth/me"),

  logout: async () => {
    const refresh_token = getRefreshToken();
    if (refresh_token) await api("/auth/logout", { method: "POST", body: JSON.stringify({ refresh_token }) }).catch(() => {});
    clearTokens();
  },

  forgotPassword: (email) => api("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),

  resetPassword: (token, new_password) => api("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, new_password }) }),

  verifyEmail: (token) => api("/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) }),

  resendVerification: (email) =>
    api("/auth/resend-verification", { method: "POST", body: JSON.stringify({ email }) }),

  updateProfile: (body) => api("/auth/me", { method: "PUT", body: JSON.stringify(body) }),
};

// --- WELLNESS ---
export const wellnessAPI = {
  logMood: (body) => api("/wellness/mood", { method: "POST", body: JSON.stringify(body) }),
  getMoodHistory: (days = 7) => api(`/wellness/mood?days=${days}`),
  getTodayMood: () => api("/wellness/mood/today"),
  getMoodStats: () => api("/wellness/mood/stats"),
  getMoodChart: () => api("/wellness/mood/chart"),
};

// --- CHAT ---
export const chatAPI = {
  getSessions: () => api("/chat/sessions"),
  createSession: (title) => api("/chat/sessions", { method: "POST", body: JSON.stringify({ title }) }),
  getSession: (id) => api(`/chat/sessions/${id}`),
  deleteSession: (id) => api(`/chat/sessions/${id}`, { method: "DELETE" }),
  sendMessage: (sessionId, content) => api(`/chat/sessions/${sessionId}/message`, { method: "POST", body: JSON.stringify({ content }) }),
  exportSession: (id) => api(`/chat/sessions/${id}/export`),
};

// --- FOCUS ---
export const focusAPI = {
  startSession: (body) => api("/focus/sessions", { method: "POST", body: JSON.stringify(body) }),
  updateSession: (id, body) => api(`/focus/sessions/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  getSessions: () => api("/focus/sessions"),
  getStats: () => api("/focus/stats"),
};

// --- ADMIN ---
export const adminAPI = {
  getUsers: (page = 1) => api(`/admin/users?page=${page}`),
  getUser: (id) => api(`/admin/users/${id}`),
  updateUser: (id, body) => api(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteUser: (id) => api(`/admin/users/${id}`, { method: "DELETE" }),
  getStats: () => api("/admin/stats"),
  getRiskFlags: () => api("/admin/risk-flags"),
  resolveFlag: (id) => api(`/admin/risk-flags/${id}`, { method: "PUT" }),
  getWellnessOverview: () => api("/admin/wellness-overview"),
};

// --- COUNSELOR ---
export const counselorAPI = {
  getStudents: () => api("/counselor/students"),
  getStudent: (id) => api(`/counselor/students/${id}`),
  addNote: (body) => api("/counselor/notes", { method: "POST", body: JSON.stringify(body) }),
  getNotes: (studentId) => api(`/counselor/notes/${studentId}`),
  updateNote: (id, body) => api(`/counselor/notes/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  getAlerts: () => api("/counselor/alerts"),
  acknowledgeAlert: (id) => api(`/counselor/alerts/${id}/acknowledge`, { method: "POST" }),
};
