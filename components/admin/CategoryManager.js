"use client";

import { useState, useTransition } from "react";
import { createCategory, updateCategory, deleteCategory } from "@/actions/admin";
import { useRouter } from "next/navigation";

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
      try {
        await createCategory({ title: newTitle.trim(), order: newOrder || 99 });
        setNewTitle(""); setNewOrder(""); setShowAdd(false);
        router.refresh();
      } catch (err) {
        setError(err.message || "Gagal menambah kategori");
      }
    });
  }

  function handleEdit(cat) {
    setEditing(cat._id);
    setEditTitle(cat.title);
    setEditOrder(cat.order ?? "");
  }

  function handleSave(id) {
    if (!editTitle.trim()) return;
    setError("");
    startTransition(async () => {
      try {
        await updateCategory(id, { title: editTitle.trim(), order: editOrder || 99 });
        setEditing(null);
        router.refresh();
      } catch (err) {
        setError(err.message || "Gagal menyimpan");
      }
    });
  }

  function handleDelete(id) {
    if (!confirm("Hapus kategori ini? Produk yang terhubung tidak akan ikut terhapus.")) return;
    setError("");
    startTransition(async () => {
      try {
        await deleteCategory(id);
        router.refresh();
      } catch (err) {
        setError(err.message || "Gagal menghapus");
      }
    });
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl">
          {error}
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
        {initial.length === 0 && !showAdd ? (
          <p className="text-center py-10 text-sm text-[#737373]">Belum ada kategori.</p>
        ) : (
          <ul className="divide-y divide-[#E5E5E5]">
            {initial.map((cat) => (
              <li key={cat._id} className="px-4 py-3 flex items-center gap-3">
                {editing === cat._id ? (
                  <>
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none" />
                    <input value={editOrder} onChange={(e) => setEditOrder(e.target.value)}
                      type="number" placeholder="Urutan" className="w-20 px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-sm outline-none" />
                    <button onClick={() => handleSave(cat._id)} disabled={isPending}
                      className="text-xs bg-[#8B5E3C] text-white px-3 py-1.5 rounded-lg hover:bg-[#5C3A24]">Simpan</button>
                    <button onClick={() => setEditing(null)}
                      className="text-xs text-[#737373] hover:text-[#171717]">Batal</button>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-[#A8A29E] w-6 text-center">{cat.order}</span>
                    <span className="flex-1 text-sm font-medium text-[#171717]">{cat.title}</span>
                    <button onClick={() => handleEdit(cat)} className="text-xs text-[#8B5E3C] hover:underline">Edit</button>
                    <button onClick={() => handleDelete(cat._id)} className="text-xs text-red-500 hover:underline">Hapus</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add form */}
      {showAdd ? (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-[#171717] mb-1">Nama Kategori</label>
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Contoh: Pashmina"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] focus:border-[#8B5E3C] text-sm outline-none" />
          </div>
          <div className="w-24">
            <label className="block text-xs font-semibold text-[#171717] mb-1">Urutan</label>
            <input value={newOrder} onChange={(e) => setNewOrder(e.target.value)}
              type="number" placeholder="1"
              className="w-full px-3 py-2 rounded-xl border border-[#E5E5E5] text-sm outline-none" />
          </div>
          <button onClick={handleAdd} disabled={isPending || !newTitle.trim()}
            className="px-4 py-2 rounded-xl bg-[#8B5E3C] text-white text-sm font-semibold hover:bg-[#5C3A24] disabled:opacity-50">
            Tambah
          </button>
          <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl bg-[#F5F5F4] text-sm text-[#737373]">
            Batal
          </button>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)}
          className="w-full py-2.5 rounded-xl border border-dashed border-[#E5E5E5] text-sm text-[#737373] hover:border-[#8B5E3C] hover:text-[#8B5E3C] transition-colors">
          + Tambah Kategori
        </button>
      )}
    </div>
  );
}
