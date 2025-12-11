'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    userId: '',
    bookId: '',
    dueDate: '',
  });
  const [error, setError] = useState('');

  const loadAll = async () => {
    try {
      setLoading(true);
      const [loanData, userData, bookData] = await Promise.all([
        apiFetch('/api/loans'),
        apiFetch('/api/users'),
        apiFetch('/api/books'),
      ]);
      setLoans(loanData);
      setUsers(userData);
      setBooks(bookData);
    } catch (err) {
      console.error(err);
      setError('Andmete laadimine ebaõnnestus');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');

      if (!form.userId || !form.bookId || !form.dueDate) {
        setError('Kasutaja, raamat ja tähtaeg on kohustuslikud.');
        return;
      }

      await apiFetch('/api/loans', {
        method: 'POST',
        body: JSON.stringify({
          userId: Number(form.userId),
          bookId: Number(form.bookId),
          dueDate: form.dueDate,
        }),
      });

      setForm({ userId: '', bookId: '', dueDate: '' });
      loadAll();
    } catch (err) {
      console.error(err);
      setError('Laenu loomine ebaõnnestus');
    }
  };

  const returnLoan = async (id) => {
    try {
      await apiFetch(`/api/loans/${id}/return`, { method: 'PUT' });
      loadAll();
    } catch (err) {
      console.error(err);
      setError('Laenu tagastamine ebaõnnestus');
    }
  };

  const activeBooks = books.filter((b) => b.status === 'available');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Laenutused</h2>

      {error && (
        <div className="rounded bg-red-100 text-red-800 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-2 md:grid-cols-3 bg-slate-50 p-3 rounded-lg"
      >
        <select
          name="userId"
          value={form.userId}
          onChange={handleChange}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Vali kasutaja</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        <select
          name="bookId"
          value={form.bookId}
          onChange={handleChange}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Vali raamat</option>
          {activeBooks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} – {b.author}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="border rounded px-2 py-1 text-sm"
        />

        <div className="md:col-span-3">
          <button
            type="submit"
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
          >
            Loo laenutus
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-slate-600">Laadimine...</p>
      ) : loans.length === 0 ? (
        <p className="text-sm text-slate-600">Laenutusi veel pole.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border px-2 py-1 text-left">ID</th>
                <th className="border px-2 py-1 text-left">Kasutaja</th>
                <th className="border px-2 py-1 text-left">Raamat</th>
                <th className="border px-2 py-1 text-left">Laenutuse kuupäev</th>
                <th className="border px-2 py-1 text-left">Tagastamise tähtaeg</th>
                <th className="border px-2 py-1 text-left">Tagastamise kuupäev</th>
                <th className="border px-2 py-1 text-left">Staatus</th>
                <th className="border px-2 py-1 text-left w-32">Tegevused</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((l) => (
                <tr key={l.id}>
                  <td className="border px-2 py-1">{l.id}</td>
                  <td className="border px-2 py-1">
                    {l.user?.name} ({l.user?.email})
                  </td>
                  <td className="border px-2 py-1">
                    {l.book?.title} – {l.book?.author}
                  </td>
                  <td className="border px-2 py-1">
                    {l.loanDate && new Date(l.loanDate).toLocaleDateString()}
                  </td>
                  <td className="border px-2 py-1">
                    {l.dueDate && new Date(l.dueDate).toLocaleDateString()}
                  </td>
                  <td className="border px-2 py-1">
                    {l.returnDate
                      ? new Date(l.returnDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="border px-2 py-1">{l.status}</td>
                  <td className="border px-2 py-1">
                    {l.status !== 'returned' && (
                      <button
                        onClick={() => returnLoan(l.id)}
                        className="text-xs px-2 py-1 border rounded"
                      >
                        Märgi tagastatud
                      </button>
                    )}
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