import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MapPin, Tag, Image as ImageIcon, Globe, Compass, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '../utils/storage';
import { TouristPlace, User } from '../types';

export default function LocalGuideDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [places, setPlaces] = useState<TouristPlace[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Puri');
  const [category, setCategory] = useState('Nature');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    const currentUser = storage.getUser();
    setUser(currentUser);
    if (currentUser) {
      setPlaces(storage.getTouristPlaces().filter(p => p.guideId === currentUser.id));
    }
  }, []);

  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newPlace: TouristPlace = {
      id: Date.now().toString(),
      name,
      location,
      category,
      description,
      image: image || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800",
      guideId: user.id
    };

    storage.saveTouristPlace(newPlace);
    setPlaces([...places, newPlace]);
    setShowAddForm(false);
    
    // Reset form
    setName(''); setDescription(''); setImage('');

    storage.addNotification({
      id: Date.now().toString(),
      userId: user.id,
      message: `New tourist place "${name}" added to the platform!`,
      date: new Date().toISOString(),
      read: false
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this place?')) {
      storage.deleteTouristPlace(id);
      setPlaces(places.filter(p => p.id !== id));
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Local Guide Dashboard</h1>
            <p className="text-gray-500 mt-1">Share the best local spots with travelers.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100"
          >
            <Plus className="w-5 h-5" /> Add Tourist Place
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Your Impact</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Places Added</p>
                    <p className="text-xl font-bold text-gray-900">{places.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Views</p>
                    <p className="text-xl font-bold text-gray-900">1.2k</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 p-3 rounded-2xl text-yellow-600">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Avg Rating</p>
                    <p className="text-xl font-bold text-gray-900">4.8</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-900 p-8 rounded-3xl text-white">
              <Compass className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">Guide Tip</h3>
              <p className="text-sm text-emerald-100 leading-relaxed">
                Add high-quality photos and detailed descriptions to help tourists find the best spots.
              </p>
            </div>
          </div>

          {/* Places List */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Added Places</h2>
            {places.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                <p className="text-gray-500">Start by adding your first local attraction!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {places.map((p) => (
                  <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-red-600 hover:bg-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{p.name}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {p.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                        <MapPin className="w-3.5 h-3.5" /> {p.location}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-3 flex-1">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Place Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Add New Attraction</h3>
              <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Trash2 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAddPlace} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Place Name</label>
                <input 
                  required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" 
                  placeholder="e.g. Golden Temple"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <select 
                  value={location} onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  {['Puri', 'Tirupati', 'Jaipur', 'Araku Valley', 'Vizag', 'Goa', 'Manali', 'Shimla', 'Varanasi', 'Udaipur'].map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select 
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  {['Nature', 'Religious', 'Heritage', 'Beach', 'Adventure', 'Food'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
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
                  placeholder="Tell us why this place is special..."
                />
              </div>
              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                  Add Place
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
