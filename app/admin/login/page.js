import { isEmailConfigured } from "@/lib/email";
import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
  // Server-side check — pass to client so "Lupa password?" link only
  // appears if Brevo is actually configured to send emails.
  const emailEnabled = isEmailConfigured();
  return <LoginForm emailEnabled={emailEnabled} />;
}
