"use client";

import { useState, useTransition } from "react";
import { createAdminUser, updateAdminUser, deleteAdminUser } from "@/actions/admin";
import { useRouter } from "next/navigation";

export default function UserManager({ users, currentUserId }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });
  const [editForm, setEditForm] = useState({});

  function handleAdd() {
    if (!form.name || !form.email || !form.password) {
      setError("Nama, email, dan password wajib diisi"); return;
    }
    setError("");
    startTransition(async () => {
      try {
        await createAdminUser(form);
        setForm({ name: "", email: "", password: "", role: "admin" });
        setShowAdd(false);
        router.refresh();
      } catch (err) {
        setError(err.message);
      }
    });
  }

  function startEdit(user) {
    setEditing(user._id);
    setEditForm({ name: user.name, email: user.email, role: user.role, isActive: user.isActive, password: "" });
  }

  function handleSave(id) {
    startTransition(async () => {
      await updateAdminUser(id, editForm);
      setEditing(null);
      router.refresh();
    });
  }

  function handleDelete(id) {
    if (id === currentUserId) { alert("Tidak bisa menghapus akun sendiri."); return; }
    if (!confirm("Hapus user ini?")) return;
    startTransition(async () => {
      await deleteAdminUser(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E5E5] bg-[#F5F5F4]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#737373]">Nama</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#737373] hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#737373]">Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-[#FAFAF8]">
                {editing === u._id ? (
                  <td colSpan={4} className="px-4 py-3">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Nama" className="px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-sm outline-none" />
                      <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="Email" className="px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-sm outline-none" />
                      <input value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        type="password" placeholder="Password baru (kosongkan jika tidak diubah)"
                        className="px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-sm outline-none col-span-2" />
                      <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-sm outline-none">
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={editForm.isActive}
                          onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                          className="accent-[#8B5E3C]" /> Aktif
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleSave(u._id)} disabled={isPending}
                        className="text-xs bg-[#8B5E3C] text-white px-3 py-1.5 rounded-lg">Simpan</button>
                      <button onClick={() => setEditing(null)} className="text-xs text-[#737373]">Batal</button>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[#171717]">{u.name}</p>
                      {!u.isActive && <span className="text-[10px] text-red-500">Nonaktif</span>}
                      {u._id === currentUserId && <span className="text-[10px] text-[#8B5E3C] ml-1">(Kamu)</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#737373] hidden sm:table-cell">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-[#F3F0EA] text-[#8B5E3C] px-2 py-0.5 rounded-full">{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => startEdit(u)} className="text-xs text-[#8B5E3C] hover:underline">Edit</button>
                        {u._id !== currentUserId && (
                          <button onClick={() => handleDelete(u._id)} className="text-xs text-red-500 hover:underline">Hapus</button>
                        )}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd ? (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 space-y-3">
          <p className="text-sm font-semibold text-[#171717]">Tambah User Baru</p>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama" className="px-3 py-2 rounded-xl border border-[#E5E5E5] text-sm outline-none" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email" placeholder="Email" className="px-3 py-2 rounded-xl border border-[#E5E5E5] text-sm outline-none" />
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password" placeholder="Password" className="px-3 py-2 rounded-xl border border-[#E5E5E5] text-sm outline-none" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="px-3 py-2 rounded-xl border border-[#E5E5E5] text-sm outline-none">
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={isPending}
              className="px-4 py-2 rounded-xl bg-[#8B5E3C] text-white text-sm font-semibold hover:bg-[#5C3A24] disabled:opacity-50">
              Tambah
            </button>
            <button onClick={() => { setShowAdd(false); setError(""); }}
              className="px-4 py-2 rounded-xl bg-[#F5F5F4] text-sm text-[#737373]">Batal</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)}
          className="w-full py-2.5 rounded-xl border border-dashed border-[#E5E5E5] text-sm text-[#737373] hover:border-[#8B5E3C] hover:text-[#8B5E3C] transition-colors">
          + Tambah User Admin
        </button>
      )}
    </div>
  );
}
