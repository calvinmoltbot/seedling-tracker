import { createClient } from '@libsql/client'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function migrate() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  const applied = new Set(
    (await db.execute('SELECT name FROM migrations')).rows.map(r => r.name)
  )

  const migrationsDir = join(__dirname, '..', 'migrations')
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  skip: ${file}`)
      continue
    }

    const sql = readFileSync(join(migrationsDir, file), 'utf-8')
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const stmt of statements) {
      await db.execute(stmt)
    }

    await db.execute({
      sql: 'INSERT INTO migrations (name) VALUES (?)',
      args: [file],
    })
    console.log(`  applied: ${file}`)
  }

  console.log('Migrations complete.')
}

migrate().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
