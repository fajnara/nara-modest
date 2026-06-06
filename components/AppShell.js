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
import ToastContainer, { useToast } from "./Toast";

const CART_STORAGE_KEY = "nara-modest-cart";

export default function AppShell({ store, categories, products }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isHydrated, setIsHydrated] = useState(false);
  const { toasts, showToast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) setCart(JSON.parse(stored));
    } catch { /* ignore */ }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch { /* ignore */ }
  }, [cart, isHydrated]);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1,
      }];
    });
    showToast(`${product.name} ditambahkan ke keranjang`);
  }, [showToast]);

  const increaseQty = useCallback((id) => {
    setCart((prev) =>
      prev.map((item) => item.id === id ? { ...item, qty: item.qty + 1 } : item)
    );
  }, []);

  const decreaseQty = useCallback((id) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      if (item.qty <= 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  }, []);

  const removeItem = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category?.slug === activeCategory);

  return (
    <div className="min-h-screen bg-[#F3F0EA]">
      <ToastContainer toasts={toasts} />

      {/* ── MOBILE layout (< md) ─────────────────────── */}
      <div className="md:hidden flex justify-center">
        <div className="relative w-full max-w-[480px] min-h-screen bg-[#FAFAF8] shadow-[0_0_40px_rgba(0,0,0,0.08)]">
          <Header
            storeName={store.storeName}
            storeTagline={store.storeTagline}
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
              />
            </div>
          </main>
          <Footer store={store} />
        </div>
      </div>

      {/* ── DESKTOP layout (≥ md) ────────────────────── */}
      <div className="hidden md:flex min-h-screen max-w-[1100px] mx-auto bg-[#FAFAF8] shadow-[0_0_60px_rgba(0,0,0,0.07)]">

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
          <div className="sticky top-0 z-40 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#E5E5E5] px-6 h-14 flex items-center justify-between">
            <p className="text-sm text-[#737373]">
              {filteredProducts.length} produk
              {activeCategory !== "all" && (
                <span className="text-[#8B5E3C] font-medium">
                  {" "}· {categories.find((c) => c.slug === activeCategory)?.title}
                </span>
              )}
            </p>
            <p className="text-xs text-[#A8A29E]">Nara Modest Catalog</p>
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
