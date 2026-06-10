import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usuarioDoToken } from "@/lib/auth";

export async function GET(request: Request) {
  const usuario = usuarioDoToken(request);
  if (!usuario) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const url = new URL(request.url);
  const pontoId = url.searchParams.get("ponto_id");

  const base = `
    SELECT a.id, a.ponto_id, a.motorista, a.nota, a.comentario, p.nome AS ponto_nome
    FROM avaliacoes a
    LEFT JOIN pontos p ON p.id = a.ponto_id
  `;

  const avaliacoes = pontoId
    ? db.prepare(base + " WHERE a.ponto_id = ? ORDER BY a.id").all(pontoId)
    : db.prepare(base + " ORDER BY a.id").all();

  return NextResponse.json(avaliacoes);
}
