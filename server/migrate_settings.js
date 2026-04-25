require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('Adding settings table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS settings (
          setting_key VARCHAR(50) PRIMARY KEY,
          setting_value TEXT NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Inserting default settings...');
    const defaults = [
      ['shipping_origin_id', '69220'],
      ['shipping_origin_name', 'Surabaya (Bubutan)'],
      ['whatsapp_number', '6281234567890'],
      ['bank_account_info', 'Bank BCA - 1234567890 - a.n. SECERA OFFICIAL']
    ];

    for (const [key, value] of defaults) {
      await connection.execute(
        'INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)',
        [key, value]
      );
    }

    console.log('Database updated successfully!');
  } catch (err) {
    console.error('Error updating database:', err);
  } finally {
    await connection.end();
  }
}

run();
