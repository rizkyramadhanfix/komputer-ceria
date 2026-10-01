import React, { useState } from 'react';
import {
  Check,
  Crown,
  Flame,
  HelpCircle,
  Lock,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Zap,
  Share2,
  Award,
  X,
  Copy,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  buyShopItem,
  equipShopItem,
  getShopItems,
  unequipShopItem,
  getBadgeForPoints,
  getGamificationConfig,
} from '../../services/storageService';
import { ShopItem } from '../../types';
import { Avatar } from '../common/Avatar';

export const StarRewardShop: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [activeCategory, setActiveCategory] = useState<'ALL' | 'frame' | 'title' | 'avatar' | 'badge'>('ALL');
  const [showShowcaseModal, setShowShowcaseModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const items = getShopItems();
  const gamification = getGamificationConfig();

  if (!currentUser) return null;

  const unlocked = currentUser.unlockedShopItemIds || [];
  const { currentBadge } = getBadgeForPoints(currentUser.totalPoints, gamification);

  const handleBuy = (item: ShopItem) => {
    const res = buyShopItem(currentUser.id, item);
    if (res.success) {
      showSuccess(res.message, 'Toko Bintang');
      refreshUser();
    } else {
      showError(res.message, 'Toko Bintang');
    }
  };

  const handleEquip = (item: ShopItem) => {
    equipShopItem(currentUser.id, item);
    showSuccess(`Memakai ${item.name}!`, 'Kustomisasi Profil');
    refreshUser();
  };

  const handleUnequip = (category: 'frame' | 'title' | 'badge' | 'avatar') => {
    unequipShopItem(currentUser.id, category);
    showInfo(`Melepas aksesoris.`, 'Kustomisasi Profil');
    refreshUser();
  };

  const handleCopyShowcase = () => {
    const text = `🌟 KARTU PRESTASI KOMPUTER CERIA 🌟\nNama: ${currentUser.name}\nSekolah: ${currentUser.school || '-'}\nGelar: ${currentUser.equippedTitle || 'Siswa Berprestasi'}\nLencana: ${currentUser.equippedBadge || currentBadge.label}\nBintang Emas: ${currentUser.totalStars} ★\nTotal Poin: ${currentUser.totalPoints} Poin\nYuk belajar komputer ceria bersama!`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    showSuccess('Teks pencapaian berhasil disalin ke clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const filteredItems = items.filter(
    (it) => activeCategory === 'ALL' || it.category === activeCategory
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <ShoppingBag className="w-4 h-4" />
              Toko Aksesoris & Hadiah Bintang
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500">Tukar Bintang Prestasimu</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Star Reward Shop & Avatar Customizer
          </h2>
          <p className="text-xs text-slate-500">
            Kumpulkan bintang dari latihan materi, kuis, dan ketik untuk membeli bingkai neon emas, avatar siber, dan lencana kehormatan!
          </p>
        </div>

        {/* Action Buttons & Star Balance */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowShowcaseModal(true)}
            className="px-4 py-2.5 rounded-xl bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-500/20 hover:opacity-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Pamerkan Prestasi 🌟</span>
          </button>

          <div className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-2xl shadow-lg shadow-amber-500/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-white/80 block leading-none">
                Saldo Bintang:
              </span>
              <span className="text-base font-black font-mono">
                {currentUser.totalStars} ★
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Avatar Preview Deck */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={currentUser.avatarUrl}
            name={currentUser.name}
            size="lg"
            frame={currentUser.equippedFrame}
          />

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {currentUser.name}
              </h3>
              {currentUser.equippedTitle && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-xs">
                  {currentUser.equippedTitle}
                </span>
              )}
              {currentUser.equippedBadge && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-xs">
                  🎖️ {currentUser.equippedBadge}
                </span>
              )}
              {currentUser.schoolFaction && (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-white text-[10px] font-bold">
                  {currentUser.schoolFaction === 'processor' && '⚡ Tim Prosesor'}
                  {currentUser.schoolFaction === 'graphics' && '🎨 Tim Grafis'}
                  {currentUser.schoolFaction === 'memory' && '🧠 Tim Memori'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentUser.grade || 'Siswa'} · {currentUser.school || 'Sekolah Terdaftar'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentUser.equippedFrame && (
            <button
              type="button"
              onClick={() => handleUnequip('frame')}
              className="px-2.5 py-1 text-[11px] border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg cursor-pointer"
            >
              Lepas Bingkai
            </button>
          )}
          {currentUser.equippedTitle && (
            <button
              type="button"
              onClick={() => handleUnequip('title')}
              className="px-2.5 py-1 text-[11px] border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg cursor-pointer"
            >
              Lepas Gelar
            </button>
          )}
          {currentUser.equippedBadge && (
            <button
              type="button"
              onClick={() => handleUnequip('badge')}
              className="px-2.5 py-1 text-[11px] border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg cursor-pointer"
            >
              Lepas Lencana
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeCategory === 'ALL'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          Semua Item Toko
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('frame')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeCategory === 'frame'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          👑 Bingkai Avatar (Frame)
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('avatar')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeCategory === 'avatar'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          🤖 Avatar Khusus
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('badge')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeCategory === 'badge'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          🎖️ Lencana Profil (Badge)
        </button>
        <button
          type="button"
          onClick={() => setActiveCategory('title')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeCategory === 'title'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          ⚡ Gelar Siswa (Title)
        </button>
      </div>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isOwned = unlocked.includes(item.id);
          const isEquipped =
            item.category === 'frame'
              ? currentUser.equippedFrame === item.id.replace('frame-', '') || currentUser.equippedFrame === item.id
              : item.category === 'title'
              ? currentUser.equippedTitle === (item.titleBadge || item.name)
              : item.category === 'badge'
              ? currentUser.equippedBadge === item.name
              : item.category === 'avatar'
              ? currentUser.equippedAvatar === item.icon
              : false;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                isEquipped
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-400 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shadow-xs">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.category === 'frame'
                        ? 'Bingkai Avatar'
                        : item.category === 'title'
                        ? 'Gelar Siswa'
                        : item.category === 'avatar'
                        ? 'Avatar Khusus'
                        : 'Lencana Profil'}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </h4>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-bold font-mono border border-amber-200 dark:border-amber-800">
                  {item.costStars} ★
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {isOwned ? (
                  isEquipped ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Sedang Dipakai
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleEquip(item)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                    >
                      Pakai Sekarang
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => handleBuy(item)}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Tukar {item.costStars} ★ Bintang</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Pamerkan Kartu Prestasi (Showcase) */}
      {showShowcaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Kartu Pamer Prestasi Siswa
                </h3>
              </div>
              <button
                onClick={() => setShowShowcaseModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual ID Card with Glow */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white shadow-xl border-2 border-indigo-400/40 relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                    KOMPUTER CERIA
                  </span>
                </div>
                <span className="text-xs font-mono text-indigo-300">
                  {currentUser.grade || 'Siswa'}
                </span>
              </div>

              <div className="flex items-center gap-4 py-2">
                <Avatar
                  src={currentUser.avatarUrl}
                  name={currentUser.name}
                  size="xl"
                  frame={currentUser.equippedFrame}
                />
                <div>
                  <h4 className="text-lg font-black text-white leading-tight">
                    {currentUser.name}
                  </h4>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    {currentUser.school || 'Sekolah Terdaftar'}
                  </p>
                  {currentUser.equippedTitle && (
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-linear-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[10px]">
                      👑 {currentUser.equippedTitle}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9px] uppercase text-indigo-300 block">Poin</span>
                  <span className="text-sm font-black font-mono text-amber-300">{currentUser.totalPoints}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9px] uppercase text-indigo-300 block">Bintang</span>
                  <span className="text-sm font-black font-mono text-amber-300">{currentUser.totalStars} ★</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9px] uppercase text-indigo-300 block">Lencana</span>
                  <span className="text-[11px] font-bold text-white truncate block">
                    {currentUser.equippedBadge || currentBadge.label}
                  </span>
                </div>
              </div>

              {currentUser.schoolFaction && (
                <div className="text-center pt-1">
                  <span className="text-[11px] font-bold text-indigo-200">
                    Anggota Fraksi:{' '}
                    <strong className="text-white">
                      {currentUser.schoolFaction === 'processor' && '⚡ Tim Prosesor'}
                      {currentUser.schoolFaction === 'graphics' && '🎨 Tim Grafis'}
                      {currentUser.schoolFaction === 'memory' && '🧠 Tim Memori'}
                    </strong>
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyShowcase}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Tersalin!' : 'Salin Kartu Prestasi'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowShowcaseModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
