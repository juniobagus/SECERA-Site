import { X, Package, Truck, Phone, MapPin, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import { formatPrice } from '../../data/products';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onStatusUpdate: (id: string, status: string) => void;
}

export default function OrderDetailModal({ isOpen, onClose, order, onStatusUpdate }: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
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
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-gray-900">Order Detail</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">ID: {order.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Items */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Order Items ({order.items?.length || 0})
                </h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                      <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                        {item.thumbnail_url && (
                          <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-900 truncate">{item.product_name || 'Product'}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span className="font-medium text-gray-700">SKU: {item.variant_sku}</span>
                          <span className="text-gray-300">•</span>
                          <span>Rp {formatPrice(item.price)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">x{item.quantity}</div>
                        <div className="text-sm font-bold text-[#722F38]">Rp {formatPrice(item.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-6 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>Rp {formatPrice(order.total_amount - (order.shipping_cost || 0) + (order.discount_amount || 0))}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping Cost</span>
                  <span>Rp {formatPrice(order.shipping_cost || 0)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-Rp {formatPrice(order.discount_amount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span className="text-[#722F38]">Rp {formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Customer & Shipping */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Order Info
                </h3>
                <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-4 shadow-sm">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date Created</label>
                    <div className="text-sm font-medium text-gray-900">{formatDate(order.created_at)}</div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status Management</label>
                    <select 
                      value={order.status}
                      onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#722F38] outline-none bg-gray-50/50"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Shipping Details
                </h3>
                <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{order.shipping_name}</div>
                      <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {order.shipping_address}<br />
                        {order.shipping_city}, {order.shipping_postal_code}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">{order.shipping_phone}</div>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Customer Notes
                  </h3>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-orange-800 italic">
                    "{order.notes}"
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50/50">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-[#722F38] text-white rounded-lg font-bold hover:bg-[#5a252d] transition-all shadow-md shadow-[#722F38]/20"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
}
