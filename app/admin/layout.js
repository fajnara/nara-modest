import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = { title: "Admin — Nara Modest" };

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-[#F5F5F4] flex">
      <AdminNav user={session?.user} />
      <main className="flex-1 min-w-0 p-6 lg:p-8 lg:pl-6 pt-16 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
