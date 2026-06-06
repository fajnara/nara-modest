export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/admin/:path*"],
  // Login page itself is excluded automatically by nextauth middleware
};
