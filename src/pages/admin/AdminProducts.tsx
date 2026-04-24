import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Search, Filter, Plus, Edit2, Trash2, Loader2, CheckSquare, X } from 'lucide-react';
import { formatPrice } from '../../data/products';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../../utils/api';
import ProductModal from '../../components/admin/ProductModal';
import BulkEditModal from '../../components/admin/BulkEditModal';

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [editingCell, setEditingCell] = useState<{ id: string, field: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  
  const categories = ['All', ...allCategories.map(c => c.name)];
  
  const fetchProducts = async () => {
    setIsLoading(true);
    const [productsData, categoriesData] = await Promise.all([
      getProducts(),
      getCategories()
    ]);
    setProducts(productsData);
    setAllCategories(categoriesData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      const loadingToast = toast.loading(`Deleting ${selectedProducts.length} products...`);
      try {
        await Promise.all(selectedProducts.map(id => deleteProduct(id)));
        toast.success(`${selectedProducts.length} products deleted`, { id: loadingToast });
        setSelectedProducts([]);
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete some products', { id: loadingToast });
      }
    }
  };

  const handleBulkEdit = async (editData: any) => {
    const loadingToast = toast.loading(`Updating ${selectedProducts.length} products...`);
    try {
      await Promise.all(selectedProducts.map(id => updateProduct(id, editData)));
      toast.success(`${selectedProducts.length} products updated`, { id: loadingToast });
      setIsBulkEditOpen(false);
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update some products', { id: loadingToast });
    }
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      alert('Failed to save product. Check console for details.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const loadingToast = toast.loading('Deleting product...');
      try {
        const success = await deleteProduct(id);
        if (success) {
          toast.success('Product deleted', { id: loadingToast });
          fetchProducts();
        } else {
          toast.error('Failed to delete product', { id: loadingToast });
        }
      } catch (error) {
        toast.error('Error deleting product', { id: loadingToast });
      }
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleInlineSave = async (id: string, field: string, value?: string) => {
    try {
      const updates: any = {};
      const finalValue = value || editValue;
      
      if (field === 'category') {
        const cat = allCategories.find(c => c.name === finalValue);
        if (cat) {
          updates['category_id'] = cat.id;
        } else {
          toast.error('Invalid category');
          return;
        }
      } else if (field === 'price') {
        const product = products.find(p => p.id === id);
        const variants = product.product_variants || product.variants || [];
        if (variants.length > 0) {
          // Update first variant's price
          await updateProduct(id, {
            variants: variants.map((v: any, i: number) => i === 0 ? { ...v, price: parseInt(finalValue) } : v)
          });
        }
        return;
      } else {
        updates[field] = finalValue;
      }
      
      await updateProduct(id, updates);
      toast.success('Updated successfully');
      setEditingCell(null);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.short_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let valA, valB;
      if (sortBy === 'name') {
        valA = a.short_name || a.name;
        valB = b.short_name || b.name;
      } else if (sortBy === 'category') {
        valA = a.category;
        valB = b.category;
      } else if (sortBy === 'price') {
        valA = (a.product_variants || a.variants || [])[0]?.price || 0;
        valB = (b.product_variants || b.variants || [])[0]?.price || 0;
      } else if (sortBy === 'stock') {
        valA = (a.product_variants || a.variants || []).reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
        valB = (b.product_variants || b.variants || []).reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
      }
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Products</h1>
          <p className="text-sm text-gray-500">Manage your product catalog and inventory.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-[#722F38] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5a252d] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-4 flex-1">
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
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-1.5 bg-[#722F38]/5 border border-[#722F38]/20 rounded-lg animate-in fade-in slide-in-from-left-2">
                <span className="text-sm font-semibold text-[#722F38]">{selectedProducts.length} selected</span>
                <div className="w-px h-4 bg-[#722F38]/20 mx-1" />
                <button 
                  onClick={() => setIsBulkEditOpen(true)}
                  className="p-1 text-[#722F38] hover:bg-[#722F38]/10 rounded transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <div className="w-px h-4 bg-[#722F38]/20 mx-1" />
                <button 
                  onClick={handleBulkDelete}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
                <div className="w-px h-4 bg-[#722F38]/20 mx-1" />
                <button 
                  onClick={() => setSelectedProducts([])}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors flex items-center gap-1.5 text-xs font-bold"
                  title="Cancel selection"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shrink-0 ${filterCategory !== 'All' ? 'bg-[#722F38] text-white border-[#722F38]' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Filter className="w-4 h-4" />
              {filterCategory === 'All' ? 'Filter' : filterCategory}
            </button>
            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95">
                <div className="p-2 border-b border-gray-50 bg-gray-50/50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">Category Filter</span>
                </div>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFilterCategory(cat);
                      setIsFilterMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center justify-between group ${filterCategory === cat ? 'bg-[#722F38]/5 text-[#722F38] font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {cat}
                    {filterCategory === cat && <div className="w-1.5 h-1.5 rounded-full bg-[#722F38]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-8 h-8 text-[#722F38] animate-spin" />
              <p className="text-sm text-gray-500">Loading products...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-[#722F38] focus:ring-[#722F38]"
                    />
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                      Product
                      {sortBy === 'name' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('category')} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                      Category
                      {sortBy === 'category' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('stock')} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                      Variants/Stock
                      {sortBy === 'stock' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('price')} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                      Base Price
                      {sortBy === 'price' && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const variants = product.product_variants || product.variants || [];
                  const totalStock = variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
                  const firstVariant = variants[0];
                  const isSelected = selectedProducts.includes(product.id);
                  
                  return (
                    <tr key={product.id} className={`${isSelected ? 'bg-[#722F38]/5' : 'hover:bg-gray-50/50'} transition-colors group`}>
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelect(product.id)}
                          className="rounded border-gray-300 text-[#722F38] focus:ring-[#722F38]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                            {(product.thumbnail_url || firstVariant?.image_url || firstVariant?.image) && (
                              <img src={product.thumbnail_url || firstVariant.image_url || firstVariant.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900">{product.short_name || product.shortName}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingCell?.id === product.id && editingCell?.field === 'category' ? (
                          <select 
                            autoFocus
                            value={editValue}
                            onChange={e => {
                              setEditValue(e.target.value);
                              handleInlineSave(product.id, 'category', e.target.value);
                            }}
                            onBlur={() => setEditingCell(null)}
                            className="w-full text-xs font-medium bg-white border border-[#722F38] rounded-full px-2 py-0.5 outline-none"
                          >
                            {categories.filter(c => c !== 'All').map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        ) : (
                          <span 
                            onClick={() => { setEditingCell({ id: product.id, field: 'category' }); setEditValue(product.category); }}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-[#722F38]/10 hover:text-[#722F38] cursor-pointer transition-colors"
                          >
                            {product.category}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{variants.length} options</div>
                        <div className={`text-xs ${totalStock < 10 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                          {totalStock} in stock
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{formatPrice(firstVariant?.price ?? 0)}</div>
                        {(firstVariant?.promo_price || firstVariant?.promoPrice) && (
                          <div className="text-xs text-green-600 font-medium">Active Promo</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="p-1.5 text-gray-400 hover:text-[#722F38] bg-white rounded-md shadow-sm border border-gray-200 hover:border-[#722F38]/30 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 bg-white rounded-md shadow-sm border border-gray-200 hover:border-red-200 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                      No products found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

      <BulkEditModal 
        isOpen={isBulkEditOpen}
        onClose={() => setIsBulkEditOpen(false)}
        onSave={handleBulkEdit}
        selectedCount={selectedProducts.length}
      />
    </div>
  );
}
