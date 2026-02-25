import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Bed, MapPin, Users, Calendar, BarChart3, Home as HomeIcon, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '../utils/storage';
import { Homestay, Booking, User } from '../types';

export default function HostDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Puri');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    const currentUser = storage.getUser();
    setUser(currentUser);
    if (currentUser) {
      const allHomestays = storage.getHomestays();
      const myHomestays = allHomestays.filter(h => h.hostId === currentUser.id);
      setHomestays(myHomestays);
      
      const allBookings = storage.getBookings();
      const myHomestayIds = myHomestays.map(h => h.id);
      setBookings(allBookings.filter(b => myHomestayIds.includes(b.homestayId)));
    }
  }, []);

  const handleAddHomestay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newHomestay: Homestay = {
      id: Date.now().toString(),
      name,
      location,
      price: parseInt(price),
      rating: 5.0,
      image: image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      hostId: user.id,
      description
    };

    storage.saveHomestay(newHomestay);
    setHomestays([...homestays, newHomestay]);
    setShowAddForm(false);
    
    // Reset form
    setName(''); setPrice(''); setDescription(''); setImage('');

    storage.addNotification({
      id: Date.now().toString(),
      userId: user.id,
      message: `Your homestay "${name}" has been listed successfully!`,
      date: new Date().toISOString(),
      read: false
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      storage.deleteHomestay(id);
      setHomestays(homestays.filter(h => h.id !== id));
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Host Control Center</h1>
            <p className="text-gray-500 mt-1">Manage your properties and track your earnings.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100"
          >
            <Plus className="w-5 h-5" /> Add New Homestay
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Listings', value: homestays.length, icon: HomeIcon, color: 'bg-blue-500' },
            { label: 'Active Bookings', value: bookings.length, icon: Calendar, color: 'bg-emerald-500' },
            { label: 'Total Earnings', value: `₹${bookings.reduce((acc, b) => acc + 2500, 0)}`, icon: BarChart3, color: 'bg-purple-500' },
            { label: 'Avg Rating', value: '4.9', icon: Star, color: 'bg-yellow-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-2xl text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listings Management */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Listings</h2>
            {homestays.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                <p className="text-gray-500">You haven't added any homestays yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {homestays.map((h) => (
                  <div key={h.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group">
                    <div className="relative h-48">
                      <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button className="p-2 bg-white/90 backdrop-blur-md rounded-full text-blue-600 hover:bg-white transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(h.id)}
                          className="p-2 bg-white/90 backdrop-blur-md rounded-full text-red-600 hover:bg-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-1">{h.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                        <MapPin className="w-3.5 h-3.5" /> {h.location}
                      </p>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <span className="text-emerald-600 font-bold">₹{h.price} / night</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold">{h.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Requests */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {bookings.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No bookings yet</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-gray-900 text-sm">{b.homestayName}</p>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {b.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.checkIn}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {b.guests} Guests</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Homestay Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">List Your Property</h3>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Trash2 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAddHomestay} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Property Name</label>
                <input 
                  required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                  placeholder="e.g. Seaside Villa"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <select 
                  value={location} onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  {['Puri', 'Tirupati', 'Jaipur', 'Araku Valley', 'Vizag', 'Goa', 'Manali', 'Shimla'].map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Price per Night (₹)</label>
                <input 
                  required type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                  placeholder="2500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Image URL</label>
                <input 
                  value={image} onChange={(e) => setImage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  required value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-32 resize-none" 
                  placeholder="Describe your homestay..."
                />
              </div>
              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                  Publish Listing
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
