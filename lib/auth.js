import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { adminClient } from "./sanity-admin";
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from "./rateLimit";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        // Rate limit key: combine IP + email so:
        // - attacker scanning many emails from one IP gets blocked
        // - one victim email being attacked from many IPs also gets blocked
        const ip =
          req?.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
          req?.headers?.["x-real-ip"] ||
          "unknown-ip";
        const email = String(credentials.email).trim().toLowerCase();
        const ipKey    = `ip:${ip}`;
        const emailKey = `email:${email}`;

        const ipCheck = checkRateLimit(ipKey);
        const emailCheck = checkRateLimit(emailKey);

        if (!ipCheck.allowed || !emailCheck.allowed) {
          const remainingMs = Math.max(
            ipCheck.remainingMs || 0,
            emailCheck.remainingMs || 0
          );
          const minutes = Math.ceil(remainingMs / 60000);
          throw new Error(
            `Terlalu banyak percobaan login. Coba lagi dalam ${minutes} menit.`
          );
        }

        const user = await adminClient.fetch(
          `*[_type == "adminUser" && email == $email && isActive == true][0]{
            _id, name, email, passwordHash, role
          }`,
          { email }
        );

        if (!user?.passwordHash) {
          recordFailedAttempt(ipKey);
          recordFailedAttempt(emailKey);
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          recordFailedAttempt(ipKey);
          recordFailedAttempt(emailKey);
          return null;
        }

        // Success — reset counters
        resetRateLimit(ipKey);
        resetRateLimit(emailKey);

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days (was 30 days default — shorter is safer)
  },
  secret: process.env.NEXTAUTH_SECRET,
};
