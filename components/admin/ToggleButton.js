"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function ToggleButton({ id, value, action }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await action(id, !value);
      router.refresh();
    });
  }

  return (
    <button onClick={handleToggle} disabled={isPending}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        value ? "bg-[#8B5E3C]" : "bg-[#E5E5E5]"
      } disabled:opacity-50`}
      aria-label={value ? "Tersedia" : "Tidak tersedia"}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
        value ? "translate-x-4" : "translate-x-1"
      }`} />
    </button>
  );
}
