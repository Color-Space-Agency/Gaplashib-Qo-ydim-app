import React, { useState } from 'react';
import { Venue } from '../types';
import { ArrowLeft, MapPin, Star, Phone, Clock, Send, ShieldCheck, CheckCircle2, Calendar, Share2 } from 'lucide-react';

interface VenueDetailPageProps {
  venue: Venue;
  onBack: () => void;
  onBook: () => void;
}

export const VenueDetailPage: React.FC<VenueDetailPageProps> = ({ venue, onBack, onBook }) => {
  const [selectedImage, setSelectedImage] = useState<string>(venue.image);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs sm:text-sm font-semibold border border-slate-700 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Orqaga qaytish</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{copiedLink ? 'Ulashildi!' : 'Ulashish'}</span>
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Images & Features */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Hero Image */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
            <img
              src={selectedImage}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-extrabold">
                {venue.category}
              </span>

              <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {venue.rating} ({venue.reviews_count} sharhlar)
              </span>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {venue.gallery && venue.gallery.length > 0 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {venue.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === imgUrl ? 'border-emerald-400 scale-105 shadow-lg shadow-emerald-500/20' : 'border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Galereya ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description & Specification */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{venue.name}</h1>
              <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{venue.city}, {venue.location}</span>
              </p>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h3 className="font-bold text-slate-200 text-sm mb-2">Tavsif va Qulayliklar:</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {venue.description}
              </p>
            </div>

            {/* Features Tags */}
            <div className="border-t border-slate-800 pt-4">
              <h3 className="font-bold text-slate-200 text-sm mb-3">Mavjud xizmatlar va qulayliklar:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {venue.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-xs text-slate-200 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Col: Booking Widget Card */}
        <div className="space-y-6">
          <div className="sticky top-24 p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
            
            {/* Price Box */}
            <div className="p-4 bg-gradient-to-r from-slate-800 to-emerald-950/40 border border-slate-700 rounded-2xl">
              <span className="text-xs text-slate-400 block">Xizmat narxi:</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-extrabold text-emerald-400">
                  {venue.price.toLocaleString('uz-UZ')}
                </span>
                <span className="text-xs text-slate-300 font-semibold">so'm / {venue.price_unit}</span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="space-y-3 text-xs border-y border-slate-800 py-4">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4 text-emerald-400" /> Ish vaqti:
                </span>
                <span className="font-bold text-white">{venue.working_hours}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-4 h-4 text-emerald-400" /> Aloqa telefoni:
                </span>
                <span className="font-bold text-white">{venue.phone}</span>
              </div>

              {venue.telegram_admin && (
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Send className="w-4 h-4 text-emerald-400" /> Telegram admin:
                  </span>
                  <span className="font-bold text-emerald-400">{venue.telegram_admin}</span>
                </div>
              )}
            </div>

            {/* Book Button */}
            <button
              onClick={onBook}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-2xl text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Hozir Band Qilish</span>
            </button>

            <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center gap-2.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>To'lov cheki yuborilgach, Telegramingizga avtomatik Voucher ID yetkaziladi.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
