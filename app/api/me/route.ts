import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usuarioDoToken } from "@/lib/auth";

type LinhaPerfil = {
  id: number;
  usuario: string;
  tipo: "admin" | "motorista";
  precisa_trocar_senha: number;
  nome_completo: string | null;
  email: string | null;
  veiculo_modelo: string | null;
  veiculo_placa: string | null;
};

function buscarPerfil(id: number) {
  return db
    .prepare(
      `SELECT id, usuario, tipo, precisa_trocar_senha, nome_completo, email, veiculo_modelo, veiculo_placa
       FROM usuarios WHERE id = ?`
    )
    .get(id) as LinhaPerfil | undefined;
}

function formatar(linha: LinhaPerfil) {
  return {
    id: linha.id,
    usuario: linha.usuario,
    tipo: linha.tipo,
    precisa_trocar_senha: linha.precisa_trocar_senha === 1,
    nome_completo: linha.nome_completo,
    email: linha.email,
    veiculo_modelo: linha.veiculo_modelo,
    veiculo_placa: linha.veiculo_placa,
  };
}

export async function GET(request: Request) {
  const usuario = usuarioDoToken(request);
  if (!usuario) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }
  const perfil = buscarPerfil(usuario.id);
  if (!perfil) {
    return NextResponse.json({ erro: "Usuário não encontrado" }, { status: 404 });
  }
  return NextResponse.json(formatar(perfil));
}

type CorpoPerfil = {
  nome_completo?: unknown;
  email?: unknown;
  veiculo_modelo?: unknown;
  veiculo_placa?: unknown;
};

const regexEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function PUT(request: Request) {
  const usuario = usuarioDoToken(request);
  if (!usuario) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const corpo = (await request.json().catch(() => null)) as CorpoPerfil | null;
  if (!corpo) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  }

  if (
    corpo.email !== undefined &&
    corpo.email !== null &&
    (typeof corpo.email !== "string" || !regexEmail.test(corpo.email))
  ) {
    return NextResponse.json({ erro: "Email inválido" }, { status: 400 });
  }

  const atual = buscarPerfil(usuario.id);
  if (!atual) {
    return NextResponse.json({ erro: "Usuário não encontrado" }, { status: 404 });
  }

  const novo = {
    nome_completo:
      typeof corpo.nome_completo === "string"
        ? corpo.nome_completo.trim() || null
        : atual.nome_completo,
    email:
      typeof corpo.email === "string"
        ? corpo.email.trim() || null
        : atual.email,
    veiculo_modelo:
      typeof corpo.veiculo_modelo === "string"
        ? corpo.veiculo_modelo.trim() || null
        : atual.veiculo_modelo,
    veiculo_placa:
      typeof corpo.veiculo_placa === "string"
        ? corpo.veiculo_placa.trim().toUpperCase() || null
        : atual.veiculo_placa,
  };

  db.prepare(
    "UPDATE usuarios SET nome_completo = ?, email = ?, veiculo_modelo = ?, veiculo_placa = ? WHERE id = ?"
  ).run(novo.nome_completo, novo.email, novo.veiculo_modelo, novo.veiculo_placa, usuario.id);

  const perfil = buscarPerfil(usuario.id);
  return NextResponse.json(formatar(perfil!));
}
