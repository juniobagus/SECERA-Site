const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('Adding 2FA columns to users table...');
  try {
    // Check if columns exist first
    const [columns] = await connection.query('SHOW COLUMNS FROM users');
    const columnNames = columns.map(c => c.Field);
    
    if (!columnNames.includes('two_factor_secret')) {
      await connection.query('ALTER TABLE users ADD COLUMN two_factor_secret TEXT');
      console.log('Added two_factor_secret');
    }
    
    if (!columnNames.includes('two_factor_enabled')) {
      await connection.query('ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE');
      console.log('Added two_factor_enabled');
    }

    console.log('Migration successful!');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await connection.end();
  }
}

migrate();
