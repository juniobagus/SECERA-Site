const db = require('./db');

async function check() {
  try {
    const [rows] = await db.query('DESCRIBE products');
    console.log(rows);
    const [variantRows] = await db.query('DESCRIBE product_variants');
    console.log(variantRows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
