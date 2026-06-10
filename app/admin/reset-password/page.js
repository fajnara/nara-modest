import { checkResetToken } from "@/actions/password-reset";
import ResetPasswordForm from "@/components/admin/ResetPasswordForm";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function ResetPasswordPage({ searchParams }) {
  const { token, email } = await searchParams;

  if (!token || !email) {
    return <InvalidTokenView />;
  }

  const { valid, userName } = await checkResetToken({ token, email });

  if (!valid) {
    return <InvalidTokenView />;
  }

  return (
    <div className="min-h-screen bg-[#F3F0EA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-black/5 border border-[#E5E5E5] p-8 animate-fade-in">
        <div className="mb-7 text-center">
          <h1 className="heading-display text-2xl text-[#171717]">Set Password Baru</h1>
          {userName && (
            <p className="text-xs text-[#737373] mt-2">
              Halo <strong className="text-[#171717]">{userName}</strong> — buat password baru di bawah.
            </p>
          )}
        </div>
        <ResetPasswordForm token={token} email={email} />
      </div>
    </div>
  );
}

function InvalidTokenView() {
  return (
    <div className="min-h-screen bg-[#F3F0EA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-black/5 border border-[#E5E5E5] p-8 animate-fade-in text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5 mx-auto">
          <AlertCircle className="w-6 h-6 text-red-500" strokeWidth={1.75} />
        </div>
        <h1 className="heading-display text-xl text-[#171717] mb-2">Link Tidak Valid</h1>
        <p className="text-sm text-[#737373] leading-relaxed mb-6">
          Link reset password sudah kadaluarsa atau tidak valid.
          Link berlaku 30 menit setelah dikirim.
        </p>
        <div className="space-y-2">
          <Link
            href="/admin/forgot-password"
            className="block w-full py-3 rounded-xl btn-brand text-sm font-semibold"
          >
            Request Link Baru
          </Link>
          <Link
            href="/admin/login"
            className="block w-full py-2.5 text-xs text-[#737373] hover:text-brand"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
