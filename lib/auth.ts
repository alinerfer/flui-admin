import crypto from "node:crypto";
import { db } from "./db";

export type Usuario = {
  id: number;
  usuario: string;
  tipo: "admin" | "motorista";
  precisa_trocar_senha: number;
};

export function hashSenha(senha: string): string {
  return crypto.createHash("sha256").update(senha).digest("hex");
}

export function gerarToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function usuarioDoToken(request: Request): Usuario | null {
  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7).trim();
  if (!token) return null;

  const linha = db
    .prepare(
      `SELECT u.id, u.usuario, u.tipo, u.precisa_trocar_senha
       FROM tokens t
       JOIN usuarios u ON u.id = t.usuario_id
       WHERE t.token = ?`
    )
    .get(token) as Usuario | undefined;

  return linha ?? null;
}
