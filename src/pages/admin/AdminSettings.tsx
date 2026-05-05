import { useState, useEffect, useRef } from 'react';
import { Save, Globe, CreditCard, Tag, Plus, Trash2, Loader2, Edit2, X, MapPin, Search, MessageCircle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  getCategories, createCategory, deleteCategory, updateCategory, 
  getSettings, updateSettings, searchDestination,
  getTags, createTag, updateTag, deleteTag 
} from '../../utils/api';
import SEOFields from '../../components/admin/SEOFields';

interface Suggestion {
  id: number;
  label: string;
}

export default function AdminSettings() {
  const { admin, setup2FA, enable2FA } = useAdminAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isLoadingCats, setIsLoadingCats] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [showSEOModal, setShowSEOModal] = useState(false);
  const [seoTarget, setSeoTarget] = useState<{ type: 'category' | 'tag', item: any } | null>(null);

  // Tags State
  const [tags, setTags] = useState<any[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');

  // Settings State
  const [settings, setSettings] = useState({
    shipping_origin_id: '',
    shipping_origin_name: '',
    whatsapp_number: '',
    bank_account_info: '',
    company_name: '',
    company_address: '',
    instagram_url: '',
    twitter_url: '',
    tiktok_url: '',
    facebook_url: '',
    cdn_base_url: '',
    hero_image_mode: 'compressed',
  });

  // Origin Autocomplete State
  const [originSearch, setOriginSearch] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
    fetchTags();
    fetchSettings();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (originSearch.length >= 3 && originSearch !== settings.shipping_origin_name) {
        setIsSearching(true);
        const results = await searchDestination(originSearch);
        setSuggestions(results);
        setShowSuggestions(true);
        setIsSearching(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [originSearch, settings.shipping_origin_name]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    setIsLoadingCats(true);
    const data = await getCategories();
    setCategories(data);
    setIsLoadingCats(false);
  };

  const fetchTags = async () => {
    setIsLoadingTags(true);
    const data = await getTags();
    setTags(data);
    setIsLoadingTags(false);
  };

  const fetchSettings = async () => {
    const data = await getSettings();
    setSettings({
      shipping_origin_id: data.shipping_origin_id || '',
      shipping_origin_name: data.shipping_origin_name || '',
      whatsapp_number: data.whatsapp_number || '',
      bank_account_info: data.bank_account_info || '',
      company_name: data.company_name || '',
      company_address: data.company_address || '',
      instagram_url: data.instagram_url || '',
      twitter_url: data.twitter_url || '',
      tiktok_url: data.tiktok_url || '',
      facebook_url: data.facebook_url || '',
      cdn_base_url: data.cdn_base_url || '',
      hero_image_mode: data.hero_image_mode || 'compressed',
    });
    setOriginSearch(data.shipping_origin_name || '');
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    const loadingToast = toast.loading('Saving settings...');
    try {
      await updateSettings(settings);
      toast.success('Settings saved successfully!', { id: loadingToast });
    } catch (error) {
      toast.error('Failed to save settings', { id: loadingToast });
    }
    setIsSaving(false);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const loadingToast = toast.loading('Adding category...');
    try {
      await createCategory(newCategory.trim());
      toast.success('Category added', { id: loadingToast });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to add category', { id: loadingToast });
    }
  };

  const handleRenameCategory = async (id: string) => {
    if (!editingCatName.trim()) return;
    const loadingToast = toast.loading('Updating category...');
    try {
      await updateCategory(id, editingCatName.trim());
      toast.success('Category updated', { id: loadingToast });
      setEditingCatId(null);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to update category', { id: loadingToast });
    }
  };

  const handleBulkDeleteCats = async () => {
    if (window.confirm(`Delete ${selectedCats.length} categories?`)) {
      const loadingToast = toast.loading('Deleting categories...');
      try {
        await Promise.all(selectedCats.map(id => deleteCategory(id)));
        toast.success('Categories deleted', { id: loadingToast });
        setSelectedCats([]);
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete some categories', { id: loadingToast });
      }
    }
  };

  const handleSelectOrigin = (s: Suggestion) => {
    setSettings({ ...settings, shipping_origin_id: String(s.id), shipping_origin_name: s.label });
    setOriginSearch(s.label);
    setShowSuggestions(false);
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    const loadingToast = toast.loading('Adding tag...');
    try {
      await createTag(newTag.trim());
      toast.success('Tag added', { id: loadingToast });
      setNewTag('');
      fetchTags();
    } catch (error) {
      toast.error('Failed to add tag', { id: loadingToast });
    }
  };

  const handleRenameTag = async (id: string) => {
    if (!editingTagName.trim()) return;
    const loadingToast = toast.loading('Updating tag...');
    try {
      await updateTag(id, { name: editingTagName.trim() });
      toast.success('Tag updated', { id: loadingToast });
      setEditingTagId(null);
      fetchTags();
    } catch (error) {
      toast.error('Failed to update tag', { id: loadingToast });
    }
  };

  const handleBulkDeleteTags = async () => {
    if (window.confirm(`Delete ${selectedTags.length} tags?`)) {
      const loadingToast = toast.loading('Deleting tags...');
      try {
        await Promise.all(selectedTags.map(id => deleteTag(id)));
        toast.success('Tags deleted', { id: loadingToast });
        setSelectedTags([]);
        fetchTags();
      } catch (error) {
        toast.error('Failed to delete some tags', { id: loadingToast });
      }
    }
  };

  const handleSaveSEO = async (seoData: any) => {
    if (!seoTarget) return;
    const loadingToast = toast.loading('Saving SEO settings...');
    try {
      if (seoTarget.type === 'category') {
        await updateCategory(seoTarget.item.id, { 
          name: seoTarget.item.name,
          slug: seoData.slug,
          seo_title: seoData.title,
          seo_description: seoData.description,
          og_image_url: seoData.ogImage
        });
        fetchCategories();
      } else {
        await updateTag(seoTarget.item.id, { 
          name: seoTarget.item.name,
          slug: seoData.slug,
          seo_title: seoData.title,
          seo_description: seoData.description,
          og_image_url: seoData.ogImage
        });
        fetchTags();
      }
      toast.success('SEO settings saved!', { id: loadingToast });
      setShowSEOModal(false);
    } catch (error) {
      toast.error('Failed to save SEO settings', { id: loadingToast });
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Store Settings</h1>
          <p className="text-sm text-gray-500">Manage your categories, shipping, and store info.</p>
        </div>
        <button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-[#722F38] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#5a252d] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Shipping Origin Config */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#722F38]" />
            <h2 className="text-lg font-bold text-gray-900">Shipping Configuration</h2>
          </div>
          <div className="p-6 space-y-4">
            <div ref={searchRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Origin (City/District)</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={originSearch} 
                  onChange={(e) => {
                    setOriginSearch(e.target.value);
                    if (e.target.value === '') setSettings({ ...settings, shipping_origin_id: '', shipping_origin_name: '' });
                  }}
                  placeholder="Type to search origin location..." 
                  className="w-full px-10 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#722F38] animate-spin" />}
              </div>
              
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto"
                  >
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectOrigin(s)}
                        className="w-full px-4 py-3 text-left hover:bg-[#722F38]/5 flex items-start gap-3 border-b border-gray-50 last:border-0"
                      >
                        <MapPin className="w-4 h-4 text-[#722F38] mt-0.5 shrink-0" />
                        <span className="text-sm font-medium text-gray-700">{s.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="text-xs text-gray-400 mt-2">Current Origin: <span className="font-bold text-[#722F38]">{settings.shipping_origin_name || 'Not set'}</span> (ID: {settings.shipping_origin_id || '-'})</p>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Tag className="w-5 h-5 text-[#722F38]" />
            <h2 className="text-lg font-bold text-gray-900">Company Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input 
                type="text" 
                value={settings.company_name}
                onChange={e => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                placeholder="e.g. PT Secera Indonesia..." 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
              <textarea 
                rows={3}
                value={settings.company_address}
                onChange={e => setSettings({ ...settings, company_address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
                placeholder="Jl. Raya Secera No. 1..." 
              />
            </div>
          </div>
        </div>

        {/* Store Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-[#722F38]" />
            <h2 className="text-lg font-bold text-gray-900">WhatsApp & Contact</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Order Number</label>
              <input 
                type="text" 
                value={settings.whatsapp_number}
                onChange={e => setSettings({ ...settings, whatsapp_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
                placeholder="e.g. 62812..." 
              />
              <p className="text-xs text-gray-400 mt-1">International format without + or spaces (e.g. 6281234567890).</p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#722F38]" />
            <h2 className="text-lg font-bold text-gray-900">Social Media Links</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                <input 
                  type="text" 
                  value={settings.instagram_url}
                  onChange={e => setSettings({ ...settings, instagram_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none text-sm" 
                  placeholder="https://instagram.com/..." 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                <input 
                  type="text" 
                  value={settings.twitter_url}
                  onChange={e => setSettings({ ...settings, twitter_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none text-sm" 
                  placeholder="https://twitter.com/..." 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
                <input 
                  type="text" 
                  value={settings.tiktok_url}
                  onChange={e => setSettings({ ...settings, tiktok_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none text-sm" 
                  placeholder="https://tiktok.com/@..." 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                <input 
                  type="text" 
                  value={settings.facebook_url}
                  onChange={e => setSettings({ ...settings, facebook_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none text-sm" 
                  placeholder="https://facebook.com/..." 
                />
              </div>
            </div>
          </div>
        </div>

        {/* CDN & Media Quality */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#722F38]" />
            <h2 className="text-lg font-bold text-gray-900">CDN & Hero Image</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CDN Base URL (Optional)</label>
              <input
                type="text"
                value={settings.cdn_base_url}
                onChange={e => setSettings({ ...settings, cdn_base_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none text-sm"
                placeholder="https://cdn.yourdomain.com"
              />
              <p className="text-xs text-gray-400 mt-1">Untuk URL media yang dimulai dengan `/uploads/...`.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image Upload Mode</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, hero_image_mode: 'compressed' })}
                  className={`px-4 py-2 rounded-lg text-sm border ${settings.hero_image_mode === 'compressed' ? 'bg-[#722F38] text-white border-[#722F38]' : 'bg-white text-gray-700 border-gray-200'}`}
                >
                  Compressed (Optimized)
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, hero_image_mode: 'original' })}
                  className={`px-4 py-2 rounded-lg text-sm border ${settings.hero_image_mode === 'original' ? 'bg-[#722F38] text-white border-[#722F38]' : 'bg-white text-gray-700 border-gray-200'}`}
                >
                  Original (No Compress)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-[#722F38]" />
            <h2 className="text-lg font-bold text-gray-900">Payment Instructions</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Transfer Details</label>
              <textarea 
                rows={3} 
                value={settings.bank_account_info}
                onChange={e => setSettings({ ...settings, bank_account_info: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
              />
              <p className="text-xs text-gray-400 mt-1">This information will be shown to customers after they place an order.</p>
            </div>
          </div>
        </div>

        {/* Category Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-[#722F38]" />
              <h2 className="text-lg font-bold text-gray-900">Category Management</h2>
            </div>
            {selectedCats.length > 0 && (
              <button 
                onClick={handleBulkDeleteCats}
                className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-all flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected ({selectedCats.length})
              </button>
            )}
          </div>
          <div className="p-6 space-y-6">
            <form onSubmit={handleAddCategory} className="flex gap-3">
              <input 
                type="text" 
                placeholder="New category name..." 
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
              />
              <button 
                type="submit"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </form>

            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedCats.length === categories.length && categories.length > 0}
                        onChange={() => setSelectedCats(selectedCats.length === categories.length ? [] : categories.map(c => String(c.id)))}
                        className="rounded border-gray-300 text-[#722F38] focus:ring-[#722F38]"
                      />
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Category Name</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoadingCats ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center">
                        <Loader2 className="w-5 h-5 text-[#722F38] animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          checked={selectedCats.includes(String(cat.id))}
                          onChange={() => setSelectedCats(prev => prev.includes(String(cat.id)) ? prev.filter(id => id !== String(cat.id)) : [...prev, String(cat.id)])}
                          className="rounded border-gray-300 text-[#722F38] focus:ring-[#722F38]"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700">
                        {editingCatId === String(cat.id) ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={editingCatName}
                              onChange={e => setEditingCatName(e.target.value)}
                              className="px-2 py-1 border border-[#722F38] rounded outline-none text-sm w-full"
                              autoFocus
                            />
                            <button 
                              onClick={() => handleRenameCategory(cat.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setEditingCatId(null)}
                              className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          cat.name
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => {
                              setSeoTarget({ type: 'category', item: cat });
                              setShowSEOModal(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="SEO Settings"
                          >
                            <Globe className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setEditingCatId(String(cat.id)); setEditingCatName(cat.name); }}
                            className="p-1.5 text-gray-400 hover:text-[#722F38] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setSelectedCats([String(cat.id)]); handleBulkDeleteCats(); }}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tag Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plus className="w-5 h-5 text-[#722F38]" />
              <h2 className="text-lg font-bold text-gray-900">Tag/Style Management</h2>
            </div>
            {selectedTags.length > 0 && (
              <button 
                onClick={handleBulkDeleteTags}
                className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-all flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected ({selectedTags.length})
              </button>
            )}
          </div>
          <div className="p-6 space-y-6">
            <form onSubmit={handleAddTag} className="flex gap-3">
              <input 
                type="text" 
                placeholder="New tag name (e.g. Pashmina, Square)..." 
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
              />
              <button 
                type="submit"
                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </form>

            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedTags.length === tags.length && tags.length > 0}
                        onChange={() => setSelectedTags(selectedTags.length === tags.length ? [] : tags.map(t => String(t.id)))}
                        className="rounded border-gray-300 text-[#722F38] focus:ring-[#722F38]"
                      />
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Tag Name</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoadingTags ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center">
                        <Loader2 className="w-5 h-5 text-[#722F38] animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : tags.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-400 text-sm italic">
                        No tags found. Add one above.
                      </td>
                    </tr>
                  ) : tags.map(tag => (
                    <tr key={tag.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <input 
                          type="checkbox" 
                          checked={selectedTags.includes(String(tag.id))}
                          onChange={() => setSelectedTags(prev => prev.includes(String(tag.id)) ? prev.filter(id => id !== String(tag.id)) : [...prev, String(tag.id)])}
                          className="rounded border-gray-300 text-[#722F38] focus:ring-[#722F38]"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700">
                        {editingTagId === String(tag.id) ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              value={editingTagName}
                              onChange={e => setEditingTagName(e.target.value)}
                              className="px-2 py-1 border border-[#722F38] rounded outline-none text-sm w-full"
                              autoFocus
                            />
                            <button 
                              onClick={() => handleRenameTag(tag.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setEditingTagId(null)}
                              className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          tag.name
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => {
                              setSeoTarget({ type: 'tag', item: tag });
                              setShowSEOModal(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            title="SEO Settings"
                          >
                            <Globe className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setEditingTagId(String(tag.id)); setEditingTagName(tag.name); }}
                            className="p-1.5 text-gray-400 hover:text-[#722F38] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setSelectedTags([String(tag.id)]); handleBulkDeleteTags(); }}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* 2FA Security */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className={`w-5 h-5 ${admin?.two_factor_enabled ? 'text-green-600' : 'text-[#722F38]'}`} />
              <h2 className="text-lg font-bold text-gray-900">Account Security (2FA)</h2>
            </div>
            {admin?.two_factor_enabled ? (
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Active
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-100">
                Inactive
              </span>
            )}
          </div>
          <div className="p-6">
            {!admin?.two_factor_enabled ? (
              <TwoFactorSetup setup2FA={setup2FA} enable2FA={enable2FA} />
            ) : (
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">Two-Factor Authentication is Enabled</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Your account is protected with an additional layer of security. You will be prompted for a code from your authenticator app when logging in.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showSEOModal && seoTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">SEO Settings: {seoTarget.item.name}</h2>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Manage Custom Slug & Meta Data</p>
                </div>
                <button onClick={() => setShowSEOModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-8">
                <SEOModalContent 
                  target={seoTarget} 
                  onSave={handleSaveSEO} 
                  onCancel={() => setShowSEOModal(false)} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TwoFactorSetup({ setup2FA, enable2FA }: { setup2FA: any, enable2FA: any }) {
  const [step, setStep] = useState<'initial' | 'qr' | 'verify'>('initial');
  const [qrData, setQrData] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartSetup = async () => {
    setIsSubmitting(true);
    try {
      const data = await setup2FA();
      setQrData(data);
      setStep('qr');
    } catch (err) {
      toast.error('Failed to generate 2FA secret');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    setIsSubmitting(true);
    try {
      const res = await enable2FA(code);
      if (res.success) {
        toast.success('2FA has been enabled!');
      } else {
        toast.error(res.message || 'Invalid code');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {step === 'initial' && (
          <motion.div 
            key="initial"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center py-4"
          >
            <ShieldAlert className="w-12 h-12 text-[#722F38] mb-4 opacity-20" />
            <h3 className="font-bold text-gray-900 mb-2">Secure your account</h3>
            <p className="text-xs text-gray-500 max-w-xs mb-6">
              Add an extra layer of security to your admin account by enabling Time-based One-Time Password (TOTP) authentication.
            </p>
            <button 
              onClick={handleStartSetup}
              disabled={isSubmitting}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Started'}
            </button>
          </motion.div>
        )}

        {step === 'qr' && (
          <motion.div 
            key="qr"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center space-y-6"
          >
            <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-inner">
              {qrData?.qrCodeUrl && <img src={qrData.qrCodeUrl} alt="QR Code" className="w-48 h-48" />}
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-bold text-gray-900">Scan this QR Code</p>
              <p className="text-xs text-gray-500 max-w-xs">
                Scan this with Google Authenticator, Authy, or any TOTP app.
              </p>
            </div>
            <div className="w-full p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-[10px] text-gray-400 uppercase font-bold text-center mb-1">Manual Entry Secret</p>
              <p className="text-sm font-mono text-center text-gray-600 font-bold tracking-wider">{qrData?.secret}</p>
            </div>
            <button 
              onClick={() => setStep('verify')}
              className="w-full py-3 bg-[#722F38] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#722F38]/10"
            >
              Next: Verify Code
            </button>
          </motion.div>
        )}

        {step === 'verify' && (
          <motion.div 
            key="verify"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-sm font-bold text-gray-900">Enter Verification Code</p>
                <p className="text-xs text-gray-500">
                  Enter the 6-digit code currently shown in your authenticator app.
                </p>
              </div>
              <input 
                type="text" 
                maxLength={6}
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-2xl font-bold text-center tracking-[0.5em] focus:bg-white focus:border-[#722F38] outline-none transition-all"
                autoFocus
              />
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setStep('qr')}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || code.length !== 6}
                  className="flex-[2] py-3 bg-gray-900 text-white rounded-xl font-bold text-sm disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Enable 2FA'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SEOModalContent({ target, onSave, onCancel }: { target: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [slug, setSlug] = useState(target.item.slug || '');
  const [seoTitle, setSeoTitle] = useState(target.item.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(target.item.seo_description || '');
  const [ogImage, setOgImage] = useState(target.item.og_image_url || '');

  return (
    <div className="space-y-8">
      <SEOFields
        slug={slug}
        setSlug={setSlug}
        seoTitle={seoTitle}
        setSeoTitle={setSeoTitle}
        seoDescription={seoDescription}
        setSeoDescription={setSeoDescription}
        ogImage={ogImage}
        setOgImage={setOgImage}
        titlePlaceholder={target.item.name}
      />
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave({ slug, title: seoTitle, description: seoDescription, ogImage })}
          className="px-8 py-2.5 bg-[#722F38] text-white rounded-xl font-bold hover:bg-[#5a252d] transition-all shadow-lg shadow-[#722F38]/20"
        >
          Save SEO Settings
        </button>
      </div>
    </div>
  );
}
