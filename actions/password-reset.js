"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { adminClient } from "@/lib/sanity-admin";
import { sendEmail, passwordResetEmailHtml, passwordResetEmailText, isEmailConfigured } from "@/lib/email";
import { validatePassword } from "@/lib/validators";

const TOKEN_VALIDITY_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Step 1 of reset flow — user enters email.
 *
 * For security, we ALWAYS return success even if email doesn't exist
 * (prevents email enumeration attacks). The only error users see is if
 * the email service itself is misconfigured.
 */
export async function requestPasswordReset({ email }) {
  if (!isEmailConfigured()) {
    throw new Error("Email service belum dikonfigurasi. Pemilik website perlu setup RESEND_API_KEY.");
  }

  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Email tidak valid");
  }

  const user = await adminClient.fetch(
    `*[_type == "adminUser" && email == $email && isActive == true][0]{ _id, name, email }`,
    { email: normalizedEmail }
  );

  // Don't reveal whether email exists — silent success
  if (!user) {
    return { success: true };
  }

  // Generate cryptographically secure token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + TOKEN_VALIDITY_MS).toISOString();

  await adminClient
    .patch(user._id)
    .set({
      resetTokenHash: tokenHash,
      resetTokenExpires: expiresAt,
    })
    .commit();

  // Fetch store settings for branded email
  const store = await adminClient.fetch(
    `*[_type == "storeSettings"][0]{ storeName, primaryColor }`
  );

  // Build reset URL
  const baseUrl = (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
  const resetUrl = `${baseUrl}/admin/reset-password?token=${rawToken}&email=${encodeURIComponent(normalizedEmail)}`;

  const storeName = store?.storeName || "Toko";
  const primaryColor = store?.primaryColor || "#8B5E3C";

  await sendEmail({
    to: user.email,
    subject: `Reset Password Admin — ${storeName}`,
    html: passwordResetEmailHtml({ storeName, userName: user.name, resetUrl, primaryColor }),
    text: passwordResetEmailText({ storeName, userName: user.name, resetUrl }),
  });

  return { success: true };
}

/**
 * Step 2 — user clicks email link with raw token, sets new password.
 */
export async function resetPasswordWithToken({ token, email, newPassword }) {
  if (!token || !email || !newPassword) {
    throw new Error("Data tidak lengkap");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const tokenHash = crypto.createHash("sha256").update(String(token)).digest("hex");

  // Find user matching email + token + not expired
  const user = await adminClient.fetch(
    `*[
      _type == "adminUser"
      && email == $email
      && isActive == true
      && resetTokenHash == $tokenHash
      && resetTokenExpires > now()
    ][0]{ _id, email, passwordHash }`,
    { email: normalizedEmail, tokenHash }
  );

  if (!user) {
    throw new Error("Link reset tidak valid atau sudah kadaluarsa. Silakan request ulang.");
  }

  // Validate new password against the same rules used elsewhere
  validatePassword(newPassword, user.email);

  // Prevent reusing the same password
  if (user.passwordHash) {
    const isSame = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSame) {
      throw new Error("Password baru harus berbeda dari password lama");
    }
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  // Update password AND clear the reset token in one transaction
  await adminClient
    .patch(user._id)
    .set({ passwordHash })
    .unset(["resetTokenHash", "resetTokenExpires"])
    .commit();

  return { success: true };
}

/**
 * Check if a token is still valid (without consuming it).
 * Used by the reset page to show friendly error before user types.
 */
export async function checkResetToken({ token, email }) {
  if (!token || !email) return { valid: false };

  const normalizedEmail = String(email).trim().toLowerCase();
  const tokenHash = crypto.createHash("sha256").update(String(token)).digest("hex");

  const user = await adminClient.fetch(
    `*[
      _type == "adminUser"
      && email == $email
      && isActive == true
      && resetTokenHash == $tokenHash
      && resetTokenExpires > now()
    ][0]{ _id, name }`,
    { email: normalizedEmail, tokenHash }
  );

  return { valid: Boolean(user), userName: user?.name };
}
