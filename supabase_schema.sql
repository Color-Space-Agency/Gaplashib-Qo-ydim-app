-- =========================================================
-- Gaplashib Qo'ydim — Supabase Database Migration SQL Schema
-- =========================================================

-- 1. Create 'venues' table
CREATE TABLE IF NOT EXISTS public.venues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    city TEXT NOT NULL,
    location TEXT NOT NULL,
    price NUMERIC NOT NULL,
    price_unit TEXT NOT NULL,
    rating NUMERIC DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    image TEXT NOT NULL,
    gallery TEXT[],
    features TEXT[],
    description TEXT,
    working_hours TEXT,
    phone TEXT,
    telegram_admin TEXT
);

-- 2. Create 'bookings' table
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    venue_id TEXT REFERENCES public.venues(id),
    venue_name TEXT NOT NULL,
    category TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    user_telegram TEXT NOT NULL,
    date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    receipt_url TEXT NOT NULL,
    voucher_id TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Disable Row Level Security (RLS) or add public read/insert policies
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read venues" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Allow public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update bookings" ON public.bookings FOR UPDATE USING (true);

-- 4. Create Storage Bucket for Payment Receipts
INSERT INTO storage.buckets (id, name, public) 
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public upload receipts" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Allow public read receipts" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'receipts');
