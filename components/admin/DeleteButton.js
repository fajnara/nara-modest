"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id, action, label = "item" }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Hapus ${label} ini?`)) return;
    startTransition(async () => {
      await action(id);
      router.refresh();
    });
  }

  return (
    <button onClick={handleDelete} disabled={isPending}
      className="text-xs text-red-500 hover:underline disabled:opacity-50">
      {isPending ? "..." : "Hapus"}
    </button>
  );
}
