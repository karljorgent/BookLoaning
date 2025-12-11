'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'user',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Kasutajate laadimine ebaõnnestus');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (!form.name || !form.email) {
        setError('Nimi ja e-posti aadress on kohustuslikud');
        return;
      }

      if (editingId) {
        await apiFetch(`/api/users/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch('/api/users', {
          method: 'POST',
          body: JSON.stringify(form),
        });
      }

      setForm({ name: '', email: '', role: 'user' });
      setEditingId(null);
      loadUsers();
    } catch (err) {
      console.error(err);
      setError('Kasutaja salvestamine ebaõnnestus');
    }
  };

  const startEdit = (u) => {
    setEditingId(u.id);
    setForm({
      name: u.name || '',
      email: u.email || '',
      role: u.role || 'user',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', email: '', role: 'user' });
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
      loadUsers();
    } catch (err) {
      console.error(err);
      setError('Kasutaja kustutamine ebaõnnestus');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Kasutajad</h2>

      {error && (
        <div className="rounded bg-red-100 text-red-800 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-2 md:grid-cols-3 bg-slate-50 p-3 rounded-lg"
      >
        <input
          className="border rounded px-2 py-1 text-sm"
          placeholder="Nimi *"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="border rounded px-2 py-1 text-sm"
          placeholder="Email *"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <select
          className="border rounded px-2 py-1 text-sm"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="user">Kasutaja</option>
          <option value="admin">Admin</option>
        </select>
        <div className="flex gap-2 md:col-span-3">
          <button
            type="submit"
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
          >
            {editingId ? 'Salvesta' : 'Lisa'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm px-3 py-1 rounded border"
            >
              Katkesta
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-slate-600">Laadimine...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-slate-600">Kasutajaid pole.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border px-2 py-1 text-left">ID</th>
                <th className="border px-2 py-1 text-left">Nimi</th>
                <th className="border px-2 py-1 text-left">Email</th>
                <th className="border px-2 py-1 text-left">Roll</th>
                <th className="border px-2 py-1 text-left w-32">Tegevused</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="border px-2 py-1">{u.id}</td>
                  <td className="border px-2 py-1">{u.name}</td>
                  <td className="border px-2 py-1">{u.email}</td>
                  <td className="border px-2 py-1">{u.role}</td>
                  <td className="border px-2 py-1">
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(u)}
                        className="text-xs px-2 py-1 border rounded"
                      >
                        Muuda
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="text-xs px-2 py-1 border rounded text-red-700"
                      >
                        Kustuta
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}