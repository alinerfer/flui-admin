"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

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

export default function EditarPontoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const pontos: Ponto[] = JSON.parse(localStorage.getItem("pontos") || "[]");
    const encontrado = pontos.find((p) => p.id === params.id);
    setPonto(encontrado ?? null);
    setCarregando(false);
  }, [params.id]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ponto) return;
    const data = new FormData(e.currentTarget);

    const atualizado: Ponto = {
      id: ponto.id,
      nome: String(data.get("nome")),
      endereco: String(data.get("endereco")),
      cidade: String(data.get("cidade")),
      uf: String(data.get("uf")),
      conector: String(data.get("conector")),
      potencia: Number(data.get("potencia")),
      preco: Number(data.get("preco")),
      latitude: Number(data.get("latitude")),
      longitude: Number(data.get("longitude")),
    };

    const pontos: Ponto[] = JSON.parse(localStorage.getItem("pontos") || "[]");
    const novos = pontos.map((p) => (p.id === ponto.id ? atualizado : p));
    localStorage.setItem("pontos", JSON.stringify(novos));

    router.push("/pontos");
  }

  if (carregando) {
    return (
      <div className="p-8">
        <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
      </div>
    );
  }

  if (!ponto) {
    return (
      <div className="p-8">
        <Link href="/pontos" className="text-sm text-emerald-700 hover:underline">
          ← Voltar
        </Link>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Ponto não encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link href="/pontos" className="text-sm text-emerald-700 hover:underline">
        ← Voltar
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Editar ponto de recarga</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Nome</span>
          <input
            name="nome"
            type="text"
            required
            defaultValue={ponto.nome}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Endereço</span>
          <input
            name="endereco"
            type="text"
            required
            defaultValue={ponto.endereco}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Cidade</span>
          <input
            name="cidade"
            type="text"
            required
            defaultValue={ponto.cidade}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">UF</span>
          <input
            name="uf"
            type="text"
            maxLength={2}
            required
            defaultValue={ponto.uf}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Conector</span>
          <select
            name="conector"
            defaultValue={ponto.conector}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="Type 2">Type 2</option>
            <option value="CCS">CCS</option>
            <option value="CHAdeMO">CHAdeMO</option>
            <option value="Tesla">Tesla</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Potência (kW)</span>
          <input
            name="potencia"
            type="number"
            step="0.1"
            required
            defaultValue={ponto.potencia}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Preço por kWh (R$)</span>
          <input
            name="preco"
            type="number"
            step="0.01"
            required
            defaultValue={ponto.preco}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Latitude</span>
          <input
            name="latitude"
            type="number"
            step="any"
            required
            defaultValue={ponto.latitude}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Longitude</span>
          <input
            name="longitude"
            type="number"
            step="any"
            required
            defaultValue={ponto.longitude}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium mt-2"
        >
          Salvar alterações
        </button>
      </form>
    </div>
  );
}
