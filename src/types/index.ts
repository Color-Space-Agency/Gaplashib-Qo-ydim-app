export type Category = 'Stadion' | 'Hotel' | 'Barber' | 'PS Club';

export interface Venue {
  id: string;
  name: string;
  category: Category;
  city: string;
  location: string;
  price: number;
  price_unit: string;
  rating: number;
  reviews_count: number;
  image: string;
  gallery: string[];
  features: string[];
  description: string;
  working_hours: string;
  phone: string;
  telegram_admin?: string;
}

export interface Booking {
  id: string;
  venue_id: string;
  venue_name: string;
  category: Category;
  user_name: string;
  user_phone: string;
  user_telegram: string; // Chat ID or Telegram handle
  date: string;
  time_slot: string;
  total_price: number;
  status: 'pending' | 'approved' | 'rejected';
  booking_status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'rejected';
  receipt_url: string;
  voucher_id?: string;
  created_at: string;
  rejection_reason?: string;
}

export interface FilterState {
  category: Category | 'All';
  search: string;
  city: string;
  sortBy: 'recommended' | 'price_low' | 'price_high' | 'rating';
}
