"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Shield, ShieldCheck, UserX, AlertCircle } from "lucide-react";
import { createAdminUser, updateAdminUser, deleteAdminUser } from "@/actions/admin";

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
      const result = await createAdminUser(form);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setForm({ name: "", email: "", password: "", role: "admin" });
      setShowAdd(false);
      router.refresh();
    });
  }

  function startEdit(user) {
    setError("");
    setEditing(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      password: "",
    });
  }

  function handleSave(id) {
    setError("");
    startTransition(async () => {
      const result = await updateAdminUser(id, editForm);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setEditing(null);
      router.refresh();
    });
  }

  function handleDelete(id) {
    setError("");
    if (id === currentUserId) { setError("Tidak bisa menghapus akun sendiri."); return; }
    if (!confirm("Hapus user ini?")) return;
    startTransition(async () => {
      const result = await deleteAdminUser(id);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
          {error}
        </div>
      )}

      {/* User list — card layout (works on mobile + desktop) */}
      <div className="space-y-2.5">
        {users.map((u) => {
          const isMe = u._id === currentUserId;
          const isSuperadmin = u.role === "superadmin";

          if (editing === u._id) {
            return (
              <div key={u._id} className="bg-white rounded-2xl border border-brand p-4 space-y-3">
                <p className="text-xs font-semibold text-[#171717] uppercase tracking-widest">
                  Edit User
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Nama"
                    className="px-3.5 py-2 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none"
                  />
                  <input
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="Email"
                    className="px-3.5 py-2 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none"
                  />
                  <input
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    type="password"
                    placeholder="Password baru (kosongkan jika tidak diubah)"
                    className="px-3.5 py-2 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none sm:col-span-2"
                  />
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="px-3.5 py-2 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none bg-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                  <label className="flex items-center gap-2 text-sm px-2">
                    <input
                      type="checkbox"
                      checked={editForm.isActive}
                      onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                      className="w-4 h-4 accent-[var(--brand)]"
                    />
                    Aktif
                  </label>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleSave(u._id)}
                    disabled={isPending}
                    className="px-4 py-2 rounded-xl btn-brand text-xs font-semibold disabled:opacity-50"
                  >
                    {isPending ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="px-4 py-2 rounded-xl bg-[#F5F5F4] text-[#737373] text-xs font-medium hover:bg-[#E5E5E5]"
                  >
                    Batal
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={u._id} className="bg-white rounded-2xl border border-[#E5E5E5] p-4">
              <div className="flex items-start gap-3">
                {/* Avatar with role icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSuperadmin ? "bg-[var(--brand)]/10 text-brand" : "bg-[#F5F5F4] text-[#737373]"
                }`}>
                  {isSuperadmin
                    ? <ShieldCheck className="w-5 h-5" strokeWidth={1.75} />
                    : <Shield className="w-5 h-5" strokeWidth={1.75} />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[#171717] truncate">{u.name}</p>
                    {isMe && (
                      <span className="text-[10px] bg-[var(--brand)]/10 text-brand px-1.5 py-0.5 rounded-full font-semibold">
                        Kamu
                      </span>
                    )}
                    {!u.isActive && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                        <UserX className="w-2.5 h-2.5" strokeWidth={2.5} />
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#737373] mt-0.5 truncate">{u.email}</p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                      isSuperadmin ? "bg-[var(--brand)]/10 text-brand" : "bg-[#F5F5F4] text-[#737373]"
                    }`}>
                      {u.role}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(u)}
                    className="text-xs text-brand font-semibold hover:underline"
                  >
                    Edit
                  </button>
                  {!isMe && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add new user */}
      {showAdd ? (
        <div className="bg-white rounded-2xl border border-brand p-4 space-y-3">
          <p className="text-xs font-semibold text-[#171717] uppercase tracking-widest">
            Tambah User Baru
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama"
              className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none"
            />
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              placeholder="Email"
              className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none"
            />
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              placeholder="Password"
              className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] focus:border-brand text-sm outline-none bg-white"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <p className="text-[10px] text-[#A8A29E] leading-relaxed">
            Password: min 10 karakter, harus ada huruf & angka, tidak boleh sama dengan email.
          </p>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAdd}
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl btn-brand text-sm font-semibold disabled:opacity-50"
            >
              {isPending ? "Menambah..." : "Tambah"}
            </button>
            <button
              onClick={() => { setShowAdd(false); setError(""); }}
              className="px-5 py-2.5 rounded-xl bg-[#F5F5F4] text-[#737373] text-sm font-medium hover:bg-[#E5E5E5]"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl border border-dashed border-[#E5E5E5] text-sm text-[#737373] hover:border-brand hover:text-brand transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          Tambah User Admin
        </button>
      )}
    </div>
  );
}
