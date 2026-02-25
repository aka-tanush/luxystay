import React, { useState } from 'react';
import { X, Calendar, Users, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Homestay, Booking, User } from '../types';
import { storage } from '../utils/storage';

interface BookingModalProps {
  homestay: Homestay;
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookingModal({ homestay, user, onClose, onSuccess }: BookingModalProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const booking: Booking = {
      id: Date.now(),
      homestayId: homestay.id,
      homestayName: homestay.name,
      location: homestay.location,
      checkIn,
      checkOut,
      guests,
      bookedBy: user.id,
      bookedByRole: 'Tourist',
      status: 'Confirmed',
      totalPrice: homestay.price * 1, // Simple calculation for demo
      hostId: homestay.hostId
    };

    storage.saveBooking(booking);
    
    // Create notification for Tourist
    storage.addNotification({
      id: Date.now().toString(),
      userId: user.id,
      message: `Accommodation Booked Successfully! Your stay at ${homestay.name} is confirmed.`,
      date: new Date().toISOString(),
      read: false
    });

    // Create notification for Host
    storage.addNotification({
      id: (Date.now() + 1).toString(),
      userId: homestay.hostId,
      message: `New booking received for ${homestay.name} from ${user.name}.`,
      date: new Date().toISOString(),
      read: false
    });

    setShowSuccess(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
      >
        {showSuccess ? (
          <div className="p-12 text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600">Accommodation Booked Successfully!</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Book Your Stay</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleBooking} className="p-6 space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <img src={homestay.image} alt={homestay.name} className="w-20 h-20 object-cover rounded-lg" />
                <div>
                  <h4 className="font-semibold text-gray-900">{homestay.name}</h4>
                  <p className="text-sm text-gray-500">{homestay.location}</p>
                  <p className="text-emerald-600 font-bold mt-1">₹{homestay.price} / night</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Check-in
                  </label>
                  <input 
                    type="date" 
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Check-out
                  </label>
                  <input 
                    type="date" 
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Number of Guests
                </label>
                <select 
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
