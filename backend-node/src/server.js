require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const firRoutes = require('./routes/firs');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch (err) {
    res.status(500).json({ ok: false, db: 'error', message: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api', complaintRoutes);
app.use('/api', firRoutes);

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const port = Number(process.env.RBAC_PORT || 5000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`RBAC FIR backend running on http://localhost:${port}`);
});
