import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7).trim();
    if (token) {
      db.prepare("DELETE FROM tokens WHERE token = ?").run(token);
    }
  }
  return NextResponse.json({ ok: true });
}
