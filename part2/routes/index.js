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

module.exports = router;              // <-- don’t forget this!
