const db = require('../db');
const { emitNotification, CHANNELS } = require('./notificationService');

async function runLowStockCheck() {
  try {
    const threshold = Number(process.env.LOW_STOCK_THRESHOLD || 5);
    const [rows] = await db.query(
      `SELECT pv.sku, pv.stock
       FROM product_variants pv
       JOIN products p ON p.id = pv.product_id
       WHERE pv.stock <= ? AND p.status = 'active'
       ORDER BY pv.stock ASC
       LIMIT 50`,
      [threshold]
    );

    for (const row of rows) {
      await emitNotification({
        event_type: 'low_stock_alert',
        entity_id: row.sku,
        idempotency_key: `low_stock_alert:${row.sku}:${new Date().toISOString().slice(0,16)}`,
        payload: { sku: row.sku, stock: row.stock },
        recipients: [
          { role: 'admin', recipient_id: 'admin', channels: [CHANNELS.IN_APP, CHANNELS.EMAIL, CHANNELS.WHATSAPP], email: process.env.ADMIN_EMAIL, phone: process.env.ADMIN_WHATSAPP }
        ]
      });
    }
  } catch (err) {
    console.error('Low stock monitor failed:', err.message);
  }
}

function startLowStockMonitor() {
  const intervalMs = Number(process.env.LOW_STOCK_INTERVAL_MS || 15 * 60 * 1000);
  setInterval(() => { runLowStockCheck(); }, intervalMs);
  runLowStockCheck();
}

module.exports = { startLowStockMonitor };
