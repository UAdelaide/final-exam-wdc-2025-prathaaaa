const express = require('express');
const router  = express.Router();
const db = require('../models/db');

router.get('/owner/dashboard', (req, res) => {
  if (req.session.user?.role === 'owner') {
    res.send(`Welcome, ${req.session.user.username}! (OWNER)`);
  } else {
    res.redirect('/');
  }
});

router.get('/walker/dashboard', (req, res) => {
  if (req.session.user?.role === 'walker') {
    res.send(`Welcome, ${req.session.user.username}! (WALKER)`);
  } else {
    res.redirect('/');
  }
});
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Logout failed');
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.redirect('/');              // Back to login form
  });
});

router.get('/owner/dogs', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'owner') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const [rows] = await db.query(
      'SELECT dog_id, name FROM Dogs WHERE owner_id = ?',
      [req.session.user.user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});
module.exports = router;              // <-- don’t forget this!
