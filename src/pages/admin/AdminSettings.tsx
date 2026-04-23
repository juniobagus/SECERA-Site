import { useState, useEffect } from 'react';
import { Save, User, Globe, CreditCard, Tag, Plus, Trash2, Loader2, Edit2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getCategories, createCategory, deleteCategory, updateCategory } from '../../utils/api';

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isLoadingCats, setIsLoadingCats] = useState(false);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  const fetchCategories = async () => {
    setIsLoadingCats(true);
    const data = await getCategories();
    setCategories(data);
    setIsLoadingCats(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('General settings saved!');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">General Settings</h1>
          <p className="text-sm text-gray-500">Configure your store and account preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#722F38] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#5a252d] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
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
                        onChange={() => setSelectedCats(selectedCats.length === categories.length ? [] : categories.map(c => c.id))}
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
                          checked={selectedCats.includes(cat.id)}
                          onChange={() => setSelectedCats(prev => prev.includes(cat.id) ? prev.filter(id => id !== cat.id) : [...prev, cat.id])}
                          className="rounded border-gray-300 text-[#722F38] focus:ring-[#722F38]"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700">
                        {editingCatId === cat.id ? (
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
                            onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name); }}
                            className="p-1.5 text-gray-400 hover:text-[#722F38] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setSelectedCats([cat.id]); handleBulkDeleteCats(); }}
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

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <User className="w-5 h-5 text-[#722F38]" />
            <h2 className="text-lg font-bold text-gray-900">Admin Profile</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
              <input type="text" defaultValue="Secera Admin" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" defaultValue="admin@secera.id" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" />
            </div>
          </div>
        </div>

        {/* Store Config */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#722F38]" />
            <h2 className="text-lg font-bold text-gray-900">Store Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Order Number</label>
              <input type="text" defaultValue="6285750990000" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" placeholder="e.g. 62812..." />
              <p className="text-xs text-gray-400 mt-1">International format without + or spaces.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Currency</label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white">
                <option value="IDR">IDR (Rp)</option>
                <option value="USD">USD ($)</option>
              </select>
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
              <textarea rows={3} defaultValue="Bank BCA&#10;A/N Secera Indonesia&#10;123-456-7890" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
