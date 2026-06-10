import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gerarToken, hashSenha } from "@/lib/auth";

type CorpoCadastro = {
  usuario?: unknown;
  senha?: unknown;
  nome_completo?: unknown;
  email?: unknown;
  veiculo_modelo?: unknown;
  veiculo_placa?: unknown;
};

const regexEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: Request) {
  const corpo = (await request.json().catch(() => null)) as CorpoCadastro | null;
  if (!corpo) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  }

  if (typeof corpo.usuario !== "string" || corpo.usuario.trim().length < 3) {
    return NextResponse.json(
      { erro: "Usuário precisa ter pelo menos 3 caracteres" },
      { status: 400 }
    );
  }
  if (typeof corpo.senha !== "string" || corpo.senha.length < 4) {
    return NextResponse.json(
      { erro: "Senha precisa ter pelo menos 4 caracteres" },
      { status: 400 }
    );
  }
  if (typeof corpo.nome_completo !== "string" || !corpo.nome_completo.trim()) {
    return NextResponse.json(
      { erro: "Nome completo obrigatório" },
      { status: 400 }
    );
  }
  if (
    corpo.email !== undefined &&
    corpo.email !== null &&
    corpo.email !== "" &&
    (typeof corpo.email !== "string" || !regexEmail.test(corpo.email))
  ) {
    return NextResponse.json({ erro: "Email inválido" }, { status: 400 });
  }

  const usuario = corpo.usuario.trim();
  const jaExiste = db
    .prepare("SELECT id FROM usuarios WHERE usuario = ?")
    .get(usuario);
  if (jaExiste) {
    return NextResponse.json({ erro: "Usuário já existe" }, { status: 409 });
  }

  const nomeCompleto = corpo.nome_completo.trim();
  const email =
    typeof corpo.email === "string" && corpo.email.trim()
      ? corpo.email.trim()
      : null;
  const veiculoModelo =
    typeof corpo.veiculo_modelo === "string" && corpo.veiculo_modelo.trim()
      ? corpo.veiculo_modelo.trim()
      : null;
  const veiculoPlaca =
    typeof corpo.veiculo_placa === "string" && corpo.veiculo_placa.trim()
      ? corpo.veiculo_placa.trim().toUpperCase()
      : null;

  const resultado = db
    .prepare(
      `INSERT INTO usuarios
       (usuario, senha_hash, precisa_trocar_senha, tipo, nome_completo, email, veiculo_modelo, veiculo_placa)
       VALUES (?, ?, 0, 'motorista', ?, ?, ?, ?)`
    )
    .run(
      usuario,
      hashSenha(corpo.senha),
      nomeCompleto,
      email,
      veiculoModelo,
      veiculoPlaca
    );

  const id = Number(resultado.lastInsertRowid);
  const token = gerarToken();
  db.prepare("INSERT INTO tokens (token, usuario_id) VALUES (?, ?)").run(
    token,
    id
  );

  return NextResponse.json(
    {
      token,
      usuario: {
        id,
        usuario,
        tipo: "motorista" as const,
        precisa_trocar_senha: false,
      },
    },
    { status: 201 }
  );
}
