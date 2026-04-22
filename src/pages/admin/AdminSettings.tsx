import { useState } from 'react';
import { Save, User, Globe, CreditCard } from 'lucide-react';

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
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
