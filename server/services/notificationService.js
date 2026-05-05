const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const NOTIF_EMAIL_ENABLED = process.env.NOTIF_EMAIL_ENABLED !== 'false';
const NOTIF_WA_ENABLED = process.env.NOTIF_WA_ENABLED !== 'false';
const NOTIF_INAPP_ENABLED = process.env.NOTIF_INAPP_ENABLED !== 'false';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'no-reply@secera.id';
const FONNTE_API_KEY = process.env.FONNTE_API_KEY;
const MAX_ATTEMPTS = 3;
const CHANNELS = { IN_APP: 'in_app', EMAIL: 'email', WHATSAPP: 'whatsapp' };
let schemaChecked = false;
let hasNotifRoleColumns = false;
let hasEventsTable = false;
let hasDeliveriesTable = false;

async function ensureSchemaFlags() {
  if (schemaChecked) return;
  try {
    const [notifCols] = await db.query('SHOW COLUMNS FROM notifications');
    const colNames = notifCols.map((c) => c.Field);
    hasNotifRoleColumns = colNames.includes('role') && colNames.includes('recipient_id') && colNames.includes('event_type') && colNames.includes('metadata');

    const [tables] = await db.query('SHOW TABLES');
    const names = tables.map((row) => Object.values(row)[0]);
    hasEventsTable = names.includes('notification_events');
    hasDeliveriesTable = names.includes('notification_deliveries');
  } catch (err) {
    console.error('notification schema check failed:', err.message);
  } finally {
    schemaChecked = true;
  }
}
function formatId(orderId) { if (!orderId) return '-'; return String(orderId).slice(0, 8); }
function toPhone(input) { if (!input) return null; const raw = String(input).replace(/\D/g, ''); if (!raw) return null; if (raw.startsWith('62')) return raw; if (raw.startsWith('0')) return `62${raw.slice(1)}`; return raw; }
function buildTemplate(eventType, payload = {}) { const orderId = payload.order_id || payload.entity_id; const short = formatId(orderId); const tracking = payload.tracking_number || '-'; const jobTitle = payload.job_title || 'Posisi'; const templates = { checkout_created: { title: 'Pesanan Baru Dibuat', message: `Pesanan #${short} berhasil dibuat.`, emailSubject: `SECERA - Pesanan #${short} diterima`, emailBody: `Pesanan Anda #${short} berhasil dibuat dan menunggu pembayaran.`, waMessage: `SECERA: Pesanan #${short} berhasil dibuat dan menunggu pembayaran.` }, payment_proof_uploaded: { title: 'Bukti Pembayaran Diupload', message: `Bukti pembayaran untuk pesanan #${short} telah diunggah.`, emailSubject: `SECERA - Bukti pembayaran #${short} diterima`, emailBody: `Bukti pembayaran untuk pesanan #${short} telah kami terima.`, waMessage: `SECERA: Bukti pembayaran pesanan #${short} telah diterima.` }, payment_confirmed: { title: 'Pembayaran Terkonfirmasi', message: `Pembayaran pesanan #${short} sudah terkonfirmasi.`, emailSubject: `SECERA - Pembayaran #${short} terkonfirmasi`, emailBody: `Pembayaran untuk pesanan #${short} sudah terkonfirmasi.`, waMessage: `SECERA: Pembayaran pesanan #${short} sudah terkonfirmasi.` }, order_shipped: { title: 'Pesanan Dikirim', message: `Pesanan #${short} sudah dikirim. Resi: ${tracking}`, emailSubject: `SECERA - Pesanan #${short} dikirim`, emailBody: `Pesanan #${short} sudah dikirim. Nomor resi: ${tracking}.`, waMessage: `SECERA: Pesanan #${short} dikirim. Resi: ${tracking}.` }, order_completed: { title: 'Pesanan Selesai', message: `Pesanan #${short} telah selesai.`, emailSubject: `SECERA - Pesanan #${short} selesai`, emailBody: `Pesanan #${short} telah selesai. Terima kasih.`, waMessage: `SECERA: Pesanan #${short} telah selesai. Terima kasih.` }, order_cancelled: { title: 'Pesanan Dibatalkan', message: `Pesanan #${short} dibatalkan.`, emailSubject: `SECERA - Pesanan #${short} dibatalkan`, emailBody: `Pesanan #${short} telah dibatalkan.`, waMessage: `SECERA: Pesanan #${short} dibatalkan.` }, job_application_submitted: { title: 'Lamaran Pekerjaan Baru', message: `Lamaran baru masuk untuk ${jobTitle}.`, emailSubject: `SECERA - Lamaran baru (${jobTitle})`, emailBody: `Lamaran baru masuk untuk posisi ${jobTitle}.`, waMessage: `SECERA: Lamaran baru masuk untuk posisi ${jobTitle}.` }, job_application_status_changed: { title: 'Status Lamaran Diperbarui', message: `Status lamaran Anda untuk ${jobTitle} diperbarui menjadi ${payload.status || '-'}.`, emailSubject: `SECERA - Update status lamaran`, emailBody: `Status lamaran Anda untuk ${jobTitle} diperbarui menjadi ${payload.status || '-'}.`, waMessage: `SECERA: Status lamaran Anda untuk ${jobTitle} sekarang ${payload.status || '-'}.` }, low_stock_alert: { title: 'Peringatan Stok Menipis', message: `${payload.sku || 'SKU'} tersisa ${payload.stock ?? '-'} unit.`, emailSubject: `SECERA - Low stock alert`, emailBody: `${payload.sku || 'SKU'} tersisa ${payload.stock ?? '-'} unit.`, waMessage: `SECERA: Low stock ${payload.sku || 'SKU'} tersisa ${payload.stock ?? '-'} unit.` }, notification_delivery_failed: { title: 'Gagal Kirim Notifikasi', message: `Pengiriman notifikasi gagal untuk event ${payload.failed_event_type || '-'}.`, emailSubject: 'SECERA - Gagal kirim notifikasi', emailBody: `Pengiriman notifikasi gagal. Event: ${payload.failed_event_type || '-'}.`, waMessage: 'SECERA: Ada kegagalan pengiriman notifikasi.' } }; return templates[eventType] || { title: 'Notifikasi Baru', message: payload.message || 'Ada pembaruan baru.', emailSubject: 'SECERA - Notifikasi', emailBody: payload.message || 'Ada pembaruan baru.', waMessage: payload.message || 'Ada pembaruan baru.' }; }
async function sendEmail(recipient, template) { if (!NOTIF_EMAIL_ENABLED) return { skipped: true, reason: 'email_disabled' }; if (!RESEND_API_KEY) return { skipped: true, reason: 'missing_resend_api_key' }; if (!recipient.email) return { skipped: true, reason: 'missing_email' }; const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: RESEND_FROM_EMAIL, to: [recipient.email], subject: template.emailSubject, text: template.emailBody }) }); const body = await response.text(); if (!response.ok) throw new Error(`Resend ${response.status}: ${body}`); return { sent: true, provider_response: body }; }
async function sendWhatsApp(recipient, template) { if (!NOTIF_WA_ENABLED) return { skipped: true, reason: 'wa_disabled' }; if (!FONNTE_API_KEY) return { skipped: true, reason: 'missing_fonnte_api_key' }; const target = toPhone(recipient.phone); if (!target) return { skipped: true, reason: 'missing_phone' }; const response = await fetch('https://api.fonnte.com/send', { method: 'POST', headers: { Authorization: FONNTE_API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ target, message: template.waMessage }) }); const body = await response.text(); if (!response.ok) throw new Error(`Fonnte ${response.status}: ${body}`); return { sent: true, provider_response: body }; }
async function createInApp(recipient, eventType, template, payload) {
  if (!NOTIF_INAPP_ENABLED) return { skipped: true, reason: 'inapp_disabled' };
  if (!recipient.role || !recipient.recipient_id) return { skipped: true, reason: 'missing_recipient' };
  await ensureSchemaFlags();
  const id = uuidv4();
  if (hasNotifRoleColumns) {
    await db.query(`INSERT INTO notifications (id, type, message, data, role, recipient_id, event_type, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [id, eventType, template.message, JSON.stringify(payload || {}), recipient.role, recipient.recipient_id, eventType, JSON.stringify({ title: template.title })]);
  } else {
    await db.query(`INSERT INTO notifications (id, type, message, data) VALUES (?, ?, ?, ?)`, [id, eventType, template.message, JSON.stringify(payload || {})]);
  }
  return { sent: true, provider_response: JSON.stringify({ notification_id: id }) };
}
async function recordDelivery(eventId, recipient, channel, status, attempt, providerResponse, errorMessage) {
  await ensureSchemaFlags();
  if (!hasDeliveriesTable) return null;
  const deliveryId = uuidv4();
  await db.query(`INSERT INTO notification_deliveries (id, event_id, role, recipient_id, recipient_email, recipient_phone, channel, status, attempt_count, provider_response, error_message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [deliveryId, eventId, recipient.role || null, recipient.recipient_id || null, recipient.email || null, toPhone(recipient.phone), channel, status, attempt, providerResponse ? String(providerResponse).slice(0, 4000) : null, errorMessage ? String(errorMessage).slice(0, 1000) : null]);
  return deliveryId;
}
function channelsForRecipient(recipient) { return Array.isArray(recipient.channels) ? recipient.channels : []; }
async function emitNotification({ event_type, entity_id = null, actor_id = null, recipients = [], payload = {}, idempotency_key }) {
  if (!event_type || !idempotency_key) throw new Error('event_type and idempotency_key are required');
  await ensureSchemaFlags();
  let eventId = uuidv4();
  if (hasEventsTable) {
    const [existing] = await db.query('SELECT id FROM notification_events WHERE idempotency_key = ? LIMIT 1', [idempotency_key]);
    if (existing.length > 0) return { skipped: true, reason: 'duplicate_event', event_id: existing[0].id };
    await db.query(`INSERT INTO notification_events (id, event_type, entity_id, actor_id, payload, idempotency_key) VALUES (?, ?, ?, ?, ?, ?)`, [eventId, event_type, entity_id, actor_id, JSON.stringify(payload), idempotency_key]);
  } else {
    eventId = `legacy:${idempotency_key}`;
  }
  const template = buildTemplate(event_type, payload); for (const recipient of recipients) { const channels = channelsForRecipient(recipient); for (const channel of channels) { let sent = false; let lastError = null; for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) { try { let result; if (channel === CHANNELS.IN_APP) result = await createInApp(recipient, event_type, template, payload); if (channel === CHANNELS.EMAIL) result = await sendEmail(recipient, template); if (channel === CHANNELS.WHATSAPP) result = await sendWhatsApp(recipient, template); const status = result?.skipped ? 'skipped' : 'sent'; await recordDelivery(eventId, recipient, channel, status, attempt, result?.provider_response || result?.reason || null, null); sent = true; break; } catch (err) { lastError = err; const status = attempt >= MAX_ATTEMPTS ? 'failed' : 'retried'; await recordDelivery(eventId, recipient, channel, status, attempt, null, err.message); } } if (!sent && lastError) console.error('[Notification Delivery Failed]', { eventId, channel, error: lastError.message }); } } return { success: true, event_id: eventId }; }
module.exports = { emitNotification, CHANNELS, toPhone };
