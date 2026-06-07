import { sanityClient, isSanityConfigured } from "@/lib/sanity";
import { STORE_SETTINGS_QUERY, CATEGORIES_QUERY, PRODUCTS_QUERY } from "@/lib/queries";
import { DUMMY_STORE, DUMMY_CATEGORIES, DUMMY_PRODUCTS } from "@/lib/dummy";
import AppShell from "@/components/AppShell";

// ISR: cache page for 10 seconds, then revalidate in background.
// - Webhook handles instant invalidation on Studio publish
// - ISR is the safety net if webhook fails (max 10s stale data)
// - Public Sanity client uses useCdn:false so fetches always return fresh data
export const revalidate = 10;

async function getData() {
  if (!isSanityConfigured) {
    return {
      store: DUMMY_STORE,
      categories: DUMMY_CATEGORIES,
      products: DUMMY_PRODUCTS,
    };
  }

  try {
    const [store, categories, products] = await Promise.all([
      sanityClient.fetch(STORE_SETTINGS_QUERY),
      sanityClient.fetch(CATEGORIES_QUERY),
      sanityClient.fetch(PRODUCTS_QUERY),
    ]);

    return {
      store: store || DUMMY_STORE,
      categories: categories?.length ? categories : DUMMY_CATEGORIES,
      products: products?.length ? products : DUMMY_PRODUCTS,
    };
  } catch {
    return {
      store: DUMMY_STORE,
      categories: DUMMY_CATEGORIES,
      products: DUMMY_PRODUCTS,
    };
  }
}

export default async function HomePage() {
  const { store, categories, products } = await getData();

  return <AppShell store={store} categories={categories} products={products} />;
}
