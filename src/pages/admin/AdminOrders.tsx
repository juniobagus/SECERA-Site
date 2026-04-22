import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit2, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../../data/products';
import { getOrders, updateOrderStatus } from '../../utils/api';

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    const data = await getOrders();
    setOrders(data);
    setIsLoading(false);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, newStatus);
      await loadOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };
  
  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shipping_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', { 
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Orders</h1>
          <p className="text-sm text-gray-500">Manage customer orders and fulfillment.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer Name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#722F38] focus:ring-1 focus:ring-[#722F38] outline-none transition-shadow"
            />
          </div>
          <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4" />
            Filter Status
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-[#722F38]" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{order.id.slice(0, 8)}...</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.shipping_name}</div>
                      <div className="text-xs text-gray-500">{order.shipping_city}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{formatPrice(order.total_amount)}</div>
                      <div className="text-xs text-gray-500">{order.order_items?.length || 0} items</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <select 
                          className="text-xs border border-gray-200 rounded p-1 outline-none focus:border-[#722F38]"
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 bg-white rounded-md shadow-sm border border-gray-200 hover:border-blue-200 transition-all" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                      No orders found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
