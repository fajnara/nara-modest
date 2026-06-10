"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id, action, label = "item" }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errMsg, setErrMsg] = useState("");

  function handleDelete() {
    if (!confirm(`Hapus ${label} ini?`)) return;
    setErrMsg("");
    startTransition(async () => {
      const result = await action(id);
      if (result?.error) {
        setErrMsg(result.error);
        // Auto-clear after 4s
        setTimeout(() => setErrMsg(""), 4000);
        return;
      }
      router.refresh();
    });
  }

  return (
    <span className="inline-flex flex-col items-end">
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs text-red-500 hover:underline disabled:opacity-50"
      >
        {isPending ? "..." : "Hapus"}
      </button>
      {errMsg && (
        <span className="text-[10px] text-red-500 mt-0.5">{errMsg}</span>
      )}
    </span>
  );
}
