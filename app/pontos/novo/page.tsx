import Link from "next/link";

export default function NovoPontoPage() {
  return (
    <div className="p-8">
      <Link href="/pontos" className="text-sm text-emerald-700 hover:underline">
        ← Voltar
      </Link>
      <h1 className="text-2xl font-bold mt-2">Novo ponto de recarga</h1>
    </div>
  );
}
