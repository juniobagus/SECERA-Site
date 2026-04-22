import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Package, Upload, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct, createProduct } from '../../utils/api';
import { formatPrice } from '../../data/products';

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await getProducts();
    setProducts(data);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      await loadProducts();
    }
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').slice(1);
      
      for (const row of rows) {
        if (!row.trim()) continue;
        const [name, short_name, category_id, price, stock, sku] = row.split(',');
        
        const productData = { name, short_name, category_id: category_id.trim() };
        const variants = [{
          sku: sku.trim(),
          price: Number(price),
          stock: Number(stock),
          color: 'Default',
          option_name: 'Regular',
          is_bundle: false
        }];
        
        try {
          await createProduct(productData, variants, []);
        } catch (err) {
          console.error('Failed to import row:', row, err);
        }
      }
      
      setIsImporting(false);
      loadProducts();
      alert('CSV Import complete!');
    };
    reader.readAsText(file);
  };
  
  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.product_variants?.some((v: any) => v.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Products</h1>
          <p className="text-sm text-gray-500">Manage your catalog, inventory, and variants.</p>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportCSV} 
            accept=".csv" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Import CSV
          </button>
          <Link 
            to="/admin/products/new" 
            className="bg-[#722F38] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5a252d] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, category, or SKU..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#722F38] focus:ring-1 focus:ring-[#722F38] outline-none transition-shadow"
            />
          </div>
          <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#722F38]"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Package className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900">No products found</p>
              <p className="text-sm">Try adjusting your search or add a new product.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium text-center">Variants</th>
                  <th className="px-6 py-4 font-medium text-right">Price Range</th>
                  <th className="px-6 py-4 font-medium text-center">Total Stock</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const variants = product.product_variants || [];
                  const totalStock = variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
                  const prices = variants.map((v: any) => v.price || 0);
                  const minPrice = prices.length ? Math.min(...prices) : 0;
                  const maxPrice = prices.length ? Math.max(...prices) : 0;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.thumbnail_url ? (
                              <img src={product.thumbnail_url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">ID: {product.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          {variants.length} Variants
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-medium text-gray-900">
                          {minPrice === maxPrice 
                            ? formatPrice(minPrice) 
                            : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium rounded-full ${
                          totalStock > 10 ? 'bg-green-50 text-green-700' : 
                          totalStock > 0 ? 'bg-yellow-50 text-yellow-700' : 
                          'bg-red-50 text-red-700'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            totalStock > 10 ? 'bg-green-500' : 
                            totalStock > 0 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`} />
                          {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 group">
                          <Link to={`/admin/products/${product.id}/edit`} className="p-1.5 text-gray-400 hover:text-[#722F38] bg-white rounded-md shadow-sm border border-gray-200 hover:border-[#722F38]/30 transition-all opacity-0 group-hover:opacity-100">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-white rounded-md shadow-sm border border-gray-200 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
