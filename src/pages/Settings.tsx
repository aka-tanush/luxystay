import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, MapPin, Bell, Shield, Save, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storage } from '../utils/storage';
import { User } from '../types';

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const currentUser = storage.getUser();
    setUser(currentUser);
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setLocation(currentUser.preferredLocation || '');
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser: User = {
      ...user,
      name,
      email,
      preferredLocation: location
    };

    storage.setUser(updatedUser);
    setUser(updatedUser);
    setShowSuccess(true);
    
    storage.addNotification({
      id: Date.now().toString(),
      userId: user.id,
      message: "Profile updated successfully!",
      date: new Date().toISOString(),
      read: false
    });

    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 mt-1">Manage your personal information and preferences.</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg shadow-emerald-100">
                  {name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{name}</h2>
                  <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">{user.role}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <UserIcon className="w-4 h-4" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Preferred Location
                  </label>
                  <select 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white"
                  >
                    <option value="">Select a location</option>
                    {['Puri', 'Tirupati', 'Jaipur', 'Goa', 'Manali', 'Shimla', 'Hyderabad', 'Vizag'].map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button 
                  type="submit"
                  className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100"
                >
                  <Save className="w-5 h-5" /> Save Changes
                </button>

                <AnimatePresence>
                  {showSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-emerald-600 font-semibold text-sm"
                    >
                      <CheckCircle className="w-5 h-5" /> Changes saved!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl text-emerald-600 shadow-sm">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive updates about your bookings</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-emerald-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl text-emerald-600 shadow-sm">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Two-Factor Auth</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
