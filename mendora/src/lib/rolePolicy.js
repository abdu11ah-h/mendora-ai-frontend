export const STAFF_ROLE_EMAILS = [
  "tubaaftab76@gmail.com",
  "muhammadabduah26@gmail.com",
];

export const ROLE_ELIGIBILITY_MESSAGE =
  "You are not eligible for this role. Please sign in as user.";

export function isStaffEmailAllowed(email) {
  const normalized = (email || "").trim().toLowerCase();
  return STAFF_ROLE_EMAILS.includes(normalized);
}

export function validateStaffRole(email, role) {
  if ((role === "counselor" || role === "admin") && !isStaffEmailAllowed(email)) {
    return ROLE_ELIGIBILITY_MESSAGE;
  }
  return null;
}
