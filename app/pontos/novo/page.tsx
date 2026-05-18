"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function NovoPontoPage() {
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const novoPonto = {
      id: crypto.randomUUID(),
      nome: data.get("nome"),
      endereco: data.get("endereco"),
      cidade: data.get("cidade"),
      uf: data.get("uf"),
      conector: data.get("conector"),
      potencia: Number(data.get("potencia")),
      preco: Number(data.get("preco")),
      latitude: Number(data.get("latitude")),
      longitude: Number(data.get("longitude")),
    };

    const pontos = JSON.parse(localStorage.getItem("pontos") || "[]");
    pontos.push(novoPonto);
    localStorage.setItem("pontos", JSON.stringify(pontos));

    router.push("/pontos");
  }

  return (
    <div className="p-8">
      <Link href="/pontos" className="text-sm text-emerald-700 hover:underline">
        ← Voltar
      </Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Novo ponto de recarga</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Nome</span>
          <input
            name="nome"
            type="text"
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Endereço</span>
          <input
            name="endereco"
            type="text"
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Cidade</span>
          <input
            name="cidade"
            type="text"
            required
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
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Conector</span>
          <select
            name="conector"
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
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium mt-2"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
