import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Shield, Wifi, Coffee, Car, Wind, User, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '../utils/storage';
import { Homestay, Review, User as UserType, Booking } from '../types';

export default function HomestayDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [homestay, setHomestay] = useState<Homestay | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      const allHomestays = storage.getHomestays();
      const found = allHomestays.find(h => h.id === id);
      setHomestay(found || null);
      
      const allReviews = storage.getReviews();
      setReviews(allReviews.filter(r => r.homestayId === id));
    }
    setUser(storage.getUser());
  }, [id]);

  const handleBook = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!homestay) return;

    const newBooking: Booking = {
      id: Date.now(),
      homestayId: homestay.id,
      homestayName: homestay.name,
      bookedBy: user.id,
      bookedByRole: 'Tourist',
      hostId: homestay.hostId,
      checkIn: '2024-06-01',
      checkOut: '2024-06-05',
      status: 'Confirmed',
      totalPrice: homestay.price * 4,
      guests: 2,
      location: homestay.location
    };

    storage.saveBooking(newBooking);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      navigate('/tourist-dashboard');
    }, 2000);
  };

  if (!homestay) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Homestay not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Image Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={homestay.image} 
          alt={homestay.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-emerald-500 rounded-full text-xs font-bold uppercase tracking-wider">Featured Stay</span>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {homestay.rating} ({reviews.length} reviews)
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{homestay.name}</h1>
            <p className="text-lg opacity-90 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" /> {homestay.location}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this home</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {homestay.description}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What this place offers</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { icon: Wifi, label: 'Fast WiFi' },
                  { icon: Coffee, label: 'Breakfast included' },
                  { icon: Car, label: 'Free parking' },
                  { icon: Wind, label: 'Air conditioning' },
                  { icon: Shield, label: 'Security cameras' },
                  { icon: User, label: 'Local guide access' }
                ].map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-600">
                    <amenity.icon className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Guest reviews</h2>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold">{homestay.rating}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-600 font-medium">{reviews.length} reviews</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map((review) => (
                  <div key={review.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Guest</h4>
                        <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-3 h-3 ${review.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-gray-400 italic">No reviews yet for this homestay.</p>
                )}
              </div>
            </section>
          </div>

          {/* Right Sidebar: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-3xl font-bold text-gray-900">₹{homestay.price}</span>
                  <span className="text-gray-500"> / night</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {homestay.rating}
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-2 border-bottom border-gray-200">
                  <div className="p-3 border-r border-gray-200">
                    <label className="block text-[10px] font-bold uppercase text-gray-400">Check-in</label>
                    <p className="text-sm font-medium">06/01/2024</p>
                  </div>
                  <div className="p-3">
                    <label className="block text-[10px] font-bold uppercase text-gray-400">Check-out</label>
                    <p className="text-sm font-medium">06/05/2024</p>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-200">
                  <label className="block text-[10px] font-bold uppercase text-gray-400">Guests</label>
                  <p className="text-sm font-medium">2 guests</p>
                </div>
              </div>

              {user?.role === 'Tourist' || !user ? (
                <button 
                  onClick={handleBook}
                  disabled={bookingSuccess}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                    bookingSuccess 
                      ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
                  }`}
                >
                  {bookingSuccess ? (
                    <>
                      <CheckCircle className="w-6 h-6" /> Booking Confirmed!
                    </>
                  ) : (
                    'Book Accommodation'
                  )}
                </button>
              ) : (
                <div className="p-4 bg-gray-50 rounded-2xl text-center">
                  <p className="text-sm text-gray-500 font-medium">Only tourists can book accommodations.</p>
                </div>
              )}

              <p className="text-center text-sm text-gray-400">You won't be charged yet</p>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span className="underline">₹{homestay.price} x 4 nights</span>
                  <span>₹{homestay.price * 4}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="underline">LuxeStay service fee</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-4">
                  <span>Total</span>
                  <span>₹{homestay.price * 4}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
