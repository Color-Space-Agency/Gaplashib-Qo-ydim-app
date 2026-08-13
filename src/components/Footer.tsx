import React from 'react';
import { Send, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/60">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤝</span>
              <span className="font-extrabold text-slate-100 text-lg">Gaplashib Qo'ydim</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              O'zbekistondagi eng yaxshi stadionlar, mehmonxonalar, sartaroshxonalar va PS klublarni bir necha soniyada onlayn band qilish platformasi.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Xavfsiz va Ishonchli</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-bold text-slate-200 text-sm mb-3">Xizmat Kategoriyalari</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-emerald-400 transition-colors">⚽ Mini-futbol va katta stadionlar</li>
              <li className="hover:text-emerald-400 transition-colors">🏨 Premium va shinam mehmonxonalar</li>
              <li className="hover:text-emerald-400 transition-colors">💈 Erkaklar va ayollar sartaroshxonalari</li>
              <li className="hover:text-emerald-400 transition-colors">🎮 PS5 & VR Kibersport klublari</li>
            </ul>
          </div>

          {/* Col 3: Cities */}
          <div>
            <h4 className="font-bold text-slate-200 text-sm mb-3">Shaharlar</h4>
            <ul className="space-y-2 text-xs">
              <li>📍 Toshkent shahri</li>
              <li>📍 Samarqand viloyati</li>
              <li>📍 Buxoro va Farg'ona</li>
              <li>📍 Namangan va Andijon</li>
            </ul>
          </div>

          {/* Col 4: Contact & Telegram Bot */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm mb-3">Aloqa & Telegram Bot</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+998 71 200 00 99</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Toshkent sh., IT Park binosi</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://t.me/raw_data_bot"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 hover:scale-105 transition-transform"
              >
                <Send className="w-4 h-4" />
                <span>Telegram Bot API Integratsiyasi</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 "Gaplashib Qo'ydim" LLC. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-1">
            <span>O'zbekistonda</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>bilan ishlab chiqildi.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
