"use client";

import { useEffect, useState } from "react";

type Avaliacao = {
  id: string;
  pontoId: string;
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

  useEffect(() => {
    setPontos(JSON.parse(localStorage.getItem("pontos") || "[]"));

    const dados: Avaliacao[] = JSON.parse(
      localStorage.getItem("avaliacoes") || "[]"
    );
    if (dados.length === 0) {
      const iniciais: Avaliacao[] = [
        {
          id: "1",
          pontoId: "paulista",
          motorista: "Ana Souza",
          nota: 5,
          comentario: "Carregamento rápido e local seguro.",
        },
        {
          id: "2",
          pontoId: "paulista",
          motorista: "Carlos Lima",
          nota: 4,
          comentario: "Bom, mas estava com fila no horário de pico.",
        },
        {
          id: "3",
          pontoId: "iguatemi",
          motorista: "Mariana Reis",
          nota: 3,
          comentario: "Funcionou, porém um pouco lento para o meu carro.",
        },
      ];
      localStorage.setItem("avaliacoes", JSON.stringify(iniciais));
      setAvaliacoes(iniciais);
    } else {
      setAvaliacoes(dados);
    }
  }, []);

  function nomeDoPonto(id: string) {
    return pontos.find((p) => p.id === id)?.nome ?? "Ponto removido";
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Avaliações</h1>

      {avaliacoes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Nenhuma avaliação ainda.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {avaliacoes.map((a) => (
            <li
              key={a.id}
              className="border border-gray-200 rounded-md p-4 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{a.motorista}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {nomeDoPonto(a.pontoId)}
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
