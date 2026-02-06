const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./models/db');
const sowingsRouter = require('./routes/sowings');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database
const db = initDb();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/sowings', sowingsRouter);

app.listen(PORT, () => {
  console.log(`Seedling Tracker API running on port ${PORT}`);
});

module.exports = app;
