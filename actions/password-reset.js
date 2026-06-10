"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { adminClient } from "@/lib/sanity-admin";
import { sendEmail, passwordResetEmailHtml, passwordResetEmailText, isEmailConfigured } from "@/lib/email";
import { validatePassword } from "@/lib/validators";
import { checkRateLimit, recordFailedAttempt } from "@/lib/rateLimit";

const TOKEN_VALIDITY_MS = 30 * 60 * 1000;

async function runAction(fn) {
  try {
    await fn();
    return { success: true };
  } catch (err) {
    return { error: err?.message || "Terjadi kesalahan" };
  }
}

export async function requestPasswordReset({ email }) {
  return runAction(async () => {
    if (!isEmailConfigured()) {
      throw new Error("Email service belum dikonfigurasi. Hubungi pemilik website untuk setup BREVO_API_KEY.");
    }

    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error("Email tidak valid");
    }

    // Rate limit per email — prevent spam (max 5 requests per 15 min window)
    const rateKey = `reset:${normalizedEmail}`;
    const check = checkRateLimit(rateKey);
    if (!check.allowed) {
      const minutes = Math.ceil((check.remainingMs || 0) / 60000);
      throw new Error(`Terlalu banyak permintaan reset. Coba lagi dalam ${minutes} menit.`);
    }
    // Record this attempt regardless of whether user exists
    // (prevents enumeration AND throttles brute-force email spam)
    recordFailedAttempt(rateKey);

    const user = await adminClient.fetch(
      `*[_type == "adminUser" && email == $email && isActive == true][0]{ _id, name, email }`,
      { email: normalizedEmail }
    );

    // Silent success if user not found (prevents email enumeration)
    if (!user) return;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + TOKEN_VALIDITY_MS).toISOString();

    await adminClient
      .patch(user._id)
      .set({ resetTokenHash: tokenHash, resetTokenExpires: expiresAt })
      .commit();

    const store = await adminClient.fetch(
      `*[_type == "storeSettings"][0]{ storeName, primaryColor }`
    );

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
  });
}

export async function resetPasswordWithToken({ token, email, newPassword }) {
  return runAction(async () => {
    if (!token || !email || !newPassword) {
      throw new Error("Data tidak lengkap");
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const tokenHash = crypto.createHash("sha256").update(String(token)).digest("hex");

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

    validatePassword(newPassword, user.email);

    if (user.passwordHash) {
      const isSame = await bcrypt.compare(newPassword, user.passwordHash);
      if (isSame) {
        throw new Error("Password baru harus berbeda dari password lama");
      }
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await adminClient
      .patch(user._id)
      .set({ passwordHash })
      .unset(["resetTokenHash", "resetTokenExpires"])
      .commit();
  });
}

/**
 * Check if token still valid — used to render reset form vs error page.
 * Returns plain object (server component reads directly).
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
