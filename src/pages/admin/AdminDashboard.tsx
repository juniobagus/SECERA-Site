import { useState, useEffect } from 'react';
import { Package, TrendingUp, Users, ShoppingCart } from 'lucide-react';
import { getProducts } from '../../utils/api';

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getProducts();
      setProducts(data);
      setIsLoading(false);
    };

    void loadData();
  }, []);

  const activeProducts = products.filter((product) => (product.status || 'active') === 'active');
  const totalProducts = products.length;
  const allVariants = products.flatMap((product) => product.product_variants || []);
  const activeVariants = activeProducts.flatMap((product) => product.product_variants || []);
  const totalVariants = allVariants.length;
  const lowStockVariants = activeVariants.filter((variant) => variant.stock < 5);

  const stats = [
    { label: 'Total Products', value: totalProducts.toString(), icon: Package, color: 'text-sky-700', bg: 'bg-sky-100' },
    { label: 'Total SKUs', value: totalVariants.toString(), icon: ShoppingCart, color: 'text-amber-700', bg: 'bg-amber-100' },
    { label: 'Low Stock Alerts', value: lowStockVariants.length.toString(), icon: TrendingUp, color: 'text-red-700', bg: 'bg-red-100' },
    { label: 'Total Sales', value: 'Rp 0', icon: Users, color: 'text-emerald-700', bg: 'bg-emerald-100' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-44 animate-pulse bg-gray-200" />
          <div className="h-4 w-72 max-w-full animate-pulse bg-gray-100" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="border border-gray-200 bg-white p-6">
              <div className="h-5 w-24 animate-pulse bg-gray-100" />
              <div className="mt-4 h-8 w-14 animate-pulse bg-gray-200" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="h-64 animate-pulse border border-gray-200 bg-white" />
          <div className="h-64 animate-pulse border border-gray-200 bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your store&apos;s performance.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-500">{stat.label}</p>
                <h2 className="text-2xl font-bold text-gray-900">{stat.value}</h2>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <article className="border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">Low Stock Alerts</h2>

          {lowStockVariants.length > 0 ? (
            <div className="mt-4 space-y-3">
              {lowStockVariants.slice(0, 6).map((variant, idx) => {
                const parent = products.find((product) => product.id === variant.product_id);

                return (
                  <div key={idx} className="flex items-center justify-between gap-3 border border-red-100 bg-red-50/40 p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border border-gray-100 bg-white">
                        {variant.image_url ? (
                          <img src={variant.image_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{parent?.short_name || parent?.name}</p>
                        <p className="truncate text-xs text-gray-500">{variant.sku} - {variant.color}</p>
                      </div>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-red-700">{variant.stock} left</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-600">All stock levels are healthy.</p>
            </div>
          )}
        </article>

        <article className="border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <div className="mt-4 flex min-h-52 flex-col items-center justify-center border border-dashed border-gray-300 bg-gray-50 px-6 text-center">
            <ShoppingCart className="h-8 w-8 text-gray-400" />
            <p className="mt-3 text-sm font-medium text-gray-600">No orders yet</p>
            <p className="mt-1 max-w-[240px] text-xs text-gray-400">Orders created via WhatsApp checkout will appear here once implemented.</p>
          </div>
        </article>
      </section>
    </div>
  );
}
