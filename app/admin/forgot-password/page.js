import { redirect } from "next/navigation";
import { isEmailConfigured } from "@/lib/email";
import ForgotPasswordForm from "@/components/admin/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  // If owner hasn't configured Brevo, no point showing this page —
  // bounce user back to login (where the "Lupa password?" link is already hidden).
  if (!isEmailConfigured()) {
    redirect("/admin/login");
  }
  return <ForgotPasswordForm />;
}
