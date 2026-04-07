const express = require('express');
const pool = require('../config/db');
const { authRequired, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public user submits complaint
router.post('/complaint', authRequired, requireRole('public_user'), async (req, res) => {
  const { description, location } = req.body;
  if (!description || !location) {
    return res.status(400).json({ message: 'description and location are required' });
  }

  const [result] = await pool.query(
    'INSERT INTO complaints (user_id, description, location, status) VALUES (?, ?, ?, ?)',
    [req.user.id, description, location, 'pending'],
  );

  return res.status(201).json({ id: result.insertId, status: 'pending' });
});

// Public tracks own complaints; admin can see all via query all=true
router.get('/complaints', authRequired, async (req, res) => {
  const wantsAll = req.query.all === 'true';

  if (wantsAll && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can view all complaints' });
  }

  if (wantsAll) {
    const [rows] = await pool.query(
      `SELECT c.*, u.name as submitted_by
       FROM complaints c
       JOIN users u ON c.user_id = u.id
       ORDER BY c.id DESC`,
    );
    return res.json(rows);
  }

  if (req.user.role === 'public_user') {
    const [rows] = await pool.query('SELECT * FROM complaints WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
    return res.json(rows);
  }

  const [rows] = await pool.query('SELECT * FROM complaints ORDER BY id DESC');
  return res.json(rows);
});

// Admin assigns complaint to an officer
router.put('/complaints/:id/assign', authRequired, requireRole('admin'), async (req, res) => {
  const complaintId = Number(req.params.id);
  const { officer_id } = req.body;

  const [officerRows] = await pool.query('SELECT id, role FROM users WHERE id = ?', [officer_id]);
  if (!officerRows.length || officerRows[0].role !== 'police_officer') {
    return res.status(400).json({ message: 'officer_id must reference a police_officer' });
  }

  const [complaintRows] = await pool.query('SELECT id FROM complaints WHERE id = ?', [complaintId]);
  if (!complaintRows.length) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  await pool.query('UPDATE complaints SET assigned_officer_id = ?, status = ? WHERE id = ?', [officer_id, 'assigned', complaintId]);
  return res.json({ message: 'Complaint assigned successfully' });
});

module.exports = router;
