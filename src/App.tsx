import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Homestays from './pages/Homestays';
import HomestayDetails from './pages/HomestayDetails';
import Attractions from './pages/Attractions';
import TouristDashboard from './pages/TouristDashboard';
import HostDashboard from './pages/HostDashboard';
import LocalGuideDashboard from './pages/LocalGuideDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import { storage } from './utils/storage';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const user = storage.getUser();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/homestays" element={<Homestays />} />
            <Route path="/homestay-details/:id" element={<HomestayDetails />} />
            <Route path="/attractions" element={<Attractions />} />
            
            {/* Dashboards */}
            <Route 
              path="/dashboard/tourist" 
              element={
                <ProtectedRoute allowedRoles={['Tourist']}>
                  <TouristDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/host" 
              element={
                <ProtectedRoute allowedRoles={['Homestay Host']}>
                  <HostDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/guide" 
              element={
                <ProtectedRoute allowedRoles={['Local Guide']}>
                  <LocalGuideDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
