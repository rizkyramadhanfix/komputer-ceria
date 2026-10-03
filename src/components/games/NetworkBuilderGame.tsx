import React, { useState } from 'react';
import { 
  Network, 
  Cpu, 
  Tv, 
  Printer, 
  Globe, 
  Workflow, 
  Play, 
  RotateCcw, 
  Check, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { recordGameScore } from '../../services/storageService';

interface Node {
  id: string;
  name: string;
  type: 'pc' | 'router' | 'switch' | 'server' | 'printer';
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
}

interface Level {
  id: number;
  title: string;
  mission: string;
  targetExplanation: string;
  nodes: Node[];
  requiredConnections: string[][]; // Pairs of node types that must be connected
}

const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Misi 1: Akses Internet Sederhana',
    mission: 'Hubungkan Komputer Siswa langsung ke Router Internet, kemudian Router Internet ke Server Google. Setelah itu klik Tes Ping!',
    targetExplanation: 'Komputer membutuhkan Router (Gateway) untuk meneruskan paket data ke server internet di seluruh dunia.',
    nodes: [
      { id: 'pc1', name: 'Komputer Siswa', type: 'pc', x: 15, y: 50 },
      { id: 'router1', name: 'Router Internet', type: 'router', x: 50, y: 50 },
      { id: 'server1', name: 'Server Google', type: 'server', x: 85, y: 50 }
    ],
    requiredConnections: [
      ['pc', 'router'],
      ['router', 'server']
    ]
  },
  {
    id: 2,
    title: 'Misi 2: Jaringan Lab Komputer Ceria',
    mission: 'Hubungkan Komputer 1 dan Komputer 2 ke Switch Lab. Kemudian hubungkan Switch ke Router, dan Router ke Server Google.',
    targetExplanation: 'Switch berfungsi menghubungkan banyak komputer lokal dalam lab, lalu membagikan akses internet lewat satu Router.',
    nodes: [
      { id: 'pc1', name: 'Komputer Siswa 1', type: 'pc', x: 15, y: 25 },
      { id: 'pc2', name: 'Komputer Siswa 2', type: 'pc', x: 15, y: 75 },
      { id: 'switch1', name: 'Switch Lab', type: 'switch', x: 45, y: 50 },
      { id: 'router1', name: 'Router Internet', type: 'router', x: 70, y: 50 },
      { id: 'server1', name: 'Server Google', type: 'server', x: 90, y: 50 }
    ],
    requiredConnections: [
      ['pc', 'switch'],
      ['pc', 'switch'], // both PCs
      ['switch', 'router'],
      ['router', 'server']
    ]
  },
  {
    id: 3,
    title: 'Misi 3: Berbagi Printer di Lab',
    mission: 'Hubungkan Komputer ke Switch, hubungkan Printer Bersama ke Switch agar bisa mencetak, serta hubungkan Switch ke Router lalu Router ke Server Google.',
    targetExplanation: 'Local Area Network (LAN) memungkinkan berbagi pakai perangkat keras (seperti printer) dan akses internet bersama secara efisien.',
    nodes: [
      { id: 'pc1', name: 'Komputer Siswa', type: 'pc', x: 15, y: 30 },
      { id: 'printer1', name: 'Printer Bersama', type: 'printer', x: 15, y: 75 },
      { id: 'switch1', name: 'Switch Lab', type: 'switch', x: 45, y: 50 },
      { id: 'router1', name: 'Router Internet', type: 'router', x: 70, y: 50 },
      { id: 'server1', name: 'Server Google', type: 'server', x: 90, y: 50 }
    ],
    requiredConnections: [
      ['pc', 'switch'],
      ['printer', 'switch'],
      ['switch', 'router'],
      ['router', 'server']
    ]
  },
  {
    id: 4,
    title: 'Misi 4: Infrastruktur Cloud Server',
    mission: 'Hubungkan PC 1 dan PC 2 ke Switch. Hubungkan Switch ke Router. Terakhir, hubungkan Router ke Server Google DAN Server Minecraft.',
    targetExplanation: 'Satu jaringan lokal dapat mengakses berbagai layanan server (Cloud) yang berbeda di internet melalui konfigurasi routing yang tepat.',
    nodes: [
      { id: 'pc1', name: 'PC Siswa A', type: 'pc', x: 15, y: 25 },
      { id: 'pc2', name: 'PC Siswa B', type: 'pc', x: 15, y: 75 },
      { id: 'switch1', name: 'Switch Utama', type: 'switch', x: 40, y: 50 },
      { id: 'router1', name: 'Router Sekolah', type: 'router', x: 65, y: 50 },
      { id: 'server1', name: 'Google Search', type: 'server', x: 90, y: 30 },
      { id: 'server2', name: 'Minecraft Cloud', type: 'server', x: 90, y: 70 }
    ],
    requiredConnections: [
      ['pc', 'switch'],
      ['pc', 'switch'],
      ['switch', 'router'],
      ['router', 'server'],
      ['router', 'server']
    ]
  }
];

