import React, { useState, useEffect } from 'react';
import { MapPin, Star, Search, Plus, Trash2, Edit3, LayoutGrid, List as ListIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '../utils/storage';
import { TouristPlace, User } from '../types';

export default function Attractions() {
  const [user, setUser] = useState<User | null>(null);
  const [places, setPlaces] = useState<TouristPlace[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setUser(storage.getUser());
    setPlaces(storage.getTouristPlaces());
  }, []);

  const filteredPlaces = places.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-emerald-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=2000" 
            alt="India" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Discover Local Gems
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-emerald-100 max-w-2xl mx-auto"
          >
            Explore the most beautiful and hidden tourist spots recommended by our local experts.
          </motion.p>
        </div>
      </div>

      {/* Search & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search attractions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          
          <div className="flex gap-2 p-1 bg-gray-50 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400'}`}
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-emerald-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No attractions yet</h3>
            <p className="text-gray-500 mt-2">Local guides are currently adding amazing places for you.</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {filteredPlaces.map((place) => (
              <motion.div 
                layout
                key={place.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 ${
                  viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                }`}
              >
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'md:w-1/3 aspect-video md:aspect-auto' : 'aspect-video'}`}>
                  <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-emerald-700 shadow-sm">
                    {place.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{place.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold text-gray-900">4.8</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    {place.location}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                    {place.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xs text-gray-400">Added by Local Guide</span>
                    <button className="text-emerald-600 text-sm font-bold hover:underline">View Map</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
