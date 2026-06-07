import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { adminClient } from "@/lib/sanity-admin";
import AdminNav from "@/components/admin/AdminNav";

export async function generateMetadata() {
  let storeName = "Admin";
  try {
    const settings = await adminClient.fetch(
      `*[_type == "storeSettings"][0]{ storeName }`
    );
    if (settings?.storeName) storeName = settings.storeName;
  } catch {
    // ignore — fallback
  }

  return {
    title: `Admin — ${storeName}`,
    robots: { index: false, follow: false }, // never index admin
  };
}

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // No session → middleware should've caught this, but defense in depth
  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  // Re-verify user is still active and exists in DB
  // (prevents access if user was deactivated/deleted mid-session)
  const dbUser = await adminClient.fetch(
    `*[_type == "adminUser" && _id == $id][0]{ _id, name, email, role, isActive }`,
    { id: session.user.id }
  );

  if (!dbUser || !dbUser.isActive) {
    redirect("/admin/login");
  }

  // Use fresh user data from DB (not stale JWT)
  const currentUser = {
    id: dbUser._id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] flex">
      <AdminNav user={currentUser} />
      <main className="flex-1 min-w-0 p-6 lg:p-8 lg:pl-6 pt-16 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
