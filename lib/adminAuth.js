import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminClient } from "@/lib/sanity-admin";

/**
 * Require any authenticated admin user.
 * Re-fetches user from Sanity to check current isActive + role.
 * Prevents stale JWT bypass: if user is deactivated after login,
 * their token is rejected immediately on next action.
 *
 * Throws "Unauthorized" if not logged in OR user is inactive/deleted.
 * Returns the user with FRESH role from Sanity (not from JWT).
 *
 * Use in ALL server actions that modify data.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized: kamu harus login sebagai admin.");
  }

  // Re-fetch user from Sanity — this prevents stale-session bypass
  // (user deactivated mid-session can no longer perform actions).
  const dbUser = await adminClient.fetch(
    `*[_type == "adminUser" && _id == $id][0]{ _id, name, email, role, isActive }`,
    { id: session.user.id }
  );

  if (!dbUser || !dbUser.isActive) {
    throw new Error("Unauthorized: akun admin tidak aktif atau sudah dihapus.");
  }

  return {
    id: dbUser._id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role, // fresh role, not from JWT
  };
}

/**
 * Require superadmin role.
 * Uses fresh role from Sanity (via requireAdmin).
 *
 * Throws if not logged in OR not active OR not superadmin.
 */
export async function requireSuperAdmin() {
  const user = await requireAdmin();

  if (user.role !== "superadmin") {
    throw new Error("Forbidden: hanya superadmin yang bisa melakukan aksi ini.");
  }

  return user;
}

/**
 * Soft check — returns the user if active superadmin, else null.
 * Use for conditional UI rendering in server components.
 */
export async function isSuperAdmin() {
  try {
    return await requireSuperAdmin();
  } catch {
    return null;
  }
}
