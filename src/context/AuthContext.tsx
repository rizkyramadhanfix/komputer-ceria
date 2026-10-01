import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  createUser,
  getUserById,
  getUserByUsernameOrNisn,
  getUsers,
  updateUser,
  recordLoginLog,
} from '../services/storageService';
import { User } from '../types';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ShieldAlert, LogOut, Clock, AlertTriangle } from 'lucide-react';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isPembina: boolean;
  isStudent: boolean;
  assignedSchool?: string;
  login: (
    identifier: string,
    password: string,
    roleRequired?: 'admin' | 'superadmin' | 'pembina' | 'student'
  ) => { success: boolean; message?: string };
  registerStudent: (data: {
    name: string;
    nisn: string;
    grade: string;
    school: string;
    password: string;
  }) => { success: boolean; message?: string; user?: User };
  logout: () => void;
  refreshUser: () => void;
  sessionNotice: string | null;
  clearSessionNotice: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    // Initial fetch for active user only (avoid quota issues)
    const initAuth = async () => {
      try {
        const raw = localStorage.getItem('ekskul_active_user');
        if (raw) {
          const parsed = JSON.parse(raw) as User;
          if (parsed && parsed.id) {
            try {
              const userDoc = await getDoc(doc(db, 'users', parsed.id));
              if (userDoc.exists()) {
                const fresh = userDoc.data() as User;
                const clientToken = localStorage.getItem('ekskul_session_token');
                if (fresh.currentSessionId && clientToken && fresh.currentSessionId !== clientToken) {
                  localStorage.removeItem('ekskul_active_user');
                  setSessionNotice('Akun ini telah login di perangkat lain. Sesi pada perangkat ini telah ditutup secara otomatis.');
                  setCurrentUser(null);
                } else {
                  setCurrentUser(fresh);
                }
              } else {
                setCurrentUser(parsed);
              }
            } catch (err) {
              console.warn('Firestore user fetch failed, fallback to local user data:', err);
              setCurrentUser(parsed);
            }
          }
        }
      } catch (e) {
        console.error('Error initializing auth:', e);
      } finally {
        setIsLoaded(true);
      }
    };
    initAuth();
  }, []);

  // --- Real-time Single Session Enforcement (Anti-Double Login) ---
  useEffect(() => {
    if (!currentUser?.id) return;
    const currentUserId = currentUser.id;
    const clientToken = localStorage.getItem('ekskul_session_token');
    if (!clientToken) return;

    const unsubscribe = onSnapshot(doc(db, 'users', currentUserId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        if (data.currentSessionId && data.currentSessionId !== clientToken) {
          console.warn('Single session violation: user logged in from another device/browser:', currentUserId);
          setCurrentUser(null);
          localStorage.removeItem('ekskul_active_user');
          setSessionNotice('Akun Anda telah login di perangkat atau jendela lain. Demi keamanan, sesi pada perangkat ini dinonaktifkan secara otomatis.');
        }
      }
    }, (err) => {
      console.warn('Session Firestore snapshot listener warning:', err);
    });

    return () => unsubscribe();
  }, [currentUser?.id]);

  // --- 1-Hour Inactivity Auto-Logout Timer (Waktu Tidur Akun 1 Jam) ---
  useEffect(() => {
    if (!currentUser) return;
    lastActivityRef.current = Date.now();

    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const trackedEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    trackedEvents.forEach((ev) => window.addEventListener(ev, handleUserActivity, { passive: true }));

    const idleInterval = setInterval(() => {
      const inactiveDuration = Date.now() - lastActivityRef.current;
      // 3,600,000 ms = 60 minutes = 1 hour of inactivity
      if (inactiveDuration >= 3600000) {
        setCurrentUser(null);
        localStorage.removeItem('ekskul_active_user');
        setSessionNotice('Waktu tidur akun aktif: Anda otomatis dikeluarkan (logout) karena tidak ada aktivitas selama 1 jam demi menjaga privasi dan keamanan.');
      }
    }, 5000);

    return () => {
      trackedEvents.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
      clearInterval(idleInterval);
    };
  }, [currentUser]);

  const refreshUser = () => {
    const allUsers = getUsers();
    setUsers(allUsers);
    if (currentUser) {
      const refreshed = allUsers.find((u) => u.id === currentUser.id);
      if (refreshed) {
        setCurrentUser(refreshed);
        localStorage.setItem('ekskul_active_user', JSON.stringify(refreshed));
      }
    }
  };

  useEffect(() => {
    const handleDataUpdated = () => {
      refreshUser();
    };
    window.addEventListener('ekskul_data_updated', handleDataUpdated);
    return () => window.removeEventListener('ekskul_data_updated', handleDataUpdated);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ekskul_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ekskul_active_user');
    }
  }, [currentUser]);

  const login = (
    identifier: string,
    password: string,
    roleRequired?: 'admin' | 'superadmin' | 'pembina' | 'student'
  ): { success: boolean; message?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    try {
      // Use local storageService to avoid Firestore read quota
      const allUsers = getUsers();
      let user: User | undefined;

      if (roleRequired === 'student') {
        user = allUsers.find(
          (u) =>
            u.role === 'student' &&
            (u.nisn?.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId || u.name.toLowerCase() === cleanId)
        );
      } else if (roleRequired === 'pembina') {
        user = allUsers.find(
          (u) =>
            (u.role === 'pembina' || u.role === 'admin') &&
            (u.username.toLowerCase() === cleanId || u.name.toLowerCase() === cleanId)
        );
      } else if (roleRequired === 'superadmin') {
        user = allUsers.find(
          (u) =>
            (u.role === 'superadmin' || u.role === 'admin') &&
            (u.username.toLowerCase() === cleanId || u.name.toLowerCase() === cleanId)
        );
      } else {
        user = allUsers.find(u => u.username.toLowerCase() === cleanId || u.nisn?.toLowerCase() === cleanId || u.name.toLowerCase() === cleanId);
      }
      
      if (!user) {
        return {
          success: false,
          message:
            roleRequired === 'student'
              ? 'NISN atau Nama Siswa tidak terdaftar.'
              : roleRequired === 'pembina'
              ? 'Username Pembina Sekolah tidak ditemukan.'
              : 'Username Administrator tidak ditemukan.',
        };
      }

      if (user.password.trim() !== cleanPass) {
        return { success: false, message: 'Kata sandi / password salah. Silakan coba lagi.' };
      }
      
      if (roleRequired) {
        if (roleRequired === 'pembina') {
          if (user.role !== 'pembina') {
            return {
              success: false,
              message: 'Akun ini bukan akun Pembina Sekolah. Silakan gunakan tombol Login Superadmin.',
            };
          }
        } else if (roleRequired === 'superadmin') {
          const isSuper = user.role === 'superadmin' || (user.role === 'admin' && !user.assignedSchool);
          if (!isSuper) {
            return {
              success: false,
              message: 'Akun ini bukan akun Super Administrator Pusat. Silakan gunakan tombol Login Pembina.',
            };
          }
        } else if (roleRequired === 'admin') {
          const isStaff = user.role === 'admin' || user.role === 'superadmin' || user.role === 'pembina';
          if (!isStaff) {
            return {
              success: false,
              message: 'Akun ini bukan akun Admin / Pembina Sekolah.',
            };
          }
        } else if (roleRequired === 'student') {
          if (user.role !== 'student') {
            return {
              success: false,
              message: 'Akun ini bukan akun Siswa. Silakan gunakan tombol Login Pembina / Superadmin.',
            };
          }
        }
      }

      // Generate a unique session token for Single Active Session enforcement
      const newSessionToken = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('ekskul_session_token', newSessionToken);
      sessionStorage.setItem('ekskul_session_token', newSessionToken);

      recordLoginLog(user);
      
      // Update session ID & last login in Firestore and Local Storage immediately
      const updatedUser = updateUser(user.id, {
        currentSessionId: newSessionToken,
        lastActiveAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      }) || user;

      setCurrentUser(updatedUser);
      setUsers(getUsers());
      lastActivityRef.current = Date.now();
      return { success: true };
    } catch (e) {
      console.error('Login error:', e);
      return { success: false, message: 'Terjadi kesalahan sistem saat login.' };
    }
  };

  const registerStudent = (data: {
    name: string;
    nisn: string;
    grade: string;
    school: string;
    password: string;
  }): { success: boolean; message?: string; user?: User } => {
    // Use state instead of localStorage
    const existing = users.find(u => u.username === data.nisn || u.nisn === data.nisn);
    if (existing) {
      return {
        success: false,
        message: `Siswa dengan NISN ${data.nisn} sudah terdaftar sebelumnya.`,
      };
    }

    const newSessionToken = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('ekskul_session_token', newSessionToken);
    sessionStorage.setItem('ekskul_session_token', newSessionToken);

    const newUser = createUser({
      role: 'student',
      username: data.nisn,
      password: data.password,
      name: data.name.trim(),
      nisn: data.nisn.trim(),
      grade: data.grade.trim(),
      school: data.school.trim(),
      currentSessionId: newSessionToken,
      lastActiveAt: new Date().toISOString(),
    });

    recordLoginLog(newUser);
    const freshUser = getUserById(newUser.id) || newUser;

    // Auto-sync users list
    setUsers(getUsers());
    setCurrentUser(freshUser);
    lastActivityRef.current = Date.now();

    return {
      success: true,
      user: freshUser,
      message: 'Pendaftaran berhasil! Akun telah disinkronisasikan ke sistem.',
    };
  };

  const logout = () => {
    if (currentUser?.id) {
      // Clear session token in Firestore & local
      updateUser(currentUser.id, {
        currentSessionId: '',
        lastActiveAt: new Date().toISOString(),
      });
    }
    localStorage.removeItem('ekskul_session_token');
    sessionStorage.removeItem('ekskul_session_token');
    localStorage.removeItem('ekskul_active_user');
    setCurrentUser(null);
  };

  const clearSessionNotice = () => {
    setSessionNotice(null);
  };

  const isSuperAdmin = currentUser?.role === 'superadmin' || (currentUser?.role === 'admin' && !currentUser?.assignedSchool);
  const isPembina = currentUser?.role === 'pembina';
  const isAdmin = isSuperAdmin || isPembina;
  const isStudent = currentUser?.role === 'student';
  const assignedSchool = currentUser?.assignedSchool || (isPembina ? currentUser?.school : undefined);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAdmin,
        isSuperAdmin,
        isPembina,
        isStudent,
        assignedSchool,
        login,
        registerStudent,
        logout,
        refreshUser,
        sessionNotice,
        clearSessionNotice,
      }}
    >
      {children}

      {/* Session Alert Modal (Anti-Double Login & 1-Minute Inactivity Auto Logout) */}
      {sessionNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Pemberitahuan Sesi Akun
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {sessionNotice}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 text-left flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                Sistem mengaktifkan <strong>Single Active Login</strong> dan batas <strong>waktu tidur 1 jam</strong> demi menjaga kerahasiaan nilai dan keamanan akun.
              </span>
            </div>

            <button
              onClick={clearSessionNotice}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Saya Mengerti & Tutup
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

