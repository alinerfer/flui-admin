import Database from "better-sqlite3";
import crypto from "node:crypto";
import path from "node:path";

const dbPath = path.join(process.cwd(), "data", "flui.sqlite");
const ehBuild = process.env.NEXT_PHASE === "phase-production-build";

const globalForDb = globalThis as unknown as { db?: Database.Database };

export const db = globalForDb.db ?? new Database(dbPath);
if (!globalForDb.db) {
  globalForDb.db = db;
  if (!ehBuild) {
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    db.pragma("busy_timeout = 5000");
    iniciarBanco(db);
  }
}

function hash(senha: string) {
  return crypto.createHash("sha256").update(senha).digest("hex");
}

function iniciarBanco(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT NOT NULL UNIQUE,
      senha_hash TEXT,
      precisa_trocar_senha INTEGER NOT NULL DEFAULT 1,
      tipo TEXT NOT NULL DEFAULT 'admin',
      nome_completo TEXT,
      email TEXT,
      veiculo_modelo TEXT,
      veiculo_placa TEXT
    );

    CREATE TABLE IF NOT EXISTS tokens (
      token TEXT PRIMARY KEY,
      usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pontos (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      endereco TEXT NOT NULL,
      cidade TEXT NOT NULL,
      uf TEXT NOT NULL,
      conector TEXT NOT NULL,
      potencia REAL NOT NULL,
      preco REAL NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      disponivel INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS avaliacoes (
      id TEXT PRIMARY KEY,
      ponto_id TEXT NOT NULL REFERENCES pontos(id) ON DELETE CASCADE,
      motorista TEXT NOT NULL,
      nota INTEGER NOT NULL,
      comentario TEXT NOT NULL
    );
  `);

  const colunasPontos = db
    .prepare("PRAGMA table_info(pontos)")
    .all() as Array<{ name: string }>;
  if (!colunasPontos.some((c) => c.name === "disponivel")) {
    db.exec(
      "ALTER TABLE pontos ADD COLUMN disponivel INTEGER NOT NULL DEFAULT 1"
    );
  }

  const colunas = db
    .prepare("PRAGMA table_info(usuarios)")
    .all() as Array<{ name: string }>;
  if (!colunas.some((c) => c.name === "tipo")) {
    db.exec(
      "ALTER TABLE usuarios ADD COLUMN tipo TEXT NOT NULL DEFAULT 'admin'"
    );
  }
  if (!colunas.some((c) => c.name === "nome_completo")) {
    db.exec("ALTER TABLE usuarios ADD COLUMN nome_completo TEXT");
  }
  if (!colunas.some((c) => c.name === "email")) {
    db.exec("ALTER TABLE usuarios ADD COLUMN email TEXT");
  }
  if (!colunas.some((c) => c.name === "veiculo_modelo")) {
    db.exec("ALTER TABLE usuarios ADD COLUMN veiculo_modelo TEXT");
  }
  if (!colunas.some((c) => c.name === "veiculo_placa")) {
    db.exec("ALTER TABLE usuarios ADD COLUMN veiculo_placa TEXT");
  }

  const temAdmin = db
    .prepare("SELECT COUNT(*) as total FROM usuarios WHERE tipo = 'admin'")
    .get() as { total: number };
  if (temAdmin.total === 0) {
    db.prepare(
      "INSERT INTO usuarios (usuario, senha_hash, precisa_trocar_senha, tipo) VALUES (?, NULL, 1, 'admin')"
    ).run("admin");
  }

  const temMotorista = db
    .prepare("SELECT COUNT(*) as total FROM usuarios WHERE tipo = 'motorista'")
    .get() as { total: number };
  if (temMotorista.total === 0) {
    const inserir = db.prepare(
      "INSERT INTO usuarios (usuario, senha_hash, precisa_trocar_senha, tipo, nome_completo, email, veiculo_modelo, veiculo_placa) VALUES (?, ?, 0, 'motorista', ?, ?, ?, ?)"
    );
    inserir.run("ana", hash("ana123"), "Ana Souza", "ana@flui.test", "Nissan Leaf", "ABC1A23");
    inserir.run("carlos", hash("carlos123"), "Carlos Lima", "carlos@flui.test", "BYD Dolphin", "DEF2B45");
    inserir.run("mariana", hash("mariana123"), "Mariana Reis", "mariana@flui.test", "Renault Kwid E-Tech", "GHI3C67");
  }

  const temPonto = db
    .prepare("SELECT COUNT(*) as total FROM pontos")
    .get() as { total: number };
  if (temPonto.total === 0) {
    const inserir = db.prepare(
      "INSERT INTO pontos (id, nome, endereco, cidade, uf, conector, potencia, preco, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    inserir.run(
      "paulista",
      "Posto Av. Paulista",
      "Av. Paulista, 1000",
      "São Paulo",
      "SP",
      "CCS",
      150,
      1.85,
      -23.5613,
      -46.6565
    );
    inserir.run(
      "iguatemi",
      "Shopping Iguatemi",
      "Av. Brigadeiro Faria Lima, 2232",
      "São Paulo",
      "SP",
      "Type 2",
      22,
      1.45,
      -23.5762,
      -46.6896
    );
  }

  const temAvaliacao = db
    .prepare("SELECT COUNT(*) as total FROM avaliacoes")
    .get() as { total: number };
  if (temAvaliacao.total === 0) {
    const inserir = db.prepare(
      "INSERT INTO avaliacoes (id, ponto_id, motorista, nota, comentario) VALUES (?, ?, ?, ?, ?)"
    );
    inserir.run("1", "paulista", "Ana Souza", 5, "Carregamento rápido e local seguro.");
    inserir.run(
      "2",
      "paulista",
      "Carlos Lima",
      4,
      "Bom, mas estava com fila no horário de pico."
    );
    inserir.run(
      "3",
      "iguatemi",
      "Mariana Reis",
      3,
      "Funcionou, porém um pouco lento para o meu carro."
    );
  }
}
