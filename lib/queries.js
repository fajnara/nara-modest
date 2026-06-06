export const STORE_SETTINGS_QUERY = `
  *[_type == "storeSettings"][0] {
    storeName,
    storeTagline,
    logo,
    whatsappNumber,
    instagramUrl,
    address,
    heroTitle,
    heroSubtitle,
    promoText,
    primaryColor
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
    image,
    description,
    isAvailable,
    isFeatured,
    sortOrder
  }
`;
