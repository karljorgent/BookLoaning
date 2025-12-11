'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/books');
      setBooks(data);
    } catch (err) {
      console.error(err);
      setError('Raamatute laadimine ebaõnnestus');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (!form.title || !form.author) {
        setError('Pealkiri ja autor on kohustuslikud');
        return;
      }

      if (editingId) {
        await apiFetch(`/api/books/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({ ...form }),
        });
      } else {
        await apiFetch('/api/books', {
          method: 'POST',
          body: JSON.stringify({ ...form }),
        });
      }

      setForm({ title: '', author: '', isbn: '', description: '' });
      setEditingId(null);
      loadBooks();
    } catch (err) {
      console.error(err);
      setError('Raamatu salvestamine ebaõnnestus');
    }
  };

  const startEdit = (book) => {
    setEditingId(book.id);
    setForm({
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      description: book.description || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: '', author: '', isbn: '', description: '' });
  };

  const deleteBook = async (id) => {
    if (!confirm('Kustuta raamat?')) return;
    try {
      await apiFetch(`/api/books/${id}`, { method: 'DELETE' });
      loadBooks();
    } catch (err) {
      console.error(err);
      setError('Raamatu kustutamine ebaõnnestus');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Raamatud</h2>

      {error && (
        <div className="rounded bg-red-100 text-red-800 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-2 md:grid-cols-2 bg-slate-50 p-3 rounded-lg"
      >
        <input
          className="border rounded px-2 py-1 text-sm"
          placeholder="Pealkiri *"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          className="border rounded px-2 py-1 text-sm"
          placeholder="Autor *"
          name="author"
          value={form.author}
          onChange={handleChange}
        />
        <input
          className="border rounded px-2 py-1 text-sm"
          placeholder="ISBN"
          name="isbn"
          value={form.isbn}
          onChange={handleChange}
        />
        <input
          className="border rounded px-2 py-1 text-sm md:col-span-2"
          placeholder="Kirjeldus"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <div className="flex gap-2 md:col-span-2">
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
      ) : books.length === 0 ? (
        <p className="text-sm text-slate-600">Raamatuid veel pole</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border px-2 py-1 text-left">ID</th>
                <th className="border px-2 py-1 text-left">Pealkiri</th>
                <th className="border px-2 py-1 text-left">Autor</th>
                <th className="border px-2 py-1 text-left">Staatus</th>
                <th className="border px-2 py-1 text-left w-32">Tegevused</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id}>
                  <td className="border px-2 py-1">{b.id}</td>
                  <td className="border px-2 py-1">{b.title}</td>
                  <td className="border px-2 py-1">{b.author}</td>
                  <td className="border px-2 py-1">{b.status}</td>
                  <td className="border px-2 py-1">
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(b)}
                        className="text-xs px-2 py-1 border rounded"
                      >
                        Muuda
                      </button>
                      <button
                        onClick={() => deleteBook(b.id)}
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