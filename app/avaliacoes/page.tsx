"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Avaliacao = {
  id: string;
  ponto_id: string;
  ponto_nome: string | null;
  motorista: string;
  nota: number;
  comentario: string;
};

type Ponto = {
  id: string;
  nome: string;
};

export default function AvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [filtroPonto, setFiltroPonto] = useState("todos");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([
      api<Avaliacao[]>("/api/avaliacoes"),
      api<Ponto[]>("/api/pontos"),
    ])
      .then(([listaAvaliacoes, listaPontos]) => {
        setAvaliacoes(listaAvaliacoes);
        setPontos(listaPontos);
      })
      .finally(() => setCarregando(false));
  }, []);

  const avaliacoesFiltradas =
    filtroPonto === "todos"
      ? avaliacoes
      : avaliacoes.filter((a) => a.ponto_id === filtroPonto);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Avaliações</h1>

      <label className="flex flex-col gap-1 text-sm mb-4 max-w-xs">
        <span className="font-medium">Filtrar por ponto</span>
        <select
          value={filtroPonto}
          onChange={(e) => setFiltroPonto(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="todos">Todos os pontos</option>
          {pontos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </label>

      {carregando ? (
        <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
      ) : avaliacoesFiltradas.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Nenhuma avaliação ainda.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {avaliacoesFiltradas.map((a) => (
            <li
              key={a.id}
              className="border border-gray-200 rounded-md p-4 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{a.motorista}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {a.ponto_nome ?? "Ponto removido"}
                  </p>
                </div>
                <span className="text-amber-500">
                  {"★".repeat(a.nota)}
                  <span className="text-gray-300 dark:text-gray-700">
                    {"★".repeat(5 - a.nota)}
                  </span>
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {a.comentario}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
