import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { db } from "@/lib/db";
import { usuarioDoToken } from "@/lib/auth";

type CorpoPonto = {
  nome?: unknown;
  endereco?: unknown;
  cidade?: unknown;
  uf?: unknown;
  conector?: unknown;
  potencia?: unknown;
  preco?: unknown;
  latitude?: unknown;
  longitude?: unknown;
};

function validar(corpo: CorpoPonto): string | null {
  if (typeof corpo.nome !== "string" || !corpo.nome.trim()) return "Nome obrigatório";
  if (typeof corpo.endereco !== "string" || !corpo.endereco.trim()) return "Endereço obrigatório";
  if (typeof corpo.cidade !== "string" || !corpo.cidade.trim()) return "Cidade obrigatória";
  if (typeof corpo.uf !== "string" || corpo.uf.length !== 2) return "UF inválida";
  if (typeof corpo.conector !== "string" || !corpo.conector) return "Conector obrigatório";
  if (typeof corpo.potencia !== "number" || Number.isNaN(corpo.potencia)) return "Potência inválida";
  if (typeof corpo.preco !== "number" || Number.isNaN(corpo.preco)) return "Preço inválido";
  if (typeof corpo.latitude !== "number" || Number.isNaN(corpo.latitude)) return "Latitude inválida";
  if (typeof corpo.longitude !== "number" || Number.isNaN(corpo.longitude)) return "Longitude inválida";
  return null;
}

export async function GET(request: Request) {
  const usuario = usuarioDoToken(request);
  if (!usuario) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }
  const pontos = db.prepare("SELECT * FROM pontos ORDER BY nome").all();
  return NextResponse.json(pontos);
}

export async function POST(request: Request) {
  const usuario = usuarioDoToken(request);
  if (!usuario) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const corpo = (await request.json().catch(() => null)) as CorpoPonto | null;
  if (!corpo) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  }

  const mensagem = validar(corpo);
  if (mensagem) {
    return NextResponse.json({ erro: mensagem }, { status: 400 });
  }

  const id = crypto.randomUUID();
  db.prepare(
    "INSERT INTO pontos (id, nome, endereco, cidade, uf, conector, potencia, preco, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    id,
    corpo.nome as string,
    corpo.endereco as string,
    corpo.cidade as string,
    corpo.uf as string,
    corpo.conector as string,
    corpo.potencia as number,
    corpo.preco as number,
    corpo.latitude as number,
    corpo.longitude as number
  );

  const novo = db.prepare("SELECT * FROM pontos WHERE id = ?").get(id);
  return NextResponse.json(novo, { status: 201 });
}
