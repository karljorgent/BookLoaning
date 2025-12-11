import "./globals.css";

export const metadata = {
  title: 'Raamatu laenutus',
  description: 'Raamatu laenutus',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900">
        <div className="max-w-4xl mx-auto p-4">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Raamatu laenutus</h1>
            <nav className="flex gap-3 text-sm">
              <a href="/" className="hover:underline">
                Avaleht
              </a>
              <a href="/books" className="hover:underline">
                Raamatud
              </a>
              <a href="/users" className="hover:underline">
                Kasutajad
              </a>
              <a href="/loans" className="hover:underline">
                Laenutused
              </a>
            </nav>
          </header>
          <main className="bg-white rounded-xl shadow p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
