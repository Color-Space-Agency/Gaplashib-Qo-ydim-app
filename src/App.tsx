import React, { useState, useEffect } from 'react';
import { Category, Venue, Booking } from './types';
import { getVenues, getBookings } from './lib/supabase';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { VenueDetailPage } from './pages/VenueDetailPage';
import { AdminPage } from './pages/AdminPage';
import { BookingModal } from './components/BookingModal';
import { VoucherModal } from './components/VoucherModal';

export function App() {
  const [activeView, setActiveView] = useState<'home' | 'venue-detail' | 'admin'>('home');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('Barcha shaharlar');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [bookingVenue, setBookingVenue] = useState<Venue | null>(null);
  const [isVouchersOpen, setIsVouchersOpen] = useState<boolean>(false);

  // Load Venues & Bookings
  const refreshData = async () => {
    const fetchedVenues = await getVenues();
    setVenues(fetchedVenues);
    const fetchedBookings = await getBookings();
    setBookings(fetchedBookings);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const displayedVenues = venues.filter((v) => {
    const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
    const matchesCity = selectedCity === 'Barcha shaharlar' || v.city === selectedCity;
    const matchesSearch =
      !searchQuery.trim() ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesCity && matchesSearch;
  });

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  const handleSelectVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setActiveView('venue-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookVenue = (venue: Venue) => {
    setBookingVenue(venue);
  };

  const handleBookingCreated = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 pb-16 md:pb-0">
      <div>
        {/* Header */}
        <Header
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            if (activeView !== 'home') setActiveView('home');
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (activeView !== 'home') setActiveView('home');
          }}
          selectedCity={selectedCity}
          onCityChange={setSelectedCity}
          onOpenAdmin={() => setActiveView('admin')}
          onOpenVouchers={() => setIsVouchersOpen(true)}
          pendingCount={pendingCount}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {activeView === 'home' && (
            <HomePage
              venues={displayedVenues}
              onSelectVenue={handleSelectVenue}
              onBookVenue={handleBookVenue}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          )}

          {activeView === 'venue-detail' && selectedVenue && (
            <VenueDetailPage
              venue={selectedVenue}
              onBack={() => setActiveView('home')}
              onBook={() => handleBookVenue(selectedVenue)}
            />
          )}

          {activeView === 'admin' && (
            <AdminPage
              onBackToClient={() => setActiveView('home')}
              onVenuesUpdated={refreshData}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeView={activeView}
        onNavigateHome={() => setActiveView('home')}
        onOpenVouchers={() => setIsVouchersOpen(true)}
        onOpenAdmin={() => setActiveView('admin')}
        pendingCount={pendingCount}
      />

      {/* Booking Modal */}
      {bookingVenue && (
        <BookingModal
          venue={bookingVenue}
          onClose={() => setBookingVenue(null)}
          onBookingCreated={handleBookingCreated}
        />
      )}

      {/* Vouchers Modal */}
      {isVouchersOpen && (
        <VoucherModal
          bookings={bookings}
          onClose={() => setIsVouchersOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
