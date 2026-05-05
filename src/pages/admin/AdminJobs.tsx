import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { Search, Plus, Edit2, Trash2, Loader2, Briefcase, MapPin, Clock, Users } from 'lucide-react';
import { getAdminJobs, createJob, updateJob, deleteJob } from '../../utils/api';
import JobModal from '../../components/admin/JobModal';
import { useNavigate } from 'react-router-dom';

export default function AdminJobs() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminJobs();
      setJobs(data);
    } catch (error) {
      toast.error('Gagal mengambil data lowongan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSave = async (data: any) => {
    try {
      if (editingJob) {
        await updateJob(editingJob.id, data);
        toast.success('Lowongan berhasil diperbarui');
      } else {
        await createJob(data);
        toast.success('Lowongan berhasil diterbitkan');
      }
      fetchJobs();
    } catch (error) {
      toast.error('Gagal menyimpan lowongan');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus lowongan ini secara permanen?')) {
      try {
        await deleteJob(id);
        toast.success('Lowongan dihapus');
        fetchJobs();
      } catch (error) {
        toast.error('Gagal menghapus lowongan');
      }
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Karir</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola lowongan pekerjaan dan proses rekrutmen Secera.</p>
        </div>
        <button
          onClick={() => {
            setEditingJob(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#722F38] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#722F38]/20 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Tambah Lowongan
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari lowongan atau departemen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border-none rounded-xl focus:ring-2 focus:ring-[#722F38] transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/admin/applications')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
            >
              <Users className="w-4 h-4" />
              Lihat Lamaran
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-[#722F38] animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Memuat data...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-20 text-center">
              <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Tidak ada lowongan ditemukan</p>
              <p className="text-sm text-gray-400 mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b border-gray-50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Informasi Posisi</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Tipe & Gaji</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredJobs.map((job) => (
                  <motion.tr 
                    layout
                    key={job.id} 
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-[#722F38] transition-colors">{job.title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                            <Briefcase className="w-3 h-3 mr-1" />
                            {job.department}
                          </span>
                          <span className="flex items-center text-[11px] text-gray-400 font-medium uppercase tracking-wider border-l border-gray-200 pl-3">
                            <MapPin className="w-3 h-3 mr-1" />
                            {job.location}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-widest">
                          <Clock className="w-3 h-3 mr-1" />
                          {job.type}
                        </span>
                        <p className="text-[11px] text-gray-400 font-medium">{job.salary_range || 'Gaji tidak ditampilkan'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          job.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {job.status === 'active' ? 'Aktif' : 'Tutup'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => {
                            setEditingJob(job);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <JobModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingJob(null);
        }}
        onSave={handleSave}
        job={editingJob}
      />
    </div>
  );
}
