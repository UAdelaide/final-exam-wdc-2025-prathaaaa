var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let db;

(async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '' // Set your MySQL root password
    });

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS testdb');
    await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'testdb'
    });

    // Create a table if it doesn't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        author VARCHAR(255)
      )
    `);

    // Insert data if table is empty
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM books');
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO books (title, author) VALUES
        ('1984', 'George Orwell'),
        ('To Kill a Mockingbird', 'Harper Lee'),
        ('Brave New World', 'Aldous Huxley')
      `);
    }
  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

// Route to return books as JSON
app.get('/', async (req, res) => {
  try {
    const [books] = await db.execute('SELECT * FROM books');
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});
//get dogs
app.get('/api/dogs', async (req, res)=>{
  try {
    const [rows] = await db.execute(`
      SELECT d.name AS dog_name, d.size, u.username AS owner_username
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id
      `);
      res.json(rows);

  } catch (err){
    res.status(500).json({error: 'Failed to fetch dogs', details: err.message});

  }
});

//walk reqs
app.get('/api/walkrequests/open', async (req, res)=>{
  try{
    const[rows]= await db.execute(`
      SELECT wr.request_id, d.name AS dog_name, wr.requested_time, wr.duration_minutes, wr.location, u.username AS owner_udername
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id= d.dog_id
      JOIN Users u ON d.owner_id= u.user_id
      WHERE wr.status = 'open'
      `);
      res.json(rows);
  } catch(err){
    res.status(500).json({error: 'Failed to fetch walk requests', details: err.message});

  }
});

//summary
app.get('/api/walkrequests/open', async (req, res)=>{
  try{
    const[rows]= await db.execute(`
      SELECT u.username AS walker_username, COUNT(r.rating_id) AS total_ratings, ROUND(AVG(r.rating),1) AS average_rating,
      (
      SELECT COUNT(*)
      FROM WalkApplications wa JOIN WalkRequests wr ON wa.request_id = wr.request_id
      WHERE wa.walker_id= u.user_id AND wr.status= 'completed')
      AS completed_walks
      FROM Users u
      WHERE u.role= 'walker'
      LEFT JOIN WalkingRatings r ON u.user_id= r.walker_id
      GROUP BY u.user_id
      `);
      res.json(rows);
  } catch(err){
    res.status(500).json({error: 'Failed to fetch walker summary', details: err.message});

  }
});
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;