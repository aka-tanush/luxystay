import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, MapPin, Bed, LayoutDashboard, Settings, LogOut, Bell, User as UserIcon } from 'lucide-react';
import { storage } from '../utils/storage';
import { User, Notification } from '../types';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const currentUser = storage.getUser();
    setUser(currentUser);
    if (currentUser) {
      setNotifications(storage.getNotifications(currentUser.id));
    }

    // Polling for notifications (simple way to keep it updated without complex state management)
    const interval = setInterval(() => {
      if (currentUser) {
        setNotifications(storage.getNotifications(currentUser.id));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [location]);

  const handleLogout = () => {
    storage.setUser(null);
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'Tourist': return '/dashboard/tourist';
      case 'Homestay Host': return '/dashboard/host';
      case 'Local Guide': return '/dashboard/guide';
      case 'Admin': return '/dashboard/admin';
      default: return '/';
    }
  };

  if (!user && location.pathname === '/login') return null;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
              <Home className="w-6 h-6" />
              <span className="hidden sm:inline">LuxeStay</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="/homestays" className={`text-sm font-medium ${location.pathname === '/homestays' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'}`}>
                Homestays
              </Link>
              <Link to="/attractions" className={`text-sm font-medium ${location.pathname === '/attractions' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'}`}>
                Attractions
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      if (!showNotifications) {
                        storage.markNotificationsRead(user.id);
                      }
                    }}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 max-h-96 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-gray-50 font-semibold text-sm text-gray-700">
                        Notifications
                      </div>
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-400 text-sm">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-emerald-50/30' : ''}`}>
                            <p className="text-sm text-gray-800">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleDateString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <Link to={getDashboardLink()} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" title="Dashboard">
                  <LayoutDashboard className="w-5 h-5" />
                </Link>

                <Link to="/settings" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" title="Settings">
                  <Settings className="w-5 h-5" />
                </Link>

                <div className="h-8 w-px bg-gray-200 mx-1"></div>

                <div className="flex items-center gap-3 pl-2">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-gray-900 leading-none">{user.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{user.role}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
