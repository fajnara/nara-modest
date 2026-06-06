import { adminClient } from "@/lib/sanity-admin";
import SettingsForm from "@/components/admin/SettingsForm";
import { updateStoreSettings } from "@/actions/admin";

export default async function SettingsPage() {
  const settings = await adminClient.fetch(
    `*[_type == "storeSettings"][0]`
  ) || {};

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#171717]">Pengaturan Toko</h1>
      </div>
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
        <SettingsForm settings={settings} action={updateStoreSettings} />
      </div>
    </div>
  );
}
