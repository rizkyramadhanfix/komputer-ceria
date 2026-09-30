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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  buyShopItem,
  equipShopItem,
  getShopItems,
  unequipShopItem,
} from '../../services/storageService';
import { ShopItem } from '../../types';
import { Avatar } from '../common/Avatar';

export const StarRewardShop: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [activeCategory, setActiveCategory] = useState<'ALL' | 'frame' | 'title' | 'avatar' | 'badge'>('ALL');
  const items = getShopItems();

  if (!currentUser) return null;

  const unlocked = currentUser.unlockedShopItemIds || [];

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

  const handleUnequip = (category: 'frame' | 'title') => {
    unequipShopItem(currentUser.id, category);
    showInfo(`Melepas aksesoris.`, 'Kustomisasi Profil');
    refreshUser();
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
            Kumpulkan bintang dari latihan materi, kuis, dan ketik untuk membeli bingkai neon emas dan gelar prestasimu!
          </p>
        </div>

        {/* Current Star Balance Badge */}
        <div className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-2xl shadow-lg shadow-amber-500/20 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
            <Star className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-white/80 block leading-none">
              Saldo Bintang Kamu:
            </span>
            <span className="text-lg font-black font-mono">
              {currentUser.totalStars} ★ Bintang
            </span>
          </div>
        </div>
      </div>

      {/* Live Avatar Preview Deck */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`relative p-1 rounded-full transition-all ${
              currentUser.equippedFrame === 'frame-gold'
                ? 'ring-4 ring-amber-400 shadow-lg shadow-amber-500/40'
                : currentUser.equippedFrame === 'frame-neon'
                ? 'ring-4 ring-cyan-400 shadow-lg shadow-cyan-500/40 animate-pulse'
                : currentUser.equippedFrame === 'frame-fire'
                ? 'ring-4 ring-rose-500 shadow-lg shadow-rose-500/40'
                : currentUser.equippedFrame === 'frame-cyber'
                ? 'ring-4 ring-emerald-400 shadow-lg shadow-emerald-500/40 animate-pulse'
                : currentUser.equippedFrame === 'frame-rainbow'
                ? 'ring-4 ring-purple-500 shadow-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500'
                : ''
            }`}
          >
            <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="lg" />
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {currentUser.name}
              </h3>
              {currentUser.equippedTitle && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-xs">
                  {currentUser.equippedTitle}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentUser.grade || 'Siswa'} · {currentUser.school || 'Sekolah Terdaftar'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.equippedFrame && (
            <button
              type="button"
              onClick={() => handleUnequip('frame')}
              className="px-2.5 py-1 text-[11px] border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg"
            >
              Lepas Bingkai
            </button>
          )}
          {currentUser.equippedTitle && (
            <button
              type="button"
              onClick={() => handleUnequip('title')}
              className="px-2.5 py-1 text-[11px] border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg"
            >
              Lepas Gelar
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
          👑 Bingkai Avatar
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
          🎖️ Gelar Prestasi
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
          🎖️ Lencana Profil
        </button>
      </div>

      {/* Shop Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isOwned = unlocked.includes(item.id);
          const isEquipped =
            item.category === 'frame'
              ? currentUser.equippedFrame === item.id
              : currentUser.equippedTitle === item.titleBadge;

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
    </div>
  );
};
