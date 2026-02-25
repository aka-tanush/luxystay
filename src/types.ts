export type UserRole = 'Tourist' | 'Homestay Host' | 'Local Guide' | 'Admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferredLocation?: string;
  phoneNumber?: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  issueType: string;
  message: string;
  status: 'Open' | 'Closed';
  date: string;
}

export interface Homestay {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  hostId: string;
  description: string;
}

export interface TouristPlace {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  guideId: string;
  category: string;
}

export interface Booking {
  id: number;
  homestayId: string;
  homestayName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  bookedBy: string;
  bookedByRole: 'Tourist';
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  totalPrice: number;
  hostId: string;
}

export interface Review {
  id: string;
  homestayId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  date: string;
  read: boolean;
}
