export default function HomePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tere tulemast</h2>
      <ul className="list-disc list-inside text-sm">
        <li>
          Halda <a href="/books" className="text-blue-600 underline">raamatuid</a>
        </li>
        <li>
          Halda <a href="/users" className="text-blue-600 underline">kasutajaid</a>
        </li>
        <li>
          Loo ja halda <a href="/loans" className="text-blue-600 underline">laenutusi</a>
        </li>
      </ul>
    </div>
  );
}
