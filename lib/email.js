/**
 * Lightweight email sender using Brevo (formerly Sendinblue) REST API.
 * No SDK needed — uses native fetch.
 *
 * Why Brevo: free tier 300 email/hari (~9000/bulan), single sender verification
 * (Gmail OK), no domain required. Cocok untuk UMKM.
 *
 * Setup:
 * 1. Sign up gratis di brevo.com
 * 2. Senders & IP → Senders → Add a sender
 *    - Verify email yang akan dipakai sebagai pengirim (Gmail/email apapun)
 *    - Cek inbox → klik link verifikasi
 * 3. SMTP & API → API Keys → Generate a new API key (v3)
 * 4. Set env:
 *    BREVO_API_KEY=xkeysib-xxx
 *    BREVO_FROM_EMAIL=email-yang-sudah-diverify@gmail.com
 *    BREVO_FROM_NAME=Nama Toko Kamu
 *
 * Penting: BREVO_FROM_EMAIL HARUS email yang sudah verified di Brevo.
 */

const BREVO_API = "https://api.brevo.com/v3/smtp/email";

export function isEmailConfigured() {
  return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_FROM_EMAIL);
}

export async function sendEmail({ to, subject, html, text }) {
  if (!isEmailConfigured()) {
    throw new Error(
      "Email service belum dikonfigurasi (BREVO_API_KEY / BREVO_FROM_EMAIL)."
    );
  }

  const res = await fetch(BREVO_API, {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: process.env.BREVO_FROM_NAME || "Admin",
        email: process.env.BREVO_FROM_EMAIL,
      },
      to: (Array.isArray(to) ? to : [to]).map((address) => ({
        email: typeof address === "string" ? address : address.email,
        name: typeof address === "string" ? undefined : address.name,
      })),
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Brevo API error (${res.status}): ${errorBody}`);
  }

  return res.json();
}

/**
 * Branded password reset email HTML.
 */
export function passwordResetEmailHtml({ storeName, userName, resetUrl, primaryColor = "#8B5E3C" }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Reset Password</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background-color:#F3F0EA;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#F3F0EA;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:480px;background-color:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #E5E5E5;">

          <tr>
            <td style="background-color:${primaryColor};padding:24px 32px;color:#ffffff;text-align:center;">
              <p style="margin:0;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;opacity:0.9;">${storeName}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#171717;line-height:1.3;">
                Reset Password Admin
              </h1>
              <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#525252;">
                Halo ${userName || "Admin"},
              </p>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#525252;">
                Kami menerima permintaan untuk reset password akun admin kamu. Klik tombol di bawah untuk membuat password baru. Link ini akan kadaluarsa dalam <strong>30 menit</strong>.
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background-color:${primaryColor};border-radius:12px;">
                    <a href="${resetUrl}"
                       style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">
                      Reset Password Sekarang
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#737373;">
                Atau salin link ini ke browser:
              </p>
              <p style="margin:8px 0 0;font-size:11px;line-height:1.4;color:#525252;word-break:break-all;background:#FAFAF8;padding:10px 12px;border-radius:8px;border:1px solid #E5E5E5;">
                ${resetUrl}
              </p>

              <hr style="margin:32px 0;border:0;border-top:1px solid #E5E5E5;">

              <p style="margin:0;font-size:12px;line-height:1.6;color:#A8A29E;">
                Bukan kamu yang meminta? Abaikan email ini — password kamu tetap aman.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;background-color:#FAFAF8;border-top:1px solid #E5E5E5;text-align:center;">
              <p style="margin:0;font-size:11px;color:#A8A29E;letter-spacing:0.05em;">
                © ${new Date().getFullYear()} ${storeName}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function passwordResetEmailText({ storeName, userName, resetUrl }) {
  return `Halo ${userName || "Admin"},

Kami menerima permintaan untuk reset password admin ${storeName}.
Klik link di bawah untuk membuat password baru (kadaluarsa dalam 30 menit):

${resetUrl}

Bukan kamu yang meminta? Abaikan email ini — password kamu tetap aman.

— ${storeName}`;
}
