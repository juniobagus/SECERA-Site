import { useState } from 'react';
import { Save, Globe } from 'lucide-react';
import { initialCMSContent } from '../../data/cms';

export default function AdminCMS() {
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState(initialCMSContent);

  const handleSave = () => {
    setIsSaving(true);
    // In a real app, we would save to backend here
    setTimeout(() => {
      setIsSaving(false);
      alert('CMS Content saved successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Content Management System</h1>
          <p className="text-sm text-gray-500">Manage your site text, hero sections, and FAQ.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#722F38] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#5a252d] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save CMS Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {/* CMS: Hero Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#722F38]" />
            <h2 className="text-lg font-bold text-gray-900">Hero Section</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
              <input 
                type="text" 
                value={content.hero.title} 
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
              <textarea 
                rows={2}
                value={content.hero.subtitle} 
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
              />
            </div>
          </div>
        </div>

        {/* CMS: FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#722F38]" />
            <h2 className="text-lg font-bold text-gray-900">FAQ Section</h2>
          </div>
          <div className="p-6 space-y-6">
            {content.faq.items.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question {index + 1}</label>
                  <input 
                    type="text" 
                    value={item.question} 
                    onChange={(e) => {
                      const newItems = [...content.faq.items];
                      newItems[index].question = e.target.value;
                      setContent({ ...content, faq: { ...content.faq, items: newItems } });
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Answer</label>
                  <textarea 
                    rows={2}
                    value={item.answer} 
                    onChange={(e) => {
                      const newItems = [...content.faq.items];
                      newItems[index].answer = e.target.value;
                      setContent({ ...content, faq: { ...content.faq, items: newItems } });
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none bg-white resize-none" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global CTA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#722F38]" />
            <h2 className="text-lg font-bold text-gray-900">Global CTA (WhatsApp Promo)</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Title</label>
              <input 
                type="text" 
                value={content.cta.title} 
                onChange={(e) => setContent({ ...content, cta: { ...content.cta, title: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA Description</label>
              <textarea 
                rows={2}
                value={content.cta.description} 
                onChange={(e) => setContent({ ...content, cta: { ...content.cta, description: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#722F38] outline-none resize-none" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
