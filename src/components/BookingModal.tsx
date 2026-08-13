import React, { useState } from 'react';
import { X, Calendar, Clock, CreditCard, Upload, CheckCircle2, Send, Info, Copy, Check } from 'lucide-react';
import { Venue, Booking } from '../types';
import { createBooking, uploadReceiptImage } from '../lib/supabase';
import { sendTelegramNotification } from '../services/telegram';

interface BookingModalProps {
  venue: Venue;
  onClose: () => void;
  onBookingCreated: (booking: Booking) => void;
}

const TIME_SLOTS = [
  '10:00 - 11:00',
  '11:00 - 12:00',
  '14:00 - 15:00',
  '16:00 - 17:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
  '21:00 - 22:00',
];

const CARD_NUMBER = '8600 1234 5678 9012';

export const BookingModal: React.FC<BookingModalProps> = ({ venue, onClose, onBookingCreated }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>(TIME_SLOTS[4]);
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('+998 ');
  const [userTelegram, setUserTelegram] = useState<string>('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>('');
  const [copiedCard, setCopiedCard] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleCopyCard = () => {
    navigator.clipboard.writeText(CARD_NUMBER.replace(/\s/g, ''));
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptFile(file);
      const base64 = await uploadReceiptImage(file);
      setReceiptPreview(base64);
    }
  };

  const handleUseDemoReceipt = () => {
    const demoUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400';
    setReceiptPreview(demoUrl);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!userName.trim()) {
      setErrorMsg('Iltimos, ism-familiyangizni kiriting');
      return;
    }
    if (!userPhone.trim() || userPhone.trim() === '+998') {
      setErrorMsg('Iltimos, telefon raqamingizni kiriting');
      return;
    }
    if (!userTelegram.trim()) {
      setErrorMsg('Iltimos, Telegram Chat ID yoki username kiriting');
      return;
    }
    if (!receiptPreview) {
      setErrorMsg("Iltimos, to'lov cheki skrinshotini yuklang");
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        venue_id: venue.id,
        venue_name: venue.name,
        category: venue.category,
        user_name: userName.trim(),
        user_phone: userPhone.trim(),
        user_telegram: userTelegram.trim(),
        date: selectedDate,
        time_slot: selectedSlot,
        total_price: venue.price,
        receipt_url: receiptPreview,
      };

      // 1. Supabase'dagi bookings jadvaliga saqlash
      const booking = await createBooking(bookingData);

      // 2. Foydalanuvchiga Telegram xabarnoma yuborish
      const telegramMessage = `⏳ Broningiz va to'lov chekingiz qabul qilindi, admin tasdiqlashini kuting!\n\n🏢 <b>Obyekt:</b> ${venue.name}\n📅 <b>Sana:</b> ${selectedDate} (${selectedSlot})\n💳 <b>Summa:</b> ${venue.price.toLocaleString('uz-UZ')} so'm`;
      await sendTelegramNotification(userTelegram.trim(), telegramMessage);

      onBookingCreated(booking);
      setStep('success');
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setErrorMsg(err.message || 'Bron qilishda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <h3 className="font-bold text-slate-100 text-base sm:text-lg">
                {step === 'form' ? `${venue.name} — Bron Qilish` : 'Bron qilish muvaffaqiyatli qabul qilindi!'}
              </h3>
              <p className="text-xs text-slate-400">
                {step === 'form' ? `Kategoriya: ${venue.category} • ${venue.city}` : "To'lov cheki tekshirish uchun yuborildi"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmitBooking} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Venue Summary Card */}
            <div className="flex items-center gap-4 p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
              <img
                src={venue.image}
                alt={venue.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-100 text-sm truncate">{venue.name}</h4>
                <p className="text-xs text-slate-400 truncate">{venue.location}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-emerald-400">
                    {venue.price.toLocaleString('uz-UZ')} so'm / {venue.price_unit}
                  </span>
                  <span className="text-[11px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md font-medium">
                    ⭐ {venue.rating} ({venue.reviews_count})
                  </span>
                </div>
              </div>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* 1. Date & Time Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Calendar className="w-4 h-4" /> 1. Sana va Vaqtni tanlang
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bron sanasi</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tanlangan vaqt intervali</label>
                  <div className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-semibold text-emerald-400 flex items-center justify-between">
                    <span>{selectedSlot}</span>
                    <Clock className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {TIME_SLOTS.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2.5 text-xs font-semibold rounded-xl border transition-all text-center ${
                      selectedSlot === slot
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Customer Information */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                👤 2. Aloqa Ma'lumotlaringiz
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Ism va Familiyangiz *</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Masalan: Sardor Rahimov"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Telefon raqamingiz *</label>
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Telegram Chat ID yoki Username * (Voucher ID yuborilishi uchun)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">💬</span>
                  <input
                    type="text"
                    value={userTelegram}
                    onChange={(e) => setUserTelegram(e.target.value)}
                    placeholder="Masalan: @sardor_dev yoki 123456789"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="mt-2 p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-start gap-2.5 text-xs text-teal-300">
                  <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <p>
                    <b>Chat ID ni qayerdan olsam bo'ladi?</b> Telegramda <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="underline font-bold text-emerald-400 hover:text-emerald-300">@userinfobot</a> ga biron xabar yozing. Bot sizga ID raqamingizni ko'rsatadi.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Payment & Receipt Upload */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <CreditCard className="w-4 h-4" /> 3. To'lov qilish va Chekni yuklash
              </label>

              <div className="p-4 bg-gradient-to-r from-slate-800 via-slate-800/90 to-emerald-950/40 border border-slate-700/80 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400">To'lov uchun karta (Click / Payme):</span>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Gaplashib Qo'ydim LLC
                  </span>
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base sm:text-lg font-mono font-extrabold tracking-wider text-emerald-400">
                    {CARD_NUMBER}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCard}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold transition-all active:scale-95"
                  >
                    {copiedCard ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCard ? 'Nusxalandi' : 'Nusxalash'}</span>
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-700/50">
                  <span className="text-slate-400">To'lanadigan jami summa:</span>
                  <span className="text-sm font-extrabold text-white">
                    {venue.price.toLocaleString('uz-UZ')} so'm
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">To'lov cheki (Skrinshot) yuklang *</label>
                
                <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/70 rounded-2xl p-4 text-center transition-colors bg-slate-800/40">
                  {receiptPreview ? (
                    <div className="space-y-3">
                      <img
                        src={receiptPreview}
                        alt="To'lov cheki"
                        className="max-h-40 mx-auto rounded-xl border border-slate-700 object-contain shadow-md"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Chek biriktirildi
                        </span>
                        <button
                          type="button"
                          onClick={() => { setReceiptFile(null); setReceiptPreview(''); }}
                          className="text-xs text-rose-400 hover:underline ml-2"
                        >
                          O'chirish
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-300 font-medium">
                        Faylni shu yerga tashlang yoki <span className="text-emerald-400 font-bold underline">tanlang</span>
                      </p>
                      <p className="text-[11px] text-slate-500">PNG, JPG, JPEG (Maks. 10MB)</p>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="receipt-upload-input"
                      />
                      <label
                        htmlFor="receipt-upload-input"
                        className="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 cursor-pointer transition-all"
                      >
                        Fayl tanlash
                      </label>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleUseDemoReceipt}
                          className="text-[11px] text-teal-400 hover:underline font-medium"
                        >
                          ⚡ Test uchun tayyor chek bilan sinab ko'rish
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-all"
              >
                Bekor qilish
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Bron qilish va Chekni Yuborish</span>
                  </>
                )}
              </button>
            </div>

          </form>
        ) : (
          /* Step Success */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-100">
                Bron qilish qabul qilindi! 🎉
              </h3>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
                ⏳ Broningiz va to'lov chekingiz qabul qilindi, admin tasdiqlashini kuting!
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between border-b border-slate-700/60 pb-2">
                <span className="text-slate-400">Obyekt:</span>
                <span className="font-bold text-white">{venue.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-700/60 pb-2">
                <span className="text-slate-400">Sana & Vaqt:</span>
                <span className="font-bold text-emerald-400">{selectedDate} ({selectedSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Holati:</span>
                <span className="font-bold text-amber-400">⏳ Chek tekshirilmoqda</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all"
            >
              Tushundim, Yopish
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
