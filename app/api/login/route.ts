import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gerarToken, hashSenha } from "@/lib/auth";

type LinhaUsuario = {
  id: number;
  usuario: string;
  tipo: "admin" | "motorista";
  senha_hash: string | null;
  precisa_trocar_senha: number;
};

export async function POST(request: Request) {
  const corpo = await request.json().catch(() => null);
  if (!corpo || typeof corpo.usuario !== "string" || typeof corpo.senha !== "string") {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  }

  const linha = db
    .prepare(
      "SELECT id, usuario, tipo, senha_hash, precisa_trocar_senha FROM usuarios WHERE usuario = ?"
    )
    .get(corpo.usuario) as LinhaUsuario | undefined;

  if (!linha) {
    return NextResponse.json(
      { erro: "Usuário ou senha inválidos" },
      { status: 401 }
    );
  }

  if (linha.senha_hash === null) {
    if (corpo.senha !== "admin") {
      return NextResponse.json(
        { erro: "Usuário ou senha inválidos" },
        { status: 401 }
      );
    }
  } else if (hashSenha(corpo.senha) !== linha.senha_hash) {
    return NextResponse.json(
      { erro: "Usuário ou senha inválidos" },
      { status: 401 }
    );
  }

  const token = gerarToken();
  db.prepare("INSERT INTO tokens (token, usuario_id) VALUES (?, ?)").run(
    token,
    linha.id
  );

  return NextResponse.json({
    token,
    usuario: {
      id: linha.id,
      usuario: linha.usuario,
      tipo: linha.tipo,
      precisa_trocar_senha: linha.precisa_trocar_senha === 1,
    },
  });
}
