import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminClient } from "@/lib/sanity-admin";
import AccountForm from "@/components/admin/AccountForm";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  // Fetch fresh user details
  const user = await adminClient.fetch(
    `*[_type == "adminUser" && _id == $id][0]{ _id, name, email, role }`,
    { id: session?.user?.id || "" }
  );

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="heading-display text-2xl text-[#171717]">Akun Saya</h1>
        <p className="text-xs text-[#737373] mt-0.5 tracking-wide">
          Ganti password atau lihat detail akun
        </p>
      </div>

      <AccountForm user={user} />
    </div>
  );
}
