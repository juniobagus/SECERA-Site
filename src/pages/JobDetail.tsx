import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Briefcase, MapPin, Clock, ArrowLeft, Loader2, Upload, Send, CheckCircle2, FileText, Monitor, Phone, Mail, User } from 'lucide-react';
import { getJobById, getJobBySlug, applyForJob, uploadDocument } from '../utils/api';
import { toast } from 'react-hot-toast';
import SEO from '../components/SEO';
import CTAButton from '../components/CTAButton';

export default function JobDetail() {
  // Editorial Job Detail Page Implementation
  const { id, slug, identifier: paramId } = useParams();
  const identifier = paramId || id || slug;
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    resume_url: '',
    portfolio_url: '',
    cover_letter: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        if (identifier) {
          // Try UUID first
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
          let data;
          if (isUuid) {
            data = await getJobById(identifier);
          } else {
            data = await getJobBySlug(identifier);
          }
 
          // Fallback
          if (!data) {
            if (isUuid) data = await getJobBySlug(identifier);
            else data = await getJobById(identifier);
          }
 
          setJob(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [identifier]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File terlalu besar (maks 10MB)');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format CV harus PDF, DOC, atau DOCX');
      return;
    }

    setUploadingResume(true);
    try {
      const url = await uploadDocument(file);
      if (url) {
        setFormData({ ...formData, resume_url: url });
        setResumeFileName(file.name);
        toast.success('CV berhasil diunggah');
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error('Gagal mengunggah CV');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resume_url) {
      toast.error('Silakan unggah CV Anda terlebih dahulu');
      return;
    }

    setIsSubmitting(true);
    try {
      if (identifier) {
        await applyForJob(identifier, formData);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim lamaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <Loader2 className="w-10 h-10 text-[#722F38] animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper p-4">
        <h2 className="text-2xl font-serif text-ink mb-4">Lowongan tidak ditemukan</h2>
        <Link to="/careers" className="text-[#722F38] font-bold uppercase tracking-widest text-sm border-b border-[#722F38]/20 pb-1">Kembali ke Karir</Link>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-20 md:py-28">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl w-full bg-white px-8 py-12 md:px-16 md:py-16 border border-ink/10 text-center"
        >
          <div className="w-24 h-px bg-brand-wine mx-auto mb-10 opacity-25" />
          <div className="mx-auto mb-8 w-12 h-12 border border-brand-wine/30 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-brand-wine" aria-hidden="true" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-ink mb-5">Lamaran Terkirim!</h2>
          <p className="text-ink/65 mb-10 leading-relaxed text-base md:text-lg">
            Terima kasih telah melamar. Tim kami akan meninjau kualifikasi Anda dan menghubungi Anda kembali melalui email jika Anda terpilih untuk tahap selanjutnya.
          </p>
          <CTAButton 
            to="/careers" 
            variant="ink"
          >
            Lihat Lowongan Lain
          </CTAButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pb-32 font-sans">
      <SEO 
        title={job.seo_title || job.title}
        description={job.seo_description || job.description}
        ogImage={job.og_image_url}
        type="article"
      />
      
      {/* Editorial Header */}
      <div className="relative h-[60vh] min-h-[500px] bg-ink overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={job.og_image_url || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop"} 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity scale-105"
            alt=""
          />
          <div className="absolute inset-0 bg-[#261F1F]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-end pb-16">
          <div className="max-w-[1400px] mx-auto px-4 md:px-10 w-full">
            <Link to="/careers" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-[0.4em] mb-12 group w-fit">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-500" />
              Kembali ke Karir
            </Link>
            
            <div className="space-y-8">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block px-5 py-2 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.3em]"
              >
                {job.department}
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-8xl font-serif text-white leading-[0.9] tracking-tight max-w-4xl"
              >
                {job.title}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-x-12 gap-y-4 text-[11px] text-white/60 font-bold uppercase tracking-[0.2em]"
              >
                <span className="flex items-center"><MapPin className="w-3 h-3 mr-3 text-brand-wine" /> {job.location}</span>
                <span className="flex items-center"><Clock className="w-3 h-3 mr-3 text-brand-wine" /> {job.type}</span>
                {job.salary_range && <span className="flex items-center"><span className="mr-3 opacity-40">Salary</span> Rp {job.salary_range}</span>}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-10 mt-32 grid grid-cols-1 lg:grid-cols-12 gap-24">
        {/* Left Column: Job Description */}
        <div className="lg:col-span-7 space-y-24">
          <section className="relative">
            <h3 className="text-[10px] font-bold text-brand-wine uppercase tracking-[0.4em] mb-12 flex items-center">
              <span className="w-12 h-px bg-brand-wine/30 mr-6"></span> Deskripsi Pekerjaan
            </h3>
            <div className="text-ink/80 leading-[1.8] text-xl whitespace-pre-wrap font-medium">
              {job.description}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-bold text-brand-wine uppercase tracking-[0.4em] mb-12 flex items-center">
              <span className="w-12 h-px bg-brand-wine/30 mr-6"></span> Persyaratan Utama
            </h3>
            <div className="text-ink/80 leading-[2] text-lg whitespace-pre-wrap font-medium pl-6 border-l border-ink/5">
              {job.requirements}
            </div>
          </section>

          {job.benefits && (
            <section className="bg-white p-12 border border-ink/5">
              <h3 className="text-[10px] font-bold text-brand-wine uppercase tracking-[0.4em] mb-10 flex items-center">
                <span className="w-12 h-px bg-brand-wine/30 mr-6"></span> Benefit & Fasilitas
              </h3>
              <div className="text-ink/70 leading-[2] text-lg whitespace-pre-wrap font-medium italic">
                {job.benefits}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Application Form */}
        <div className="lg:col-span-5" id="apply">
          <div className="sticky top-32 bg-white p-12 md:p-16 border border-ink/10">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-serif text-ink mb-3 tracking-tight">Formulir Lamaran</h3>
              <p className="text-[10px] text-brand-wine uppercase tracking-[0.3em] font-bold">Lengkapi data diri Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-ink/50 uppercase tracking-[0.2em] flex items-center">
                  Nama Lengkap
                </label>
                <input
                  required
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-6 py-4 bg-paper/50 border-none focus:ring-1 focus:ring-brand-wine/20 transition-all text-sm font-medium"
                  placeholder="Nama Lengkap"
                />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-ink/50 uppercase tracking-[0.2em] flex items-center">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 bg-paper/50 border-none focus:ring-1 focus:ring-brand-wine/20 transition-all text-sm font-medium"
                    placeholder="email@anda.com"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-ink/50 uppercase tracking-[0.2em] flex items-center">
                    WhatsApp
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-6 py-4 bg-paper/50 border-none focus:ring-1 focus:ring-brand-wine/20 transition-all text-sm font-medium"
                    placeholder="0812..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-ink/50 uppercase tracking-[0.2em] flex items-center">
                  Resume / CV (PDF)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full px-6 py-10 border border-dashed transition-all flex flex-col items-center justify-center gap-4 ${
                      formData.resume_url 
                        ? 'bg-brand-wine/[0.03] border-brand-wine/30' 
                        : 'bg-paper/50 border-ink/10 hover:border-brand-wine/20'
                    }`}
                  >
                    {uploadingResume ? (
                      <Loader2 className="w-6 h-6 text-brand-wine animate-spin" />
                    ) : formData.resume_url ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-brand-wine" />
                        <p className="text-[10px] font-bold text-brand-wine uppercase tracking-[0.2em]">CV Siap Dikirim</p>
                        <p className="text-xs text-brand-wine/70 break-all text-center max-w-full">
                          {resumeFileName || formData.resume_url.split('/').pop()}
                        </p>
                        <a
                          href={formData.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-wine underline underline-offset-4"
                        >
                          Preview File
                        </a>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-ink/20" />
                        <p className="text-[10px] font-bold text-ink/30 uppercase tracking-[0.2em]">Unggah CV (Maks 10MB)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-ink/50 uppercase tracking-[0.2em] flex items-center">
                  Link Portfolio (Opsional)
                </label>
                <input
                  type="url"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  className="w-full px-6 py-4 bg-paper/50 border-none focus:ring-1 focus:ring-brand-wine/20 transition-all text-sm font-medium"
                  placeholder="https://behance.net/anda"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-ink/50 uppercase tracking-[0.2em] flex items-center">
                  Surat Lamaran Singkat
                </label>
                <textarea
                  rows={4}
                  value={formData.cover_letter}
                  onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                  className="w-full px-6 py-4 bg-paper/50 border-none focus:ring-1 focus:ring-brand-wine/20 transition-all text-sm font-medium resize-none"
                  placeholder="Ceritakan mengapa Anda tertarik bergabung..."
                />
              </div>

              <CTAButton
                type="submit"
                variant="wine"
                disabled={isSubmitting || uploadingResume}
                className="w-full"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Lamaran'}
              </CTAButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
