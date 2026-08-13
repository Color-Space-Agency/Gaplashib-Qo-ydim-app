import React, { useState } from 'react';
import { X, Calendar, Clock, CreditCard, Upload, CheckCircle2, Send, Info, Copy, Check, ChevronRight, ArrowLeft } from 'lucide-react';
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
  const [bookingType, setBookingType] = useState<'hourly' | 'daily'>('hourly');
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1); // Step 1: Date/Time, Step 2: Payment/Customer, Step 3: Success
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
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

  const handleNextToPayment = () => {
    setErrorMsg('');
    if (bookingType === 'hourly' && !selectedSlot) {
      setErrorMsg('Kamida bitta vaqt tanlang');
      return;
    }
    setModalStep(2);
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
      setErrorMsg("To'lov chekini yuklang");
      return;
    }

    try {
      setLoading(true);

      const displaySlot = bookingType === 'daily' ? `Kunlik: ${selectedDate} dan ${endDate} gacha` : selectedSlot;

      const bookingData = {
        venue_id: venue.id,
        venue_name: venue.name,
        category: venue.category,
        user_name: userName.trim(),
        user_phone: userPhone.trim(),
        user_telegram: userTelegram.trim(),
        date: selectedDate,
        time_slot: displaySlot,
        total_price: venue.price,
        receipt_url: receiptPreview,
      };

      const booking = await createBooking(bookingData);

      const telegramMessage = `⏳ Broningiz va to'lov chekingiz qabul qilindi, admin tasdiqlashini kuting!\n\n🏢 <b>Obyekt:</b> ${venue.name}\n📅 <b>Sana:</b> ${selectedDate} (${displaySlot})\n💳 <b>Summa:</b> ${venue.price.toLocaleString('uz-UZ')} so'm`;
      await sendTelegramNotification(userTelegram.trim(), telegramMessage);

      onBookingCreated(booking);
      setModalStep(3);
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setErrorMsg('Chek yuklashda xatolik. Qaytadan urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <h3 className="font-bold text-slate-100 text-base sm:text-lg">
                {modalStep === 1 && `${venue.name} — Sana va vaqt tanlang`}
                {modalStep === 2 && `${venue.name} — To'lov va ma'lumot`}
                {modalStep === 3 && `Bron qilish muvaffaqiyatli qabul qilindi!`}
              </h3>
              <p className="text-xs text-slate-400">
                Kategoriya: {venue.category} • {venue.city}
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

        {/* STEP 1: Date & Time Selection */}
        {modalStep === 1 && (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Booking Type Pill Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Band qilish turi:
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setBookingType('hourly')}
                  className={`py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    bookingType === 'hourly'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ⏰ Soatlik band qilish
                </button>
                <button
                  type="button"
                  onClick={() => setBookingType('daily')}
                  className={`py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    bookingType === 'daily'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📅 Kunlik band qilish
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
                ⚠️ {errorMsg}
              </div>
            )}

            {bookingType === 'hourly' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Sana tanlang</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Vaqt oralig'i tanlang</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-2.5 text-xs font-bold rounded-xl border transition-all text-center ${
                          selectedSlot === slot
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Kelish sanasi</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Ketish sanasi</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={selectedDate}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleNextToPayment}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold rounded-2xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>To'lovga davom etish</span>
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        )}

        {/* STEP 2: Payment & Customer Details */}
        {modalStep === 2 && (
          <form onSubmit={handleSubmitBooking} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setModalStep(1)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold"
              >
                <ArrowLeft className="w-4 h-4" /> Orqaga (Sana/Vaqt)
              </button>
              <span className="text-xs font-extrabold text-emerald-400">2 / 2 Bosqich</span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Instruction Banner */}
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-300 font-medium">
              <b>{venue.price.toLocaleString('uz-UZ')} so'm</b> miqdorida to'lov qiling, so'ng chek rasmini yuklang. Buyurtma admin tomonidan tasdiqlangandan keyin aktiv bo'ladi.
            </div>

            {/* Card Copy Box */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">To'lov ma'lumotlari:</span>
                <span className="font-bold text-emerald-400">Gaplashib Qo'ydim LLC</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-base sm:text-lg font-mono font-extrabold text-emerald-400 tracking-wider">
                  {CARD_NUMBER}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCard}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold"
                >
                  {copiedCard ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCard ? 'Nusxalandi' : 'Nusxalash'}</span>
                </button>
              </div>
            </div>

            {/* Customer Contact */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                👤 Aloqa ma'lumotlaringiz
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ism va Familiyangiz *"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100"
                  required
                />

                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="Telefon raqamingiz *"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100"
                  required
                />
              </div>

              <input
                type="text"
                value={userTelegram}
                onChange={(e) => setUserTelegram(e.target.value)}
                placeholder="Telegram Chat ID yoki Username (@username) *"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100"
                required
              />
            </div>

            {/* Receipt Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                To'lov cheki rasmi *
              </label>

              <div className="border-2 border-dashed border-slate-700 rounded-2xl p-4 text-center bg-slate-800/40">
                {receiptPreview ? (
                  <div className="space-y-2">
                    <img src={receiptPreview} alt="To'lov cheki" className="max-h-36 mx-auto rounded-xl object-contain border border-slate-700" />
                    <button type="button" onClick={() => { setReceiptFile(null); setReceiptPreview(''); }} className="text-xs text-rose-400 underline">
                      O'chirish
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-7 h-7 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-300 font-medium">Chek rasmini yuklash</p>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="receipt-file-input" />
                    <label htmlFor="receipt-file-input" className="inline-block px-4 py-2 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer">
                      Fayl tanlash
                    </label>
                    <div>
                      <button type="button" onClick={handleUseDemoReceipt} className="text-[11px] text-teal-400 underline">
                        ⚡ Test cheki bilan sinab ko'rish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold rounded-2xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Yuborilmoqda...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Band qilish va Chekni yuborish</span>
                </>
              )}
            </button>

          </form>
        )}

        {/* STEP 3: Success Banner */}
        {modalStep === 3 && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-100">
                Bron qilish qabul qilindi! 🎉
              </h3>
              <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto font-medium">
                ⏳ Broningiz va to'lov chekingiz qabul qilindi, admin tasdiqlashini kuting!
              </p>
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
