import React, { useState } from 'react';
import { Category, Venue, FilterState } from '../types';
import { CategoryFilter } from '../components/CategoryFilter';
import { MapPin, Star, Sparkles, ChevronRight, ShieldCheck, Clock, Check } from 'lucide-react';

interface HomePageProps {
  venues: Venue[];
  onSelectVenue: (venue: Venue) => void;
  onBookVenue: (venue: Venue) => void;
  activeCategory: Category | 'All';
  onSelectCategory: (cat: Category | 'All') => void;
}

const CITIES = ['Barcha shaharlar', 'Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon'];

export const HomePage: React.FC<HomePageProps> = ({
  venues,
  onSelectVenue,
  onBookVenue,
  activeCategory,
  onSelectCategory,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('Barcha shaharlar');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');

  // Filtering logic
  const filteredVenues = venues.filter((v) => {
    const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
    const matchesCity = selectedCity === 'Barcha shaharlar' || v.city === selectedCity;
    return matchesCategory && matchesCity;
  }).sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="space-y-10 pb-12">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> O'zbekistondagi #1 Band Qilish Platformasi
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Stadion, Mehmonxona va PS Klubini{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              "Gaplashib Qo'ying"!
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Telefon qilish va uzoq kutishlarga hojat yo'q. Qulay vaqtni tanlang, to'lov chekini yuklang va Telegram orqali rasmiy <b>Voucher ID</b> qabul qiling.
          </p>

          {/* Quick stats pills */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-emerald-400">⚽</span> 100+ Stadionlar
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-emerald-400">🏨</span> 50+ Mehmonxonalar
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-emerald-400">💈</span> Barber & PS Klublar
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Categories Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={onSelectCategory}
          />

          {/* Secondary Controls: City & Sort */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {/* City selector */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="recommended">Tavsiya etilganlar</option>
              <option value="price_low">Narx: Arzondan qimmatga</option>
              <option value="price_high">Narx: Qimmatdan arzonga</option>
              <option value="rating">Reyting bo'yicha</option>
            </select>
          </div>
        </div>
      </section>

      {/* Venue Cards Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Mavjud Joylar</span>
            <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full border border-slate-700 font-extrabold">
              {filteredVenues.length} ta
            </span>
          </h2>
        </div>

        {filteredVenues.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-3">
            <div className="text-3xl">🔍</div>
            <h3 className="font-bold text-slate-200">Hech qanday joy topilmadi</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Iltimos, boshqa kategoriya yoki shaharni tanlab ko'ring.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col"
              >
                {/* Image & Badges */}
                <div 
                  onClick={() => onSelectVenue(venue)}
                  className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                >
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-extrabold shadow-md">
                    {venue.category === 'Stadion' && '⚽ Stadion'}
                    {venue.category === 'Hotel' && '🏨 Mehmonxona'}
                    {venue.category === 'Barber' && '💈 Sartaroshxona'}
                    {venue.category === 'PS Club' && '🎮 PS Klub'}
                  </span>

                  {/* Rating */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold flex items-center gap-1">
                    ⭐ {venue.rating}
                  </span>

                  {/* Location badge on image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1 text-slate-300 text-xs truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{venue.city}, {venue.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 
                      onClick={() => onSelectVenue(venue)}
                      className="font-bold text-slate-100 text-base group-hover:text-emerald-400 transition-colors cursor-pointer line-clamp-1"
                    >
                      {venue.name}
                    </h3>

                    {/* Features list */}
                    <div className="flex flex-wrap gap-1.5">
                      {venue.features.slice(0, 3).map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Narxi:</span>
                      <span className="font-extrabold text-sm sm:text-base text-emerald-400">
                        {venue.price.toLocaleString('uz-UZ')} <span className="text-xs font-normal text-slate-300">so'm / {venue.price_unit}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => onBookVenue(venue)}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span>Band qilish</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
