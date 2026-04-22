import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Calendar, Tag, Loader2 } from 'lucide-react';
import { getPromos, deletePromo, getProducts } from '../../utils/api';
import { formatPrice } from '../../data/products';

export default function AdminPromos() {
  const [promos, setPromos] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount_percentage: 0,
    start_date: '',
    end_date: ''
  });
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [promosData, productsData] = await Promise.all([
      getPromos(),
      getProducts()
    ]);
    setPromos(promosData);
    setProducts(productsData);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo?')) return;
    setIsDeleting(id);
    await deletePromo(id);
    await loadData();
    setIsDeleting(null);
  };

  const getStatus = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (now < startDate) return { label: 'Upcoming', class: 'bg-blue-100 text-blue-800' };
    if (now > endDate) return { label: 'Expired', class: 'bg-red-100 text-red-800' };
    return { label: 'Active', class: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Promotions</h1>
          <p className="text-sm text-gray-500">Create and manage seasonal discounts and campaigns.</p>
        </div>
        <button 
          className="bg-[#722F38] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5a252d] transition-colors flex items-center gap-2"
          onClick={() => alert('Promo creation UI coming soon!')}
        >
          <Plus className="w-4 h-4" />
          Create Promo
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#722F38]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((promo) => {
            const status = getStatus(promo.start_date, promo.end_date);
            return (
              <div key={promo.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col relative group">
                <button 
                  onClick={() => handleDelete(promo.id)}
                  disabled={isDeleting === promo.id}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  {isDeleting === promo.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>

                <div className="mb-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.class}`}>
                    {status.label}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{promo.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{promo.description}</p>

                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Tag className="w-4 h-4" />
                    <span className="font-bold text-[#722F38]">{promo.discount_percentage}% OFF</span>
                    <span className="text-gray-400">•</span>
                    <span>{promo.promo_products?.length || 0} Products</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(promo.start_date).toLocaleDateString()} - {new Date(promo.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {promos.length === 0 && (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
              No promotions found. Start by creating one!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
