import { useEffect, useState } from 'react';
import { getNotificationDeliveries } from '../../utils/api';

export default function AdminNotificationDeliveries() {
  const [rows, setRows] = useState<any[]>([]);
  const [filter, setFilter] = useState('');

  async function load() {
    const data = await getNotificationDeliveries(filter || undefined);
    setRows(data);
  }

  useEffect(() => { load(); }, [filter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notification Deliveries</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">All status</option>
          <option value="sent">sent</option>
          <option value="failed">failed</option>
          <option value="retried">retried</option>
          <option value="skipped">skipped</option>
        </select>
      </div>
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Event</th><th className="p-3">Channel</th><th className="p-3">Status</th><th className="p-3">Recipient</th><th className="p-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.event_type}</td>
                <td className="p-3">{r.channel}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3">{r.recipient_email || r.recipient_phone || r.recipient_id || '-'}</td>
                <td className="p-3">{new Date(r.created_at).toLocaleString('id-ID')}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td className="p-4 text-gray-400" colSpan={5}>Belum ada data delivery.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
