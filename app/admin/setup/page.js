import { adminClient } from "@/lib/sanity-admin";
import SetupWizard from "@/components/admin/SetupWizard";

export default async function SetupPage() {
  const [store, categoryCount, productCount] = await Promise.all([
    adminClient.fetch(`*[_type == "storeSettings"][0]`),
    adminClient.fetch(`count(*[_type == "category"])`),
    adminClient.fetch(`count(*[_type == "product"])`),
  ]);

  return (
    <SetupWizard
      initialStore={store || {}}
      initialCategoryCount={categoryCount}
      initialProductCount={productCount}
    />
  );
}
