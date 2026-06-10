import { NextResponse } from "next/server";
import { usuarioDoToken } from "@/lib/auth";

export async function GET(request: Request) {
  const usuario = usuarioDoToken(request);
  if (!usuario) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }
  return NextResponse.json({
    id: usuario.id,
    usuario: usuario.usuario,
    tipo: usuario.tipo,
    precisa_trocar_senha: usuario.precisa_trocar_senha === 1,
  });
}
