import { useState, useEffect } from 'react';
import { Package, TrendingUp, Users, ShoppingCart, Loader2 } from 'lucide-react';
import { getProducts } from '../../utils/api';
import { formatPrice } from '../../data/products';

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getProducts();
      setProducts(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const totalProducts = products.length;
  const allVariants = products.flatMap(p => p.product_variants || []);
  const totalVariants = allVariants.length;
  const lowStockVariants = allVariants.filter(v => v.stock < 5);

  const stats = [
    { label: 'Total Products', value: totalProducts.toString(), icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total SKUs', value: totalVariants.toString(), icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Low Stock Alerts', value: lowStockVariants.length.toString(), icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Total Sales', value: 'Rp 0', icon: Users, color: 'text-green-600', bg: 'bg-green-100' }, // Dummy for MVP
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#722F38]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your store's performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Low Stock Alerts</h2>
          {lowStockVariants.length > 0 ? (
            <div className="space-y-4">
              {lowStockVariants.slice(0, 5).map((variant, i) => {
                const parent = products.find(p => p.id === variant.product_id);
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-red-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-white border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {variant.image_url ? (
                          <img src={variant.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{parent?.short_name || parent?.name}</p>
                        <p className="text-xs text-gray-500">{variant.sku} • {variant.color}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">{variant.stock} left</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">All stock levels are healthy.</p>
          )}
        </div>

        {/* Recent Orders Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="flex flex-col items-center justify-center h-48 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <ShoppingCart className="w-8 h-8 text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-600">No orders yet</p>
            <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
              Orders created via WhatsApp checkout will appear here once implemented.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
