import { useState, useEffect } from 'react';
import { Search, Users, Phone, MapPin, ShoppingBag, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { formatPrice } from '../../data/products';
import { getCustomers } from '../../utils/api';
import { motion, AnimatePresence } from 'motion/react';
import CustomerDetailModal from '../../components/admin/CustomerDetailModal';
import AdminDataTable from '../../components/admin/AdminDataTable';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'spent' | 'orders' | 'name'>('spent');
  const [memberTab, setMemberTab] = useState<'all' | 'registered' | 'guest'>('all');
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setIsLoading(true);
    const data = await getCustomers();
    setCustomers(data);
    setIsLoading(false);
  };

  const filteredCustomers = customers
    .filter(c => {
      const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm);
      const matchesMember = memberTab === 'all' || 
                           (memberTab === 'registered' && c.is_registered) || 
                           (memberTab === 'guest' && !c.is_registered);
      return matchesSearch && matchesMember;
    })
    .sort((a, b) => {
      if (sortBy === 'spent') return b.total_spent - a.total_spent;
      if (sortBy === 'orders') return b.total_orders - a.total_orders;
      return (a.name || '').localeCompare(b.name || '');
    });

  const formatDate = (isoString: string) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('id-ID', { 
      day: 'numeric', month: 'short', year: 'numeric' 
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Customers (CRM)</h1>
          <p className="text-sm text-gray-500">Manage customer relationships and track purchasing behavior.</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
        {[
          { id: 'all', label: 'All Customers' },
          { id: 'registered', label: 'Registered Users' },
          { id: 'guest', label: 'Guest Buyers' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setMemberTab(tab.id as any)}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              memberTab === tab.id 
                ? 'text-[#722F38]' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            {memberTab === tab.id && (
              <motion.div layoutId="activeMemberTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#722F38]" />
            )}
          </button>
        ))}
      </div>

      <AdminDataTable toolbar={
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#722F38] outline-none bg-white"
            />
          </div>
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl w-fit">
            {[
              { id: 'spent', label: 'Top Spenders' },
              { id: 'orders', label: 'Most Orders' },
              { id: 'name', label: 'A-Z' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSortBy(tab.id as any)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortBy === tab.id 
                    ? 'bg-white text-[#722F38] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      }>

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
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Orders</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Order</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.phone} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {customer.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-bold text-gray-900">{customer.name || 'Anonymous'}</div>
                            {customer.is_registered ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-green-100 text-green-700 rounded-md uppercase tracking-wider">Member</span>
                            ) : (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-md uppercase tracking-wider">Guest</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" /> {customer.phone}
                            {customer.registered_email && (
                              <span className="text-gray-300 ml-1">• {customer.registered_email}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {customer.city || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {customer.total_orders}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#722F38]">{formatPrice(customer.total_spent)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">{formatDate(customer.last_order_date)}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedPhone(customer.phone);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-[#722F38] hover:bg-[#722F38]/5 rounded-lg transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AdminDataTable>

      <CustomerDetailModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPhone(null);
        }}
        phone={selectedPhone}
      />
    </div>
  );
}
