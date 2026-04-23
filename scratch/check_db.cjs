const pool = require('/Users/juniobagus/Project/Secera/secera site/SECERA-Site/server/db');

async function checkTable() {
  try {
    const [rows] = await pool.query('DESCRIBE categories');
    console.log('Categories table structure:', rows);
    process.exit(0);
  } catch (err) {
    console.error('Error checking table:', err);
    process.exit(1);
  }
}

checkTable();
