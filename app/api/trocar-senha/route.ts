import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashSenha, usuarioDoToken } from "@/lib/auth";

export async function POST(request: Request) {
  const usuario = usuarioDoToken(request);
  if (!usuario) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const corpo = await request.json().catch(() => null);
  if (!corpo || typeof corpo.senha_nova !== "string" || corpo.senha_nova.length === 0) {
    return NextResponse.json({ erro: "Senha inválida" }, { status: 400 });
  }

  db.prepare(
    "UPDATE usuarios SET senha_hash = ?, precisa_trocar_senha = 0 WHERE id = ?"
  ).run(hashSenha(corpo.senha_nova), usuario.id);

  return NextResponse.json({ ok: true });
}
