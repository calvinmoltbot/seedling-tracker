const { getDb } = require('./db');

function create({ sowing_id, photo_type, filename, notes }) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO photos (sowing_id, photo_type, filename, notes)
    VALUES (?, ?, ?, ?)
  `).run(sowing_id, photo_type, filename, notes || null);

  return getById(result.lastInsertRowid);
}

function getById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM photos WHERE id = ?').get(id);
}

function listBySowing(sowing_id) {
  const db = getDb();
  return db.prepare(
    'SELECT * FROM photos WHERE sowing_id = ? ORDER BY taken_at DESC'
  ).all(sowing_id);
}

function remove(id) {
  const db = getDb();
  const photo = getById(id);
  if (photo) {
    db.prepare('DELETE FROM photos WHERE id = ?').run(id);
  }
  return photo;
}

module.exports = { create, getById, listBySowing, remove };
