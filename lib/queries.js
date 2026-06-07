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
    gallery,
    description,
    colors,
    sizes,
    material,
    isAvailable,
    isFeatured,
    sortOrder
  }
`;
