"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import HeroBanner from "./HeroBanner";
import CategoryChips from "./CategoryChips";
import ProductGrid from "./ProductGrid";
import ProductModal from "./ProductModal";
import CartDrawer from "./CartDrawer";
import Footer from "./Footer";
import DesktopSidebar from "./DesktopSidebar";
import SearchBar from "./SearchBar";
import ToastContainer, { useToast } from "./Toast";
import { darkenHex } from "@/lib/colorUtils";

const CART_STORAGE_KEY = "nara-modest-cart";

export default function AppShell({ store, categories, products }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const { toasts, showToast } = useToast();

  // Step 1: hydrate cart from localStorage once
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) setCart(JSON.parse(stored));
    } catch { /* ignore */ }
    setIsHydrated(true);
  }, []);

  // Step 2: after hydration, sync cart with latest product data
  // (update price, remove unavailable items)
  useEffect(() => {
    if (!isHydrated) return;
    setCart((prev) => {
      if (prev.length === 0) return prev;
      const synced = prev
        .map((item) => {
          const fresh = products.find((p) => p._id === item.id);
          if (!fresh || !fresh.isAvailable) return null;
          const freshPrice =
            fresh.discountPrice && fresh.discountPrice < fresh.price
              ? fresh.discountPrice
              : fresh.price;
          return {
            ...item,
            name: fresh.name,
            price: freshPrice,
            image: fresh.image,
          };
        })
        .filter(Boolean);
      // Avoid unnecessary re-render if nothing changed
      const isSame =
        synced.length === prev.length &&
        synced.every((s, i) => s.price === prev[i].price && s.name === prev[i].name);
      return isSame ? prev : synced;
    });
  }, [isHydrated, products]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch { /* ignore */ }
  }, [cart, isHydrated]);

  // Unique cart key combines product ID + selected variants
  // so same product with different color/size becomes separate cart entries
  function getCartKey(productId, color, size) {
    return `${productId}|${color || ""}|${size || ""}`;
  }

  const addToCart = useCallback((product) => {
    // Use effective price (discount price if available)
    const price =
      product.discountPrice && product.discountPrice < product.price
        ? product.discountPrice
        : product.price;

    const color = product._selectedColor || null;
    const size = product._selectedSize || null;
    const cartKey = getCartKey(product._id, color, size);

    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, {
        cartKey,
        id: product._id,
        name: product.name,
        price,
        image: product.image,
        color,
        size,
        qty: 1,
      }];
    });

    // Build descriptive toast with variant info
    const variantLabel = [color, size].filter(Boolean).join(" · ");
    const toastMsg = variantLabel
      ? `${product.name} (${variantLabel}) ditambahkan`
      : `${product.name} ditambahkan ke keranjang`;
    showToast(toastMsg);
  }, [showToast]);

  const increaseQty = useCallback((cartKey) => {
    setCart((prev) =>
      prev.map((item) => item.cartKey === cartKey ? { ...item, qty: item.qty + 1 } : item)
    );
  }, []);

  const decreaseQty = useCallback((cartKey) => {
    setCart((prev) => {
      const item = prev.find((i) => i.cartKey === cartKey);
      if (!item) return prev;
      if (item.qty <= 1) return prev.filter((i) => i.cartKey !== cartKey);
      return prev.map((i) => i.cartKey === cartKey ? { ...i, qty: i.qty - 1 } : i);
    });
  }, []);

  const removeItem = useCallback((cartKey) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Filter by category + search query
  const filteredProducts = products.filter((p) => {
    const catMatch =
      activeCategory === "all" || p.category?.slug === activeCategory;
    if (!catMatch) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.title?.toLowerCase().includes(q) ||
      p.material?.toLowerCase().includes(q)
    );
  });

  // Auto-derive dark shade so owner only needs to set ONE color in CMS
  const brandColor = store.primaryColor || "#8B5E3C";
  const brandDark = darkenHex(brandColor, 30);

  return (
    <div
      className="min-h-screen bg-[#F3F0EA]"
      style={{ "--brand": brandColor, "--brand-dark": brandDark }}
    >
      <ToastContainer toasts={toasts} />

      {/* ── MOBILE layout (< md) ─────────────────────── */}
      <div className="md:hidden flex justify-center">
        <div className="relative w-full max-w-[480px] min-h-screen bg-[#FAFAF8] shadow-[0_0_40px_rgba(0,0,0,0.08)]">
          <Header
            storeName={store.storeName}
            storeTagline={store.storeTagline}
            logo={store.logo}
            totalQty={totalQty}
            onCartOpen={() => setIsCartOpen(true)}
          />
          <main>
            <HeroBanner
              heroTitle={store.heroTitle}
              heroSubtitle={store.heroSubtitle}
              promoText={store.promoText}
            />
            <div className="px-4 pt-5 pb-2">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="px-4 pt-3 pb-2">
              <CategoryChips
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
            <div className="px-4 pb-6">
              <ProductGrid
                products={filteredProducts}
                onProductClick={setSelectedProduct}
                onAddToCart={addToCart}
                searchQuery={searchQuery}
                onClearFilters={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              />
            </div>
          </main>
          <Footer store={store} />
        </div>
      </div>

      {/* ── DESKTOP layout (≥ md) ────────────────────── */}
      <div className="hidden md:flex min-h-screen w-full bg-[#FAFAF8]">

        {/* Sidebar */}
        <DesktopSidebar
          store={store}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          totalQty={totalQty}
          onCartOpen={() => setIsCartOpen(true)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Desktop top bar */}
          <div className="sticky top-0 z-40 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#E5E5E5] px-6 h-14 flex items-center justify-between gap-4">
            <p className="text-sm text-[#737373] whitespace-nowrap shrink-0">
              {filteredProducts.length} produk
              {activeCategory !== "all" && (
                <span className="text-brand font-medium">
                  {" "}· {categories.find((c) => c.slug === activeCategory)?.title}
                </span>
              )}
            </p>
            <div className="flex-1 max-w-sm">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <p className="text-xs text-[#A8A29E] whitespace-nowrap shrink-0 hidden lg:block">
              {store.storeName} Catalog
            </p>
          </div>

          {/* Hero */}
          <div className="px-6 pt-5">
            <HeroBanner
              heroTitle={store.heroTitle}
              heroSubtitle={store.heroSubtitle}
              promoText={store.promoText}
            />
          </div>

          {/* Product grid — 3 columns on desktop */}
          <div className="px-6 pt-4 pb-8 flex-1">
            <ProductGrid
              products={filteredProducts}
              onProductClick={setSelectedProduct}
              onAddToCart={addToCart}
              columns={3}
              searchQuery={searchQuery}
              onClearFilters={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
            />
          </div>

          {/* Desktop footer */}
          <Footer store={store} />
        </div>
      </div>

      {/* ── Shared: Modal & Cart (both layouts) ─────── */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p) => {
            addToCart(p);
            setSelectedProduct(null);
          }}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        subtotal={subtotal}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
        onRemove={removeItem}
        onClearCart={clearCart}
        store={store}
      />
    </div>
  );
}
