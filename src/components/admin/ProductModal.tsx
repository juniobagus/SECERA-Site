import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Reorder } from 'motion/react';
import { X, Plus, Trash2, Upload, Search, CheckSquare, Edit2, Save, FileText, LayoutGrid, GripVertical, Layers, Star, Copy, Globe } from 'lucide-react';
import ImageUpload from './ImageUpload';
import SEOFields from './SEOFields';
import { getCategories, createCategory } from '../../utils/api';

const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  product?: any;
  existingTags?: string[];
}

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [formData, setFormData] = useState<any>({
    name: '',
    short_name: '',
    thumbnail_url: '',
    images: [],
    category_id: '',
    material: 'Ceruty Babydoll Premium',
    weight: 100,
    description: '',
    shopee_link: '',
    tiktok_link: '',
    cms_content: {
      features: { title: 'What\'s in the box', items: [] },
      editorial: { title: 'Features & Details', sections: [] },
      accordions: { material: '', specs: '', shipping: '' },
      size_guide: {
        title: 'Panduan Ukuran',
        description: 'Bandingkan dengan pakaian serupa yang Anda miliki. Ukur lebar dada, lebar bahu, dan panjang lengan di permukaan datar untuk mendapatkan ukuran terbaik.',
        column1_label: 'Dada',
        column2_label: 'Panjang',
        table: []
      }
    },
    variants: [{ id: 'v1', sku: '', color: '', option_name: '', price: 0, promo_price: 0, stock: 0, image_url: '' }],
    tags: [],
    slug: '',
    seo_title: '',
    seo_description: '',
    og_image_url: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);
  const [bulkEditValues, setBulkEditValues] = useState({ price: '', promo_price: '', stock: '' });
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'variants' | 'cms' | 'seo'>('basic');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories();
      setCategories(data);
    }
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
          id: product.id,
          name: product.name || '',
          short_name: product.short_name || product.shortName || '',
          thumbnail_url: product.thumbnail_url || '',
          images: (() => {
            const imgs = product.product_images || product.images || [];
            if (Array.isArray(imgs)) {
              return imgs.map((img: any) => typeof img === 'string' ? img : img.image_url);
            }
            return product.thumbnail_url ? [product.thumbnail_url] : [];
          })(),
          category_id: product.category_id || '',
          material: product.material || '',
          weight: product.weight || 100,
          description: product.description || '',
          shopee_link: product.shopee_link || '',
          tiktok_link: product.tiktok_link || '',
          variants: (product.product_variants || product.variants || []).map((v: any, i: number) => ({
            id: v.id || generateId(),
            sku: v.sku || '',
            color: v.color || '',
            option_name: v.option_name || v.option || '',
            price: v.price || 0,
            promo_price: v.promo_price || v.promoPrice || 0,
            stock: v.stock || 0,
            image_url: v.image_url || v.image || ''
          })),
          cms_content: {
            features: {
              title: product.cms_content?.features?.title || "What's in the box",
              items: (product.cms_content?.features?.items || []).map((item: any, i: number) => ({
                id: item.id || generateId(),
                title: item.title || '',
                description: item.description || '',
                icon: item.icon || 'Package'
              }))
            },
            editorial: {
              title: product.cms_content?.editorial?.title || 'Features & Details',
              sections: (product.cms_content?.editorial?.sections || []).map((section: any, i: number) => ({
                id: section.id || generateId(),
                title: section.title || '',
                description: section.description || '',
                imageUrl: section.imageUrl || '',
                videoUrl: section.videoUrl || '',
                imagePosition: section.imagePosition || 'right'
              }))
            },
            accordions: {
              material: product.cms_content?.accordions?.material || '',
              specs: product.cms_content?.accordions?.specs || '',
              shipping: product.cms_content?.accordions?.shipping || ''
            },
            size_guide: {
              title: product.cms_content?.size_guide?.title || 'Panduan Ukuran',
              description: product.cms_content?.size_guide?.description || 'Bandingkan dengan pakaian serupa yang Anda miliki. Ukur lebar dada, lebar bahu, dan panjang lengan di permukaan datar untuk mendapatkan ukuran terbaik.',
              column1_label: product.cms_content?.size_guide?.column1_label || 'Dada',
              column2_label: product.cms_content?.size_guide?.column2_label || 'Panjang',
              table: (product.cms_content?.size_guide?.table || []).map((row: any) => ({
                id: row.id || generateId(),
                label: row.label || '',
                dada: row.dada || '',
                panjang: row.panjang || ''
              }))
            }
          },
          slug: product.slug || '',
          seo_title: product.seo_title || '',
          seo_description: product.seo_description || '',
          og_image_url: product.og_image_url || ''
        });
      } else {
        setFormData({
          name: '',
          short_name: '',
          thumbnail_url: '',
          images: [],
          category_id: categories.length > 0 ? categories[0].id : '',
          material: 'Ceruty Babydoll Premium',
          weight: 100,
          description: '',
          shopee_link: '',
          tiktok_link: '',
          cms_content: {
            features: { title: 'What\'s in the box', items: [] },
            editorial: { title: 'Features & Details', sections: [] },
            accordions: { material: '', specs: '', shipping: '' },
            size_guide: {
              title: 'Panduan Ukuran',
              description: 'Bandingkan dengan pakaian serupa yang Anda miliki. Ukur lebar dada, lebar bahu, dan panjang lengan di permukaan datar untuk mendapatkan ukuran terbaik.',
              column1_label: 'Dada',
              column2_label: 'Panjang',
              table: []
            }
          },
          variants: [{ id: generateId(), sku: '', color: '', option_name: '', price: 0, promo_price: 0, stock: 0, image_url: '' }],
          tags: [],
          slug: '',
          seo_title: '',
          seo_description: '',
          og_image_url: ''
        });
      }
      setSelectedVariants([]);
      setShowBulkEdit(false);
      setActiveTab('basic');
    }
  }, [isOpen, product, categories]);

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { id: generateId(), sku: '', color: '', option_name: '', price: 0, promo_price: 0, stock: 0, image_url: '' }]
    });
  };

  const handleDuplicateVariant = (idx: number) => {
    const variant = formData.variants[idx];
    const newVariant = {
      ...variant,
      id: generateId(),
      sku: variant.sku ? `${variant.sku}-copy` : ''
    };
    const newVariants = [...formData.variants];
    newVariants.splice(idx + 1, 0, newVariant);
    setFormData({ ...formData, variants: newVariants });
    toast.success('Variant duplicated');
  };

  const handleDuplicateColorGroup = (colorName: string) => {
    const groupVariants = formData.variants.filter((v: any) => v.color === colorName);
    const duplicatedVariants = groupVariants.map((v: any) => ({
      ...v,
      id: generateId(),
      color: `${v.color} (Copy)`,
      sku: v.sku ? `${v.sku}-copy` : ''
    }));
    setFormData({
      ...formData,
      variants: [...formData.variants, ...duplicatedVariants]
    });
    toast.success(`Color group "${colorName}" duplicated`);
  };

  const handleBulkDeleteVariants = () => {
    if (window.confirm(`Delete ${selectedVariants.length} variants?`)) {
      const newVariants = formData.variants.filter((_: any, i: number) => !selectedVariants.includes(i));
      setFormData({
        ...formData,
        variants: newVariants.length > 0 ? newVariants : [{ id: generateId(), sku: '', color: '', option_name: '', price: 0, promo_price: 0, stock: 0, image_url: '' }]
      });
      setSelectedVariants([]);
      toast.success('Variants removed');
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
    toast.success('Bulk update applied');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving product...');
    try {
      const dataToSave = {
        ...formData,
        images: (formData.images || []).filter((img: string) => img && img.trim() !== '')
      };
      await onSave(dataToSave);
      toast.success('Product saved successfully', { id: loadingToast });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product', { id: loadingToast });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col border border-white/20">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-0.5">SECERA Admin Panel</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 border-b border-gray-100 bg-gray-50/30 p-2">
          {[
            { id: 'basic', label: 'Basic Information', icon: LayoutGrid },
            { id: 'variants', label: 'Inventory & Variants', icon: Layers },
            { id: 'cms', label: 'Page Content (CMS)', icon: FileText },
            { id: 'seo', label: 'SEO Settings', icon: Globe }
          ].map((tab: any) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === tab.id
                ? 'bg-white text-[#722F38] shadow-sm border border-gray-100'
                : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
          {/* BASIC TAB */}
          {activeTab === 'basic' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Product Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-[#722F38] focus:ring-4 focus:ring-[#722F38]/5 outline-none transition-all"
                      placeholder="e.g. SECERA VERSA Multi Style One Set"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Short Name (Storefront)</label>
                    <input
                      type="text"
                      required
                      value={formData.short_name}
                      onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:border-[#722F38] outline-none"
                      placeholder="e.g. VERSA"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                    <button
                      type="button"
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-left flex justify-between items-center transition-all focus:bg-white focus:border-[#722F38]"
                    >
                      <span className={formData.category_id ? 'text-gray-900' : 'text-gray-400'}>
                        {categories.find(c => c.id === formData.category_id)?.name || 'Select Category'}
                      </span>
                      <Search className="w-4 h-4 text-gray-300" />
                    </button>
                    {showDropdown && (
                      <div className="absolute z-30 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              placeholder="Create new..."
                              className="flex-1 px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none focus:border-[#722F38]"
                            />
                            <button
                              type="button"
                              onClick={async () => {
                                if (!newCategoryName) return;
                                const newCat = await createCategory({ name: newCategoryName });
                                setCategories([...categories, newCat]);
                                setFormData({ ...formData, category_id: newCat.id });
                                setNewCategoryName('');
                                setShowDropdown(false);
                                toast.success('Category created');
                              }}
                              className="px-4 py-2 bg-[#722F38] text-white text-[10px] font-bold rounded-xl hover:bg-[#5a252d]"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {categories.map(cat => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, category_id: cat.id });
                                setShowDropdown(false);
                              }}
                              className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${formData.category_id === cat.id ? 'text-[#722F38] font-bold bg-[#722F38]/5' : 'text-gray-600'}`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Material</label>
                      <input
                        type="text"
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Weight (g)</label>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Marketplace Links</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#EE4D2D]/10 flex items-center justify-center shrink-0">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Shopee_logo_transparent_PNG.png" className="w-4 h-4 object-contain" alt="Shopee" />
                        </div>
                        <input
                          type="url"
                          value={formData.shopee_link}
                          onChange={(e) => setFormData({ ...formData, shopee_link: e.target.value })}
                          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none"
                          placeholder="Shopee product link"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center shrink-0">
                          <img src="https://cdn.pixabay.com/photo/2021/06/15/12/28/tiktok-6338430_1280.png" className="w-4 h-4 object-contain" alt="TikTok" />
                        </div>
                        <input
                          type="url"
                          value={formData.tiktok_link}
                          onChange={(e) => setFormData({ ...formData, tiktok_link: e.target.value })}
                          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none"
                          placeholder="TikTok Shop link"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Product Tags (Styles, Collections, etc.)</label>
                <div className="relative">
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-100 rounded-2xl focus-within:bg-white focus-within:border-[#722F38] transition-all min-h-[52px]">
                    {formData.tags?.map((tag: string) => (
                      <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 text-gray-700 text-[10px] font-bold rounded-xl shadow-sm animate-in zoom-in-95">
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => setFormData({ ...formData, tags: formData.tags.filter((t: string) => t !== tag) })} 
                          className="p-0.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && tagInput.trim()) {
                          e.preventDefault();
                          if (!formData.tags?.includes(tagInput.trim())) {
                            setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
                          }
                          setTagInput('');
                        }
                      }}
                      className="flex-1 min-w-[150px] bg-transparent outline-none text-sm placeholder:text-gray-300 px-2"
                      placeholder="Add style (e.g. Ethnic, Modern)..."
                    />
                  </div>
                  
                  {tagInput.trim() && (
                    <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto animate-in fade-in zoom-in-95">
                      <div className="p-2 border-b border-gray-50 bg-gray-50/50">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">Suggestions</span>
                      </div>
                      {existingTags
                        .filter(t => t.toLowerCase().includes(tagInput.toLowerCase()) && !(formData.tags || []).includes(t))
                        .map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, tags: [...(formData.tags || []), tag] });
                              setTagInput('');
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-gray-600 hover:bg-[#722F38]/5 hover:text-[#722F38] transition-colors flex items-center justify-between group"
                          >
                            {tag}
                            <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Product Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:bg-white outline-none resize-none leading-relaxed"
                  placeholder="Describe the product details..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product Gallery</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, images: [...(formData.images || []), ''] })}
                    className="text-xs font-bold text-[#722F38] hover:bg-[#722F38]/5 px-4 py-2 rounded-xl border border-[#722F38]/20 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Add Image
                  </button>
                </div>

                <Reorder.Group
                  axis="x"
                  values={formData.images || []}
                  onReorder={(newImages) => setFormData({ ...formData, images: newImages })}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                >
                  {(formData.images || []).map((img: string, idx: number) => (
                    <Reorder.Item
                      key={idx}
                      value={img}
                      className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm"
                    >
                      <ImageUpload
                        value={img}
                        onChange={(url) => {
                          const newImages = [...formData.images];
                          newImages[idx] = url;
                          const isThumb = formData.thumbnail_url === img;
                          setFormData({
                            ...formData,
                            images: newImages,
                            ...(isThumb ? { thumbnail_url: url } : (formData.thumbnail_url === '' ? { thumbnail_url: url } : {}))
                          });
                        }}
                        aspectRatio={1}
                        className="h-full w-full"
                      />
                      
                      {/* Controls Overlay */}
                      <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, thumbnail_url: img })}
                          title="Set as Thumbnail"
                          className={`p-1.5 rounded-lg border shadow-sm transition-all ${formData.thumbnail_url === img
                            ? 'bg-[#722F38] border-[#722F38] text-white'
                            : 'bg-white border-gray-100 text-gray-400 hover:text-[#722F38] hover:border-[#722F38]/30'
                            }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${formData.thumbnail_url === img ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = formData.images.filter((_: any, i: number) => i !== idx);
                            setFormData({
                              ...formData,
                              images: newImages,
                              ...(formData.thumbnail_url === img ? { thumbnail_url: newImages[0] || '' } : {})
                            });
                          }}
                          title="Delete Image"
                          className="p-1.5 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-500 shadow-sm transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Grab Handle */}
                      <div className="absolute top-2 left-2 p-1 bg-white/80 backdrop-blur-sm rounded-lg border border-white/50 text-gray-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <GripVertical className="w-3.5 h-3.5" />
                      </div>

                      {/* Thumbnail Badge */}
                      {formData.thumbnail_url === img && img && (
                        <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-[#722F38] text-white text-[8px] font-bold uppercase tracking-widest text-center rounded-md shadow-lg z-10">
                          Main Thumbnail
                        </div>
                      )}
                    </Reorder.Item>
                  ))}

                  {(formData.images || []).length === 0 && (
                    <div className="col-span-full py-12 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-gray-400">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-medium">No photos uploaded yet</p>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, images: [''] })}
                        className="text-[10px] font-bold text-[#722F38] uppercase tracking-widest hover:underline"
                      >
                        Start Uploading
                      </button>
                    </div>
                  )}
                </Reorder.Group>
                <p className="text-[10px] text-gray-400 italic mt-2">
                  * Drag and drop to reorder. Use the star icon to select the main display image.
                </p>
              </div>
            </div>
          )}

          {/* VARIANTS TAB */}
          {activeTab === 'variants' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-bold text-gray-900 flex items-center gap-2">
                    Manage Inventory
                    <span className="bg-[#722F38]/10 text-label text-[10px] px-2 py-0.5 rounded-full">{formData.variants.length} Variants</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Set prices and stock levels for each SKU</p>
                </div>
                <div className="flex gap-2">
                  {selectedVariants.length > 0 && (
                    <div className="flex gap-2 mr-2 border-r border-gray-100 pr-4">
                      <button type="button" onClick={() => setShowBulkEdit(true)} className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2 transition-all">
                        <Edit2 className="w-4 h-4" /> Bulk Edit
                      </button>
                      <button type="button" onClick={handleBulkDeleteVariants} className="text-xs font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl flex items-center gap-2 transition-all">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                  <button type="button" onClick={handleAddVariant} className="bg-[#722F38] text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#5a252d] shadow-lg shadow-[#722F38]/20 transition-all active:scale-95">
                    <Plus className="w-4 h-4" /> Add Variant
                  </button>
                </div>
              </div>

              {showBulkEdit && (
                <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-widest flex items-center gap-2">
                      <CheckSquare className="w-4 h-4" /> Bulk Edit Selected
                    </p>
                    <button type="button" onClick={() => setShowBulkEdit(false)} className="text-blue-400 hover:text-blue-600"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-blue-400 uppercase">Price</label>
                      <input type="number" value={bulkEditValues.price} onChange={e => setBulkEditValues({ ...bulkEditValues, price: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-blue-400 uppercase">Promo Price</label>
                      <input type="number" value={bulkEditValues.promo_price} onChange={e => setBulkEditValues({ ...bulkEditValues, promo_price: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-blue-400 uppercase">Stock</label>
                      <input type="number" value={bulkEditValues.stock} onChange={e => setBulkEditValues({ ...bulkEditValues, stock: e.target.value })} className="w-full px-4 py-2.5 bg-white border border-blue-100 rounded-xl text-sm outline-none" />
                    </div>
                  </div>
                  <button type="button" onClick={handleApplyBulkEdit} className="w-full mt-6 py-3 bg-blue-600 text-white text-xs font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/10">Apply Changes</button>
                </div>
              )}

              <div className="space-y-10">
                {Object.entries(
                  formData.variants.reduce((acc: any, variant: any, idx: number) => {
                    const color = variant.color || 'Uncategorized';
                    if (!acc[color]) acc[color] = [];
                    acc[color].push({ ...variant, originalIndex: idx });
                    return acc;
                  }, {})
                ).map(([color, colorVariants]: [string, any]) => (
                  <div key={color} className="space-y-4">
                    <div className="flex items-center gap-4 px-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-200"
                          style={{ 
                            backgroundColor: 
                              color.toLowerCase() === 'black' ? '#1a1a1a' :
                              color.toLowerCase() === 'white' ? '#ffffff' :
                              color.toLowerCase() === 'navy' ? '#000080' :
                              '#cbd5e1'
                          }}
                        />
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{color}</h3>
                      </div>
                      <div className="h-px flex-1 bg-gray-100" />
                      <div className="flex items-center gap-4">
                        <button 
                          type="button" 
                          onClick={() => handleDuplicateColorGroup(color)}
                          className="text-[10px] font-bold text-gray-400 hover:text-[#722F38] uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                        >
                          <Copy className="w-3 h-3" /> Duplicate Group
                        </button>
                        <span className="text-[10px] font-bold text-gray-300 uppercase">{colorVariants.length} Sizes</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {colorVariants.map((variant: any) => {
                        const idx = variant.originalIndex;
                        return (
                          <div
                            key={variant.id}
                            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all relative group"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-4">
                                <input
                                  type="checkbox"
                                  checked={selectedVariants.includes(idx)}
                                  onChange={() => {
                                    setSelectedVariants(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
                                  }}
                                  className="w-4 h-4 rounded border-gray-300 text-[#722F38] focus:ring-[#722F38]"
                                />
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">SKU Reference</span>
                                  <input
                                    type="text"
                                    placeholder="SKU Code"
                                    value={variant.sku}
                                    onChange={(e) => {
                                      const newVariants = [...formData.variants];
                                      newVariants[idx].sku = e.target.value;
                                      setFormData({ ...formData, variants: newVariants });
                                    }}
                                    className="px-3 py-1.5 bg-gray-50 border border-transparent rounded-lg text-xs font-bold focus:bg-white focus:border-[#722F38] outline-none w-48"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button 
                                  type="button" 
                                  onClick={() => handleDuplicateVariant(idx)} 
                                  className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                  title="Duplicate Size"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => {
                                  const newVariants = formData.variants.filter((_: any, i: number) => i !== idx);
                                  setFormData({ ...formData, variants: newVariants });
                                }} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8">
                              <div className="flex-1 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Color Label</label>
                                    <input type="text" value={variant.color} onChange={e => { const v = [...formData.variants]; v[idx].color = e.target.value; setFormData({ ...formData, variants: v }) }} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white outline-none font-medium" placeholder="e.g. Sage" />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Size / Option</label>
                                    <input type="text" value={variant.option_name} onChange={e => { const v = [...formData.variants]; v[idx].option_name = e.target.value; setFormData({ ...formData, variants: v }) }} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white outline-none font-medium" placeholder="e.g. XL" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</label>
                                    <div className="relative">
                                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">Rp</span>
                                      <input type="number" value={variant.price} onChange={e => { const v = [...formData.variants]; v[idx].price = parseInt(e.target.value); setFormData({ ...formData, variants: v }) }} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white outline-none font-bold" />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Promo Price</label>
                                    <div className="relative">
                                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">Rp</span>
                                      <input type="number" value={variant.promo_price} onChange={e => { const v = [...formData.variants]; v[idx].promo_price = parseInt(e.target.value); setFormData({ ...formData, variants: v }) }} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white outline-none font-bold text-[#722F38]" />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stock Level</label>
                                    <input type="number" value={variant.stock} onChange={e => { const v = [...formData.variants]; v[idx].stock = parseInt(e.target.value); setFormData({ ...formData, variants: v }) }} className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:bg-white outline-none font-bold ${variant.stock < 10 ? 'text-orange-500' : 'text-gray-900'}`} />
                                  </div>
                                </div>
                              </div>
                              <div className="w-full md:w-56 shrink-0">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Variant Asset</label>
                                <ImageUpload value={variant.image_url} onChange={url => { const v = [...formData.variants]; v[idx].image_url = url; setFormData({ ...formData, variants: v }) }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* CMS TAB */}
          {activeTab === 'cms' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Info Accordions */}
              <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100 space-y-8">
                <div>
                  <h3 className="text-sm tracking-normal font-bold text-gray-900">Product Information Accordions</h3>
                  <p className="text-xs text-gray-400 mt-1">Details shown in collapsible sections on the product page</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#722F38] uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#722F38]" /> Material & Perawatan
                    </label>
                    <textarea
                      rows={5}
                      value={formData.cms_content.accordions?.material}
                      onChange={e => setFormData({
                        ...formData,
                        cms_content: {
                          ...formData.cms_content,
                          accordions: { ...formData.cms_content.accordions, material: e.target.value }
                        }
                      })}
                      placeholder="Contoh: Dibuat dari Ceruty Babydoll Premium. Disarankan cuci dengan tangan..."
                      className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:border-[#722F38] resize-none leading-relaxed"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#722F38] uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#722F38]" /> Spesifikasi Produk
                    </label>
                    <textarea
                      rows={5}
                      value={formData.cms_content.accordions?.specs}
                      onChange={e => setFormData({
                        ...formData,
                        cms_content: {
                          ...formData.cms_content,
                          accordions: { ...formData.cms_content.accordions, specs: e.target.value }
                        }
                      })}
                      placeholder="Contoh: Berat: 100g. Ukuran: All Size. Panjang Depan: 75cm..."
                      className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:border-[#722F38] resize-none leading-relaxed"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#722F38] uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#722F38]" /> Informasi Pengiriman
                    </label>
                    <textarea
                      rows={5}
                      value={formData.cms_content.accordions?.shipping}
                      onChange={e => setFormData({
                        ...formData,
                        cms_content: {
                          ...formData.cms_content,
                          accordions: { ...formData.cms_content.accordions, shipping: e.target.value }
                        }
                      })}
                      placeholder="Contoh: Pengiriman dilakukan setiap hari Senin-Sabtu. Estimasi 2-4 hari kerja..."
                      className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:border-[#722F38] resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm tracking-normal font-bold text-gray-900">Iconic Features</h3>
                    <p className="text-xs text-gray-400 mt-1">Grid of icons showing product highlights</p>
                  </div>
                  <button type="button" onClick={() => {
                    const newFeatures = { ...formData.cms_content.features };
                    newFeatures.items.push({ id: generateId(), icon: 'Package', title: '', description: '' });
                    setFormData({ ...formData, cms_content: { ...formData.cms_content, features: newFeatures } });
                  }} className="text-xs font-bold text-[#722F38] hover:bg-[#722F38]/5 px-4 py-2 rounded-xl border border-[#722F38]/20 flex items-center gap-2 transition-all">
                    <Plus className="w-4 h-4" /> Add Feature
                  </button>
                </div>

                <Reorder.Group axis="y" values={formData.cms_content.features.items} onReorder={items => setFormData({ ...formData, cms_content: { ...formData.cms_content, features: { ...formData.cms_content.features, items } } })} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.cms_content.features.items.map((item: any, idx: number) => (
                    <Reorder.Item key={item.id} value={item} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="cursor-grab active:cursor-grabbing text-gray-200 group-hover:text-gray-400"><GripVertical className="w-4 h-4" /></div>
                        <button type="button" onClick={() => { const items = formData.cms_content.features.items.filter((_: any, i: number) => i !== idx); setFormData({ ...formData, cms_content: { ...formData.cms_content, features: { ...formData.cms_content.features, items } } }) }} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-1/3">
                          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Icon</label>
                          <select value={item.icon} onChange={e => { const items = [...formData.cms_content.features.items]; items[idx].icon = e.target.value; setFormData({ ...formData, cms_content: { ...formData.cms_content, features: { ...formData.cms_content.features, items } } }) }} className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#722F38]">
                            {['Package', 'Truck', 'Shield', 'Star', 'Layers', 'Gem', 'Sparkles', 'Heart'].map(icon => <option key={icon} value={icon}>{icon}</option>)}
                          </select>
                        </div>
                        <div className="w-2/3">
                          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Title</label>
                          <input type="text" value={item.title} onChange={e => { const items = [...formData.cms_content.features.items]; items[idx].title = e.target.value; setFormData({ ...formData, cms_content: { ...formData.cms_content, features: { ...formData.cms_content.features, items } } }) }} className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#722F38]" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Description</label>
                        <textarea rows={2} value={item.description} onChange={e => { const items = [...formData.cms_content.features.items]; items[idx].description = e.target.value; setFormData({ ...formData, cms_content: { ...formData.cms_content, features: { ...formData.cms_content.features, items } } }) }} className="w-full px-4 py-2 text-sm border border-gray-200 rounded-xl outline-none resize-none focus:border-[#722F38]" />
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>

              {/* Editorial Section */}
              <div className="space-y-6 pt-8 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm tracking-normal font-bold text-gray-900">Editorial Blocks</h3>
                    <p className="text-xs text-gray-400 mt-1">Full-width storytelling sections with text and image</p>
                  </div>
                  <button type="button" onClick={() => {
                    const newEd = { ...formData.cms_content.editorial };
                    newEd.sections.push({ id: generateId(), title: '', description: '', imageUrl: '', videoUrl: '', imagePosition: 'right' });
                    setFormData({ ...formData, cms_content: { ...formData.cms_content, editorial: newEd } });
                  }} className="text-xs font-bold text-[#722F38] hover:bg-[#722F38]/5 px-4 py-2 rounded-xl border border-[#722F38]/20 flex items-center gap-2 transition-all">
                    <Plus className="w-4 h-4" /> Add Block
                  </button>
                </div>

                <Reorder.Group axis="y" values={formData.cms_content.editorial.sections} onReorder={sections => setFormData({ ...formData, cms_content: { ...formData.cms_content, editorial: { ...formData.cms_content.editorial, sections } } })} className="space-y-8">
                  {formData.cms_content.editorial.sections.map((section: any, idx: number) => (
                    <Reorder.Item key={section.id} value={section} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative group space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="cursor-grab active:cursor-grabbing text-gray-200 group-hover:text-gray-400"><GripVertical className="w-5 h-5" /></div>
                        <button type="button" onClick={() => { const sections = formData.cms_content.editorial.sections.filter((_: any, i: number) => i !== idx); setFormData({ ...formData, cms_content: { ...formData.cms_content, editorial: { ...formData.cms_content.editorial, sections } } }) }} className="text-gray-300 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7 space-y-6">
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Block Title</label>
                            <input type="text" value={section.title} onChange={e => { const sections = [...formData.cms_content.editorial.sections]; sections[idx].title = e.target.value; setFormData({ ...formData, cms_content: { ...formData.cms_content, editorial: { ...formData.cms_content.editorial, sections } } }) }} className="w-full px-5 py-3 text-sm border border-gray-100 rounded-2xl outline-none bg-gray-50 focus:bg-white focus:border-[#722F38]" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Description</label>
                            <textarea rows={4} value={section.description} onChange={e => { const sections = [...formData.cms_content.editorial.sections]; sections[idx].description = e.target.value; setFormData({ ...formData, cms_content: { ...formData.cms_content, editorial: { ...formData.cms_content.editorial, sections } } }) }} className="w-full px-5 py-3 text-sm border border-gray-100 rounded-2xl outline-none bg-gray-50 focus:bg-white focus:border-[#722F38] resize-none leading-relaxed" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Video URL (Optional)</label>
                            <input type="text" value={section.videoUrl || ''} onChange={e => { const sections = [...formData.cms_content.editorial.sections]; sections[idx].videoUrl = e.target.value; setFormData({ ...formData, cms_content: { ...formData.cms_content, editorial: { ...formData.cms_content.editorial, sections } } }) }} className="w-full px-5 py-3 text-sm border border-gray-100 rounded-2xl outline-none bg-gray-50 focus:bg-white focus:border-[#722F38]" placeholder="https://.../video.mp4" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Image Position</label>
                            <div className="flex gap-4">
                              {['left', 'right'].map(pos => (
                                <button key={pos} type="button" onClick={() => { const sections = [...formData.cms_content.editorial.sections]; sections[idx].imagePosition = pos; setFormData({ ...formData, cms_content: { ...formData.cms_content, editorial: { ...formData.cms_content.editorial, sections } } }) }} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${section.imagePosition === pos ? 'bg-[#722F38] text-white border-[#722F38]' : 'bg-white text-gray-400 border-gray-100'}`}>{pos.toUpperCase()}</button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="lg:col-span-5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Section Image (Poster)</label>
                          <ImageUpload value={section.imageUrl} onChange={url => { const sections = [...formData.cms_content.editorial.sections]; sections[idx].imageUrl = url; setFormData({ ...formData, cms_content: { ...formData.cms_content, editorial: { ...formData.cms_content.editorial, sections } } }) }} className="h-64" />
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>

              {/* Size Guide Section */}
              <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100 space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Size Guide Table</h3>
                    <p className="text-xs text-gray-400 mt-1">Configure sizing details for the storefront modal</p>
                  </div>
                  <button type="button" onClick={() => {
                    const newGuide = { ...formData.cms_content.size_guide };
                    newGuide.table.push({ id: generateId(), label: '', dada: '', panjang: '' });
                    setFormData({ ...formData, cms_content: { ...formData.cms_content, size_guide: newGuide } });
                  }} className="text-xs font-bold text-[#722F38] hover:bg-[#722F38]/5 px-4 py-2 rounded-xl border border-[#722F38]/20 flex items-center gap-2 transition-all">
                    <Plus className="w-4 h-4" /> Add Row
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Guide Title</label>
                      <input
                        type="text"
                        value={formData.cms_content.size_guide.title}
                        onChange={e => setFormData({
                          ...formData,
                          cms_content: { ...formData.cms_content, size_guide: { ...formData.cms_content.size_guide, title: e.target.value } }
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-[#722F38]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Column 1 Label</label>
                      <input
                        type="text"
                        value={formData.cms_content.size_guide.column1_label}
                        onChange={e => setFormData({
                          ...formData,
                          cms_content: { ...formData.cms_content, size_guide: { ...formData.cms_content.size_guide, column1_label: e.target.value } }
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-[#722F38]"
                        placeholder="e.g. Bust (Dada)"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Column 2 Label</label>
                      <input
                        type="text"
                        value={formData.cms_content.size_guide.column2_label}
                        onChange={e => setFormData({
                          ...formData,
                          cms_content: { ...formData.cms_content, size_guide: { ...formData.cms_content.size_guide, column2_label: e.target.value } }
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-[#722F38]"
                        placeholder="e.g. Length (Panjang)"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Guide Description</label>
                      <input
                        type="text"
                        value={formData.cms_content.size_guide.description}
                        onChange={e => setFormData({
                          ...formData,
                          cms_content: { ...formData.cms_content, size_guide: { ...formData.cms_content.size_guide, description: e.target.value } }
                        })}
                        className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:border-[#722F38]"
                      />
                    </div>
                  </div>

                  <div className="overflow-hidden border border-gray-100 rounded-2xl bg-white">
                    <table className="w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="py-3 px-4 text-left font-bold text-gray-400 uppercase">Size Label</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-400 uppercase">{formData.cms_content.size_guide.column1_label}</th>
                          <th className="py-3 px-4 text-left font-bold text-gray-400 uppercase">{formData.cms_content.size_guide.column2_label}</th>
                          <th className="py-3 px-4 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {formData.cms_content.size_guide.table.map((row: any, idx: number) => (
                          <tr key={row.id}>
                            <td className="p-2">
                              <input
                                type="text"
                                value={row.label}
                                onChange={e => {
                                  const table = [...formData.cms_content.size_guide.table];
                                  table[idx].label = e.target.value;
                                  setFormData({ ...formData, cms_content: { ...formData.cms_content, size_guide: { ...formData.cms_content.size_guide, table } } });
                                }}
                                placeholder="e.g. S"
                                className="w-full px-3 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-[#722F38]/20 border rounded-lg outline-none"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={row.dada}
                                onChange={e => {
                                  const table = [...formData.cms_content.size_guide.table];
                                  table[idx].dada = e.target.value;
                                  setFormData({ ...formData, cms_content: { ...formData.cms_content, size_guide: { ...formData.cms_content.size_guide, table } } });
                                }}
                                placeholder="88 cm"
                                className="w-full px-3 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-[#722F38]/20 border rounded-lg outline-none"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={row.panjang}
                                onChange={e => {
                                  const table = [...formData.cms_content.size_guide.table];
                                  table[idx].panjang = e.target.value;
                                  setFormData({ ...formData, cms_content: { ...formData.cms_content, size_guide: { ...formData.cms_content.size_guide, table } } });
                                }}
                                placeholder="66 cm"
                                className="w-full px-3 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-[#722F38]/20 border rounded-lg outline-none"
                              />
                            </td>
                            <td className="p-2 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  const table = formData.cms_content.size_guide.table.filter((_: any, i: number) => i !== idx);
                                  setFormData({ ...formData, cms_content: { ...formData.cms_content, size_guide: { ...formData.cms_content.size_guide, table } } });
                                }}
                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {formData.cms_content.size_guide.table.length === 0 && (
                      <div className="p-8 text-center text-gray-400 italic">No sizing rows added yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* SEO TAB */}
          {activeTab === 'seo' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SEOFields
                slug={formData.slug}
                setSlug={(slug) => setFormData({ ...formData, slug })}
                seoTitle={formData.seo_title}
                setSeoTitle={(seo_title) => setFormData({ ...formData, seo_title })}
                seoDescription={formData.seo_description}
                setSeoDescription={(seo_description) => setFormData({ ...formData, seo_description })}
                ogImage={formData.og_image_url}
                setOgImage={(og_image_url) => setFormData({ ...formData, og_image_url })}
                titlePlaceholder={formData.name}
              />
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50">
          <button type="button" onClick={onClose} className="px-8 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-200 transition-all">Cancel</button>
          <button type="submit" onClick={handleSubmit} className="px-10 py-3 bg-[#722F38] text-white rounded-2xl text-sm font-bold hover:bg-[#5a252d] shadow-xl shadow-[#722F38]/20 transition-all active:scale-95">
            {product ? 'Update Changes' : 'Publish Product'}
          </button>
        </div>
      </div>
    </div>
  );
}
