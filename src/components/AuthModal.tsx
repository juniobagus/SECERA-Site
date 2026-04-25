import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
  onContinueAsGuest?: () => void;
}

export default function AuthModal({ onClose, onContinueAsGuest }: AuthModalProps) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0); // To force image refresh

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'login') {
        const result = await login(email, password);
        if (!result.success) setError(result.message || 'Login gagal');
      } else {
        if (password.length < 6) {
          setError('Password minimal 6 karakter');
          setLoading(false);
          return;
        }
        const result = await register(email, password, name, phone, captcha);
        if (!result.success) {
          setError(result.message || 'Registrasi gagal');
          refreshCaptcha(); // Refresh on failure
        }
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  function switchTab(newTab: 'login' | 'register') {
    setTab(newTab);
    setError('');
    if (newTab === 'register') {
      refreshCaptcha();
    }
  }

  function refreshCaptcha() {
    setCaptchaUrl(`/api/captcha/generate?t=${Date.now()}`);
    setCaptcha('');
    setCaptchaKey(prev => prev + 1);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.15)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors z-10"
          >
            <X className="w-4 h-4 text-zinc-500" />
          </button>

          {/* Header */}
          <div className="pt-10 pb-6 px-8 text-center">
            <h2 className="text-2xl font-serif text-[#722F38] mb-1">
              {tab === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru'}
            </h2>
            <p className="text-sm text-zinc-400">
              {tab === 'login' ? 'Masuk untuk melihat riwayat pesanan Anda' : 'Daftar untuk checkout lebih cepat'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mx-8 mb-6 bg-zinc-100 rounded-2xl p-1">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                tab === 'login'
                  ? 'bg-white text-[#722F38] shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                tab === 'register'
                  ? 'bg-white text-[#722F38] shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
            {tab === 'register' && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <input
                    type="text"
                    placeholder="Nama lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-zinc-50 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-[#3A3A3A] border border-transparent focus:border-[#722F38]/20 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <input
                    type="tel"
                    placeholder="No. HP / WhatsApp"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-50 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-[#3A3A3A] border border-transparent focus:border-[#722F38]/20 focus:bg-white outline-none transition-all"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-50 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-[#3A3A3A] border border-transparent focus:border-[#722F38]/20 focus:bg-white outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-zinc-50 rounded-2xl pl-11 pr-12 py-3.5 text-sm text-[#3A3A3A] border border-transparent focus:border-[#722F38]/20 focus:bg-white outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {tab === 'register' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="bg-zinc-50 rounded-2xl h-12 flex-1 flex items-center justify-center overflow-hidden border border-zinc-100 cursor-pointer"
                    onClick={refreshCaptcha}
                    title="Klik untuk segarkan captcha"
                  >
                    {captchaUrl && (
                      <img 
                        src={captchaUrl} 
                        alt="Captcha" 
                        className="h-full w-auto object-contain"
                      />
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={refreshCaptcha}
                    className="text-[10px] font-bold text-[#722F38] uppercase tracking-widest hover:underline px-2"
                  >
                    Segarkan
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Masukkan kode di atas"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  required
                  className="w-full bg-zinc-50 rounded-2xl px-4 py-3.5 text-sm text-[#3A3A3A] border border-transparent focus:border-[#722F38]/20 focus:bg-white outline-none transition-all text-center font-bold tracking-widest"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs text-center bg-red-50 rounded-xl py-2.5 px-4"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#722F38] hover:bg-[#5a252d] disabled:opacity-50 text-white text-sm font-bold py-4 rounded-2xl uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : tab === 'login' ? (
                'Masuk'
              ) : (
                'Daftar'
              )}
            </button>

            {/* Guest option */}
            {onContinueAsGuest && (
              <div className="pt-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-zinc-100" />
                  <span className="text-[10px] text-zinc-300 uppercase tracking-widest font-bold">atau</span>
                  <div className="flex-1 h-px bg-zinc-100" />
                </div>
                <button
                  type="button"
                  onClick={onContinueAsGuest}
                  className="w-full text-[#722F38] text-sm font-bold py-3 rounded-2xl border border-[#722F38]/10 hover:bg-[#722F38]/5 transition-all"
                >
                  Lanjut sebagai Tamu
                </button>
              </div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
