import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Require any authenticated admin user.
 * Throws if not logged in. Returns the user.
 *
 * Use in ALL server actions that modify data.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized: kamu harus login sebagai admin.");
  }

  return session.user;
}

/**
 * Require superadmin role.
 * Throws if not logged in OR not superadmin.
 *
 * Use for user management & sensitive operations.
 */
export async function requireSuperAdmin() {
  const user = await requireAdmin();

  if (user.role !== "superadmin") {
    throw new Error("Forbidden: hanya superadmin yang bisa melakukan aksi ini.");
  }

  return user;
}

/**
 * Soft check (returns boolean instead of throw).
 * Use for conditional UI rendering in server components.
 */
export async function isSuperAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "superadmin";
}
