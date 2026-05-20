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

export default function LoginPage() {
  const router = useRouter();
  const [erro, setErro] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const usuario = String(data.get("usuario"));
    const senha = String(data.get("senha"));

    if (usuario !== "admin") {
      setErro("Usuário ou senha inválidos");
      return;
    }

    const senhaHash = localStorage.getItem("senha_hash");

    if (senhaHash) {
      const hash = await gerarHash(senha);
      if (hash !== senhaHash) {
        setErro("Usuário ou senha inválidos");
        return;
      }
      localStorage.setItem("logado", "1");
      router.push("/pontos");
    } else {
      if (senha !== "admin") {
        setErro("Usuário ou senha inválidos");
        return;
      }
      localStorage.setItem("logado", "1");
      router.push("/trocar-senha");
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
