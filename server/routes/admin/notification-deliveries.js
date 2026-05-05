const express = require('express');
const router = express.Router();
const db = require('../../db');
const { authenticateAdmin } = require('../../middleware/auth');

let deliverySchemaChecked = false;
let hasDeliveriesTable = false;
let hasEventsTable = false;

async function ensureDeliverySchema() {
  if (deliverySchemaChecked) return;
  try {
    const [tables] = await db.query('SHOW TABLES');
    const names = tables.map((row) => Object.values(row)[0]);
    hasDeliveriesTable = names.includes('notification_deliveries');
    hasEventsTable = names.includes('notification_events');
  } catch (err) {
    console.error('Error checking notification delivery schema:', err.message);
  } finally {
    deliverySchemaChecked = true;
  }
}

router.get('/', authenticateAdmin, async (req, res) => {
  try {
    await ensureDeliverySchema();
    if (!hasDeliveriesTable) return res.json([]);

    const status = req.query.status;
    const limit = Math.min(parseInt(req.query.limit || '100', 10), 200);
    const params = [];
    let sql = hasEventsTable
      ? `SELECT nd.*, ne.event_type, ne.entity_id, ne.created_at as event_created_at
         FROM notification_deliveries nd
         LEFT JOIN notification_events ne ON ne.id = nd.event_id`
      : `SELECT nd.*, NULL as event_type, NULL as entity_id, NULL as event_created_at
         FROM notification_deliveries nd`;

    if (status) {
      sql += ' WHERE nd.status = ? ';
      params.push(status);
    }

    sql += ' ORDER BY nd.created_at DESC LIMIT ?';
    params.push(limit);

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching notification deliveries:', err);
    res.status(500).json({ message: 'Error fetching notification deliveries' });
  }
});

module.exports = router;
