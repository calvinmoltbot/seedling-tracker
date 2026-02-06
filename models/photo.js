import { getDb } from './db.js'

export async function create({ sowing_id, photo_type, filename, notes }) {
  const db = getDb()
  const result = await db.execute({
    sql: `INSERT INTO photos (sowing_id, photo_type, filename, notes)
          VALUES (?, ?, ?, ?)`,
    args: [sowing_id, photo_type, filename, notes || null],
  })

  return getById(Number(result.lastInsertRowid))
}

export async function getById(id) {
  const db = getDb()
  const result = await db.execute({
    sql: 'SELECT * FROM photos WHERE id = ?',
    args: [id],
  })
  return result.rows[0] || null
}

export async function listBySowing(sowing_id) {
  const db = getDb()
  const result = await db.execute({
    sql: 'SELECT * FROM photos WHERE sowing_id = ? ORDER BY taken_at DESC',
    args: [sowing_id],
  })
  return result.rows
}

export async function remove(id) {
  const db = getDb()
  const photo = await getById(id)
  if (photo) {
    await db.execute({ sql: 'DELETE FROM photos WHERE id = ?', args: [id] })
  }
  return photo
}