export const NetworkBuilderGame: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { showSuccess, showError, showStarReward } = useToast();

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  const [points, setPoints] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showLevelVictory, setShowLevelVictory] = useState(false);
  const [animationPacket, setAnimationPacket] = useState<{ x: number; y: number } | null>(null);

  const level = LEVELS[currentLevelIdx];

  const handleNodeClick = (id: string) => {
    if (isTesting || showLevelVictory) return;

    if (selectedNodeId === null) {
      setSelectedNodeId(id);
    } else if (selectedNodeId === id) {
      setSelectedNodeId(null);
    } else {
      // Connect selectedNodeId and id
      const exists = connections.some(
        (c) => (c.from === selectedNodeId && c.to === id) || (c.from === id && c.to === selectedNodeId)
      );

      if (exists) {
        // Disconnect
        setConnections((prev) =>
          prev.filter(
            (c) => !((c.from === selectedNodeId && c.to === id) || (c.from === id && c.to === selectedNodeId))
          )
        );
      } else {
        // Connect
        setConnections((prev) => [...prev, { from: selectedNodeId, to: id }]);
      }
      setSelectedNodeId(null);
    }
  };

  const handleClearConnections = () => {
    setConnections([]);
    setSelectedNodeId(null);
    setTestSuccess(null);
  };

  const handleTestPing = () => {
    if (isTesting) return;
    setIsTesting(true);
    setTestSuccess(null);

    // Validate connections
    let validatedCount = 0;
    const requiredConns = [...level.requiredConnections];

    connections.forEach((conn) => {
      const nodeFrom = level.nodes.find((n) => n.id === conn.from);
      const nodeTo = level.nodes.find((n) => n.id === conn.to);
      if (!nodeFrom || !nodeTo) return;

      const idx = requiredConns.findIndex(
        (req) =>
          (req[0] === nodeFrom.type && req[1] === nodeTo.type) ||
          (req[0] === nodeTo.type && req[1] === nodeFrom.type)
      );

      if (idx !== -1) {
        validatedCount++;
        requiredConns.splice(idx, 1);
      }
    });

    const hasCompletedAll = requiredConns.length === 0 && connections.length >= level.requiredConnections.length;

    // Simulate packet flow animation
    let animationStep = 0;
    const interval = setInterval(() => {
      animationStep++;
      if (animationStep <= 10) {
        const pct = animationStep / 10;
        setAnimationPacket({
          x: 15 + pct * 70,
          y: 50
        });
      } else {
        clearInterval(interval);
        setAnimationPacket(null);
        setIsTesting(false);

        if (hasCompletedAll) {
          setTestSuccess(true);
          const earned = 60;
          setPoints((prev) => prev + earned);

          if (!completedLevels.includes(level.id)) {
            setCompletedLevels((prev) => [...prev, level.id]);
            if (currentUser) {
              recordGameScore('Simulasi Jaringan', currentUser.id, points + earned, 12);
              refreshUser();
              showStarReward(
                4,
                `Level ${level.id} Selesai! Paket data terkirim sukses (+${earned} Poin)!`,
                'Bintang Topologi Jaringan!'
              );
            }
          }
          setShowLevelVictory(true);
        } else {
          setTestSuccess(false);
          showError('Ping Gagal! Cek kembali konfigurasi kabel jaringan Anda.');
        }
      }
    }, 120);
  };

  const handleNextLevel = () => {
    setShowLevelVictory(false);
    setConnections([]);
    setSelectedNodeId(null);
    setTestSuccess(null);

    if (currentLevelIdx + 1 < LEVELS.length) {
      setCurrentLevelIdx((prev) => prev + 1);
    } else {
      handleGameCompleted();
    }
  };

  const handleSelectLevel = (idx: number) => {
    setCurrentLevelIdx(idx);
    setShowLevelVictory(false);
    setConnections([]);
    setSelectedNodeId(null);
    setTestSuccess(null);
  };

  const handleGameCompleted = () => {
    setGameState('completed');

    if (currentUser) {
      const rewardPoints = 100;
      recordGameScore('Simulasi Jaringan', currentUser.id, points + rewardPoints, 20);
      refreshUser();
      showStarReward(
        10,
        `Keren! Kamu menyelesaikan semua simulasi jaringan dan mendapat +100 Poin (+10 ★ Bintang)!`,
        'Master Teknisi Jaringan'
      );
    }
  };

  const handleRestart = () => {
    setCurrentLevelIdx(0);
    setConnections([]);
    setSelectedNodeId(null);
    setTestSuccess(null);
    setPoints(0);
    setCompletedLevels([]);
    setShowLevelVictory(false);
    setGameState('playing');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-4xl mx-auto">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Simulator Topologi Jaringan Komputer
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Level {currentLevelIdx + 1} dari {LEVELS.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rancang rute kabel data antar komputer, switch, router, dan cloud server.
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Level Selector Tabs */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
              {LEVELS.map((lvl, idx) => {
                const isDone = completedLevels.includes(lvl.id);
                const isCurrent = idx === currentLevelIdx;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => handleSelectLevel(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isDone
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                    <span>Lvl {lvl.id}</span>
                  </button>
                );
              })}
            </div>

            <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xs">
              Skor: <span className="font-mono text-sm">{points}</span>
            </span>
          </div>
        )}
      </div>

      {gameState === 'intro' ? (
        <div className="py-12 flex flex-col items-center text-center space-y-5">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center animate-bounce shadow-xl shadow-blue-500/10">
            <Workflow className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md">
            <h4 className="text-xl font-black text-slate-900 dark:text-white">
              Arsitek Jaringan Lab Sekolah
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pelajari bagaimana paket data melesat melintasi kabel LAN, switch pembagi, dan router gerbang internet untuk menyambungkan semua perangkat!
            </p>
          </div>
          <button
            onClick={() => setGameState('playing')}
            className="inline-flex items-center gap-2 px-8 py-3.5 font-black text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-500/25 cursor-pointer transition-all hover:scale-105"
          >
            <Play className="w-4 h-4" />
            <span>Mulai Simulasi Level 1</span>
          </button>
        </div>
      ) : gameState === 'completed' ? (
        <div className="py-12 flex flex-col items-center text-center space-y-5">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-amber-600 text-white rounded-3xl flex items-center justify-center animate-bounce shadow-xl shadow-amber-500/30">
            <Award className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white">
              🎉 Selamat! Kamu Tamat Menjadi Master Jaringan!
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Skor Simulasi: <span className="font-black text-blue-600 dark:text-blue-400 text-lg">{points} Poin</span>
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Kamu telah sukses merancang topologi internet, lab LAN, printer sharing, dan infrastruktur cloud multi-server!
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg cursor-pointer transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mainkan Lagi dari Misi 1</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mission Instruction Card */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {level.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {level.mission}
              </p>
            </div>
          </div>

          {/* Canvas Workspace Map */}
          <div className="relative w-full h-80 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-inner select-none">
            {/* Grid dot background */}
            <div 
              className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" 
            />

            {/* SVG Connecting Wire Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((conn, idx) => {
                const nFrom = level.nodes.find((n) => n.id === conn.from);
                const nTo = level.nodes.find((n) => n.id === conn.to);
                if (!nFrom || !nTo) return null;

                const fromX = `${nFrom.x}%`;
                const fromY = `${nFrom.y}%`;
                const toX = `${nTo.x}%`;
                const toY = `${nTo.y}%`;

                return (
                  <line
                    key={idx}
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    className="stroke-indigo-400 stroke-[3]"
                    strokeDasharray="4,4"
                  />
                );
              })}

              {/* Animated ping circle */}
              {animationPacket && (
                <circle
                  cx={`${animationPacket.x}%`}
                  cy={`${animationPacket.y}%`}
                  r="8"
                  className="fill-amber-400 animate-ping shadow-lg"
                />
              )}
            </svg>

            {/* Render Network Nodes */}
            {level.nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const hasConnectingLink = connections.some((c) => c.from === node.id || c.to === node.id);

              return (
                <div
                  key={node.id}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  onClick={() => handleNodeClick(node.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/40 ring-4 ring-blue-300 dark:ring-blue-900' 
                      : hasConnectingLink 
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-400 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20">
                    {node.type === 'pc' && <Tv className="w-6 h-6 shrink-0" />}
                    {node.type === 'router' && <Cpu className="w-6 h-6 shrink-0 text-amber-500" />}
                    {node.type === 'switch' && <Workflow className="w-6 h-6 shrink-0 text-cyan-500" />}
                    {node.type === 'server' && <Globe className="w-6 h-6 shrink-0 text-emerald-500" />}
                    {node.type === 'printer' && <Printer className="w-6 h-6 shrink-0 text-pink-500" />}
                  </div>
                  <span className="text-[10px] font-bold mt-1.5 leading-none block whitespace-nowrap bg-slate-900/10 dark:bg-white/10 px-1.5 py-0.5 rounded-md">
                    {node.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Klik perangkat pertama, lalu klik perangkat kedua untuk memasang atau mencabut kabel LAN!</span>
            </div>

            <div className="flex gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleClearConnections}
                className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
              >
                Hapus Kabel
              </button>

              <button
                type="button"
                onClick={handleTestPing}
                disabled={isTesting || connections.length === 0}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                <span>{isTesting ? 'Menguji Paket Data...' : 'Tes Jaringan (Ping!)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Level Victory Modal & Lanjut Level */}
      {showLevelVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-blue-500/40 shadow-2xl text-center space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 via-indigo-500 to-cyan-500 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                Level {currentLevelIdx + 1} Berhasil!
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                Paket Data Terkirim Sukses!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                {level.targetExplanation}
              </p>
            </div>

            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/50 rounded-2xl border border-blue-200 dark:border-blue-900 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-500 block">Poin Didapatkan</span>
              <span className="text-xl font-black font-mono text-blue-600 dark:text-blue-400">
                +60 Poin (★ 4 Bintang)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowLevelVictory(false)}
                className="w-full sm:w-1/3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Lihat Topologi
              </button>
              <button
                type="button"
                onClick={handleNextLevel}
                className="w-full sm:w-2/3 py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>{currentLevelIdx < LEVELS.length - 1 ? 'Lanjut ke Level Berikutnya' : 'Lihat Gelar Tamat Jaringan!'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
