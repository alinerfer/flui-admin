const TOKEN_KEY = "token";

type Opcoes = {
  metodo?: "GET" | "POST" | "PUT" | "DELETE";
  corpo?: unknown;
};

export function pegarToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function salvarToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removerToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function api<T = unknown>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (opcoes.corpo !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  const token = pegarToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const resposta = await fetch(caminho, {
    method: opcoes.metodo ?? "GET",
    headers,
    body: opcoes.corpo !== undefined ? JSON.stringify(opcoes.corpo) : undefined,
  });

  if (resposta.status === 401) {
    removerToken();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new Error("Não autenticado");
  }

  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new Error((dados as { erro?: string })?.erro ?? "Erro na requisição");
  }

  return dados as T;
}
