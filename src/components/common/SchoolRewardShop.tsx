import React, { useState, useEffect } from 'react';
import {
  Gift,
  Sparkles,
  Utensils,
  Award,
  CheckCircle2,
  Clock,
  QrCode,
  Tag,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import {
  SchoolRewardItem,
  RewardRedemption,
  User,
} from '../../types';
import {
  getSchoolRewards,
  getRewardRedemptions,
  redeemReward,
  getActiveUser,
} from '../../services/storageService';

export const SchoolRewardShop: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getActiveUser());
  const [rewards, setRewards] = useState<SchoolRewardItem[]>(() => getSchoolRewards());
  const [myRedemptions, setMyRedemptions] = useState<RewardRedemption[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<RewardRedemption | null>(null);
  const [activeTab, setActiveTab] = useState<'shop' | 'my_vouchers'>('shop');
  const [notice, setNotice] = useState<{ isSuccess: boolean; message: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const user = getActiveUser();
    setCurrentUser(user);
    if (user) {
      const all = getRewardRedemptions();
      setMyRedemptions(all.filter((r) => r.studentId === user.id));
    }
  }, []);

  const handleRedeem = (item: SchoolRewardItem) => {
    if (!currentUser) return;
    if (confirm(`Yakin ingin menukarkan ${item.pointCost} Poin untuk "${item.name}"?`)) {
      const result = redeemReward(currentUser.id, item.id);
      if (result.success && result.redemption) {
        setNotice({ isSuccess: true, message: result.message });
        setRewards(getSchoolRewards());
        setCurrentUser(getActiveUser());
        setMyRedemptions((prev) => [result.redemption!, ...prev]);
        setSelectedVoucher(result.redemption);
      } else {
        setNotice({ isSuccess: false, message: result.message });
      }
      setTimeout(() => setNotice(null), 6000);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-amber-500" />;
      case 'Award':
        return <Award className="w-5 h-5 text-purple-500" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center gap-1">
              <Gift className="w-3 h-3" />
              Toko Hadiah Sekolah
            </span>
            <span className="text-xs text-slate-500">Tukar Poin Bintangmu</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            Pusat Penukaran Hadiah Nyata di Sekolah
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kerja kerasmu belajar komputer terbayar! Tukarkan poin bintang dengan stiker, voucher jajan kantin, atau sertifikat fisik berbingkai.
          </p>
        </div>

        {currentUser && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 px-4 py-2 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              ★
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 block uppercase tracking-wider">
                Saldo Poin Kamu
              </span>
              <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                {currentUser.totalPoints || 0} Poin ({currentUser.totalStars || 0} Bintang)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('shop')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'shop'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🎁 Katalog Hadiah
        </button>
        <button
          onClick={() => setActiveTab('my_vouchers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'my_vouchers'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span>🎟️ Kupon Voucher Saya</span>
          {myRedemptions.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] rounded-full">
              {myRedemptions.length}
            </span>
          )}
        </button>
      </div>

      {/* Notice Message */}
      {notice && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 animate-in fade-in ${
            notice.isSuccess
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          {notice.isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{notice.message}</span>
        </div>
      )}

      {/* TAB 1: REWARD CATALOG */}
      {activeTab === 'shop' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map((item) => {
            const canAfford = (currentUser?.totalPoints || 0) >= item.pointCost;
            const inStock = item.stock > 0;

            return (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-xs">
                      {getIcon(item.icon)}
                    </div>
                    {item.badgeLabel && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {item.badgeLabel}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Harga:</span>
                    <span className="font-mono font-bold text-amber-500 text-sm">
                      ★ {item.pointCost} Poin
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Sisa Stok:</span>
                    <span className={inStock ? 'font-semibold text-slate-700 dark:text-slate-300' : 'text-rose-500 font-bold'}>
                      {inStock ? `${item.stock} item` : 'Habis'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRedeem(item)}
                    disabled={!canAfford || !inStock}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    {!inStock
                      ? 'Stok Habis'
                      : !canAfford
                      ? `Kurang ${item.pointCost - (currentUser?.totalPoints || 0)} Poin`
                      : 'Tukarkan Hadiah'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: MY VOUCHERS */}
      {activeTab === 'my_vouchers' && (
        <div className="space-y-4">
          {myRedemptions.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Gift className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Belum ada kupon hadiah yang kamu tukarkan
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Kumpulkan bintang dari latihan mengetik, kuis, dan materi, lalu tukarkan di tab Katalog Hadiah!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRedemptions.map((red) => (
                <div
                  key={red.id}
                  className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        Tanggal: {new Date(red.redeemedAt).toLocaleDateString('id-ID')}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {red.rewardName}
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        red.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {red.status === 'completed' ? 'Sudah Diterima' : 'Menunggu Verifikasi Guru'}
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest block">
                        KODE VOUCHER KLAIM
                      </span>
                      <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                        {red.redeemCode}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(red.redeemCode)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                      title="Salin Kode"
                    >
                      {copiedCode === red.redeemCode ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    💡 Perlihatkan kode ini kepada <strong>Guru Pembina Komputer</strong> untuk mengambil hadiah fisik Anda di lab.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
