import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = { title: "Admin — Nara Modest" };

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#F5F5F4] flex">
      <AdminNav user={session.user} />
      <main className="flex-1 min-w-0 p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
