"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

async function gerarHash(senha: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(senha);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  const arr = Array.from(new Uint8Array(buffer));
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function TrocarSenhaPage() {
  const router = useRouter();
  const [erro, setErro] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const novaSenha = String(data.get("novaSenha"));
    const confirmacao = String(data.get("confirmacao"));

    if (novaSenha !== confirmacao) {
      setErro("As senhas não conferem");
      return;
    }

    const hash = await gerarHash(novaSenha);
    localStorage.setItem("senha_hash", hash);
    router.push("/pontos");
  }

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-2">Trocar senha</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        No primeiro acesso é necessário definir uma nova senha.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Nova senha</span>
          <input
            name="novaSenha"
            type="password"
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Confirmar nova senha</span>
          <input
            name="confirmacao"
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
          Salvar nova senha
        </button>
      </form>
    </div>
  );
}
