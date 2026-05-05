import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { Search, Filter, Plus, Edit2, Trash2, Loader2, CheckSquare, X, Archive, RotateCcw, XCircle, ArrowUpCircle } from 'lucide-react';
import { formatPrice } from '../../data/products';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../../utils/api';
import ProductModal from '../../components/admin/ProductModal';
import BulkEditModal from '../../components/admin/BulkEditModal';
import AdminDataTable from '../../components/admin/AdminDataTable';

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
  const [currentTab, setCurrentTab] = useState<'active' | 'archived' | 'trash'>('active');
  
  const categories = ['All', ...allCategories.map(c => c.name)];
  
  const existingTags = useMemo(() => {
    const tags = products.flatMap(p => p.tags || []);
    return Array.from(new Set(tags)).sort();
  }, [products]);
  
  const fetchProducts = async () => {
    setIsLoading(true);
    const [productsData, categoriesData] = await Promise.all([
      getProducts(currentTab),
      getCategories()
    ]);
    setProducts(productsData);
    setAllCategories(categoriesData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentTab]);

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

  const handleBulkTrash = async () => {
    if (window.confirm(`Move ${selectedProducts.length} products to trash?`)) {
      const loadingToast = toast.loading(`Moving to trash...`);
      try {
        await Promise.all(selectedProducts.map(id => deleteProduct(id)));
        toast.success(`${selectedProducts.length} products moved to trash`, { id: loadingToast });
        setSelectedProducts([]);
        fetchProducts();
      } catch (error) {
        toast.error('Failed to move some products to trash', { id: loadingToast });
      }
    }
  };

  const handleBulkArchive = async () => {
    const newStatus = currentTab === 'archived' ? 'active' : 'archived';
    const actionLabel = currentTab === 'archived' ? 'restoring' : 'archiving';
    const loadingToast = toast.loading(`${actionLabel.charAt(0).toUpperCase() + actionLabel.slice(1)} ${selectedProducts.length} products...`);
    try {
      await Promise.all(selectedProducts.map(id => updateProduct(id, { status: newStatus })));
      toast.success(`${selectedProducts.length} products updated`, { id: loadingToast });
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update some products', { id: loadingToast });
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
    const isPermanent = currentTab === 'trash';
    const confirmMsg = isPermanent 
      ? 'Are you sure you want to PERMANENTLY delete this product? This action cannot be undone.' 
      : 'Move this product to trash?';
    
    if (window.confirm(confirmMsg)) {
      const loadingToast = toast.loading(isPermanent ? 'Deleting permanently...' : 'Moving to trash...');
      try {
        const success = await deleteProduct(id);
        if (success) {
          toast.success(isPermanent ? 'Product permanently deleted' : 'Product moved to trash', { id: loadingToast });
          fetchProducts();
        } else {
          toast.error('Failed to delete product', { id: loadingToast });
        }
      } catch (error) {
        toast.error('Error deleting product', { id: loadingToast });
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const loadingToast = toast.loading('Updating status...');
    try {
      await updateProduct(id, { status: newStatus });
      toast.success('Status updated', { id: loadingToast });
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update status', { id: loadingToast });
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

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
        {[
          { id: 'active', label: 'Active', count: null },
          { id: 'archived', label: 'Archived', count: null },
          { id: 'trash', label: 'Trash', count: null }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id as any)}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              currentTab === tab.id 
                ? 'text-[#722F38]' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            {currentTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#722F38]" 
              />
            )}
          </button>
        ))}
      </div>

      <AdminDataTable toolbar={
        <div className="flex items-center justify-between gap-4">
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
                  onClick={handleBulkArchive}
                  className="p-1 text-[#722F38] hover:bg-[#722F38]/10 rounded transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  {currentTab === 'archived' ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                  {currentTab === 'archived' ? 'Restore' : 'Archive'}
                </button>
                <div className="w-px h-4 bg-[#722F38]/20 mx-1" />
                <button 
                  onClick={handleBulkTrash}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  {currentTab === 'trash' ? <XCircle className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                  {currentTab === 'trash' ? 'Delete Permanently' : 'Move to Trash'}
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
      }>

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
                    Tags
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
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="group/product flex w-full items-center gap-4 rounded-lg text-left transition-colors hover:bg-gray-50/80"
                          title="Open product detail"
                        >
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                            {(product.thumbnail_url || firstVariant?.image_url || firstVariant?.image) && (
                              <img src={product.thumbnail_url || firstVariant.image_url || firstVariant.image} alt="" className="h-full w-full object-cover transition-transform group-hover/product:scale-[1.03]" referrerPolicy="no-referrer" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-gray-900 group-hover/product:text-[#722F38]">{product.short_name || product.shortName}</div>
                            <div className="max-w-xs truncate text-xs text-gray-500">{product.name}</div>
                          </div>
                        </button>
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
                        <div className="flex flex-wrap gap-1.5 min-w-[140px]">
                          {(product.tags || []).map((tag: string) => (
                            <button
                              key={tag}
                              onClick={() => {
                                const newTags = (product.tags || []).filter((t: string) => t !== tag);
                                updateProduct(product.id, { tags: newTags }).then(() => fetchProducts());
                                toast.success(`Tag "${tag}" removed`);
                              }}
                              className="group/tag inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-gray-100 text-gray-500 hover:border-red-200 hover:text-red-500 transition-all shadow-sm"
                            >
                              {tag}
                              <X className="w-2.5 h-2.5 opacity-0 group-hover/tag:opacity-100 transition-opacity" />
                            </button>
                          ))}
                          {editingCell?.id === product.id && editingCell?.field === 'tags' ? (
                            <div className="relative">
                              <input
                                autoFocus
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-24 px-2 py-0.5 text-[10px] font-bold border border-[#722F38] rounded-md outline-none"
                                placeholder="Add tag..."
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = editValue.trim();
                                    if (val) {
                                      const newTags = [...(product.tags || []), val];
                                      updateProduct(product.id, { tags: newTags }).then(() => fetchProducts());
                                      setEditingCell(null);
                                      setEditValue('');
                                      toast.success('Tag added');
                                    }
                                  } else if (e.key === 'Escape') {
                                    setEditingCell(null);
                                    setEditValue('');
                                  }
                                }}
                              />
                              {editValue.trim() && (
                                <div className="absolute z-50 left-0 top-full mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden max-h-40 overflow-y-auto animate-in fade-in slide-in-from-top-1">
                                  {existingTags
                                    .filter(t => t.toLowerCase().includes(editValue.toLowerCase()) && !(product.tags || []).includes(t))
                                    .map(tag => (
                                      <button
                                        key={tag}
                                        type="button"
                                        onClick={() => {
                                          const newTags = [...(product.tags || []), tag];
                                          updateProduct(product.id, { tags: newTags }).then(() => fetchProducts());
                                          setEditingCell(null);
                                          setEditValue('');
                                          toast.success('Tag added');
                                        }}
                                        className="w-full px-3 py-2 text-left text-[10px] font-bold text-gray-600 hover:bg-[#722F38]/5 hover:text-[#722F38] transition-colors border-b border-gray-50 last:border-0"
                                      >
                                        {tag}
                                      </button>
                                    ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingCell({ id: product.id, field: 'tags' });
                                setEditValue('');
                              }}
                              className="p-1 text-gray-300 hover:text-[#722F38] hover:bg-[#722F38]/5 rounded-md transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
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
                        <div className="flex items-center justify-end gap-2 opacity-100">
                          {currentTab === 'active' && (
                            <button 
                              onClick={() => handleStatusChange(product.id, 'archived')}
                              className="p-1.5 text-gray-400 hover:text-[#722F38] bg-white rounded-md shadow-sm border border-gray-200 hover:border-[#722F38]/30 transition-all"
                              title="Archive Product"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}
                          {(currentTab === 'archived' || currentTab === 'trash') && (
                            <button 
                              onClick={() => handleStatusChange(product.id, 'active')}
                              className="p-1.5 text-gray-400 hover:text-green-600 bg-white rounded-md shadow-sm border border-gray-200 hover:border-green-200 transition-all"
                              title="Restore to Active"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleEdit(product)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 bg-white rounded-md shadow-sm border border-gray-200 hover:border-blue-200 transition-all"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className={`p-1.5 text-gray-400 hover:text-red-600 bg-white rounded-md shadow-sm border border-gray-200 hover:border-red-200 transition-all`}
                            title={currentTab === 'trash' ? "Delete Permanently" : "Move to Trash"}
                          >
                            {currentTab === 'trash' ? <XCircle className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
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
      </AdminDataTable>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
        onSave={handleSaveProduct}
        product={editingProduct}
        existingTags={existingTags}
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
