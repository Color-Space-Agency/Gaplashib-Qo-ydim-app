import { createClient } from '@supabase/supabase-js';
import { Venue, Booking } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://pcjvzknxbutqzzqxbfgd.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjanZ6a254YnV0cXp6cXhiZmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM1Mzg2MzMsImV4cCI6MjAzOTExNDYzM30.n0.97aOjzkBTGk4PFnCOBwvczMzmoEzOkouT2BwbMkCOGU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Boshlang'ich O'zbekiston maskanlari (Sample Venues)
export const INITIAL_VENUES: Venue[] = [
  {
    id: 'venue-1',
    name: 'Bunyodkor Turf Arena',
    category: 'Stadion',
    city: 'Toshkent',
    location: "Chilonzor tumani, Bunyodkor shoh ko'chasi 47",
    price: 150000,
    price_unit: 'soat',
    rating: 4.9,
    reviews_count: 128,
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Professional chim', 'Yoritgichlar (Soffit)', 'Kiyinish xonasi & Dush', 'Avtoturargoh', 'Suv & Soqol bepul'],
    description: "Toshkent shahridagi eng zamonaviy va sifatli sun'iy va tabiiy qoplamali mini-futbol stadioni. Tungi yoritish tizimi hamda dush xonalari mavjud.",
    working_hours: '08:00 - 02:00',
    phone: '+998 90 123 45 67',
    telegram_admin: '@bunyodkor_stadium'
  },
  {
    id: 'venue-2',
    name: 'Samarqand Afrosiyob Turf',
    category: 'Stadion',
    city: 'Samarqand',
    location: "Dagbitskaya ko'chasi 12",
    price: 120000,
    price_unit: 'soat',
    rating: 4.8,
    reviews_count: 94,
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Standard 5x5 va 7x7', 'Kiyim almashtirish xonasi', 'Wifi zone', 'Kafel / Bar'],
    description: "Samarqand shahri markazidagi shinam mini-futbol stadioni. O'yin keyin dam olish uchun qahvaxona bor.",
    working_hours: '09:00 - 00:00',
    phone: '+998 66 234 56 78'
  },
  {
    id: 'venue-3',
    name: 'Hyatt Regency Tashkent Suite',
    category: 'Hotel',
    city: 'Toshkent',
    location: "Yunusobod tumani, Navoiy shoh ko'chasi 1A",
    price: 1800000,
    price_unit: 'kun',
    rating: 5.0,
    reviews_count: 310,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['5 Yulduzli servis', 'Basseyn & SPA', 'Nonushta kiritilgan (Buffet)', 'Fitness zal', 'Prezident Suite'],
    description: 'Toshkent markazida joylashgan 5 yulduzli premium mehmonxona. Oliy darajadagi qulaylik va bepul nonushta.',
    working_hours: '24/7 (Check-in 14:00)',
    phone: '+998 71 207 12 34'
  },
  {
    id: 'venue-4',
    name: 'Silk Road Samarkand Resort',
    category: 'Hotel',
    city: 'Samarqand',
    location: "Eski shahar, Karvon ko'chasi 88",
    price: 1400000,
    price_unit: 'kun',
    rating: 4.9,
    reviews_count: 215,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Sharqona dizayn', 'Golosiy va milliy taomlar', 'Basseyn', 'Ekskursiya xizmati'],
    description: 'Samarqand Boqiy Shahar majmuasi yaqinidagi kurort mehmonxonasi.',
    working_hours: '24/7',
    phone: '+998 66 999 00 11'
  },
  {
    id: 'venue-5',
    name: 'Chop-Chop Premium Barbershop',
    category: 'Barber',
    city: 'Toshkent',
    location: "Mirobod tumani, Taras Shevchenko ko'chasi 21",
    price: 150000,
    price_unit: 'seans',
    rating: 4.9,
    reviews_count: 180,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Top Barber ustalar', 'Soqol tekislash va parvarish', 'Kofe va salqin ichimliklar', 'PS5 kutish zonasi'],
    description: "Erkaklar uchun zamonaviy soch va soqol uslublari, premium kosmetika va do'stona muhit.",
    working_hours: '10:00 - 22:00',
    phone: '+998 97 777 11 22'
  },
  {
    id: 'venue-6',
    name: 'Gentleman Master Barber',
    category: 'Barber',
    city: 'Namangan',
    location: "Bobur shoh ko'chasi 45",
    price: 90000,
    price_unit: 'seans',
    rating: 4.7,
    reviews_count: 76,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Soch turmaklash', 'Yuz parvarishi va niqob', 'VIP xona'],
    description: 'Namangandagi eng sara sartaroshlar va zamonaviy uslublar.',
    working_hours: '09:00 - 21:00',
    phone: '+998 69 222 33 44'
  },
  {
    id: 'venue-7',
    name: 'CyberSpace PS5 & VR Arena',
    category: 'PS Club',
    city: 'Toshkent',
    location: "Shayxontohur tumani, Labzak ko'chasi 10",
    price: 35000,
    price_unit: 'soat',
    rating: 4.9,
    reviews_count: 340,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Playstation 5 (4K 120Hz TV)', 'VIP Xonalar & Proyektor', "VR Ko'zoynaklar (Oculus)", 'FC24 / GTA 5 / Mortal Kombat 1', 'Fast Food & Energiya ichimliklar'],
    description: "O'zbekistondagi eng ulkan PS5 va Kibersport klubi. Maxsus VIP kabinalar va 45 dyuymli 4K televizorlar.",
    working_hours: '24/7',
    phone: '+998 90 999 55 44'
  },
  {
    id: 'venue-8',
    name: 'Playstation Lounge 24/7',
    category: 'PS Club',
    city: 'Samarqand',
    location: "Registon ko'chasi 5",
    price: 25000,
    price_unit: 'soat',
    rating: 4.8,
    reviews_count: 112,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['PS5 va PS4 Pro', 'Konditsioner', 'Gazli ichimliklar va Sneklar'],
    description: "Do'stlar bilan o'yin o'ynash uchun Samarqanddagi qulay va arzon PS klubi.",
    working_hours: '24/7',
    phone: '+998 66 111 22 33'
  }
];

