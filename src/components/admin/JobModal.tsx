import { useState, useEffect } from 'react';
import { X, Loader2, Globe, FileText } from 'lucide-react';
import SEOFields from './SEOFields';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  job?: any;
}

export default function JobModal({ isOpen, onClose, onSave, job }: JobModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    salary_range: '',
    description: '',
    requirements: '',
    benefits: '',
    status: 'active',
    slug: '',
    seo_title: '',
    seo_description: '',
    og_image_url: ''
  });
  const [activeTab, setActiveTab] = useState<'general' | 'seo'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlPrefix, setUrlPrefix] = useState('karir');

  useEffect(() => {
    async function fetchPrefix() {
      try {
        const { getCMSContent } = await import('../../utils/api');
        const careerData = await getCMSContent('career_page');
        if (careerData?.seo?.slug) {
          setUrlPrefix(careerData.seo.slug);
        }
      } catch (err) {
        console.error('Failed to fetch career prefix:', err);
      }
    }
    fetchPrefix();
  }, []);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        department: job.department || '',
        location: job.location || '',
        type: job.type || 'Full-time',
        salary_range: job.salary_range || '',
        description: job.description || '',
        requirements: job.requirements || '',
        benefits: job.benefits || '',
        status: job.status || 'active',
        slug: job.slug || '',
        seo_title: job.seo_title || '',
        seo_description: job.seo_description || '',
        og_image_url: job.og_image_url || ''
      });
    } else {
      setFormData({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        salary_range: '',
        description: '',
        requirements: '',
        benefits: '',
        status: 'active',
        slug: '',
        seo_title: '',
        seo_description: '',
        og_image_url: ''
      });
    }
    setActiveTab('general');
  }, [job, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract'];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-xl font-bold text-gray-900">{job ? 'Edit Lowongan' : 'Tambah Lowongan Baru'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 border-b border-gray-100 bg-gray-50/30 p-2">
          {[
            { id: 'general', label: 'Informasi Lowongan', icon: FileText },
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Judul Posisi</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#722F38] transition-all"
                placeholder="e.g. Senior Fashion Designer"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Departemen</label>
              <input
                required
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#722F38] transition-all"
                placeholder="e.g. Production, Marketing"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lokasi</label>
              <input
                required
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#722F38] transition-all"
                placeholder="e.g. Surabaya, Remote"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipe</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#722F38] transition-all"
              >
                {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rentang Gaji (Opsional)</label>
              <input
                type="text"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#722F38] transition-all"
                placeholder="e.g. 5jt - 8jt"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deskripsi Pekerjaan</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#722F38] transition-all resize-none"
              placeholder="Jelaskan peran dan tanggung jawab posisi ini..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Persyaratan</label>
            <textarea
              required
              rows={4}
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#722F38] transition-all resize-none"
              placeholder="Gunakan tanda hubung (-) untuk list persyaratan..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Benefit (Opsional)</label>
            <textarea
              rows={3}
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#722F38] transition-all resize-none"
              placeholder="Asuransi, Makan Siang, dll..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={() => setFormData({ ...formData, status: 'active' })}
                  className="w-4 h-4 text-[#722F38] focus:ring-[#722F38]"
                />
                <span className="text-sm font-medium text-gray-700">Aktif (Tampil di website)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="closed"
                  checked={formData.status === 'closed'}
                  onChange={() => setFormData({ ...formData, status: 'closed' })}
                  className="w-4 h-4 text-[#722F38] focus:ring-[#722F38]"
                />
                <span className="text-sm font-medium text-gray-700">Tutup (Sembunyi)</span>
              </label>
            </div>
          </div>
          </div>
          )}

          {activeTab === 'seo' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <SEOFields
                slug={formData.slug}
                setSlug={(slug) => setFormData({ ...formData, slug })}
                seoTitle={formData.seo_title}
                setSeoTitle={(seo_title) => setFormData({ ...formData, seo_title })}
                seoDescription={formData.seo_description}
                setSeoDescription={(seo_description) => setFormData({ ...formData, seo_description })}
                ogImage={formData.og_image_url}
                setOgImage={(og_image_url) => setFormData({ ...formData, og_image_url })}
                titlePlaceholder={formData.title}
                urlPrefix={urlPrefix}
              />
            </div>
          )}
        </form>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-[#722F38] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#722F38]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {job ? 'Simpan Perubahan' : 'Terbitkan Lowongan'}
          </button>
        </div>
      </div>
    </div>
  );
}
