export function displayName(user) {
  if (!user) return "there";
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return name || user.email?.split("@")[0] || "there";
}

export function userInitials(user) {
  if (!user) return "?";
  const a = user.first_name?.[0] || "";
  const b = user.last_name?.[0] || "";
  const letters = (a + b).toUpperCase();
  if (letters) return letters;
  return (user.email?.[0] || "?").toUpperCase();
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
