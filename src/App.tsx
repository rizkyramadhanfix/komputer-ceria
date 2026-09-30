import React, { useState } from 'react';
import { PembinaLoginModal, SuperadminLoginModal, StudentAuthModal } from './components/auth/AuthModals';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Footer } from './components/common/Footer';
import { Header } from './components/common/Header';
import { AnnouncementModal } from './components/common/AnnouncementModal';
import { ContactModal } from './components/common/ContactModal';
import { LeaderboardWidget } from './components/common/LeaderboardWidget';
import { LandingPage } from './components/landing/LandingPage';
import { EditProfileModal } from './components/student/EditProfileModal';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentGallery } from './components/gallery/StudentGallery';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

function MainAppContent() {
  const { currentUser, isAdmin, isStudent } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [authModalState, setAuthModalState] = useState<{
    isOpen: boolean;
    mode: 'student-login' | 'student-register' | 'pembina' | 'superadmin';
  }>({
    isOpen: false,
    mode: 'student-login',
  });

  const handleOpenAuth = (mode: 'admin' | 'superadmin' | 'pembina' | 'student-login' | 'student-register') => {
    const targetMode = mode === 'admin' ? 'superadmin' : mode;
    setAuthModalState({ isOpen: true, mode: targetMode });
  };

  // Ensure logout immediately redirects user to landing page (dashboard awal)
  React.useEffect(() => {
    if (
      !currentUser &&
      currentView !== 'landing' &&
      currentView !== 'leaderboard' &&
      currentView !== 'gallery' &&
      currentView !== 'student-gallery' &&
      currentView !== 'public-announcements' &&
      currentView !== 'public-contact'
    ) {
      setCurrentView('landing');
    }
  }, [currentUser, currentView]);

  const handleAuthSuccess = () => {
    // If successfully logged in or registered, redirect to appropriate dashboard
    const userRole = currentUser?.role;
    // We check after state updates
    setTimeout(() => {
      const activeUser = localStorage.getItem('ekskul_active_user');
      if (activeUser) {
        const parsed = JSON.parse(activeUser);
        if (parsed.role === 'admin' || parsed.role === 'superadmin' || parsed.role === 'pembina') {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('student-dashboard');
        }
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenAuthModal={handleOpenAuth}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      <main className="flex-1">
        {/* LANDING PAGE */}
        {currentView === 'landing' && (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onNavigate={setCurrentView}
          />
        )}

        {/* STUDENT VIEWS */}
        {currentView === 'student-dashboard' && (
          <StudentDashboard initialTab="overview" />
        )}
        {currentView === 'student-leaderboard' && (
          <StudentDashboard initialTab="leaderboard" />
        )}
        {currentView === 'student-lessons' && (
          <StudentDashboard initialTab="lessons" />
        )}
        {currentView === 'student-quizzes' && (
          <StudentDashboard initialTab="quizzes" />
        )}
        {currentView === 'student-quiz-duel' && (
          <StudentDashboard initialTab="quiz-duel" />
        )}
        {currentView === 'student-typing' && (
          <StudentDashboard initialTab="typing" />
        )}
        {currentView === 'student-typing-hero' && (
          <StudentDashboard initialTab="typing-hero" />
        )}
        {currentView === 'student-typing-race' && (
          <StudentDashboard initialTab="typing-race" />
        )}
        {currentView === 'student-tournaments' && (
          <StudentDashboard initialTab="tournaments" />
        )}
        {currentView === 'student-games' && (
          <StudentDashboard initialTab="games" />
        )}
        {currentView === 'student-pc-builder' && (
          <StudentDashboard initialTab="pc-builder" />
        )}
        {currentView === 'student-coding-lab' && (
          <StudentDashboard initialTab="coding-lab" />
        )}
        {currentView === 'student-file-explorer' && (
          <StudentDashboard initialTab="file-explorer" />
        )}
        {currentView === 'student-network-builder' && (
          <StudentDashboard initialTab="network-builder" />
        )}
        {currentView === 'student-cyber-safety' && (
          <StudentDashboard initialTab="cyber-safety" />
        )}
        {currentView === 'student-shortcuts' && (
          <StudentDashboard initialTab="shortcuts" />
        )}
        {currentView === 'student-achievements' && (
          <StudentDashboard initialTab="achievements" />
        )}
        {(currentView === 'gallery' || currentView === 'student-gallery') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <StudentGallery onOpenAuthModal={() => handleOpenAuth('student-login')} />
          </div>
        )}
        {currentView === 'student-forum' && (
          <StudentDashboard initialTab="forum" />
        )}
        {currentView === 'student-star-shop' && (
          <StudentDashboard initialTab="star-shop" />
        )}
        {currentView === 'student-pc-doctor' && (
          <StudentDashboard initialTab="pc-doctor" />
        )}
        {currentView === 'student-pixel-art' && (
          <StudentDashboard initialTab="pixel-art" />
        )}
        {currentView === 'student-spreadsheet' && (
          <StudentDashboard initialTab="spreadsheet" />
        )}
        {currentView === 'student-reward-shop' && (
          <StudentDashboard initialTab="reward-shop" />
        )}
        {currentView === 'student-glossary' && (
          <StudentDashboard initialTab="tech-glossary" />
        )}

        {/* ADMIN VIEWS */}
        {currentView === 'admin-dashboard' && (
          <AdminDashboard initialTab="students" />
        )}
        {currentView === 'admin-pembina' && (
          <AdminDashboard initialTab="pembina" />
        )}
        {currentView === 'admin-students' && (
          <AdminDashboard initialTab="students" />
        )}
        {currentView === 'admin-lessons' && (
          <AdminDashboard initialTab="lessons" />
        )}
        {currentView === 'admin-quizzes' && (
          <AdminDashboard initialTab="quizzes" />
        )}
        {currentView === 'admin-typing' && (
          <AdminDashboard initialTab="typing" />
        )}
        {currentView === 'admin-gamification' && (
          <AdminDashboard initialTab="gamification" />
        )}
        {currentView === 'admin-submissions' && (
          <AdminDashboard initialTab="submissions" />
        )}
        {currentView === 'admin-dashboard-config' && (
          <AdminDashboard initialTab="dashboard" />
        )}
        {currentView === 'admin-certificate' && (
          <AdminDashboard initialTab="certificate" />
        )}
        {currentView === 'admin-gallery' && (
          <AdminDashboard initialTab="gallery" />
        )}
        {currentView === 'admin-games' && (
          <AdminDashboard initialTab="games" />
        )}
        {currentView === 'admin-forum' && (
          <AdminDashboard initialTab="forum" />
        )}
        {currentView === 'admin-login-activity' && (
          <AdminDashboard initialTab="login-activity" />
        )}
        {currentView === 'admin-content' && (
          <AdminDashboard initialTab="lessons" />
        )}
        {currentView === 'admin-announcements' && (
          <AdminDashboard initialTab="announcements" />
        )}

        {/* PUBLIC STANDALONE PAGES */}
        {currentView === 'public-announcements' && (
          <AnnouncementModal
            isOpen={true}
            isPage={true}
            onClose={() => setCurrentView('landing')}
          />
        )}
        {currentView === 'public-contact' && (
          <ContactModal
            isOpen={true}
            isPage={true}
            onClose={() => setCurrentView('landing')}
          />
        )}

        {/* STANDALONE LEADERBOARD */}
        {currentView === 'leaderboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="text-left space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Papan Peringkat Bintang
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Leaderboard Siswa Ekstrakurikuler Komputer
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daftar peringkat seluruh siswa berdasarkan akumulasi poin bintang dari membaca materi, pengerjaan kuis, dan latihan mengetik.
              </p>
            </div>
            <LeaderboardWidget showAll={true} />
          </div>
        )}
      </main>

      <Footer />

      {/* Dedicated Pembina Login Modal */}
      <PembinaLoginModal
        isOpen={authModalState.isOpen && authModalState.mode === 'pembina'}
        onClose={() => setAuthModalState((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={handleAuthSuccess}
        onSwitchToStudent={() => setAuthModalState({ isOpen: true, mode: 'student-login' })}
        onSwitchToSuperadmin={() => setAuthModalState({ isOpen: true, mode: 'superadmin' })}
      />

      {/* Dedicated Superadmin Login Modal */}
      <SuperadminLoginModal
        isOpen={authModalState.isOpen && authModalState.mode === 'superadmin'}
        onClose={() => setAuthModalState((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={handleAuthSuccess}
        onSwitchToStudent={() => setAuthModalState({ isOpen: true, mode: 'student-login' })}
        onSwitchToPembina={() => setAuthModalState({ isOpen: true, mode: 'pembina' })}
      />

      {/* Dedicated Student Auth Modal */}
      <StudentAuthModal
        isOpen={authModalState.isOpen && (authModalState.mode === 'student-login' || authModalState.mode === 'student-register')}
        initialMode={authModalState.mode === 'student-register' ? 'student-register' : 'student-login'}
        onClose={() => setAuthModalState((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={handleAuthSuccess}
        onSwitchToAdmin={() => setAuthModalState({ isOpen: true, mode: 'superadmin' })}
        onSwitchToPembina={() => setAuthModalState({ isOpen: true, mode: 'pembina' })}
      />

      {/* Edit Profile Modal for Student */}
      {isStudent && (
        <EditProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <MainAppContent />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
