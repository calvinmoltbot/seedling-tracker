CREATE TABLE sowings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sowing_code TEXT UNIQUE NOT NULL,
  seed_name TEXT NOT NULL,
  variety TEXT,
  brand TEXT,
  sowing_date TEXT NOT NULL,
  germination_date TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'planted' CHECK(status IN ('planted', 'germinated', 'potted', 'shared', 'discarded')),
  deleted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sowing_id INTEGER NOT NULL REFERENCES sowings(id) ON DELETE CASCADE,
  photo_type TEXT NOT NULL CHECK(photo_type IN ('packet', 'tray', 'progress')),
  filename TEXT NOT NULL,
  taken_at TEXT NOT NULL DEFAULT (datetime('now')),
  notes TEXT
);

CREATE INDEX idx_sowings_code ON sowings(sowing_code);
CREATE INDEX idx_sowings_status ON sowings(status);
CREATE INDEX idx_photos_sowing ON photos(sowing_id);
