import { adminClient } from "@/lib/sanity-admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteAdminUser } from "@/actions/admin";
import UserManager from "@/components/admin/UserManager";

export default async function UsersPage() {
  const [session, users] = await Promise.all([
    getServerSession(authOptions),
    adminClient.fetch(
      `*[_type == "adminUser"] | order(_createdAt asc) { _id, name, email, role, isActive }`
    ),
  ]);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#171717]">Users</h1>
        <p className="text-sm text-[#737373] mt-0.5">{users.length} admin terdaftar</p>
      </div>
      <UserManager users={users} currentUserId={session?.user?.id} />
    </div>
  );
}
