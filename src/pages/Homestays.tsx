import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Filter, Heart, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storage } from '../utils/storage';
import { Homestay, User } from '../types';
import BookingModal from '../components/BookingModal';
import ReviewSystem from '../components/ReviewSystem';

const LOCATIONS = [
  'All Locations', 'Puri', 'Tirupati', 'Jaipur', 'Araku Valley', 'Vizag', 
  'Lambasingi', 'Hyderabad', 'Goa', 'Varanasi', 'Udaipur', 'Manali', 'Shimla', 'Mysore'
];

export default function Homestays() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [filteredHomestays, setFilteredHomestays] = useState<Homestay[]>([]);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minRating, setMinRating] = useState(0);
  const [selectedHomestay, setSelectedHomestay] = useState<Homestay | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    setUser(storage.getUser());
    const data = storage.getHomestays();
    setHomestays(data);
    setFilteredHomestays(data);
  }, []);

  useEffect(() => {
    let result = homestays;

    if (search) {
      result = result.filter(h => 
        h.name.toLowerCase().includes(search.toLowerCase()) || 
        h.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedLocation !== 'All Locations') {
      result = result.filter(h => h.location === selectedLocation);
    }

    result = result.filter(h => h.price <= maxPrice);
    result = result.filter(h => h.rating >= minRating);

    setFilteredHomestays(result);
  }, [search, selectedLocation, maxPrice, minRating, homestays]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Search & Filter Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by name or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {LOCATIONS.map(loc => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedLocation === loc 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">Max Price:</span>
              <input 
                type="range" 
                min="500" 
                max="10000" 
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-32 accent-emerald-600"
              />
              <span className="text-sm font-bold text-emerald-600">₹{maxPrice}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">Min Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star}
                    onClick={() => setMinRating(star)}
                    className={`transition-colors ${minRating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {filteredHomestays.length} Homestays Found
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <SlidersHorizontal className="w-4 h-4" />
            Sort by: <span className="font-semibold text-gray-900">Recommended</span>
          </div>
        </div>

        {filteredHomestays.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No results found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredHomestays.map((homestay) => (
              <motion.div 
                layout
                key={homestay.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={homestay.image} 
                    alt={homestay.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button 
                    onClick={() => toggleWishlist(homestay.id)}
                    className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${wishlist.includes(homestay.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-emerald-700 shadow-sm">
                    ₹{homestay.price} / night
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{homestay.name}</h3>
                    <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-emerald-700">{homestay.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    {homestay.location}
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                    {homestay.description || "Experience the local culture and hospitality in this beautiful homestay."}
                  </p>

                  <div className="flex gap-2">
                    {user?.role === 'Tourist' && (
                      <button 
                        onClick={() => setSelectedHomestay(homestay)}
                        className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Book Now
                      </button>
                    )}
                    <button 
                      onClick={() => navigate(`/homestay-details/${homestay.id}`)}
                      className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedHomestay && user && (
        <BookingModal 
          homestay={selectedHomestay} 
          user={user} 
          onClose={() => setSelectedHomestay(null)}
          onSuccess={() => {
            // Refresh bookings in dashboard if needed
          }}
        />
      )}

      {/* Review System (Simple implementation: show for first homestay for demo) */}
      {filteredHomestays.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <ReviewSystem homestayId={filteredHomestays[0].id} user={user} />
        </div>
      )}
    </div>
  );
}
