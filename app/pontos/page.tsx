import Link from "next/link";

export default function PontosPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pontos de recarga</h1>
        <Link
          href="/pontos/novo"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + Novo ponto
        </Link>
      </div>
      <p className="text-gray-500">Nenhum ponto cadastrado ainda.</p>
    </div>
  );
}
