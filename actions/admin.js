"use server";

import { revalidatePath } from "next/cache";
import { adminClient } from "@/lib/sanity-admin";
import bcrypt from "bcryptjs";

// ── Products ──────────────────────────────────────────

export async function createProduct(data) {
  const slug = data.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  await adminClient.create({
    _type: "product",
    name: data.name,
    slug: { _type: "slug", current: slug },
    category: data.categoryId ? { _type: "reference", _ref: data.categoryId } : undefined,
    price: Number(data.price),
    description: data.description || "",
    isAvailable: data.isAvailable === true || data.isAvailable === "true",
    isFeatured: data.isFeatured === true || data.isFeatured === "true",
    sortOrder: data.sortOrder ? Number(data.sortOrder) : 99,
  });

  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function updateProduct(id, data) {
  await adminClient
    .patch(id)
    .set({
      name: data.name,
      category: data.categoryId ? { _type: "reference", _ref: data.categoryId } : undefined,
      price: Number(data.price),
      description: data.description || "",
      isAvailable: data.isAvailable === true || data.isAvailable === "true",
      isFeatured: data.isFeatured === true || data.isFeatured === "true",
      sortOrder: data.sortOrder ? Number(data.sortOrder) : 99,
    })
    .commit();

  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function deleteProduct(id) {
  await adminClient.delete(id);
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function toggleProductAvailability(id, isAvailable) {
  await adminClient.patch(id).set({ isAvailable }).commit();
  revalidatePath("/");
  revalidatePath("/admin/products");
}

// ── Categories ────────────────────────────────────────

export async function createCategory(data) {
  const slug = data.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  await adminClient.create({
    _type: "category",
    title: data.title,
    slug: { _type: "slug", current: slug },
    order: data.order ? Number(data.order) : 99,
  });

  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function updateCategory(id, data) {
  await adminClient
    .patch(id)
    .set({
      title: data.title,
      order: data.order ? Number(data.order) : 99,
    })
    .commit();

  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id) {
  await adminClient.delete(id);
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

// ── Store Settings ────────────────────────────────────

export async function updateStoreSettings(data) {
  await adminClient
    .createOrReplace({
      _id: "storeSettings-singleton",
      _type: "storeSettings",
      storeName: data.storeName,
      storeTagline: data.storeTagline,
      whatsappNumber: data.whatsappNumber,
      instagramUrl: data.instagramUrl,
      address: data.address,
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
      promoText: data.promoText,
    });

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

// ── Admin Users ───────────────────────────────────────

export async function createAdminUser(data) {
  const existing = await adminClient.fetch(
    `*[_type == "adminUser" && email == $email][0]._id`,
    { email: data.email }
  );
  if (existing) throw new Error("Email sudah terdaftar");

  const passwordHash = await bcrypt.hash(data.password, 12);

  await adminClient.create({
    _type: "adminUser",
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role || "admin",
    isActive: true,
  });

  revalidatePath("/admin/users");
}

export async function updateAdminUser(id, data) {
  const updates = {
    name: data.name,
    email: data.email,
    role: data.role,
    isActive: data.isActive === true || data.isActive === "true",
  };

  if (data.password) {
    updates.passwordHash = await bcrypt.hash(data.password, 12);
  }

  await adminClient.patch(id).set(updates).commit();
  revalidatePath("/admin/users");
}

export async function deleteAdminUser(id) {
  await adminClient.delete(id);
  revalidatePath("/admin/users");
}
