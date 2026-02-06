const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./models/db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database
const db = initDb();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Seedling Tracker API running on port ${PORT}`);
});

module.exports = app;
