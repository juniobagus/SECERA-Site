import { useState, useEffect } from 'react';
import { X, Save, Search, Plus } from 'lucide-react';
import { getCategories, createCategory } from '../../utils/api';

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  selectedCount: number;
}

export default function BulkEditModal({ isOpen, onClose, onSave, selectedCount }: BulkEditModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    category_id: '',
    material: '',
  });
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories();
      setCategories(data);
    }
    if (isOpen) {
      loadCategories();
      setFormData({ category_id: '', material: '' });
      setIsAddingNewCategory(false);
      setNewCategoryName('');
      setShowDropdown(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanData: any = {};
    
    let finalCategoryId = formData.category_id;
    
    if (isAddingNewCategory && newCategoryName.trim()) {
      try {
        const newCat = await createCategory(newCategoryName.trim());
        finalCategoryId = newCat.id;
      } catch (error) {
        alert('Failed to create new category');
        return;
      }
    }

    if (finalCategoryId) cleanData.category_id = finalCategoryId;
    if (formData.material) cleanData.material = formData.material;
    
    if (Object.keys(cleanData).length === 0) {
      alert('Please fill at least one field to update.');
      return;
    }
    
    onSave(cleanData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bulk Edit Products</h2>
            <p className="text-xs text-gray-500 mt-0.5">Editing {selectedCount} selected products</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 mb-4">
            Fill only the fields you want to update for all selected products.
          </p>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Category</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Material</label>
            <input 
              type="text" 
              placeholder="e.g. Ceruty Babydoll..."
              value={formData.material}
              onChange={e => setFormData({ ...formData, material: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-[#722F38] text-white rounded-lg font-medium hover:bg-[#5a252d] transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Update All
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
