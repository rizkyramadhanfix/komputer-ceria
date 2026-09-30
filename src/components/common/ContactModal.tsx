import React, { useState, useEffect } from 'react';
import {
  Building,
  Clock,
  ExternalLink,
  Globe,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  School,
  Send,
  X,
  Youtube,
} from 'lucide-react';
import { getContactInfo } from '../../services/storageService';
import { ContactInfoConfig } from '../../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPage?: boolean;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  isPage = false,
}) => {
  const [contactInfo, setContactInfo] = useState<ContactInfoConfig>(() =>
    getContactInfo()
  );

  useEffect(() => {
    if (isOpen || isPage) {
      setContactInfo(getContactInfo());
    }
  }, [isOpen, isPage]);

  // Sync real-time storage updates
  useEffect(() => {
    const handleUpdate = () => {
      if (isOpen || isPage) {
        setContactInfo(getContactInfo());
      }
    };
    window.addEventListener('ekskul_data_updated', handleUpdate);
    return () => window.removeEventListener('ekskul_data_updated', handleUpdate);
  }, [isOpen, isPage]);

  const waCleanNumber = (contactInfo.phoneSecondary || contactInfo.phonePrimary || '')
    .replace(/[^0-9]/g, '')
    .replace(/^0/, '62');

  if (isPage) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Full Page Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded">
                Halaman Publik
              </span>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Layanan Informasi & Kontak Resmi
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Hubungi pengelola ekstrakurikuler komputer atau temukan detail sekretariat kami.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5 font-sans"
          >
            <span>← Kembali ke Beranda</span>
          </button>
        </div>

        {/* Two-Column Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          {/* LEFT COLUMN: Sambutan & Tombol Cepat */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <Building className="w-4 h-4 text-indigo-500" />
                <span>{contactInfo.schoolName || 'Pusat Ekstrakurikuler Komputer Ceria'}</span>
              </div>
              <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white">
                Hubungi Tim Pengelola & Guru Pembina
              </h2>
            </div>

            {/* Editable Description Message */}
            {contactInfo.descriptionText && (
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40 text-xs md:text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed font-medium space-y-2">
                <div className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  💬 Sambutan Pengelola:
                </div>
                <p className="whitespace-pre-line text-slate-700 dark:text-slate-200 font-normal">
                  {contactInfo.descriptionText}
                </p>
              </div>
            )}

            {/* Quick Action Grid */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Pilih Jalur Chat Cepat:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WhatsApp Chat Button */}
                {waCleanNumber && (
                  <a
                    href={`https://wa.me/${waCleanNumber}?text=Halo%20Admin%20Ekstrakurikuler%20Komputer,%20saya%20ingin%20bertanya`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all flex items-center gap-3.5 group shadow-xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/10">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block leading-none">
                        WhatsApp Hub
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate block mt-1.5">
                        {contactInfo.phoneSecondary || contactInfo.phonePrimary}
                      </span>
                    </div>
                  </a>
                )}

                {/* Email Button */}
                {contactInfo.email && (
                  <a
                    href={`mailto:${contactInfo.email}?subject=Tanya%20Ekskul%20Komputer`}
                    className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-all flex items-center gap-3.5 group shadow-xs"
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/10">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-extrabold text-sky-700 dark:text-sky-300 uppercase tracking-wider block leading-none">
                        Kirim Email
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate block mt-1.5 font-mono">
                        {contactInfo.email}
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Informasi Detail Sekretariat & Jam Operasional */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800">
              Detail Sekretariat & Lab
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block leading-none">
                    Nomor Telepon Kantor
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm mt-1 block">
                    {contactInfo.phonePrimary || '-'}
                  </span>
                  {contactInfo.phoneSecondary && (
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Kontak Sekunder: {contactInfo.phoneSecondary}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-50 dark:bg-rose-950/60 rounded-xl border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block leading-none mb-1">
                    Alamat Lengkap Kantor & Lab Komputer
                  </span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    {contactInfo.address || '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/60 rounded-xl border border-amber-100 dark:border-amber-800 text-amber-600 dark:text-amber-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block leading-none mb-1">
                    Jam Operasional Layanan
                  </span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {contactInfo.operationalHours || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            {(contactInfo.socialIg || contactInfo.socialYt) && (
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                  Media Sosial Resmi:
                </span>
                <div className="flex flex-col gap-2 text-xs">
                  {contactInfo.socialIg && (
                    <a
                      href={`https://instagram.com/${contactInfo.socialIg.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-pink-500" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {contactInfo.socialIg}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-500 transition-colors" />
                    </a>
                  )}

                  {contactInfo.socialYt && (
                    <a
                      href={`https://youtube.com/results?search_query=${encodeURIComponent(contactInfo.socialYt)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-rose-600" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {contactInfo.socialYt}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/80 dark:bg-indigo-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded">
                Layanan Informasi Publik
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                Kontak & Bantuan Ekstrakurikuler
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-lg cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Main Institution Title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <Building className="w-4 h-4 text-indigo-500" />
              <span>{contactInfo.schoolName || 'Pusat Ekstrakurikuler Komputer Ceria'}</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Hubungi Tim Pengelola & Pembina
            </h2>
          </div>

          {/* EDITABLE DESCRIPTION TEXT BLOCK */}
          {contactInfo.descriptionText && (
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-950 dark:text-indigo-200 space-y-1.5 leading-relaxed">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <span>💬 Pesan & Informasi Pengelola:</span>
              </div>
              <p className="whitespace-pre-line font-medium text-slate-700 dark:text-slate-200">
                {contactInfo.descriptionText}
              </p>
            </div>
          )}

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* WhatsApp Chat Button */}
            {waCleanNumber && (
              <a
                href={`https://wa.me/${waCleanNumber}?text=Halo%20Admin%20Ekstrakurikuler%20Komputer,%20saya%20ingin%20bertanya`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
                    Chat WhatsApp
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                    {contactInfo.phoneSecondary || contactInfo.phonePrimary}
                  </span>
                </div>
              </a>
            )}

            {/* Email Button */}
            {contactInfo.email && (
              <a
                href={`mailto:${contactInfo.email}?subject=Tanya%20Ekskul%20Komputer`}
                className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider block">
                    Kirim Email Resmi
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                    {contactInfo.email}
                  </span>
                </div>
              </a>
            )}
          </div>

          {/* Contact Details List */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Nomor Telepon Sekretariat
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {contactInfo.phonePrimary || '-'}
                </span>
                {contactInfo.phoneSecondary && (
                  <span className="text-slate-500 dark:text-slate-400 ml-2">
                    ({contactInfo.phoneSecondary})
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Alamat Sekretariat & Laboratorium
                </span>
                <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                  {contactInfo.address || '-'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Jam Operasional Layanan
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {contactInfo.operationalHours || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Tutup Kontak
          </button>
        </div>
      </div>
    </div>
  );
};
