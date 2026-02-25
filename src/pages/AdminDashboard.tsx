import React, { useState, useEffect } from 'react';
import { Users, Home, MapPin, Calendar, Shield, Trash2, Search, Filter, MoreVertical, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '../utils/storage';
import { User, Homestay, TouristPlace, Booking } from '../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    homestays: 0,
    places: 0,
    bookings: 0
  });

  const [activeTab, setActiveTab] = useState<'users' | 'homestays' | 'places' | 'bookings'>('bookings');
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [places, setPlaces] = useState<TouristPlace[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const h = storage.getHomestays();
    const p = storage.getTouristPlaces();
    const b = storage.getBookings();
    const u = storage.getAllUsers();
    
    setHomestays(h);
    setPlaces(p);
    setBookings(b);
    setUsers(u);
    
    setStats({
      users: u.length || 124, // Use real count if available
      homestays: h.length,
      places: p.length,
      bookings: b.length
    });
  }, []);

  const handleDeleteHomestay = (id: string) => {
    if (window.confirm('Admin: Delete this homestay?')) {
      storage.deleteHomestay(id);
      setHomestays(homestays.filter(h => h.id !== id));
    }
  };

  const handleDeletePlace = (id: string) => {
    if (window.confirm('Admin: Delete this tourist place?')) {
      storage.deleteTouristPlace(id);
      setPlaces(places.filter(p => p.id !== id));
    }
  };

  const handleDeleteBooking = (id: number) => {
    if (window.confirm('Admin: Cancel and delete this booking?')) {
      storage.deleteBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Admin: Remove this user from the platform?')) {
      storage.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
          <p className="text-gray-500 mt-1">Monitor platform activity and manage content.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Homestays', value: stats.homestays, icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Tourist Places', value: stats.places, icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Total Bookings', value: stats.bookings, icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Management Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
            {[
              { id: 'bookings', label: 'Booking Monitor', icon: Calendar },
              { id: 'homestays', label: 'Manage Homestays', icon: Home },
              { id: 'places', label: 'Manage Places', icon: MapPin },
              { id: 'users', label: 'Manage Users', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-emerald-600 text-emerald-600 bg-emerald-50/30' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'bookings' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="pb-4 px-4">Booking ID</th>
                      <th className="pb-4 px-4">Property</th>
                      <th className="pb-4 px-4">Dates</th>
                      <th className="pb-4 px-4">Guests</th>
                      <th className="pb-4 px-4">Status</th>
                      <th className="pb-4 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.map((b) => (
                      <tr key={b.id} className="text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-mono text-xs">#{b.id}</td>
                        <td className="py-4 px-4 font-semibold text-gray-900">{b.homestayName}</td>
                        <td className="py-4 px-4">{b.checkIn} - {b.checkOut}</td>
                        <td className="py-4 px-4">{b.guests}</td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button 
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length === 0 && <p className="text-center py-12 text-gray-400">No bookings recorded yet.</p>}
              </div>
            )}

            {activeTab === 'homestays' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {homestays.map((h) => (
                  <div key={h.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <img src={h.image} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{h.name}</p>
                      <p className="text-xs text-gray-500">{h.location}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteHomestay(h.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'places' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <img src={p.image} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.category}</p>
                    </div>
                    <button 
                      onClick={() => handleDeletePlace(p.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.role}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Shield className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500">No registered users found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
