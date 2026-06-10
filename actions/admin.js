"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { adminClient } from "@/lib/sanity-admin";
import { requireAdmin, requireSuperAdmin } from "@/lib/adminAuth";
import {
  validateProductInput,
  validateCategoryInput,
  validateStoreSettings,
  validateAdminUserInput,
  validatePassword,
} from "@/lib/validators";

/**
 * Wraps an action so user-friendly errors are returned as `{ error: msg }`
 * instead of thrown.
 *
 * Why: Next.js 15 production redacts thrown error messages from Server Actions
 * (replaces with generic "An error occurred in the Server Components render").
 * Returning errors as data preserves the actual message for client display.
 */
async function runAction(fn) {
  try {
    await fn();
    return { success: true };
  } catch (err) {
    return { error: err?.message || "Terjadi kesalahan tidak terduga" };
  }
}

// ── Slug Helpers ──────────────────────────────────────

function slugify(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Ensure slug is unique within a document type.
 * Appends -2, -3, etc. if duplicates exist.
 */
async function uniqueSlug(type, baseSlug, excludeId = null) {
  if (!baseSlug) baseSlug = "item";
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = await adminClient.fetch(
      `*[_type == $type && slug.current == $slug && _id != $excludeId][0]._id`,
      { type, slug: candidate, excludeId: excludeId || "" }
    );
    if (!existing) return candidate;
    candidate = `${baseSlug}-${suffix}`;
    suffix++;
  }
}

// ── Products ──────────────────────────────────────────

function buildProductDoc(data) {
  return {
    name: data.name,
    category: data.categoryId
      ? { _type: "reference", _ref: data.categoryId }
      : undefined,
    price: Number(data.price),
    discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
    description: data.description || "",
    material: data.material || "",
    colors: Array.isArray(data.colors) ? data.colors : [],
    sizes: Array.isArray(data.sizes) ? data.sizes : [],
    image: data.image || undefined,
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    isAvailable: data.isAvailable === true || data.isAvailable === "true",
    isFeatured: data.isFeatured === true || data.isFeatured === "true",
    sortOrder: data.sortOrder ? Number(data.sortOrder) : 99,
  };
}

export async function createProduct(data) {
  return runAction(async () => {
    await requireAdmin();
    validateProductInput(data, { requireImage: true });

    const baseSlug = slugify(data.name);
    const slug = await uniqueSlug("product", baseSlug);

    await adminClient.create({
      _type: "product",
      slug: { _type: "slug", current: slug },
      ...buildProductDoc(data),
    });

    revalidatePath("/");
    revalidatePath("/admin/products");
  });
}

export async function updateProduct(id, data) {
  return runAction(async () => {
    await requireAdmin();
    validateProductInput(data, { requireImage: true });

    const existing = await adminClient.fetch(
      `*[_type == "product" && _id == $id][0]{ name, "slug": slug.current }`,
      { id }
    );

    const patch = adminClient.patch(id).set(buildProductDoc(data));

    if (existing?.name !== data.name) {
      const baseSlug = slugify(data.name);
      const slug = await uniqueSlug("product", baseSlug, id);
      patch.set({ slug: { _type: "slug", current: slug } });
    }

    await patch.commit();

    revalidatePath("/");
    revalidatePath("/admin/products");
  });
}

export async function deleteProduct(id) {
  return runAction(async () => {
    await requireAdmin();
    if (!id) throw new Error("ID produk tidak valid");

    await adminClient.delete(id);
    revalidatePath("/");
    revalidatePath("/admin/products");
  });
}

export async function toggleProductAvailability(id, isAvailable) {
  return runAction(async () => {
    await requireAdmin();
    if (!id) throw new Error("ID produk tidak valid");

    await adminClient.patch(id).set({ isAvailable: !!isAvailable }).commit();
    revalidatePath("/");
    revalidatePath("/admin/products");
  });
}

// ── Categories ────────────────────────────────────────

export async function createCategory(data) {
  return runAction(async () => {
    await requireAdmin();
    validateCategoryInput(data);

    const baseSlug = slugify(data.title);
    const slug = await uniqueSlug("category", baseSlug);

    await adminClient.create({
      _type: "category",
      title: data.title,
      slug: { _type: "slug", current: slug },
      order: data.order ? Number(data.order) : 99,
    });

    revalidatePath("/");
    revalidatePath("/admin/categories");
  });
}

export async function updateCategory(id, data) {
  return runAction(async () => {
    await requireAdmin();
    if (!id) throw new Error("ID kategori tidak valid");
    validateCategoryInput(data);

    await adminClient
      .patch(id)
      .set({
        title: data.title,
        order: data.order ? Number(data.order) : 99,
      })
      .commit();

    revalidatePath("/");
    revalidatePath("/admin/categories");
  });
}

export async function deleteCategory(id) {
  return runAction(async () => {
    await requireAdmin();
    if (!id) throw new Error("ID kategori tidak valid");

    await adminClient.delete(id);
    revalidatePath("/");
    revalidatePath("/admin/categories");
  });
}

// ── Store Settings ────────────────────────────────────

