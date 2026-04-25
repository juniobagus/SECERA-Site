const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function check() {
  console.log('Connecting to:', process.env.DB_HOST, 'on port:', process.env.DB_PORT);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [rows] = await connection.query('SELECT email, name FROM users');
    console.log('Users:', rows);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await connection.end();
  }
}

check();
