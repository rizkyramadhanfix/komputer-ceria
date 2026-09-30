import React, { useState, useEffect } from 'react';
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
  CheckCircle, 
  Award, 
  Sparkles, 
  AlertTriangle,
  HelpCircle
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
    targetExplanation: 'Mengajarkan bahwa komputer butuh Router (Gateway) untuk meneruskan paket data ke server internet di seluruh dunia.',
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
    targetExplanation: 'Mengajarkan fungsi Switch untuk menghubungkan banyak komputer lokal, lalu membagikan akses internet lewat satu Router.',
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
    targetExplanation: 'Mengajarkan konsep Local Area Network (LAN) untuk berbagi pakai perangkat keras (printer) dan akses internet bersama.',
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
    targetExplanation: 'Mengajarkan bahwa satu jaringan lokal bisa mengakses berbagai layanan server (Cloud) yang berbeda di internet melalui satu Router.',
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
  const [animationPacket, setAnimationPacket] = useState<{ x: number; y: number } | null>(null);

  const level = LEVELS[currentLevelIdx];

  const handleNodeClick = (id: string) => {
    if (isTesting) return;

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

    // Let's validate connections
    // Find matching nodes based on requirements
    let validatedCount = 0;
    const requiredConns = [...level.requiredConnections];

    // For each link in connections, check if it matches a required pair
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

    // Check path validity: PC must be connected to Switch/Router, Router to Server
    // Level 1: pc -> router -> server
    // Level 2: pc1 -> switch, pc2 -> switch, switch -> router, router -> server
    // Level 3: pc -> switch, printer -> switch, switch -> router, router -> server

    const hasCompletedAll = requiredConns.length === 0 && connections.length >= level.requiredConnections.length;

    // Simulate packet flow animation
    let animationStep = 0;
    const interval = setInterval(() => {
      animationStep++;
      if (animationStep <= 10) {
        // animate packet moving along the path
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
          setPoints((prev) => prev + 100);
          showSuccess(`Misi Berhasil! Jaringan terhubung sempurna. ${level.targetExplanation}`);
        } else {
          setTestSuccess(false);
          showError('Ping Gagal! Cek kembali konfigurasi kabel jaringan Anda.');
        }
      }
    }, 150);
  };

  const handleNextLevel = () => {
    setConnections([]);
    setSelectedNodeId(null);
    setTestSuccess(null);

    if (currentLevelIdx + 1 < LEVELS.length) {
      setCurrentLevelIdx((prev) => prev + 1);
    } else {
      handleGameCompleted();
    }
  };

  const handleGameCompleted = () => {
    setGameState('completed');

    if (currentUser) {
      const rewardPoints = 80;
      recordGameScore('Simulasi Jaringan', currentUser.id, points, rewardPoints);
      refreshUser();
      showStarReward(
        8,
        `Keren! Kamu menyelesaikan semua simulasi jaringan dan mendapat +80 Poin (+8 ★ Bintang)!`,
        'Teknisi Jaringan Cilik'
      );
    }
  };

  const handleRestart = () => {
    setCurrentLevelIdx(0);
    setConnections([]);
    setSelectedNodeId(null);
    setTestSuccess(null);
    setPoints(0);
    setGameState('playing');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Simulator Jaringan Komputer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Belajar konsep pengkabelan, alamat IP, dan cara kerja internet dengan menyambungkan komputer lab!
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-3 font-bold text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300">
              Poin: <span className="font-mono text-sm">{points}</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 font-sans">
              Level {level.id} / 3
            </span>
          </div>
        )}
      </div>

      {gameState === 'intro' ? (
        <div className="py-12 flex flex-col items-center text-center space-y-5">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center animate-pulse">
            <Workflow className="w-10 h-10" />
          </div>
          <div className="space-y-2 max-w-md">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Hubungkan Kabel Jaringan Lab Ceria!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pernahkah kamu penasaran bagaimana Komputer di Lab bisa terhubung ke Google? Di sini kamu akan belajar menjadi teknisi jaringan cilik dengan menyambungkan kabel data LAN!
            </p>
          </div>
          <button
            onClick={() => setGameState('playing')}
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Mulai Mendesain Jaringan</span>
          </button>
        </div>
      ) : gameState === 'completed' ? (
        <div className="py-12 flex flex-col items-center text-center space-y-5">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center animate-bounce">
            <Award className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Semua Misi Selesai! Kamu Hebat!
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Poin Desain Jaringan: <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{points} Poin</span>
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Luar biasa! Sekarang kamu tahu bagaimana router, switch, printer, dan server bekerjasama membagikan internet.
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Main Ulang</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Mission explanation card */}
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300">
            <span className="font-extrabold block text-sm mb-1">{level.title}</span>
            <p>{level.mission}</p>
          </div>

          {/* Interactive Topology Designer Workspace */}
          <div className="relative h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            {/* Background grid line decoration */}
            <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

            {/* Render Canvas Connections SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-300 dark:fill-slate-700" />
                </marker>
              </defs>
              
              {connections.map((conn, idx) => {
                const nodeFrom = level.nodes.find((n) => n.id === conn.from);
                const nodeTo = level.nodes.find((n) => n.id === conn.to);
                if (!nodeFrom || !nodeTo) return null;

                const fromX = `${nodeFrom.x}%`;
                const fromY = `${nodeFrom.y}%`;
                const toX = `${nodeTo.x}%`;
                const toY = `${nodeTo.y}%`;

                return (
                  <line
                    key={idx}
                    x1={fromX}
                    y1={fromY}
                    x2={toX}
                    y2={toY}
                    className="stroke-indigo-500 dark:stroke-indigo-400 stroke-[3]"
                    strokeDasharray="2,2"
                  />
                );
              })}

              {/* Render Animated Package Traveling */}
              {animationPacket && (
                <circle
                  cx={`${animationPacket.x}%`}
                  cy={`${animationPacket.y}%`}
                  r="8"
                  className="fill-amber-500 animate-ping shadow-lg"
                />
              )}
            </svg>

            {/* Render Topology Devices Nodes */}
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

          {/* Action Footer Button Group */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="text-slate-400 text-[11px] flex items-center gap-1">
              <HelpCircle className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Pilih satu perangkat, lalu klik perangkat lain untuk membuat/menghapus kabel data!</span>
            </div>

            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={handleClearConnections}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
              >
                Hapus Kabel
              </button>

              {testSuccess ? (
                <button
                  type="button"
                  onClick={handleNextLevel}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Misi Berikutnya</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleTestPing}
                  disabled={isTesting || connections.length === 0}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4" />
                  <span>Tes Jaringan (Ping!)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
