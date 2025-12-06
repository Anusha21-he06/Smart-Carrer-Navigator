import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/authContext';
import { Layout } from './components/Layout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { ProfileSetup } from './pages/ProfileSetup';
import { CareerPath } from './pages/CareerPath';
import { IndustryTrends } from './pages/IndustryTrends';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  return user ? <Layout>{children}</Layout> : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfileSetup />
            </PrivateRoute>
          } />
          
          <Route path="/pathway" element={
            <PrivateRoute>
              <CareerPath />
            </PrivateRoute>
          } />
          
          <Route path="/trends" element={
            <PrivateRoute>
              <IndustryTrends />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;