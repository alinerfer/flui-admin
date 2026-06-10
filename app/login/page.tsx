"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { api, salvarToken } from "@/lib/api";

type RespostaLogin = {
  token: string;
  usuario: {
    id: number;
    usuario: string;
    tipo: "admin" | "motorista";
    precisa_trocar_senha: boolean;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const [erro, setErro] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    const data = new FormData(e.currentTarget);
    const usuario = String(data.get("usuario"));
    const senha = String(data.get("senha"));

    try {
      const resposta = await api<RespostaLogin>("/api/login", {
        metodo: "POST",
        corpo: { usuario, senha },
      });
      salvarToken(resposta.token);
      if (resposta.usuario.precisa_trocar_senha) {
        router.push("/trocar-senha");
      } else {
        router.push("/pontos");
      }
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-6">Entrar</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Usuário</span>
          <input
            name="usuario"
            type="text"
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Senha</span>
          <input
            name="senha"
            type="password"
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>
        {erro && <p className="text-sm text-red-600">{erro}</p>}
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium mt-2"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
