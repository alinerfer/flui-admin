"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  uf: string;
  conector: string;
  potencia: number;
  preco: number;
  latitude: number;
  longitude: number;
};

export default function PontosPage() {
  const [pontos, setPontos] = useState<Ponto[]>([]);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("pontos") || "[]");
    setPontos(dados);
  }, []);

  function removerPonto(id: string) {
    if (!confirm("Remover este ponto?")) return;
    const novos = pontos.filter((p) => p.id !== id);
    setPontos(novos);
    localStorage.setItem("pontos", JSON.stringify(novos));
  }

  return (
    <div className="p-8">
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Pontos de recarga</h1>
        <Link
          href="/pontos/novo"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
        >
          + Novo ponto
        </Link>
      </div>

      {pontos.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Nenhum ponto cadastrado ainda.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {pontos.map((p) => (
            <li
              key={p.id}
              className="border border-gray-200 rounded-md p-4 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold">{p.nome}</h2>
                <div className="flex gap-3">
                  <Link
                    href={`/pontos/${p.id}/editar`}
                    className="text-sm text-emerald-700 hover:underline dark:text-emerald-400"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => removerPonto(p.id)}
                    className="text-sm text-red-600 hover:underline dark:text-red-400"
                  >
                    Remover
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {p.endereco}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {p.cidade} - {p.uf}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {p.conector} · {p.potencia} kW · R$ {p.preco.toFixed(2)}/kWh
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
