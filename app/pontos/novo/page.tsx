"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { api } from "@/lib/api";

export default function NovoPontoPage() {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    const data = new FormData(e.currentTarget);

    const novoPonto = {
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

    try {
      await api("/api/pontos", { metodo: "POST", corpo: novoPonto });
      router.push("/pontos");
    } catch (e) {
      setErro((e as Error).message);
      setSalvando(false);
    }
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

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium mt-2 disabled:opacity-60"
        >
          {salvando ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
