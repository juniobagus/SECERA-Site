import { useState, useEffect } from 'react';
import { X, Phone, MapPin, ShoppingBag, Clock, ChevronRight, Loader2, User, Mail, CreditCard } from 'lucide-react';
import { formatPrice } from '../../data/products';
import { getCustomerByPhone } from '../../utils/api';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string | null;
}

export default function CustomerDetailModal({ isOpen, onClose, phone }: CustomerDetailModalProps) {
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && phone) {
      loadCustomerDetails();
    } else {
      setCustomer(null);
    }
  }, [isOpen, phone]);

  const loadCustomerDetails = async () => {
    setIsLoading(true);
    const data = await getCustomerByPhone(phone!);
    setCustomer(data);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('id-ID', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#722F38]/10 rounded-full flex items-center justify-center text-[#722F38]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Customer Profile</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">CRM Detail View</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#722F38]" />
              <p className="text-sm font-medium">Fetching customer records...</p>
            </div>
          ) : customer ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Profile Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-[#722F38] text-2xl font-bold shadow-sm border border-gray-100">
                      {customer.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900">{customer.name || 'Anonymous'}</h3>
                        {customer.orders?.some((o: any) => o.user_id) && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-green-100 text-green-700 rounded-md uppercase tracking-wider">Member</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 pt-1">
                        <div className="text-sm text-gray-500 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" /> {customer.phone}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {customer.city || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-200/50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Shipping Address</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{customer.address || 'No address saved'}</p>
                  </div>
                </div>

                <div className="bg-[#722F38] rounded-[2rem] p-8 text-white shadow-xl shadow-[#722F38]/20 flex flex-col justify-between relative overflow-hidden">
                  {/* Decorative background circle */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                  
                  <div className="space-y-8 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-3.5 h-3.5 text-white/40" />
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Total Spending</p>
                      </div>
                      <h4 className="text-3xl font-serif font-medium">{formatPrice(customer.total_spent)}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <ShoppingBag className="w-3 h-3 text-white/40" />
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Orders</p>
                        </div>
                        <p className="text-xl font-bold">{customer.total_orders}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Clock className="w-3 h-3 text-white/40" />
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">AOV</p>
                        </div>
                        <p className="text-sm font-bold opacity-90">{formatPrice(customer.total_spent / (customer.total_orders || 1))}</p>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/${customer.phone?.replace(/^0/, '62')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-10 py-3.5 bg-white/10 hover:bg-white text-white hover:text-[#722F38] rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border border-white/20 block text-center backdrop-blur-sm"
                  >
                    Send WhatsApp
                  </a>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-gray-400" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Order History</h3>
                </div>
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {customer.orders?.map((order: any) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id.slice(0, 8).toUpperCase()}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">{formatDate(order.created_at)}</td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">{formatPrice(order.total_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">Customer not found</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50/50">
          <button onClick={onClose} className="px-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all">
            Close Detail
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Users(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}