/**
 * LocalStorage zaxira yordamchilari
 */
const STORAGE_KEY_BOOKINGS = 'gaplashib_qoydim_bookings';

export function getLocalBookings(): Booking[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveLocalBooking(booking: Booking) {
  const current = getLocalBookings();
  const updated = [booking, ...current.filter(b => b.id !== booking.id)];
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
}

/**
 * Supabase va LocalStorage orqali Joylarni olish
 */
export async function getVenues(): Promise<Venue[]> {
  try {
    const { data, error } = await supabase.from('venues').select('*');
    if (error || !data || data.length === 0) {
      return INITIAL_VENUES;
    }
    return data as Venue[];
  } catch (e) {
    return INITIAL_VENUES;
  }
}

/**
 * Supabase va LocalStorage orqali Bandlov yaratish
 */
export async function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'status' | 'booking_status' | 'payment_status'>): Promise<Booking> {
  const newBooking: Booking = {
    ...booking,
    id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    status: 'pending',
    booking_status: 'pending',
    payment_status: 'pending',
    created_at: new Date().toISOString(),
  };

  // 1. LocalStorage zaxirasi
  saveLocalBooking(newBooking);

  // 2. Supabase
  try {
    const { data, error } = await supabase.from('bookings').insert([newBooking]).select().single();
    if (!error && data) {
      return data as Booking;
    }
  } catch (e) {
    console.warn('Supabase insert fallback:', e);
  }

  return newBooking;
}

/**
 * Barcha bandlovlarni olish (Admin sahifasi uchun)
 */
export async function getBookings(): Promise<Booking[]> {
  try {
    const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return data as Booking[];
    }
  } catch (e) {
    console.warn('Supabase fetch bookings failed, fallback to local:', e);
  }

  return getLocalBookings();
}

/**
 * Bandlov statusini va Voucher ID ni yangilash (Admin Approve / Reject)
 */
export async function updateBookingStatus(
  bookingId: string,
  status: 'approved' | 'rejected',
  voucherId?: string,
  rejectionReason?: string
): Promise<Booking | null> {
  const isApproved = status === 'approved';
  const booking_status = isApproved ? 'confirmed' : 'cancelled';
  const payment_status = isApproved ? 'paid' : 'rejected';

  // 1. LocalStorage update
  const localList = getLocalBookings();
  const target = localList.find(b => b.id === bookingId);
  if (target) {
    target.status = status;
    target.booking_status = booking_status;
    target.payment_status = payment_status;
    if (voucherId) target.voucher_id = voucherId;
    if (rejectionReason) target.rejection_reason = rejectionReason;
    saveLocalBooking(target);
  }

  // 2. Supabase update
  try {
    const updatePayload: any = {
      status,
      booking_status,
      payment_status,
    };
    if (voucherId) updatePayload.voucher_id = voucherId;
    if (rejectionReason) updatePayload.rejection_reason = rejectionReason;

    const { data, error } = await supabase
      .from('bookings')
      .update(updatePayload)
      .eq('id', bookingId)
      .select()
      .single();

    if (!error && data) {
      return data as Booking;
    }
  } catch (e) {
    console.warn('Supabase update status fallback:', e);
  }

  return target || null;
}

/**
 * Rasmni yuklash
 */
export async function uploadReceiptImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}
