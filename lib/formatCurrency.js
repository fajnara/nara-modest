export function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyShort(amount) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export function getEffectivePrice(product) {
  if (product?.discountPrice && product.discountPrice < product.price) {
    return product.discountPrice;
  }
  return product?.price ?? 0;
}

export function hasDiscount(product) {
  return product?.discountPrice && product.discountPrice < product.price;
}
