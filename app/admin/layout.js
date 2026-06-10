import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authOptions } from "@/lib/auth";
import { adminClient } from "@/lib/sanity-admin";
import AdminNav from "@/components/admin/AdminNav";
import BrandColorProvider from "@/components/BrandColorProvider";

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
    robots: { index: false, follow: false },
  };
}

export default async function AdminLayout({ children }) {
  // Detect login path — must bypass auth & layout to avoid redirect loop
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  // Pages that should render bare (no nav, no auth check)
  const isPublicAuthPage =
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/forgot-password") ||
    pathname.startsWith("/admin/reset-password");

  // Fetch primary color for admin theming (lightweight — only color field)
  let primaryColor = "#8B5E3C";
  try {
    const settings = await adminClient.fetch(
      `*[_type == "storeSettings"][0]{ primaryColor }`
    );
    if (settings?.primaryColor) primaryColor = settings.primaryColor;
  } catch {
    // ignore — fallback
  }

  // Public auth pages — render bare with brand color, no nav, no auth check
  if (isPublicAuthPage) {
    return (
      <BrandColorProvider primaryColor={primaryColor}>
        {children}
      </BrandColorProvider>
    );
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  // Re-verify user is still active in DB
  const dbUser = await adminClient.fetch(
    `*[_type == "adminUser" && _id == $id][0]{ _id, name, email, role, isActive }`,
    { id: session.user.id }
  );

  if (!dbUser || !dbUser.isActive) {
    redirect("/admin/login");
  }

  const currentUser = {
    id: dbUser._id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role,
  };

  return (
    <BrandColorProvider
      primaryColor={primaryColor}
      className="min-h-screen bg-[#F5F5F4] flex"
    >
      <AdminNav user={currentUser} />
      <main className="flex-1 min-w-0 p-6 lg:p-8 lg:pl-6 pt-16 lg:pt-8">
        {children}
      </main>
    </BrandColorProvider>
  );
}
