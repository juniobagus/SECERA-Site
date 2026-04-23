import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { CATEGORIES } from '../../data/products';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  product?: any;
}

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = useState<any>({
    name: '',
    short_name: '',
    thumbnail_url: '',
    category: 'Selendang Kebaya',
    material: 'Ceruty Babydoll Premium',
    weight: 100,
    description: '',
    shopee_link: '',
    tiktok_link: '',
    variants: [{ sku: '', color: '', option_name: '', price: 0, stock: 0, image_url: '' }]
  });

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name || '',
        short_name: product.short_name || product.shortName || '',
        thumbnail_url: product.thumbnail_url || '',
        category: product.category || 'Selendang Kebaya',
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
          stock: v.stock || 0,
          image_url: v.image_url || v.image || ''
        }))
      });
      
      // Ensure at least one variant exists
      setFormData((prev: any) => ({
        ...prev,
        variants: prev.variants.length > 0 ? prev.variants : [{ sku: '', color: '', option_name: '', price: 0, stock: 0, image_url: '' }]
      }));
    } else {
      setFormData({
        name: '',
        short_name: '',
        category: 'Selendang Kebaya',
        material: 'Ceruty Babydoll Premium',
        weight: 100,
        description: '',
        shopee_link: '',
        tiktok_link: '',
        variants: [{ sku: '', color: '', option_name: '', price: 0, stock: 0, image_url: '' }]
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { sku: '', color: '', option_name: '', price: 0, stock: 0, image_url: '' }]
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                  >
                    {CATEGORIES.filter(c => c !== 'Semua').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
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
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Product Variants</h3>
              <button 
                type="button"
                onClick={handleAddVariant}
                className="text-sm font-medium text-[#722F38] hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Variant
              </button>
            </div>
            
            <div className="space-y-6">
              {formData.variants.map((variant: any, index: number) => (
                <div key={index} className="p-4 border border-gray-100 rounded-xl bg-gray-50/30 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-400">VARIANT #{index + 1}</span>
                    {formData.variants.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="text-red-400 hover:text-red-600 transition-colors"
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
                          value={variant.option_name || variant.option}
                          onChange={e => handleVariantChange(index, 'option_name', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                        <input 
                          type="number" 
                          required
                          value={variant.price}
                          onChange={e => handleVariantChange(index, 'price', parseInt(e.target.value))}
                          className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
                        />
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
