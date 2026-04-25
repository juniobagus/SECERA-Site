const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const email = 'admin@secera.id';
    const password = 'password123';
    const name = 'Super Admin';
    const id = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    await connection.query(
      'INSERT IGNORE INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)',
      [id, email, password_hash, name, 'admin']
    );

    console.log('Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await connection.end();
  }
}

seed();
