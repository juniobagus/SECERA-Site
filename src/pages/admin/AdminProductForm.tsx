import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProductById, getCategories } from '../../utils/api';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    description: '',
    category_id: '',
    thumbnail_url: '',
  });

  const [variants, setVariants] = useState<any[]>([
    { sku: '', color: '', option_name: '', price: 0, stock: 0, is_bundle: false, image_url: '' }
  ]);

  const [images, setImages] = useState([{ url: '' }]);

  useEffect(() => {
    const init = async () => {
      await loadCategories();
      if (isEdit && id) {
        await loadProduct(id);
      }
    };
    init();
  }, [id]);

  const loadCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const loadProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      const product = await getProductById(productId);
      if (product) {
        setFormData({
          name: product.name || '',
          short_name: product.short_name || '',
          description: product.description || '',
          category_id: product.category_id || '',
          thumbnail_url: product.thumbnail_url || '',
        });
        
        if (product.product_variants && product.product_variants.length > 0) {
          setVariants(product.product_variants.map((v: any) => ({
            sku: v.sku,
            color: v.color || '',
            option_name: v.option_name || '',
            price: Number(v.price),
            stock: v.stock,
            is_bundle: v.is_bundle,
            image_url: v.image_url || ''
          })));
        }

        if (product.product_images && product.product_images.length > 0) {
          setImages(product.product_images.map((img: any) => ({ url: img.image_url })));
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Failed to load product', err);
      setError('Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, { sku: '', color: '', option_name: '', price: 0, cost_price: 0, stock: 0, is_bundle: false, image_url: '' }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleAddImage = () => {
    setImages([...images, { url: '' }]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = { url };
    setImages(newImages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (isEdit && id) {
        await updateProduct(id, formData, variants, images);
      } else {
        await createProduct(formData, variants, images);
      }
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#722F38] mb-4" />
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/products" className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-sm text-gray-500">{isEdit ? 'Update product information and inventory.' : 'Create a new product with variations and images.'}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] focus:ring-1 focus:ring-[#722F38] outline-none"
                placeholder="e.g. Scarf Paris Premium Silk"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Name (for display) *</label>
              <input
                type="text"
                required
                value={formData.short_name}
                onChange={e => setFormData({ ...formData, short_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] focus:ring-1 focus:ring-[#722F38] outline-none"
                placeholder="e.g. Scarf Paris"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                required
                value={formData.category_id}
                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] focus:ring-1 focus:ring-[#722F38] outline-none bg-white"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Thumbnail URL</label>
              <input
                type="url"
                value={formData.thumbnail_url}
                onChange={e => setFormData({ ...formData, thumbnail_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] focus:ring-1 focus:ring-[#722F38] outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] focus:ring-1 focus:ring-[#722F38] outline-none resize-y"
              placeholder="Detailed product description..."
            />
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-gray-900">Image Gallery</h2>
            <button type="button" onClick={handleAddImage} className="text-sm font-medium text-[#722F38] hover:text-[#5a252d] flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Image
            </button>
          </div>
          
          <div className="space-y-3">
            {images.map((img, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="url"
                    value={img.url}
                    onChange={e => handleImageChange(index, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none text-sm"
                    placeholder="Image URL..."
                  />
                </div>
                {images.length > 1 && (
                  <button type="button" onClick={() => handleRemoveImage(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-0.5">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Variations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h2 className="text-lg font-bold text-gray-900">Variations & Stock</h2>
            <button type="button" onClick={handleAddVariant} className="text-sm font-medium text-[#722F38] hover:text-[#5a252d] flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Variant
            </button>
          </div>

          <div className="space-y-6">
            {variants.map((variant, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                {variants.length > 1 && (
                  <button type="button" onClick={() => handleRemoveVariant(index)} className="absolute -top-3 -right-3 p-1.5 bg-white border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-full shadow-sm transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">SKU *</label>
                    <input type="text" required value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-md focus:border-[#722F38] outline-none text-sm bg-white" placeholder="e.g. IN-B-M" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
                    <input type="text" value={variant.color} onChange={e => handleVariantChange(index, 'color', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-md focus:border-[#722F38] outline-none text-sm bg-white" placeholder="e.g. Black" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Option / Size</label>
                    <input type="text" value={variant.option_name} onChange={e => handleVariantChange(index, 'option_name', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-md focus:border-[#722F38] outline-none text-sm bg-white" placeholder="e.g. Size M" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Selling Price (Rp) *</label>
                    <input type="number" required min="0" value={variant.price} onChange={e => handleVariantChange(index, 'price', Number(e.target.value))} className="w-full px-3 py-1.5 border border-gray-200 rounded-md focus:border-[#722F38] outline-none text-sm bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Cost Price (HPP) *</label>
                    <input type="number" required min="0" value={variant.cost_price || 0} onChange={e => handleVariantChange(index, 'cost_price', Number(e.target.value))} className="w-full px-3 py-1.5 border border-gray-200 rounded-md focus:border-[#722F38] outline-none text-sm bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Stock *</label>
                    <input type="number" required min="0" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', Number(e.target.value))} className="w-full px-3 py-1.5 border border-gray-200 rounded-md focus:border-[#722F38] outline-none text-sm bg-white" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Variant Image URL</label>
                    <input type="url" value={variant.image_url} onChange={e => handleVariantChange(index, 'image_url', e.target.value)} className="w-full px-3 py-1.5 border border-gray-200 rounded-md focus:border-[#722F38] outline-none text-sm bg-white" placeholder="https://..." />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <input type="checkbox" id={`bundle-${index}`} checked={variant.is_bundle} onChange={e => handleVariantChange(index, 'is_bundle', e.target.checked)} className="rounded text-[#722F38] focus:ring-[#722F38]" />
                  <label htmlFor={`bundle-${index}`} className="text-sm text-gray-700">This is a bundle/paket</label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 pt-4">
          <Link to="/admin/products" className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#722F38] text-white font-medium rounded-lg hover:bg-[#5a252d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
