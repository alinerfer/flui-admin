import Database from "better-sqlite3";
import path from "node:path";

const dbPath = path.join(process.cwd(), "data", "flui.sqlite");

const globalForDb = globalThis as unknown as { db?: Database.Database };

export const db = globalForDb.db ?? new Database(dbPath);
if (!globalForDb.db) {
  globalForDb.db = db;
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  iniciarBanco(db);
}

function iniciarBanco(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT NOT NULL UNIQUE,
      senha_hash TEXT,
      precisa_trocar_senha INTEGER NOT NULL DEFAULT 1
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
      longitude REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS avaliacoes (
      id TEXT PRIMARY KEY,
      ponto_id TEXT NOT NULL REFERENCES pontos(id) ON DELETE CASCADE,
      motorista TEXT NOT NULL,
      nota INTEGER NOT NULL,
      comentario TEXT NOT NULL
    );
  `);

  const temUsuario = db
    .prepare("SELECT COUNT(*) as total FROM usuarios")
    .get() as { total: number };
  if (temUsuario.total === 0) {
    db.prepare(
      "INSERT INTO usuarios (usuario, senha_hash, precisa_trocar_senha) VALUES (?, NULL, 1)"
    ).run("admin");
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
