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
              <h2 className="font-semibold">{p.nome}</h2>
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
