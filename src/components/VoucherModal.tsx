import React from 'react';
import { X, QrCode, CheckCircle2, Clock, XCircle, Printer } from 'lucide-react';
import { Booking } from '../types';

interface VoucherModalProps {
  bookings: Booking[];
  onClose: () => void;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({ bookings, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base sm:text-lg">Mening Vaucherlarim va Bandlovlar</h3>
              <p className="text-xs text-slate-400">Platforma orqali band qilingan chipta va vaucherlar ro'yxati</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {bookings.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-2xl">
                🎟️
              </div>
              <h4 className="font-bold text-slate-300">Sizda hali bandlovlar yo'q</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Katalogdan o'zingizga ma'qul joyni tanlab band qilishni amalga oshiring.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className={`p-6 rounded-3xl border transition-all relative overflow-hidden ${
                    b.status === 'approved'
                      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-500/50 shadow-xl shadow-emerald-500/10'
                      : b.status === 'rejected'
                      ? 'bg-slate-900/60 border-rose-500/30'
                      : 'bg-slate-900/80 border-amber-500/30'
                  }`}
                >
                  {/* Top Status Bar */}
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🤝</span>
                      <span className="font-extrabold text-sm text-slate-100">Gaplashib Qo'ydim</span>
                      <span className="text-xs text-slate-400">• {b.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status === 'approved' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-extrabold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> TASDIQLANDI
                        </span>
                      )}
                      {b.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" /> KUTILMOQDA
                        </span>
                      )}
                      {b.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full text-xs font-bold">
                          <XCircle className="w-3.5 h-3.5" /> RAD ETILDI
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main Voucher Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-center">
                    
                    {/* Left Details */}
                    <div className="md:col-span-2 space-y-2">
                      <h4 className="font-extrabold text-lg text-slate-100">{b.venue_name}</h4>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs pt-1">
                        <div>
                          <span className="text-slate-400 block">Sana:</span>
                          <span className="font-semibold text-slate-200">📅 {b.date}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Vaqt:</span>
                          <span className="font-semibold text-emerald-400">⏰ {b.time_slot}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Mijoz:</span>
                          <span className="font-semibold text-slate-200">👤 {b.user_name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">To'lov summasi:</span>
                          <span className="font-bold text-white">💰 {b.total_price.toLocaleString('uz-UZ')} so'm</span>
                        </div>
                      </div>

                      {b.rejection_reason && (
                        <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 mt-2">
                          <b>Rad etilish sababi:</b> {b.rejection_reason}
                        </p>
                      )}
                    </div>

                    {/* Right Voucher ID Box / QR */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-2 flex flex-col items-center justify-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        VOUCHER ID
                      </span>

                      {b.voucher_id ? (
                        <>
                          <span className="font-mono text-base font-extrabold text-emerald-400 tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
                            {b.voucher_id}
                          </span>

                          {/* Simplified QR Representation */}
                          <div className="w-20 h-20 bg-white p-1.5 rounded-lg flex items-center justify-center shadow-md my-1">
                            <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center text-[10px] text-emerald-400 font-mono font-bold">
                              GQ-QR
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500">Xizmat joyida ko'rsating</span>
                        </>
                      ) : (
                        <div className="py-3">
                          <span className="text-xs text-amber-400 font-medium">⏳ Chek tekshirilmoqda</span>
                          <p className="text-[10px] text-slate-500 mt-1">Tasdiqlangach Voucher shakllanadi</p>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Chop etish / Saqlash</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all"
          >
            Yopish
          </button>
        </div>

      </div>
    </div>
  );
};
