import React, { useState } from 'react';
import { Category, Venue } from '../types';
import { CategoryFilter } from '../components/CategoryFilter';
import { MapPin, Star, Sparkles, ChevronRight, Zap, ArrowUpRight, Trophy, Hotel as HotelIcon, Scissors, Gamepad2, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

interface HomePageProps {
  venues: Venue[];
  onSelectVenue: (venue: Venue) => void;
  onBookVenue: (venue: Venue) => void;
  activeCategory: Category | 'All';
  onSelectCategory: (cat: Category | 'All') => void;
}

const CITIES = ['Barcha shaharlar', 'Toshkent', 'Samarqand', 'Buxoro', 'Andijon', "Farg‘ona"];

export const HomePage: React.FC<HomePageProps> = ({
  venues,
  onSelectVenue,
  onBookVenue,
  activeCategory,
  onSelectCategory,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('Barcha shaharlar');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');

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

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'Stadion': return <Trophy className="w-3.5 h-3.5" />;
      case 'Hotel': return <HotelIcon className="w-3.5 h-3.5" />;
      case 'Barber': return <Scissors className="w-3.5 h-3.5" />;
      case 'PS Club': return <Gamepad2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      
      {/* Target Site Exact Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800/80 p-6 sm:p-10 lg:p-12 shadow-2xl glow-emerald">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-extrabold tracking-wide shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Gaplashib Qo'ydim — Onlayn joy band qilish platformasi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Joy band qiling —{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              tez va oson
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-medium">
            Stadion, hotel, barber, PS club va boshqalarni onlayn band qiling. Vaqt tanlang, to'lov qiling, tasdiqlang.
          </p>

          {/* Quick stats pills */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-extrabold text-slate-200">
            <div className="flex items-center gap-2 bg-slate-800/90 px-4 py-2 rounded-2xl border border-slate-700/80 shadow-md">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>⚽ 100+ Stadionlar</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/90 px-4 py-2 rounded-2xl border border-slate-700/80 shadow-md">
              <HotelIcon className="w-4 h-4 text-emerald-400" />
              <span>🏨 50+ Mehmonxonalar</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/90 px-4 py-2 rounded-2xl border border-slate-700/80 shadow-md">
              <Scissors className="w-4 h-4 text-emerald-400" />
              <span>💈 Barber & PS Klublar</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-2xl border border-emerald-500/20">
              <Zap className="w-4 h-4" />
              <span>Telegram Bot API Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Categories Section */}
      <section className="space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <CategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={onSelectCategory}
          />

          {/* Secondary Controls: City & Sort */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto overflow-x-auto">
            <div className="flex items-center gap-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-bold"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city} className="bg-slate-900 text-slate-200">
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-bold"
              >
                <option value="recommended" className="bg-slate-900 text-slate-200">✨ Tavsiya etilganlar</option>
                <option value="price_low" className="bg-slate-900 text-slate-200">💰 Narx: Arzondan qimmatga</option>
                <option value="price_high" className="bg-slate-900 text-slate-200">💎 Narx: Qimmatdan arzonga</option>
                <option value="rating" className="bg-slate-900 text-slate-200">⭐ Reyting bo'yicha</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Cards Grid */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <span>Mavjud Maskanlar</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-black">
              {filteredVenues.length} ta
            </span>
          </h2>
        </div>

        {filteredVenues.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 border border-slate-800/80 rounded-3xl space-y-3">
            <div className="text-4xl">🔍</div>
            <h3 className="font-extrabold text-slate-200 text-base">Hech qanday joy topilmadi</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Iltimos, boshqa kategoriya yoki shaharni tanlab ko'ring.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="group bg-slate-900 border border-slate-800/80 hover:border-emerald-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-500/15 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div 
                    onClick={() => onSelectVenue(venue)}
                    className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-slate-950"
                  >
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90"></div>

                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-black shadow-md flex items-center gap-1.5">
                      {getCategoryIcon(venue.category)}
                      <span>{venue.category}</span>
                    </span>

                    {/* Rating Badge */}
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/85 backdrop-blur-md text-amber-400 border border-amber-500/30 rounded-full text-xs font-extrabold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{venue.rating}</span>
                    </span>

                    {/* City & Location label */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-slate-300 text-xs font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{venue.city}, {venue.location}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 
                      onClick={() => onSelectVenue(venue)}
                      className="font-extrabold text-slate-100 text-base group-hover:text-emerald-400 transition-colors cursor-pointer line-clamp-1 flex items-center justify-between"
                    >
                      <span>{venue.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </h3>

                    {/* Features list */}
                    <div className="flex flex-wrap gap-1.5">
                      {venue.features.slice(0, 3).map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700/60 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Book Button */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 block uppercase">Narxi:</span>
                      <span className="font-black text-sm sm:text-base text-emerald-400">
                        {venue.price.toLocaleString('uz-UZ')}{' '}
                        <span className="text-xs font-normal text-slate-400">so'm / {venue.price_unit}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => onBookVenue(venue)}
                      className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold rounded-2xl text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1"
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
