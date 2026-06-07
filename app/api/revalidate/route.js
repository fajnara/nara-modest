import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook handler — clears Next.js cache on Studio publish.
 *
 * Setup:
 * 1. Set SANITY_REVALIDATE_SECRET in .env.local
 * 2. In Sanity dashboard → API → Webhooks → Create new:
 *    - URL: https://your-site.vercel.app/api/revalidate
 *    - Dataset: production
 *    - Trigger on: Create, Update, Delete
 *    - HTTP method: POST
 *    - Secret: same as SANITY_REVALIDATE_SECRET
 */
export async function POST(req) {
  console.log("[revalidate] Webhook received");

  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
      console.error("[revalidate] SANITY_REVALIDATE_SECRET not set");
      return NextResponse.json(
        { message: "Server not configured: SANITY_REVALIDATE_SECRET missing" },
        { status: 500 }
      );
    }

    const { isValidSignature, body } = await parseBody(req, secret);

    if (!isValidSignature) {
      console.error("[revalidate] Invalid signature — check secret matches in Sanity webhook config");
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    console.log("[revalidate] Valid signature, body:", JSON.stringify(body));

    if (!body?._type) {
      return NextResponse.json(
        { message: "Bad Request: no _type in body" },
        { status: 400 }
      );
    }

    // Always revalidate homepage
    revalidatePath("/", "layout");
    console.log("[revalidate] Revalidated /");

    if (body._type === "product") {
      revalidatePath("/admin/products");
    } else if (body._type === "category") {
      revalidatePath("/admin/categories");
    } else if (body._type === "storeSettings") {
      revalidatePath("/admin/settings");
    }

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      now: Date.now(),
    });
  } catch (err) {
    console.error("[revalidate] Error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// GET endpoint — for manual testing & health check
export async function GET(req) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: "Invalid secret" },
      { status: 401 }
    );
  }

  // Manual revalidate trigger — useful for testing
  revalidatePath("/", "layout");
  console.log("[revalidate] Manual GET trigger — revalidated /");

  return NextResponse.json({
    revalidated: true,
    method: "GET",
    now: Date.now(),
  });
}
