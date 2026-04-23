import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { X, Plus, Trash2, Upload, Search, CheckSquare, Edit2, Save } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { getCategories, createCategory } from '../../utils/api';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  product?: any;
}

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [formData, setFormData] = useState<any>({
    name: '',
    short_name: '',
    thumbnail_url: '',
    category_id: '',
    material: 'Ceruty Babydoll Premium',
    weight: 100,
    description: '',
    shopee_link: '',
    tiktok_link: '',
    variants: [{ sku: '', color: '', option_name: '', price: 0, promo_price: 0, stock: 0, image_url: '' }]
  });
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);
  const [bulkEditValues, setBulkEditValues] = useState({ price: '', promo_price: '', stock: '' });
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  const handleBulkDeleteVariants = () => {
    if (window.confirm(`Delete ${selectedVariants.length} variants?`)) {
      const newVariants = formData.variants.filter((_: any, i: number) => !selectedVariants.includes(i));
      setFormData({ 
        ...formData, 
        variants: newVariants.length > 0 ? newVariants : [{ sku: '', color: '', option_name: '', price: 0, promo_price: 0, stock: 0, image_url: '' }]
      });
      setSelectedVariants([]);
      toast.success('Variants removed from list');
    }
  };

  const handleApplyBulkEdit = () => {
    const newVariants = [...formData.variants];
    selectedVariants.forEach(index => {
      if (bulkEditValues.price) newVariants[index].price = parseInt(bulkEditValues.price);
      if (bulkEditValues.promo_price) newVariants[index].promo_price = parseInt(bulkEditValues.promo_price);
      if (bulkEditValues.stock) newVariants[index].stock = parseInt(bulkEditValues.stock);
    });
    setFormData({ ...formData, variants: newVariants });
    setShowBulkEdit(false);
    setBulkEditValues({ price: '', promo_price: '', stock: '' });
    toast.success(`Updated ${selectedVariants.length} variants`);
  };

  const hasInitialized = useRef(false);

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories();
      setCategories(data);
    }
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          id: product.id,
          name: product.name || '',
          short_name: product.short_name || product.shortName || '',
          thumbnail_url: product.thumbnail_url || '',
          category_id: product.category_id || '',
          material: product.material || '',
          weight: product.weight || 100,
          description: product.description || '',
          shopee_link: product.shopee_link || '',
          tiktok_link: product.tiktok_link || '',
          variants: (product.product_variants || product.variants || []).map((v: any) => ({
            sku: v.sku || '',
            color: v.color || '',
            option_name: v.option_name || v.option || '',
            price: v.price || 0,
            promo_price: v.promo_price || v.promoPrice || 0,
            stock: v.stock || 0,
            image_url: v.image_url || v.image || ''
          }))
        });
      } else {
        setFormData({
          name: '',
          short_name: '',
          thumbnail_url: '',
          category_id: categories.length > 0 ? categories[0].id : '',
          material: 'Ceruty Babydoll Premium',
          weight: 100,
          description: '',
          shopee_link: '',
          tiktok_link: '',
          variants: [{ sku: '', color: '', option_name: '', price: 0, promo_price: 0, stock: 0, image_url: '' }]
        });
      }
      setIsAddingNewCategory(false);
      setNewCategoryName('');
      setShowDropdown(false);
      hasInitialized.current = true;
    }
  }, [isOpen, product, categories]);

  // Set default category if empty when categories load
  useEffect(() => {
    if (!product && categories.length > 0 && !formData.category_id) {
      setFormData(prev => ({ ...prev, category_id: categories[0].id }));
    }
  }, [categories, product]);

  if (!isOpen) return null;

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { sku: '', color: '', option_name: '', price: 0, promo_price: 0, stock: 0, image_url: '' }]
    });
  };

  const handleRemoveVariant = (index: number) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((_: any, i: number) => i !== index)
    });
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalCategoryId = formData.category_id;
    const loadingToast = toast.loading('Saving product...');
    
    try {
      if (isAddingNewCategory && newCategoryName.trim()) {
        const newCat = await createCategory(newCategoryName.trim());
        finalCategoryId = newCat.id;
        toast.success(`Category "${newCategoryName}" created`, { id: loadingToast });
      }
      
      await onSave({ ...formData, category_id: finalCategoryId });
      toast.success('Product saved successfully', { id: loadingToast });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to save product', { id: loadingToast });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Basic Information</h3>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <ImageUpload 
                  label="Product Thumbnail (Main Image)"
                  value={formData.thumbnail_url} 
                  onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
                />
              </div>
              
              <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Product Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Name (Dashboard)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.short_name}
                    onChange={e => setFormData({ ...formData, short_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search or add category..."
                      value={isAddingNewCategory ? newCategoryName : (categories.find(c => c.id === formData.category_id)?.name || '')}
                      onChange={e => {
                        const val = e.target.value;
                        const match = categories.find(c => c.name.toLowerCase() === val.toLowerCase());
                        if (match) {
                          setFormData({ ...formData, category_id: match.id });
                          setIsAddingNewCategory(false);
                          setNewCategoryName('');
                        } else {
                          setIsAddingNewCategory(true);
                          setNewCategoryName(val);
                          setFormData({ ...formData, category_id: '' });
                        }
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => {
                        // Delay blur to allow button clicks
                        setTimeout(() => setShowDropdown(false), 200);
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white"
                    />
                    <div className="absolute right-3 top-2.5 flex items-center gap-1 pointer-events-none text-gray-400">
                      <Search className="w-4 h-4" />
                    </div>

                    {showDropdown && newCategoryName && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        {categories.filter(c => c.name.toLowerCase().includes(newCategoryName.toLowerCase())).map(cat => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, category_id: cat.id });
                              setIsAddingNewCategory(false);
                              setNewCategoryName('');
                              setShowDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between group"
                          >
                            <span className="text-gray-700">{cat.name}</span>
                            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                          </button>
                        ))}
                        {!categories.find(c => c.name.toLowerCase() === newCategoryName.toLowerCase()) && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingNewCategory(true);
                              setShowDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-[#722F38]/5 border-t border-gray-50"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#722F38]/10 flex items-center justify-center">
                                <Plus className="w-3 h-3 text-[#722F38]" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#722F38]">Add New Category</p>
                                <p className="text-xs text-gray-500">Create "{newCategoryName}"</p>
                              </div>
                            </div>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <input 
                  type="text" 
                  value={formData.material}
                  onChange={e => setFormData({ ...formData, material: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (grams)</label>
                <input 
                  type="number" 
                  value={formData.weight}
                  onChange={e => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Marketplace Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shopee Link</label>
                <input 
                  type="url" 
                  value={formData.shopee_link}
                  onChange={e => setFormData({ ...formData, shopee_link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TikTok Link</label>
                <input 
                  type="url" 
                  value={formData.tiktok_link}
                  onChange={e => setFormData({ ...formData, tiktok_link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Product Variants</h3>
                {selectedVariants.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setShowBulkEdit(!showBulkEdit)}
                      className={`text-xs font-bold ${showBulkEdit ? 'text-gray-900 bg-gray-100' : 'text-[#722F38] hover:bg-[#722F38]/5'} px-3 py-1.5 rounded-lg border border-gray-100 transition-all flex items-center gap-2`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      {showBulkEdit ? 'Cancel Bulk Edit' : `Edit Selected (${selectedVariants.length})`}
                    </button>
                    <button 
                      type="button"
                      onClick={handleBulkDeleteVariants}
                      className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <button 
                type="button"
                onClick={handleAddVariant}
                className="text-sm font-medium text-[#722F38] hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Variant
              </button>
            </div>

            {showBulkEdit && (
              <div className="p-4 bg-[#722F38]/5 border border-[#722F38]/20 rounded-xl animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-[#722F38] uppercase tracking-wider flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Bulk Edit {selectedVariants.length} Variants
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">New Price</label>
                    <input 
                      type="number"
                      value={bulkEditValues.price}
                      onChange={e => setBulkEditValues({ ...bulkEditValues, price: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white"
                      placeholder="No Change"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">New Promo Price</label>
                    <input 
                      type="number"
                      value={bulkEditValues.promo_price}
                      onChange={e => setBulkEditValues({ ...bulkEditValues, promo_price: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white"
                      placeholder="No Change"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">New Stock</label>
                    <input 
                      type="number"
                      value={bulkEditValues.stock}
                      onChange={e => setBulkEditValues({ ...bulkEditValues, stock: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white"
                      placeholder="No Change"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={handleApplyBulkEdit}
                    className="h-9 bg-[#722F38] text-white rounded-lg text-sm font-bold hover:bg-[#5a252d] transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Apply to {selectedVariants.length}
                  </button>
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              {formData.variants.map((variant: any, index: number) => (
                <div key={index} className={`p-4 border ${selectedVariants.includes(index) ? 'border-[#722F38]/30 bg-[#722F38]/5' : 'border-gray-100 bg-gray-50/30'} rounded-xl transition-all space-y-4`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={selectedVariants.includes(index)}
                        onChange={() => {
                          setSelectedVariants(prev => 
                            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
                          );
                        }}
                        className="rounded border-gray-300 text-[#722F38] focus:ring-[#722F38]"
                      />
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">VARIANT #{index + 1}</span>
                    </div>
                    {formData.variants.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <ImageUpload 
                        value={variant.image_url || variant.image} 
                        onChange={(url) => handleVariantChange(index, 'image_url', url)}
                        className="h-full"
                      />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">SKU</label>
                        <input 
                          type="text" 
                          required
                          value={variant.sku}
                          onChange={e => handleVariantChange(index, 'sku', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
                        <input 
                          type="text" 
                          value={variant.color}
                          onChange={e => handleVariantChange(index, 'color', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Option (e.g. Size)</label>
                        <input 
                          type="text" 
                          value={variant.option_name || variant.option || ''}
                          onChange={e => handleVariantChange(index, 'option_name', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Normal Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1.5 text-sm text-gray-400">Rp.</span>
                          <input 
                            type="text" 
                            inputMode="numeric"
                            required
                            value={variant.price ? Math.floor(Number(variant.price)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
                            onChange={e => {
                              const val = e.target.value.replace(/\./g, '').replace(/\D/g, '');
                              handleVariantChange(index, 'price', val ? parseInt(val) : 0);
                            }}
                            className="w-full pl-10 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Promo Price (Optional)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1.5 text-sm text-gray-400">Rp.</span>
                          <input 
                            type="text" 
                            inputMode="numeric"
                            value={(variant.promo_price || variant.promoPrice) ? Math.floor(Number(variant.promo_price || variant.promoPrice)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ''}
                            onChange={e => {
                              const val = e.target.value.replace(/\./g, '').replace(/\D/g, '');
                              handleVariantChange(index, 'promo_price', val ? parseInt(val) : 0);
                            }}
                            placeholder="0"
                            className="w-full pl-10 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
                        <input 
                          type="number" 
                          required
                          value={variant.stock}
                          onChange={e => handleVariantChange(index, 'stock', parseInt(e.target.value))}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#722F38] text-white rounded-lg font-medium hover:bg-[#5a252d] transition-colors shadow-sm"
          >
            {product ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
