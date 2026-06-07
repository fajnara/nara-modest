export const STORE_SETTINGS_QUERY = `
  *[_type == "storeSettings"][0] {
    storeName,
    storeTagline,
    logo,
    whatsappNumber,
    instagramUsername,
    instagramUrl,
    address,
    heroTitle,
    heroSubtitle,
    promoText,
    primaryColor,
    seoTitle,
    seoDescription
  }
`;

export const CATEGORIES_QUERY = `
  *[_type == "category"] | order(order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    order
  }
`;

// Lightweight query for homepage grid + modal.
// `gallery` is excluded here — too heavy to fetch for all products at once.
// If/when product detail pages are added, fetch gallery via PRODUCT_BY_SLUG_QUERY.
export const PRODUCTS_QUERY = `
  *[_type == "product"] | order(sortOrder asc, name asc) {
    _id,
    name,
    "slug": slug.current,
    "category": category-> {
      _id,
      title,
      "slug": slug.current
    },
    price,
    discountPrice,
    image,
    description,
    colors,
    sizes,
    material,
    isAvailable,
    isFeatured,
    sortOrder
  }
`;

// Heavier query — only call this for a single product (e.g., detail page).
// Includes gallery for full-screen image viewer.
export const PRODUCT_BY_SLUG_QUERY = `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    "category": category-> { _id, title, "slug": slug.current },
    price,
    discountPrice,
    image,
    gallery,
    description,
    colors,
    sizes,
    material,
    isAvailable,
    isFeatured
  }
`;
