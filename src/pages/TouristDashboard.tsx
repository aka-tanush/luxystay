import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Star, Clock, ChevronRight, Bookmark, MessageSquare, User as UserIcon, CreditCard, LifeBuoy, CheckCircle, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storage } from '../utils/storage';
import { Booking, Review, User, PaymentMethod, SupportTicket } from '../types';

export default function TouristDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeSection, setActiveSection] = useState<'bookings' | 'profile' | 'payments' | 'support'>('bookings');

  // Profile State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Payment State
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');

  // Support State
  const [issueType, setIssueType] = useState('Booking Issue');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSuccess, setSupportSuccess] = useState(false);

  useEffect(() => {
    const currentUser = storage.getUser();
    setUser(currentUser);
    if (currentUser) {
      setBookings(storage.getBookings().filter(b => b.bookedBy === currentUser.id));
      setReviews(storage.getReviews().filter(r => r.userId === currentUser.id));
      setPayments(storage.getPaymentMethods(currentUser.id));
      
      setProfileName(currentUser.name);
      setProfileEmail(currentUser.email);
      setProfileLocation(currentUser.preferredLocation || '');
      setProfilePhone(currentUser.phoneNumber || '');
    }
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updatedUser: User = {
      ...user,
      name: profileName,
      email: profileEmail,
      preferredLocation: profileLocation,
      phoneNumber: profilePhone
    };
    storage.setUser(updatedUser);
    setUser(updatedUser);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      userId: user.id,
      cardHolderName: cardHolder,
      cardNumber: cardNumber,
      expiryDate: expiry
    };
    storage.savePaymentMethod(newMethod);
    setPayments([...payments, newMethod]);
    setShowPaymentForm(false);
    setCardHolder(''); setCardNumber(''); setExpiry('');
  };

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const ticket: SupportTicket = {
      id: Date.now().toString(),
      userId: user.id,
      issueType,
      message: supportMessage,
      status: 'Open',
      date: new Date().toISOString()
    };
    storage.saveSupportTicket(ticket);
    setSupportSuccess(true);
    setSupportMessage('');
    setTimeout(() => setSupportSuccess(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
            <p className="text-gray-500 mt-1">Manage your travel experience in one place.</p>
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            {[
              { id: 'bookings', icon: Calendar, label: 'Bookings' },
              { id: 'profile', icon: UserIcon, label: 'Profile' },
              { id: 'payments', icon: CreditCard, label: 'Payments' },
              { id: 'support', icon: LifeBuoy, label: 'Support' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeSection === tab.id 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {activeSection === 'bookings' && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        My Accommodation Bookings
                      </h2>
                      <span className="text-sm text-emerald-600 font-semibold">{bookings.length} Total</span>
                    </div>

                    {bookings.length === 0 ? (
                      <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                        <p className="text-gray-500">You haven't booked any stays yet.</p>
                        <button 
                          onClick={() => window.location.href = '/homestays'}
                          className="mt-4 text-emerald-600 font-bold hover:underline"
                        >
                          Explore Homestays
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div 
                            key={booking.id} 
                            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center"
                          >
                            <div className="w-full md:w-32 h-24 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                              <Bookmark className="w-8 h-8 text-emerald-200" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{booking.homestayName}</h3>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                  {booking.status}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-4 h-4 text-emerald-500" />
                                  {booking.location}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-4 h-4 text-emerald-500" />
                                  {booking.checkIn} to {booking.checkOut}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Star className="w-4 h-4 text-emerald-500" />
                                  {booking.guests} Guests
                                </div>
                              </div>
                            </div>
                            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                              <ChevronRight className="w-6 h-6 text-gray-300" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-emerald-600" />
                        My Reviews
                      </h2>
                    </div>

                    {reviews.length === 0 ? (
                      <div className="bg-white rounded-3xl p-8 text-center border border-gray-100">
                        <p className="text-gray-500">Share your experiences with the community!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex gap-1 mb-2">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className={`w-3 h-3 ${review.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">"{review.comment}"</p>
                            <div className="text-xs text-gray-400 flex justify-between">
                              <span>Stayed at {review.homestayId}</span>
                              <span>{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </motion.div>
              )}

              {activeSection === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <UserIcon className="w-6 h-6 text-emerald-600" /> Update Profile
                  </h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input 
                          required value={profileName} onChange={(e) => setProfileName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input 
                          required type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Preferred Location</label>
                        <input 
                          value={profileLocation} onChange={(e) => setProfileLocation(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                          placeholder="e.g. Jaipur"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input 
                          value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        type="submit"
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                      >
                        Update Profile
                      </button>
                      {profileSuccess && (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle className="w-5 h-5" /> Profile Updated Successfully
                        </span>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}

              {activeSection === 'payments' && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-6 h-6 text-emerald-600" /> Payment Methods
                    </h2>
                    <button 
                      onClick={() => setShowPaymentForm(true)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Payment Method
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {payments.map(method => (
                      <div key={method.id} className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-8">
                            <CreditCard className="w-10 h-10 opacity-80" />
                            <span className="text-xs font-bold opacity-60 uppercase tracking-widest">LuxeStay Card</span>
                          </div>
                          <p className="text-xl font-mono tracking-widest mb-4">**** **** **** {method.cardNumber.slice(-4)}</p>
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[10px] uppercase opacity-60 mb-1">Card Holder</p>
                              <p className="font-bold">{method.cardHolderName}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase opacity-60 mb-1">Expires</p>
                              <p className="font-bold">{method.expiryDate}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {payments.length === 0 && !showPaymentForm && (
                      <div className="md:col-span-2 bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                        <p className="text-gray-500">No payment methods added yet.</p>
                      </div>
                    )}
                  </div>

                  {showPaymentForm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold text-gray-900">Add New Card</h3>
                          <button onClick={() => setShowPaymentForm(false)} className="p-2 hover:bg-gray-100 rounded-full">
                            <X className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                        <form onSubmit={handleAddPayment} className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Card Holder Name</label>
                            <input required value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Card Number</label>
                            <input required value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="1234 5678 9101 1121" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Expiry Date</label>
                            <input required value={expiry} onChange={(e) => setExpiry(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="MM/YY" />
                          </div>
                          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all mt-4">
                            Save Payment Method
                          </button>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeSection === 'support' && (
                <motion.div
                  key="support"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <LifeBuoy className="w-6 h-6 text-emerald-600" /> Support Center
                  </h2>
                  <form onSubmit={handleSubmitSupport} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Issue Type</label>
                      <select 
                        value={issueType} onChange={(e) => setIssueType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                      >
                        <option>Booking Issue</option>
                        <option>Payment Issue</option>
                        <option>Host Complaint</option>
                        <option>App Bug</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Message</label>
                      <textarea 
                        required value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-32 resize-none"
                        placeholder="Describe your issue in detail..."
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        type="submit"
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                      >
                        Submit Support Request
                      </button>
                      {supportSuccess && (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle className="w-5 h-5" /> Support Request Sent
                        </span>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar: Stats & Quick Actions */}
          <div className="space-y-8">
            <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-100">
              <h3 className="text-lg font-bold mb-6">Travel Stats</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-100">Total Stays</span>
                  <span className="text-2xl font-bold">{bookings.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-100">Reviews Written</span>
                  <span className="text-2xl font-bold">{reviews.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-100">Saved Cards</span>
                  <span className="text-2xl font-bold">{payments.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveSection('profile')}
                  className={`w-full py-3 px-4 rounded-2xl text-sm font-semibold transition-all text-left flex items-center justify-between ${
                    activeSection === 'profile' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Update Profile <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveSection('payments')}
                  className={`w-full py-3 px-4 rounded-2xl text-sm font-semibold transition-all text-left flex items-center justify-between ${
                    activeSection === 'payments' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Payment Methods <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveSection('support')}
                  className={`w-full py-3 px-4 rounded-2xl text-sm font-semibold transition-all text-left flex items-center justify-between ${
                    activeSection === 'support' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Support Center <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
