const { getDb } = require('./db');

function generateSowingCode() {
  const db = getDb();
  const last = db.prepare(
    "SELECT sowing_code FROM sowings ORDER BY id DESC LIMIT 1"
  ).get();

  if (!last) return 'S001';

  const num = parseInt(last.sowing_code.slice(1), 10) + 1;
  return `S${String(num).padStart(3, '0')}`;
}

function create({ seed_name, variety, brand, sowing_date, notes }) {
  const db = getDb();
  const sowing_code = generateSowingCode();

  const result = db.prepare(`
    INSERT INTO sowings (sowing_code, seed_name, variety, brand, sowing_date, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(sowing_code, seed_name, variety || null, brand || null, sowing_date, notes || null);

  return getById(result.lastInsertRowid);
}

function getById(id) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM sowings WHERE id = ? AND deleted_at IS NULL
  `).get(id);
}

function getByCode(code) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM sowings WHERE sowing_code = ? AND deleted_at IS NULL
  `).get(code);
}

function list({ status } = {}) {
  const db = getDb();

  if (status) {
    return db.prepare(`
      SELECT * FROM sowings WHERE status = ? AND deleted_at IS NULL ORDER BY created_at DESC
    `).all(status);
  }

  return db.prepare(`
    SELECT * FROM sowings WHERE deleted_at IS NULL ORDER BY created_at DESC
  `).all();
}

function update(id, fields) {
  const db = getDb();
  const allowed = ['seed_name', 'variety', 'brand', 'sowing_date', 'germination_date', 'notes', 'status'];
  const sets = [];
  const values = [];

  for (const key of allowed) {
    if (key in fields) {
      sets.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }

  if (sets.length === 0) return getById(id);

  sets.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE sowings SET ${sets.join(', ')} WHERE id = ? AND deleted_at IS NULL`).run(...values);
  return getById(id);
}

function softDelete(id) {
  const db = getDb();
  db.prepare(`UPDATE sowings SET deleted_at = datetime('now') WHERE id = ?`).run(id);
}

module.exports = { create, getById, getByCode, list, update, softDelete };
