import { adminClient } from "@/lib/sanity-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserManager from "@/components/admin/UserManager";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  // Defense in depth: only superadmin may view this page
  if (session?.user?.role !== "superadmin") {
    redirect("/admin");
  }

  const users = await adminClient.fetch(
    `*[_type == "adminUser"] | order(_createdAt asc) { _id, name, email, role, isActive }`
  );

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#171717]">Users</h1>
        <p className="text-sm text-[#737373] mt-0.5">{users.length} admin terdaftar</p>
        <p className="text-[10px] text-[#A8A29E] mt-1">
          Hanya superadmin yang bisa mengakses halaman ini.
        </p>
      </div>
      <UserManager
        users={users}
        currentUserId={session?.user?.id}
        currentUserRole={session?.user?.role}
      />
    </div>
  );
}
