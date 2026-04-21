/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import QuestionManagement from './pages/guru/QuestionManagement';
import ExamManagement from './pages/guru/ExamManagement';
import SiswaExams from './pages/siswa/SiswaExams';
import ExamRunner from './pages/siswa/ExamRunner';

import { Sidebar, Header } from './components/Layout';

function ProtectedRoute({ children, roles }: { children: React.ReactNode, roles?: string[] }) {
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  if (roles && profile && !roles.includes(profile.role)) {
    return <Navigate to="/app" />;
  }

  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col">
        <Header />
        <main className="p-[60px]">
          {children}
        </main>
      </div>
    </div>
  );
}


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/app" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/app/admin/users" element={
            <ProtectedRoute roles={['admin']}>
              <AppLayout><UserManagement /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Guru Routes */}
          <Route path="/app/guru/questions" element={
            <ProtectedRoute roles={['guru', 'admin']}>
              <AppLayout><QuestionManagement /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/app/guru/exams" element={
            <ProtectedRoute roles={['guru', 'admin']}>
              <AppLayout><ExamManagement /></AppLayout>
            </ProtectedRoute>
          } />

          {/* Siswa Routes */}
          <Route path="/app/siswa/exams" element={
            <ProtectedRoute roles={['siswa']}>
              <AppLayout><SiswaExams /></AppLayout>
            </ProtectedRoute>
          } />
          
          {/* Exam Runner is special - full screen */}
          <Route path="/app/siswa/exam/:id" element={
            <ProtectedRoute roles={['siswa']}>
              <ExamRunner />
            </ProtectedRoute>
          } />

        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}
