"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api, removerToken } from "@/lib/api";

const abas = [
  { href: "/pontos", label: "Pontos de recarga" },
  { href: "/avaliacoes", label: "Avaliações" },
];

const rotasSemHeader = ["/login", "/trocar-senha"];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  if (rotasSemHeader.some((rota) => pathname.startsWith(rota))) {
    return null;
  }

  async function sair() {
    try {
      await api("/api/logout", { metodo: "POST" });
    } catch {}
    removerToken();
    router.push("/login");
  }

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold">
          Flui Admin
        </Link>
        <button
          onClick={sair}
          className="text-sm text-gray-600 hover:underline dark:text-gray-400"
        >
          Sair
        </button>
      </div>
      <nav className="px-4 flex gap-1">
        {abas.map((aba) => {
          const ativa = pathname.startsWith(aba.href);
          return (
            <Link
              key={aba.href}
              href={aba.href}
              className={`-mb-px px-4 py-3 text-sm font-medium border-b-2 ${
                ativa
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              {aba.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
