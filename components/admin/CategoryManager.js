"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, X, AlertCircle, Tag } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/actions/admin";

export default function CategoryManager({ categories: initial }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newOrder, setNewOrder] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editOrder, setEditOrder] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!newTitle.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await createCategory({ title: newTitle.trim(), order: newOrder || 99 });
      if (result?.error) {
        setError(result.error);
        return;
      }
      setNewTitle(""); setNewOrder(""); setShowAdd(false);
      router.refresh();
    });
  }

  function handleEdit(cat) {
    setError("");
    setEditing(cat._id);
    setEditTitle(cat.title);
    setEditOrder(cat.order ?? "");
  }

  function handleSave(id) {
    if (!editTitle.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await updateCategory(id, { title: editTitle.trim(), order: editOrder || 99 });
      if (result?.error) {
        setError(result.error);
        return;
      }
      setEditing(null);
      router.refresh();
    });
  }

  function handleDelete(id) {
    if (!confirm("Hapus kategori ini? Produk yang terhubung tidak akan ikut terhapus.")) return;
    setError("");
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
          {error}
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
        {initial.length === 0 && !showAdd ? (
          <p className="text-center py-12 text-sm text-[#737373]">
            Belum ada kategori.
          </p>
        ) : (
          <ul className="divide-y divide-[#E5E5E5]">
            {initial.map((cat) => (
              <li key={cat._id} className="px-4 py-3.5 flex items-center gap-3">
                {editing === cat._id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-[#E5E5E5] focus:border-brand text-sm outline-none"
                    />
                    <input
                      value={editOrder}
                      onChange={(e) => setEditOrder(e.target.value)}
                      type="number"
                      placeholder="#"
                      className="w-16 px-3 py-2 rounded-lg border border-[#E5E5E5] focus:border-brand text-sm outline-none tabular-nums"
                    />
                    <button
                      onClick={() => handleSave(cat._id)}
                      disabled={isPending}
                      className="w-8 h-8 flex items-center justify-center rounded-lg btn-brand"
                      aria-label="Simpan"
                    >
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F5F5F4] hover:bg-[#E5E5E5] text-[#737373]"
                      aria-label="Batal"
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-[#F3F0EA] flex items-center justify-center shrink-0">
                      <Tag className="w-3.5 h-3.5 text-brand" strokeWidth={1.75} />
                    </div>
                    <span className="text-[10px] text-[#A8A29E] w-6 text-center tabular-nums">
                      {cat.order ?? "—"}
                    </span>
                    <span className="flex-1 text-sm font-medium text-[#171717]">
                      {cat.title}
                    </span>
                    <button onClick={() => handleEdit(cat)} className="text-xs text-brand font-semibold hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="text-xs text-red-500 hover:underline">
                      Hapus
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add form */}
      {showAdd ? (
        <div className="bg-white rounded-2xl border border-brand p-4 flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <label className="block text-[10px] font-semibold text-[#171717] uppercase tracking-widest mb-1.5">
              Nama Kategori
            </label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Contoh: Pashmina"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none"
            />
          </div>
          <div className="w-full sm:w-24">
            <label className="block text-[10px] font-semibold text-[#171717] uppercase tracking-widest mb-1.5">
              Urutan
            </label>
            <input
              value={newOrder}
              onChange={(e) => setNewOrder(e.target.value)}
              type="number"
              placeholder="1"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none tabular-nums"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={isPending || !newTitle.trim()}
              className="px-5 py-2.5 rounded-xl btn-brand text-sm font-semibold disabled:opacity-50"
            >
              Tambah
            </button>
            <button
              onClick={() => { setShowAdd(false); setNewTitle(""); setNewOrder(""); }}
              className="px-5 py-2.5 rounded-xl bg-[#F5F5F4] text-[#737373] text-sm font-medium hover:bg-[#E5E5E5]"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl border border-dashed border-[#E5E5E5] text-sm text-[#737373] hover:border-brand hover:text-brand"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          Tambah Kategori
        </button>
      )}
    </div>
  );
}
