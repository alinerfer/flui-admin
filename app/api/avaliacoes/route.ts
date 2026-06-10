import { NextResponse } from "next/server";
import crypto from "node:crypto";
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

type CorpoAvaliacao = {
  ponto_id?: unknown;
  nota?: unknown;
  comentario?: unknown;
};

export async function POST(request: Request) {
  const usuario = usuarioDoToken(request);
  if (!usuario) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const corpo = (await request.json().catch(() => null)) as CorpoAvaliacao | null;
  if (!corpo) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  }

  if (typeof corpo.ponto_id !== "string" || !corpo.ponto_id) {
    return NextResponse.json({ erro: "ponto_id obrigatório" }, { status: 400 });
  }
  if (
    typeof corpo.nota !== "number" ||
    !Number.isInteger(corpo.nota) ||
    corpo.nota < 1 ||
    corpo.nota > 5
  ) {
    return NextResponse.json({ erro: "Nota deve ser um inteiro entre 1 e 5" }, { status: 400 });
  }
  if (typeof corpo.comentario !== "string" || !corpo.comentario.trim()) {
    return NextResponse.json({ erro: "Comentário obrigatório" }, { status: 400 });
  }

  const ponto = db
    .prepare("SELECT id FROM pontos WHERE id = ?")
    .get(corpo.ponto_id);
  if (!ponto) {
    return NextResponse.json({ erro: "Ponto não encontrado" }, { status: 404 });
  }

  const id = crypto.randomUUID();
  db.prepare(
    "INSERT INTO avaliacoes (id, ponto_id, motorista, nota, comentario) VALUES (?, ?, ?, ?, ?)"
  ).run(id, corpo.ponto_id, usuario.usuario, corpo.nota, corpo.comentario.trim());

  const nova = db
    .prepare(
      `SELECT a.id, a.ponto_id, a.motorista, a.nota, a.comentario, p.nome AS ponto_nome
       FROM avaliacoes a
       LEFT JOIN pontos p ON p.id = a.ponto_id
       WHERE a.id = ?`
    )
    .get(id);

  return NextResponse.json(nova, { status: 201 });
}
