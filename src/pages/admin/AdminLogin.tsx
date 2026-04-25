import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { LayoutDashboard, Lock, Mail, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  
  const { login, verify2FA } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.requires2FA) {
          setTempToken(res.tempToken || '');
          setShow2FA(true);
          toast.success('Masukkan kode 2FA Anda');
        } else {
          toast.success('Login berhasil');
          navigate('/admin');
        }
      } else {
        toast.error(res.message || 'Login gagal');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await verify2FA(tempToken, code);
      if (res.success) {
        toast.success('Verifikasi berhasil');
        navigate('/admin');
      } else {
        toast.error(res.message || 'Kode tidak valid');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6 font-sans selection:bg-[#722F38] selection:text-white">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#722F38]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl shadow-gray-200/50 mb-6 border border-gray-100">
            <LayoutDashboard className="w-8 h-8 text-[#722F38]" />
          </div>
          <h1 className="text-3xl font-serif text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-500 text-sm">Secure access to SECERA management system</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <AnimatePresence mode="wait">
            {!show2FA ? (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@secera.id"
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-[#722F38] outline-none transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Secret Key</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-[#722F38] outline-none transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#722F38] text-white rounded-2xl font-bold hover:bg-[#5a252d] transition-all shadow-xl shadow-[#722F38]/20 flex items-center justify-center gap-2 group disabled:opacity-70 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify Identity
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="2fa"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerify2FA}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">2FA Verification</h2>
                  <p className="text-xs text-gray-500 mt-1">Enter the 6-digit code from your authenticator app</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1 text-center block w-full">Authentication Code</label>
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full px-4 py-5 bg-gray-50 border border-transparent rounded-2xl text-2xl font-bold text-center tracking-[0.5em] focus:bg-white focus:border-indigo-500 outline-none transition-all placeholder:text-gray-200"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Access'}
                </button>

                <button 
                  type="button"
                  onClick={() => setShow2FA(false)}
                  className="w-full py-2 text-gray-400 text-xs hover:text-gray-600 transition-colors"
                >
                  Back to login
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-widest">
          Authorized personnel only • Secure SSL Encryption
        </p>
      </motion.div>
    </div>
  );
}
