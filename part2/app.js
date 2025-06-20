const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');


const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
  secret: 'something-secret',
  resave: false,
  saveUninitialized: true
}));
// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
const dashRoutes = require('./routes/index');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
app
// Export the app instead of listening here
module.exports = app;