const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDb() {
  const db = getDb();

  // Create migrations tracking table
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Run pending migrations
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  if (fs.existsSync(migrationsDir)) {
    const applied = new Set(
      db.prepare('SELECT name FROM migrations').all().map(r => r.name)
    );

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (!applied.has(file)) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        db.exec(sql);
        db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
        console.log(`Migration applied: ${file}`);
      }
    }
  }

  return db;
}

module.exports = { getDb, initDb };
