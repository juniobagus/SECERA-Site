import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, getMyOrders, getCMSContent } from '../utils/api';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Save, Loader2, Package, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  const { user, setShowAuthModal, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
  });
  const [orderCount, setOrderCount] = useState(0);
  const [waNumber, setWaNumber] = useState('628123456789'); // Default

  useEffect(() => {
    async function loadStats() {
      const orders = await getMyOrders();
      setOrderCount(orders.length);
      
      const cms = await getCMSContent('main_site');
      if (cms?.footer?.phone) {
        setWaNumber(cms.footer.phone);
      }
    }
    loadStats();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        province: user.province || '',
        postal_code: user.postal_code || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profil berhasil diperbarui');
      // Update local context if necessary - here we just assume the next session fetch will handle it
      // or we can manually update the user object if AuthContext supports it
    } catch (error: any) {
      toast.error(error.message || 'Gagal memperbarui profil');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 pt-32">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Silakan Login</h2>
        <p className="text-gray-500 mb-6 text-center max-w-xs">Anda perlu masuk ke akun Anda untuk melihat dan mengelola profil.</p>
        <button 
          onClick={() => setShowAuthModal(true)} 
          className="px-8 py-3 bg-[#722F38] text-white rounded-xl font-bold hover:bg-[#5a252d] transition-all"
        >
          Masuk ke Akun
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-32 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-8"
      >
        {/* Sidebar Info */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-[#722F38]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#722F38] text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
            <div className="mt-6 pt-6 border-t border-gray-50 flex justify-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{orderCount}</div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Pesanan</div>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">Member</div>
                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Status</div>
              </div>
            </div>
          </div>

          <div className="bg-[#722F38] rounded-3xl p-8 text-white shadow-xl shadow-[#722F38]/20">
            <h3 className="font-bold mb-2">Klaim Pesanan</h3>
            <p className="text-xs text-white/70 mb-4 leading-relaxed">Pernah berbelanja sebagai Guest? Klaim pesanan Anda berdasarkan nomor HP yang terdaftar.</p>
            <button 
              onClick={async () => {
                if (!user.phone) {
                  toast.error('Silakan simpan nomor WhatsApp di profil terlebih dahulu');
                  return;
                }
                setIsLoading(true);
                const { claimGuestOrder } = await import('../utils/api');
                const res = await claimGuestOrder(user.phone);
                setIsLoading(false);
                if (res.success) {
                  toast.success(`Berhasil mengklaim ${res.claimed_count} pesanan`);
                  // reload page to fetch orders
                  window.location.reload();
                } else {
                  toast.error(res.message);
                }
              }}
              disabled={isLoading}
              className="w-full py-3 bg-white text-[#722F38] rounded-xl text-xs font-bold hover:bg-gray-100 transition-all block text-center disabled:opacity-70"
            >
              Klaim Sekarang
            </button>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 text-gray-900 shadow-sm border border-gray-100">
            <h3 className="font-bold mb-2">Punya Pertanyaan?</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">Hubungi Customer Service kami jika Anda mengalami kesulitan dalam mengelola akun.</p>
            <a 
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#722F38] text-white rounded-xl text-xs font-bold hover:bg-[#5a252d] transition-all block text-center"
            >
              Hubungi WhatsApp
            </a>
          </div>

          <button 
            onClick={logout}
            className="w-full py-4 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-3xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4" />
            Keluar Akun
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pengaturan Profil</h1>
              <p className="text-sm text-gray-500">Kelola informasi pribadi dan alamat pengiriman Anda.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-[#722F38] outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-[#722F38] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="email" 
                  disabled
                  value={user.email}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-100 border border-transparent rounded-2xl text-sm text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
              <p className="text-[10px] text-gray-400 ml-1 italic">* Email tidak dapat diubah untuk keamanan akun.</p>
            </div>

            <div className="pt-6 border-t border-gray-50 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-900">Alamat Pengiriman</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alamat Lengkap</label>
                <textarea 
                  rows={3}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-[#722F38] outline-none transition-all resize-none leading-relaxed"
                  placeholder="Nama jalan, nomor rumah, RT/RW..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kota/Kabupaten</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-[#722F38] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Provinsi</label>
                  <input 
                    type="text" 
                    value={formData.province}
                    onChange={e => setFormData({...formData, province: e.target.value})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-[#722F38] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Kode Pos</label>
                  <input 
                    type="text" 
                    value={formData.postal_code}
                    onChange={e => setFormData({...formData, postal_code: e.target.value})}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-[#722F38] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-[#722F38] text-white rounded-2xl font-bold hover:bg-[#5a252d] transition-all shadow-xl shadow-[#722F38]/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
