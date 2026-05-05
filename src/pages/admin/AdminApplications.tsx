import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, FileUser, Mail, Phone, Calendar, ExternalLink, ChevronRight, X, User, Briefcase, FileText } from 'lucide-react';
import { getAdminApplications, updateApplicationStatus, getApplicationById } from '../../utils/api';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function AdminApplications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminApplications();
      setApplications(data);
    } catch (error) {
      toast.error('Gagal mengambil data lamaran');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleViewDetail = async (id: string) => {
    setIsDetailLoading(true);
    try {
      const data = await getApplicationById(id);
      setSelectedApp(data);
    } catch (error) {
      toast.error('Gagal mengambil detail lamaran');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const success = await updateApplicationStatus(id, newStatus);
      if (success) {
        toast.success(`Status lamaran diperbarui ke ${newStatus}`);
        setApplications(apps => apps.map(a => a.id === id ? { ...a, status: newStatus } : a));
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp({ ...selectedApp, status: newStatus });
        }
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error('Gagal memperbarui status');
    }
  };

  const filteredApps = applications.filter(app => 
    app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors: any = {
    pending: 'bg-yellow-100 text-yellow-700',
    reviewed: 'bg-blue-100 text-blue-700',
    interview: 'bg-purple-100 text-purple-700',
    rejected: 'bg-red-100 text-red-700',
    accepted: 'bg-green-100 text-green-700'
  };

  return (
    <div className="flex h-full gap-8 animate-in fade-in duration-500 overflow-hidden">
      {/* Left List */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Daftar Lamaran</h1>
            <p className="text-xs text-gray-500 mt-1">Lihat dan kelola lamaran yang masuk dari website.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari kandidat atau posisi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#722F38] transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-[#722F38] animate-spin" />
              <p className="text-xs text-gray-400 font-medium">Memuat lamaran...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="py-20 text-center">
              <FileUser className="w-10 h-10 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-sm font-medium">Belum ada lamaran</p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleViewDetail(app.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 group ${
                  selectedApp?.id === app.id 
                    ? 'border-[#722F38] bg-[#722F38]/5 shadow-sm shadow-[#722F38]/10' 
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                  selectedApp?.id === app.id ? 'bg-[#722F38] text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {app.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-bold text-gray-900 truncate">{app.full_name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest shrink-0 ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#722F38] font-bold uppercase tracking-wider mb-1">{app.job_title}</p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                    <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {format(new Date(app.created_at), 'dd MMM yyyy', { locale: localeId })}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedApp?.id === app.id ? 'text-[#722F38] translate-x-1' : 'text-gray-200 group-hover:text-gray-400'}`} />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Detail */}
      <div className="w-[450px] bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {!selectedApp ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                <FileUser className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-gray-500 font-bold">Pilih lamaran</p>
              <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Pilih lamaran dari daftar di samping untuk melihat detail kandidat.</p>
            </div>
          ) : isDetailLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <Loader2 className="w-8 h-8 text-[#722F38] animate-spin" />
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* Detail Header */}
              <div className="p-8 border-b border-gray-50 bg-gray-50/30 shrink-0">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-[#722F38] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-[#722F38]/20">
                    {selectedApp.full_name.charAt(0)}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedApp.status}
                      onChange={(e) => handleStatusUpdate(selectedApp.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest border-none focus:ring-2 focus:ring-[#722F38] shadow-sm cursor-pointer ${statusColors[selectedApp.status]}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="interview">Interview</option>
                      <option value="rejected">Rejected</option>
                      <option value="accepted">Accepted</option>
                    </select>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedApp.full_name}</h2>
                <p className="text-sm text-[#722F38] font-bold uppercase tracking-widest mt-1 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {selectedApp.job_title}
                </p>
                <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">{selectedApp.job_department}</p>
              </div>

              {/* Detail Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center">
                      <Mail className="w-3 h-3 mr-1.5" /> Email
                    </p>
                    <p className="text-xs font-bold text-gray-900 truncate">{selectedApp.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center">
                      <Phone className="w-3 h-3 mr-1.5" /> WhatsApp
                    </p>
                    <p className="text-xs font-bold text-gray-900">{selectedApp.phone}</p>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Dokumen Pendukung</p>
                  <div className="grid grid-cols-1 gap-2">
                    <a 
                      href={selectedApp.resume_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-[#722F38] hover:bg-gray-50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">Curriculum Vitae (CV)</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">PDF / Document</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#722F38]" />
                    </a>

                    {selectedApp.portfolio_url && (
                      <a 
                        href={selectedApp.portfolio_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-[#722F38] hover:bg-gray-50 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <Monitor className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">Portfolio</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Link Eksternal</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#722F38]" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Surat Lamaran</p>
                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap italic">
                      {selectedApp.cover_letter || 'Tidak menyertakan surat lamaran.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