export async function updateStoreSettings(data) {
  return runAction(async () => {
    await requireAdmin();
    validateStoreSettings(data);

    const existingId = await adminClient.fetch(
      `*[_type == "storeSettings"][0]._id`
    );
    const docId = existingId || "storeSettings-singleton";

    await adminClient.createOrReplace({
      _id: docId,
      _type: "storeSettings",
      storeName: data.storeName,
      storeTagline: data.storeTagline,
      logo: data.logo || undefined,
      whatsappNumber: data.whatsappNumber,
      instagramUsername: data.instagramUsername,
      instagramUrl: data.instagramUrl,
      address: data.address,
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
      heroImage: data.heroImage || undefined,
      heroCtaText: data.heroCtaText,
      promoText: data.promoText,
      primaryColor: data.primaryColor,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
    });

    revalidatePath("/");
    revalidatePath("/admin/settings");
  });
}

// ── Admin Users ───────────────────────────────────────
// All user management requires superadmin role.
// Plus extra protection: cannot delete self or last active superadmin.

async function countActiveSuperadmins(excludeId = null) {
  return adminClient.fetch(
    `count(*[_type == "adminUser" && role == "superadmin" && isActive == true && _id != $excludeId])`,
    { excludeId: excludeId || "" }
  );
}

export async function createAdminUser(data) {
  return runAction(async () => {
    await requireSuperAdmin();
    validateAdminUserInput(data, { requirePassword: true });

    const email = String(data.email).trim().toLowerCase();

    const existing = await adminClient.fetch(
      `*[_type == "adminUser" && email == $email][0]._id`,
      { email }
    );
    if (existing) throw new Error("Email sudah terdaftar");

    const passwordHash = await bcrypt.hash(data.password, 12);

    await adminClient.create({
      _type: "adminUser",
      name: data.name,
      email,
      passwordHash,
      role: ["admin", "superadmin"].includes(data.role) ? data.role : "admin",
      isActive: true,
    });

    revalidatePath("/admin/users");
  });
}

export async function updateAdminUser(id, data) {
  return runAction(async () => {
    const currentUser = await requireSuperAdmin();
    if (!id) throw new Error("ID user tidak valid");
    validateAdminUserInput(data, { requirePassword: false });

    const target = await adminClient.fetch(
      `*[_type == "adminUser" && _id == $id][0]{ _id, role, isActive }`,
      { id }
    );
    if (!target) throw new Error("User tidak ditemukan");

    const newRole = ["admin", "superadmin"].includes(data.role) ? data.role : target.role;
    const newActive = data.isActive === true || data.isActive === "true";

    const isCurrentlySuperadmin = target.role === "superadmin" && target.isActive;
    const willStaySuperadmin = newRole === "superadmin" && newActive;

    if (isCurrentlySuperadmin && !willStaySuperadmin) {
      const otherSuperadmins = await countActiveSuperadmins(id);
      if (otherSuperadmins === 0) {
        throw new Error("Tidak bisa menonaktifkan/menurunkan superadmin terakhir");
      }
    }

    if (target._id === currentUser.id && !newActive) {
      throw new Error("Tidak bisa menonaktifkan akun sendiri");
    }

    const updates = {
      name: data.name,
      email: String(data.email).trim().toLowerCase(),
      role: newRole,
      isActive: newActive,
    };

    if (data.password) {
      updates.passwordHash = await bcrypt.hash(data.password, 12);
    }

    await adminClient.patch(id).set(updates).commit();
    revalidatePath("/admin/users");
  });
}

/**
 * Self-service password change for the currently logged-in user.
 * Verifies the old password first to prevent session hijack abuse.
 */
export async function updateOwnPassword({ currentPassword, newPassword }) {
  return runAction(async () => {
    const currentUser = await requireAdmin();

    if (!currentPassword) throw new Error("Password lama wajib diisi");

    const dbUser = await adminClient.fetch(
      `*[_type == "adminUser" && _id == $id][0]{ _id, email, passwordHash }`,
      { id: currentUser.id }
    );
    if (!dbUser?.passwordHash) throw new Error("User tidak ditemukan");

    const isValid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
    if (!isValid) throw new Error("Password lama salah");

    validatePassword(newPassword, dbUser.email);

    const isSame = await bcrypt.compare(newPassword, dbUser.passwordHash);
    if (isSame) throw new Error("Password baru harus berbeda dari password lama");

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await adminClient.patch(currentUser.id).set({ passwordHash }).commit();
  });
}

export async function deleteAdminUser(id) {
  return runAction(async () => {
    const currentUser = await requireSuperAdmin();
    if (!id) throw new Error("ID user tidak valid");

    if (id === currentUser.id) {
      throw new Error("Tidak bisa menghapus akun sendiri");
    }

    const target = await adminClient.fetch(
      `*[_type == "adminUser" && _id == $id][0]{ _id, role, isActive }`,
      { id }
    );
    if (!target) throw new Error("User tidak ditemukan");

    if (target.role === "superadmin" && target.isActive) {
      const otherSuperadmins = await countActiveSuperadmins(id);
      if (otherSuperadmins === 0) {
        throw new Error("Tidak bisa menghapus superadmin terakhir yang aktif");
      }
    }

    await adminClient.delete(id);
    revalidatePath("/admin/users");
  });
}
