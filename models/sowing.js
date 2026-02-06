import { getDb } from './db.js'

async function generateSowingCode() {
  const db = getDb()
  const result = await db.execute(
    'SELECT sowing_code FROM sowings ORDER BY id DESC LIMIT 1'
  )

  if (result.rows.length === 0) return 'S001'

  const num = parseInt(result.rows[0].sowing_code.slice(1), 10) + 1
  return `S${String(num).padStart(3, '0')}`
}

export async function create({ seed_name, variety, brand, sowing_date, notes }) {
  const db = getDb()
  const sowing_code = await generateSowingCode()

  const result = await db.execute({
    sql: `INSERT INTO sowings (sowing_code, seed_name, variety, brand, sowing_date, notes)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [sowing_code, seed_name, variety || null, brand || null, sowing_date, notes || null],
  })

  return getById(Number(result.lastInsertRowid))
}

export async function getById(id) {
  const db = getDb()
  const result = await db.execute({
    sql: 'SELECT * FROM sowings WHERE id = ? AND deleted_at IS NULL',
    args: [id],
  })
  return result.rows[0] || null
}

export async function getByCode(code) {
  const db = getDb()
  const result = await db.execute({
    sql: 'SELECT * FROM sowings WHERE sowing_code = ? AND deleted_at IS NULL',
    args: [code],
  })
  return result.rows[0] || null
}

export async function list({ status } = {}) {
  const db = getDb()

  if (status) {
    const result = await db.execute({
      sql: `SELECT s.*,
              (SELECT filename FROM photos WHERE sowing_id = s.id AND photo_type = 'packet' LIMIT 1) as thumbnail
            FROM sowings s
            WHERE s.status = ? AND s.deleted_at IS NULL
            ORDER BY s.created_at DESC`,
      args: [status],
    })
    return result.rows
  }

  const result = await db.execute(
    `SELECT s.*,
       (SELECT filename FROM photos WHERE sowing_id = s.id AND photo_type = 'packet' LIMIT 1) as thumbnail
     FROM sowings s
     WHERE s.deleted_at IS NULL
     ORDER BY s.created_at DESC`
  )
  return result.rows
}

export async function update(id, fields) {
  const db = getDb()
  const allowed = ['seed_name', 'variety', 'brand', 'sowing_date', 'germination_date', 'notes', 'status']
  const sets = []
  const values = []

  for (const key of allowed) {
    if (key in fields) {
      sets.push(`${key} = ?`)
      values.push(fields[key])
    }
  }

  if (sets.length === 0) return getById(id)

  sets.push("updated_at = datetime('now')")
  values.push(id)

  await db.execute({
    sql: `UPDATE sowings SET ${sets.join(', ')} WHERE id = ? AND deleted_at IS NULL`,
    args: values,
  })

  return getById(id)
}

export async function softDelete(id) {
  const db = getDb()
  await db.execute({
    sql: "UPDATE sowings SET deleted_at = datetime('now') WHERE id = ?",
    args: [id],
  })
}

export async function stats() {
  const db = getDb()
  const result = await db.execute(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status IN ('planted','germinated','potted') THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN germination_date IS NOT NULL THEN 1 ELSE 0 END) as germinated_count,
      SUM(CASE WHEN status = 'planted' THEN 1 ELSE 0 END) as planted_count,
      SUM(CASE WHEN status = 'potted' THEN 1 ELSE 0 END) as potted_count
    FROM sowings WHERE deleted_at IS NULL
  `)
  const row = result.rows[0]
  return {
    total: Number(row.total),
    active: Number(row.active),
    germinatedCount: Number(row.germinated_count),
    plantedCount: Number(row.planted_count),
    pottedCount: Number(row.potted_count),
    germinationRate: row.total > 0 ? Math.round((Number(row.germinated_count) / Number(row.total)) * 100) : 0,
  }
}
