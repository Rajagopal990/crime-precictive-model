const express = require('express');
const pool = require('../config/db');
const { authRequired, requireRole } = require('../middleware/auth');
const { hotspotSummary, predictCrimeRisk } = require('../services/analyticsService');

const router = express.Router();
const STATUS_VALUES = ['pending', 'under investigation', 'closed'];

// Police verifies complaint and creates FIR
router.post('/fir', authRequired, requireRole('police_officer', 'admin'), async (req, res) => {
  const { complaint_id, officer_id, crime_type, status, date, location } = req.body;

  if (!complaint_id || !crime_type || !location) {
    return res.status(400).json({ message: 'complaint_id, crime_type and location are required' });
  }

  const effectiveOfficerId = req.user.role === 'police_officer' ? req.user.id : officer_id;
  if (!effectiveOfficerId) {
    return res.status(400).json({ message: 'officer_id is required for admin-created FIR' });
  }

  const [complaintRows] = await pool.query('SELECT * FROM complaints WHERE id = ?', [complaint_id]);
  const complaint = complaintRows[0];
  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  if (req.user.role === 'police_officer' && complaint.assigned_officer_id !== req.user.id) {
    return res.status(403).json({ message: 'Complaint is not assigned to you' });
  }

  const firStatus = STATUS_VALUES.includes(String(status || '').toLowerCase())
    ? String(status).toLowerCase()
    : 'pending';

  const [result] = await pool.query(
    `INSERT INTO firs (complaint_id, officer_id, crime_type, status, date, location)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [complaint_id, effectiveOfficerId, crime_type, firStatus, date || new Date(), location],
  );

  await pool.query('UPDATE complaints SET status = ? WHERE id = ?', ['converted_to_fir', complaint_id]);

  await pool.query('INSERT INTO crime_data (location, type, date) VALUES (?, ?, ?)', [location, crime_type, date || new Date()]);

  return res.status(201).json({ id: result.insertId, status: firStatus });
});

// Admin gets all, officer gets assigned to them
router.get('/firs', authRequired, async (req, res) => {
  if (req.user.role === 'admin') {
    const [rows] = await pool.query(
      `SELECT f.*, c.description AS complaint_description, u.name AS officer_name
       FROM firs f
       LEFT JOIN complaints c ON c.id = f.complaint_id
       LEFT JOIN users u ON u.id = f.officer_id
       ORDER BY f.id DESC`,
    );
    return res.json(rows);
  }

  if (req.user.role === 'police_officer') {
    const [rows] = await pool.query(
      `SELECT f.*, c.description AS complaint_description
       FROM firs f
       LEFT JOIN complaints c ON c.id = f.complaint_id
       WHERE f.officer_id = ?
       ORDER BY f.id DESC`,
      [req.user.id],
    );
    return res.json(rows);
  }

  return res.status(403).json({ message: 'Public users cannot view FIR list' });
});

router.put('/fir/:id/status', authRequired, requireRole('admin', 'police_officer'), async (req, res) => {
  const firId = Number(req.params.id);
  const nextStatus = String(req.body.status || '').toLowerCase();

  if (!STATUS_VALUES.includes(nextStatus)) {
    return res.status(400).json({ message: 'status must be Pending, Under Investigation, or Closed' });
  }

  const [rows] = await pool.query('SELECT * FROM firs WHERE id = ?', [firId]);
  const fir = rows[0];
  if (!fir) {
    return res.status(404).json({ message: 'FIR not found' });
  }

  if (req.user.role === 'police_officer' && fir.officer_id !== req.user.id) {
    return res.status(403).json({ message: 'You can update only your assigned FIRs' });
  }

  await pool.query('UPDATE firs SET status = ? WHERE id = ?', [nextStatus, firId]);
  return res.json({ message: 'FIR status updated' });
});

router.get('/analytics/hotspots', authRequired, requireRole('admin', 'police_officer', 'public_user'), async (_req, res) => {
  const [rows] = await pool.query('SELECT location, type, date FROM crime_data ORDER BY date DESC');
  const hotspots = hotspotSummary(rows.map((r) => ({ location: r.location, status: r.type })));
  return res.json({ hotspots });
});

router.get('/analytics/predictions', authRequired, requireRole('admin', 'police_officer'), async (_req, res) => {
  const [rows] = await pool.query('SELECT id, crime_type, status, location FROM firs ORDER BY id DESC LIMIT 100');
  const predictions = rows.map((row) => ({ ...row, predicted_risk: predictCrimeRisk(row) }));
  return res.json({ predictions });
});

router.get('/alerts/safety', authRequired, requireRole('public_user', 'admin', 'police_officer'), async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT location, COUNT(*) AS incidents
     FROM crime_data
     GROUP BY location
     ORDER BY incidents DESC
     LIMIT 10`,
  );
  const alerts = rows.map((row) => ({
    location: row.location,
    incidents: row.incidents,
    level: row.incidents >= 10 ? 'high' : row.incidents >= 5 ? 'medium' : 'low',
  }));
  return res.json({ alerts });
});

module.exports = router;
