const express = require('express');
const router  = express.Router();

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
module.exports = router;              // <-- don’t forget this!
