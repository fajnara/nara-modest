"use client";

import { useEffect, useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  function showToast(message, type = "success") {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }

  return { toasts, showToast };
}

export default function ToastContainer({ toasts }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-[calc(100%-2rem)] max-w-[440px]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const bg =
    toast.type === "success"
      ? "bg-[#171717] text-white"
      : "bg-red-600 text-white";

  return (
    <div
      className={`
        ${bg} px-4 py-3 rounded-xl shadow-lg text-sm font-medium
        flex items-center gap-2 transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      `}
    >
      {toast.type === "success" && (
        <span className="text-[#25D366] text-base">✓</span>
      )}
      {toast.message}
    </div>
  );
}
