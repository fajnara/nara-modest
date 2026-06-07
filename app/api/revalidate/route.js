import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook handler — clears Next.js cache on Studio publish.
 *
 * Setup:
 * 1. Set SANITY_REVALIDATE_SECRET in .env.local (any random string)
 * 2. In Sanity dashboard → API → Webhooks → Create new:
 *    - URL: https://your-site.vercel.app/api/revalidate
 *    - Dataset: production
 *    - Trigger on: Create, Update, Delete
 *    - HTTP method: POST
 *    - HTTP headers: (leave default)
 *    - Secret: same as SANITY_REVALIDATE_SECRET
 *    - Enable signature verification
 */
export async function POST(req) {
  try {
    const { isValidSignature, body } = await parseBody(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: "Bad Request" },
        { status: 400 }
      );
    }

    // Always revalidate homepage — affected by all content types
    revalidatePath("/");

    // Type-specific paths
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
    console.error("Revalidate webhook error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
