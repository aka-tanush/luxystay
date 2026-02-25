import { User, Homestay, TouristPlace, Booking, Review, Notification, PaymentMethod, SupportTicket } from '../types';

const KEYS = {
  USER: 'tourist_app_user',
  HOMESTAYS: 'homestays',
  TOURIST_PLACES: 'touristPlaces',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'userSettings',
  PAYMENT_METHODS: 'paymentMethods',
  SUPPORT_TICKETS: 'supportTickets',
  USER_PROFILE: 'userProfile'
};

export const storage = {
  getUser: (): User | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  setUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
      // Also sync to userProfile for the specific requirement
      localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(user));
    }
    else localStorage.removeItem(KEYS.USER);
  },

  getPaymentMethods: (userId: string): PaymentMethod[] => {
    const data = localStorage.getItem(KEYS.PAYMENT_METHODS);
    const all: PaymentMethod[] = data ? JSON.parse(data) : [];
    return all.filter(m => m.userId === userId);
  },
  savePaymentMethod: (method: PaymentMethod) => {
    const data = localStorage.getItem(KEYS.PAYMENT_METHODS);
    const all: PaymentMethod[] = data ? JSON.parse(data) : [];
    localStorage.setItem(KEYS.PAYMENT_METHODS, JSON.stringify([...all, method]));
  },

  getSupportTickets: (userId: string): SupportTicket[] => {
    const data = localStorage.getItem(KEYS.SUPPORT_TICKETS);
    const all: SupportTicket[] = data ? JSON.parse(data) : [];
    return all.filter(t => t.userId === userId);
  },
  saveSupportTicket: (ticket: SupportTicket) => {
    const data = localStorage.getItem(KEYS.SUPPORT_TICKETS);
    const all: SupportTicket[] = data ? JSON.parse(data) : [];
    localStorage.setItem(KEYS.SUPPORT_TICKETS, JSON.stringify([...all, ticket]));
  },
  
  getHomestays: (): Homestay[] => {
    const data = localStorage.getItem(KEYS.HOMESTAYS);
    return data ? JSON.parse(data) : [];
  },
  saveHomestay: (homestay: Homestay) => {
    const homestays = storage.getHomestays();
    localStorage.setItem(KEYS.HOMESTAYS, JSON.stringify([...homestays, homestay]));
  },
  deleteHomestay: (id: string) => {
    const homestays = storage.getHomestays().filter(h => h.id !== id);
    localStorage.setItem(KEYS.HOMESTAYS, JSON.stringify(homestays));
  },

  getTouristPlaces: (): TouristPlace[] => {
    const data = localStorage.getItem(KEYS.TOURIST_PLACES);
    return data ? JSON.parse(data) : [];
  },
  saveTouristPlace: (place: TouristPlace) => {
    const places = storage.getTouristPlaces();
    localStorage.setItem(KEYS.TOURIST_PLACES, JSON.stringify([...places, place]));
  },
  deleteTouristPlace: (id: string) => {
    const places = storage.getTouristPlaces().filter(p => p.id !== id);
    localStorage.setItem(KEYS.TOURIST_PLACES, JSON.stringify(places));
  },

  getBookings: (): Booking[] => {
    const data = localStorage.getItem(KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  },
  saveBooking: (booking: Booking) => {
    const bookings = storage.getBookings();
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([...bookings, booking]));
  },
  deleteBooking: (id: number | string) => {
    const bookings = storage.getBookings().filter(b => b.id.toString() !== id.toString());
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  // User Management (Simulated registry)
  getAllUsers: (): User[] => {
    const data = localStorage.getItem('all_users');
    return data ? JSON.parse(data) : [];
  },
  saveUserToRegistry: (user: User) => {
    const users = storage.getAllUsers();
    if (!users.find(u => u.id === user.id)) {
      localStorage.setItem('all_users', JSON.stringify([...users, user]));
    }
  },
  deleteUser: (id: string) => {
    const users = storage.getAllUsers().filter(u => u.id !== id);
    localStorage.setItem('all_users', JSON.stringify(users));
  },

  getReviews: (): Review[] => {
    const data = localStorage.getItem(KEYS.REVIEWS);
    return data ? JSON.parse(data) : [];
  },
  saveReview: (review: Review) => {
    const reviews = storage.getReviews();
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify([...reviews, review]));
  },

  getNotifications: (userId: string): Notification[] => {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    const all: Notification[] = data ? JSON.parse(data) : [];
    return all.filter(n => n.userId === userId);
  },
  addNotification: (notification: Notification) => {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    const all: Notification[] = data ? JSON.parse(data) : [];
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([notification, ...all]));
  },
  markNotificationsRead: (userId: string) => {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    const all: Notification[] = data ? JSON.parse(data) : [];
    const updated = all.map(n => n.userId === userId ? { ...n, read: true } : n);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
  }
};
