type MinimalUser = {
  email?: string | null;
  app_metadata?: Record<string, unknown>;
};

function configuredAdminEmails() {
  return (process.env.AETHEL_ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: MinimalUser | null | undefined) {
  if (!user) return false;

  const role = user.app_metadata?.role;
  const roles = user.app_metadata?.roles;
  const email = user.email?.toLowerCase();

  return (
    role === "admin" ||
    (Array.isArray(roles) && roles.includes("admin")) ||
    Boolean(email && configuredAdminEmails().includes(email))
  );
}
