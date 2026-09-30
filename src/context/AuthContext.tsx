import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUser,
  getUserById,
  getUserByUsernameOrNisn,
  getUsers,
  updateUser,
  recordLoginLog,
} from '../services/storageService';
import { User } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
                setCurrentUser(userDoc.data() as User);
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

      recordLoginLog(user);
      const freshUser = getUserById(user.id) || user;
      setCurrentUser(freshUser);
      setUsers(getUsers());
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

    const newUser = createUser({
      role: 'student',
      username: data.nisn,
      password: data.password,
      name: data.name.trim(),
      nisn: data.nisn.trim(),
      grade: data.grade.trim(),
      school: data.school.trim(),
    });

    recordLoginLog(newUser);
    const freshUser = getUserById(newUser.id) || newUser;

    // Auto-sync users list
    setUsers(getUsers());
    setCurrentUser(freshUser);

    return {
      success: true,
      user: freshUser,
      message: 'Pendaftaran berhasil! Akun telah disinkronisasikan ke sistem.',
    };
  };

  const logout = () => {
    setCurrentUser(null);
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
      }}
    >
      {children}
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
