import React, { useState, useEffect } from 'react';
import { Booking, Venue, Category } from '../types';
import { getBookings, updateBookingStatus, getVenues, addVenue, deleteVenue, uploadReceiptImage } from '../lib/supabase';
import { sendTelegramNotification } from '../services/telegram';
import { Shield, CheckCircle2, XCircle, Clock, Eye, Send, RefreshCw, Search, PlusCircle, Building2, Trash2, Upload, Check, Image as ImageIcon } from 'lucide-react';

interface AdminPageProps {
  onBackToClient: () => void;
  onVenuesUpdated?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToClient, onVenuesUpdated }) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'add-venue' | 'manage-venues'>('bookings');
  
  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [rejectingBooking, setRejectingBooking] = useState<Booking | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  // Venues state
  const [venues, setVenues] = useState<Venue[]>([]);
  const [newVenueName, setNewVenueName] = useState<string>('');
  const [newCategory, setNewCategory] = useState<Category>('Stadion');
  const [newCity, setNewCity] = useState<string>('Toshkent');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newPrice, setNewPrice] = useState<number>(100000);
  const [newPriceUnit, setNewPriceUnit] = useState<string>('soat');
  const [newImage, setNewImage] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [newFeatures, setNewFeatures] = useState<string>('WiFi, Avtoturargoh, Kiyinish xonasi');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newWorkingHours, setNewWorkingHours] = useState<string>('09:00 - 23:00');
  const [newPhone, setNewPhone] = useState<string>('+998 90 ');
  const [newTelegramAdmin, setNewTelegramAdmin] = useState<string>('@admin');
  const [addVenueLoading, setAddVenueLoading] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    const fetchedBookings = await getBookings();
    setBookings(fetchedBookings);
    const fetchedVenues = await getVenues();
    setVenues(fetchedVenues);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesSearch =
      b.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.user_phone.includes(searchQuery) ||
      b.venue_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.voucher_id && b.voucher_id.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const approvedCount = bookings.filter((b) => b.status === 'approved').length;
  const rejectedCount = bookings.filter((b) => b.status === 'rejected').length;
  const totalRevenue = bookings
    .filter((b) => b.status === 'approved')
    .reduce((sum, b) => sum + b.total_price, 0);

  // Approve action (TASDIQLASH)
  const handleApprove = async (booking: Booking) => {
    try {
      setActionLoadingId(booking.id);
      
      const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      const voucherId = `GQ-2026-${randomCode}`;

      await updateBookingStatus(booking.id, 'approved', voucherId);

      const telegramMessage = `
🎉 <b>TABRIKLAYMIZ! BRONINGIZ TASDIQLANDI!</b>

🎫 <b>Vaucher ID:</b> <code>${voucherId}</code>
🏢 <b>Obyekt:</b> ${booking.venue_name}
📅 <b>Sana va vaqt:</b> ${booking.date} (${booking.time_slot})
💰 <b>To'lov summasi:</b> ${booking.total_price.toLocaleString('uz-UZ')} so'm
✅ <b>To'lov holati:</b> paid (To'langan)
✅ <b>Bron holati:</b> confirmed (Tasdiqlangan)

<i>Xizmat ko'rsatish joyiga borganingizda ushbu Vaucher ID ni taqdim eting!</i>
      `.trim();

      const telegramRes = await sendTelegramNotification(booking.user_telegram, telegramMessage);

      if (telegramRes.success) {
        setNotificationMsg({
          type: 'success',
          text: `Bron tasdiqlandi! Vaucher ID (${voucherId}) Telegram (${booking.user_telegram}) ga yuborildi.`,
        });
      } else {
        setNotificationMsg({
          type: 'success',
          text: `Bron tasdiqlandi (${voucherId})! Telegram xabari yuborilmadi: ${telegramRes.error}`,
        });
      }

      await loadData();
    } catch (err: any) {
      console.error('Approve error:', err);
      setNotificationMsg({ type: 'error', text: err.message || 'Tasdiqlashda xatolik' });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setNotificationMsg(null), 6000);
    }
  };

  // Reject action
  const handleConfirmReject = async () => {
    if (!rejectingBooking) return;

    try {
      setActionLoadingId(rejectingBooking.id);

      await updateBookingStatus(rejectingBooking.id, 'rejected', undefined, rejectReason);

      const telegramMessage = `
❌ <b>TO'LOV VA BRON RAD ETILDI</b>

🏢 <b>Obyekt:</b> ${rejectingBooking.venue_name}
📅 <b>Sana:</b> ${rejectingBooking.date} (${rejectingBooking.time_slot})
⚠️ <b>Sabab:</b> ${rejectReason || "To'lov cheki tasdiqlanmadi, iltimos qayta tekshirib ko'ring."}

<i>Savollaringiz bo'lsa, ma'muriyat bilan bog'laning.</i>
      `.trim();

      await sendTelegramNotification(rejectingBooking.user_telegram, telegramMessage);

      setNotificationMsg({
        type: 'success',
        text: `Bron rad etildi va mijozga Telegram orqali xabar yuborildi.`,
      });

      setRejectingBooking(null);
      setRejectReason('');
      await loadData();
    } catch (err: any) {
      console.error('Reject error:', err);
      setNotificationMsg({ type: 'error', text: err.message || 'Rad etishda xatolik' });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setNotificationMsg(null), 5000);
    }
  };

  // Image Upload handler for new venue
  const handleVenueImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await uploadReceiptImage(file);
      setNewImage(base64);
      setImagePreview(base64);
    }
  };

  // Sample image template
  const handleUseSampleImage = (url: string) => {
    setNewImage(url);
    setImagePreview(url);
  };

  // Add New Venue submit
  const handleAddVenueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVenueName.trim()) {
      alert("Iltimos, biznes/joy nomini kiriting");
      return;
    }
    if (!imagePreview && !newImage.trim()) {
      alert("Iltimos, rasm yuklang yoki URL kiriting");
      return;
    }

    try {
      setAddVenueLoading(true);
      const finalImage = imagePreview || newImage.trim();

      const venuePayload = {
        name: newVenueName.trim(),
        category: newCategory,
        city: newCity,
        location: newLocation.trim() || `${newCity} markazi`,
        price: Number(newPrice),
        price_unit: newPriceUnit,
        rating: 5.0,
        reviews_count: 1,
        image: finalImage,
        gallery: [finalImage],
        features: newFeatures.split(',').map((f) => f.trim()).filter(Boolean),
        description: newDescription.trim() || `${newVenueName} xizmat ko'rsatish shoxobchasi.`,
        working_hours: newWorkingHours.trim(),
        phone: newPhone.trim(),
        telegram_admin: newTelegramAdmin.trim(),
      };

      await addVenue(venuePayload);

      setNotificationMsg({
        type: 'success',
        text: `Yangi joy "${newVenueName}" muvaffaqiyatli qo'shildi!`,
      });

      // Reset Form
      setNewVenueName('');
      setNewLocation('');
      setNewImage('');
      setImagePreview('');
      setNewDescription('');
      
      await loadData();
      if (onVenuesUpdated) onVenuesUpdated();
      setActiveTab('manage-venues');
    } catch (err: any) {
      alert("Xatolik: " + err.message);
    } finally {
      setAddVenueLoading(false);
      setTimeout(() => setNotificationMsg(null), 5000);
    }
  };

  // Delete Venue
  const handleDeleteVenue = async (id: string, name: string) => {
    if (confirm(`Haqiqatan ham "${name}" joyini o'chirmoqchimisiz?`)) {
      await deleteVenue(id);
      await loadData();
      if (onVenuesUpdated) onVenuesUpdated();
      setNotificationMsg({ type: 'success', text: `"${name}" o'chirildi.` });
      setTimeout(() => setNotificationMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Administrator Paneli</h1>
            <p className="text-xs text-slate-400">
              Biznes va joylarni boshqarish, to'lov cheklarini tasdiqlash hamda Telegram Vaucher yuborish
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={loadData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all"
            title="Yangilash"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onBackToClient}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all active:scale-95 shadow-md shadow-emerald-600/20"
          >
            Mijoz rejimiga o'tish
          </button>
        </div>
      </div>

      {/* Main Admin Mode Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'bookings'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>📥 Bronlar & To'lovlar</span>
          {pendingCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-extrabold rounded-full animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('add-venue')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'add-venue'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>➕ Yangi Joy / Biznes Qo'shish</span>
        </button>

        <button
          onClick={() => setActiveTab('manage-venues')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'manage-venues'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>🏢 Maskanlar Ro'yxati ({venues.length})</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notificationMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-lg animate-bounce ${
            notificationMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <span>{notificationMsg.text}</span>
          <button onClick={() => setNotificationMsg(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: BOOKINGS & PAYMENTS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-slate-400">Jami Bronlar</span>
              <p className="text-2xl font-extrabold text-white">{bookings.length}</p>
            </div>

            <div className="p-4 bg-slate-900 border border-amber-500/30 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Kutilayotgan cheklar
              </span>
              <p className="text-2xl font-extrabold text-amber-400">{pendingCount}</p>
            </div>

            <div className="p-4 bg-slate-900 border border-emerald-500/30 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tasdiqlanganlar (paid)
              </span>
              <p className="text-2xl font-extrabold text-emerald-400">{approvedCount}</p>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-slate-400">Jami Tasdiqlangan Tushum</span>
              <p className="text-xl font-extrabold text-emerald-400">{totalRevenue.toLocaleString('uz-UZ')} so'm</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    filterStatus === st
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st === 'all' && 'Barchasi'}
                  {st === 'pending' && `Kutilmoqda (${pendingCount})`}
                  {st === 'approved' && `Tasdiqlangan (${approvedCount})`}
                  {st === 'rejected' && `Rad etilgan (${rejectedCount})`}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mijoz ismi, tel yoki obyekt..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="py-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl space-y-2">
                <div className="text-2xl">📥</div>
                <h4 className="font-bold text-slate-300">Hech qanday bron topilmadi</h4>
              </div>
            ) : (
              filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 bg-slate-900 border border-slate-800 rounded-3xl hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-white">{b.venue_name}</span>
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700 font-medium">
                        {b.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" /> Kutilmoqda
                        </span>
                      )}
                      {b.status === 'approved' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-extrabold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CONFIRMED (PAID)
                        </span>
                      )}
                      {b.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full text-xs font-bold">
                          <XCircle className="w-3.5 h-3.5" /> REJECTED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">Mijoz ma'lumotlari:</span>
                      <p className="font-bold text-slate-100">👤 {b.user_name}</p>
                      <p className="text-slate-300">📞 {b.user_phone}</p>
                      <p className="text-emerald-400 font-mono">💬 Telegram: {b.user_telegram}</p>
                    </div>

                    <div className="space-y-1 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">Bron vaqti:</span>
                      <p className="font-bold text-slate-200">📅 Sana: {b.date}</p>
                      <p className="font-bold text-emerald-400">⏰ Vaqt: {b.time_slot}</p>
                      <p className="text-white font-extrabold">💰 Summa: {b.total_price.toLocaleString('uz-UZ')} so'm</p>
                    </div>

                    <div className="space-y-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">To'lov Cheki:</span>
                        {b.receipt_url ? (
                          <button
                            onClick={() => setSelectedReceipt(b.receipt_url)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Chekni ko'rish</span>
                          </button>
                        ) : (
                          <span className="text-slate-500">Chek yuklanmagan</span>
                        )}
                      </div>

                      {b.voucher_id && (
                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] text-slate-400 block">Vaucher ID:</span>
                          <span className="font-mono text-xs font-extrabold text-emerald-400">{b.voucher_id}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => setRejectingBooking(b)}
                          disabled={actionLoadingId === b.id}
                          className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all"
                        >
                          Reject (Rad etish)
                        </button>

                        <button
                          onClick={() => handleApprove(b)}
                          disabled={actionLoadingId === b.id}
                          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
                        >
                          {actionLoadingId === b.id ? (
                            <span>Yuborilmoqda...</span>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Approve (paid & confirmed + Telegram Vaucher)</span>
                            </>
                          )}
                        </button>
                      </>
                    )}

                    {b.status === 'approved' && (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mijoz Telegramiga Vaucher yuborilgan ({b.voucher_id}) • payment_status = paid</span>
                      </div>
                    )}

                    {b.status === 'rejected' && (
                      <span className="text-xs text-rose-400 font-semibold">
                        Rad etilgan: {b.rejection_reason || "To'lov tasdiqlanmadi"} • payment_status = rejected
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ADD NEW VENUE / BUSINESS FORM */}
      {activeTab === 'add-venue' && (
        <form onSubmit={handleAddVenueSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Yangi Biznes yoki Maskan Qo'shish</h2>
              <p className="text-xs text-slate-400">Stadion, Mehmonxona, Sartaroshxona yoki PS Klub yaratish va katalogga chiqarish</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Biznes / Maskan nomi *</label>
              <input
                type="text"
                value={newVenueName}
                onChange={(e) => setNewVenueName(e.target.value)}
                placeholder="Masalan: Milliy Turf Arena"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Kategoriya *</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Stadion">⚽ Stadion (Mini-futbol / Katta)</option>
                <option value="Hotel">🏨 Hotel (Mehmonxona)</option>
                <option value="Barber">💈 Barber (Sartaroshxona)</option>
                <option value="PS Club">🎮 PS Club (Playstation Arena)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Shahar *</label>
              <select
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Toshkent">Toshkent</option>
                <option value="Samarqand">Samarqand</option>
                <option value="Buxoro">Buxoro</option>
                <option value="Namangan">Namangan</option>
                <option value="Andijon">Andijon</option>
                <option value="Farg'ona">Farg'ona</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Manzil & Mo'ljal *</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Chilonzor 19-mavze, Metrogacha 200m"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Xizmat narxi (so'mda) *</label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                placeholder="150000"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Narx o'lchov birligi *</label>
              <select
                value={newPriceUnit}
                onChange={(e) => setNewPriceUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="soat">soat (masalan: 150.000 so'm/soat)</option>
                <option value="kun">kun (mehmonxona uchun)</option>
                <option value="seans">seans (sartaroshxona uchun)</option>
              </select>
            </div>
          </div>

          {/* Image Upload Box */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300">Asosiy Rasm (Fayl yuklang yoki URL kiritishingiz mumkin) *</label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* File upload */}
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-800/40">
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Preview" className="h-32 mx-auto rounded-xl object-cover border border-slate-700" />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(''); setNewImage(''); }}
                      className="text-xs text-rose-400 underline"
                    >
                      Rasmni o'chirish
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <p className="text-xs text-slate-300">Kompyuterdan rasm tanlang</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleVenueImageUpload}
                      className="hidden"
                      id="venue-image-file"
                    />
                    <label
                      htmlFor="venue-image-file"
                      className="inline-block px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
                    >
                      Fayl Tanlash
                    </label>
                  </div>
                )}
              </div>

              {/* Image URL input */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Rasm URL havolasi (Muqobil)</label>
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => { setNewImage(e.target.value); setImagePreview(e.target.value); }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Tayyor shablon rasmlardan birini tanlash:</span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    <button
                      type="button"
                      onClick={() => handleUseSampleImage('https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=800')}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700 text-slate-300 whitespace-nowrap"
                    >
                      ⚽ Stadion
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUseSampleImage('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800')}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700 text-slate-300 whitespace-nowrap"
                    >
                      🏨 Mehmonxona
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUseSampleImage('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800')}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700 text-slate-300 whitespace-nowrap"
                    >
                      💈 Barber
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUseSampleImage('https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800')}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700 text-slate-300 whitespace-nowrap"
                    >
                      🎮 PS Club
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Qulayliklar va Xizmatlar (Vergul bilan belgilang)</label>
              <input
                type="text"
                value={newFeatures}
                onChange={(e) => setNewFeatures(e.target.value)}
                placeholder="Dush, Yoritgichlar, WiFi, VIP kabina"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Ish vaqti</label>
              <input
                type="text"
                value={newWorkingHours}
                onChange={(e) => setNewWorkingHours(e.target.value)}
                placeholder="09:00 - 02:00 yoki 24/7"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Telefon raqami</label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Telegram Admin (@username)</label>
              <input
                type="text"
                value={newTelegramAdmin}
                onChange={(e) => setNewTelegramAdmin(e.target.value)}
                placeholder="@admin_handle"
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Batafsil Tavsif</label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Joy va biznes haqida batafsil ma'lumot kiriting..."
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 h-24"
            />
          </div>

          <button
            type="submit"
            disabled={addVenueLoading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-2xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {addVenueLoading ? (
              <span>Saqlanmoqda...</span>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                <span>Yangi Biznes / Joyni Katalogga Qo'shish</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* TAB 3: MANAGE EXISTING VENUES */}
      {activeTab === 'manage-venues' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Mavjud Joy va Bizneslar Ro'yxati ({venues.length} ta)</h2>
            <button
              onClick={() => setActiveTab('add-venue')}
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yangi qo'shish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {venues.map((v) => (
              <div key={v.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-950/80 text-emerald-400 rounded-full text-[10px] font-extrabold">
                      {v.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm">{v.name}</h3>
                  <p className="text-xs text-slate-400">📍 {v.city}, {v.location}</p>
                  <p className="text-xs font-extrabold text-emerald-400">💰 {v.price.toLocaleString('uz-UZ')} so'm / {v.price_unit}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleDeleteVenue(v.id, v.name)}
                    className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-bold p-1.5 rounded-lg hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>O'chirish</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Receipt View Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm">To'lov Cheki Skrinshoti</h3>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto flex items-center justify-center bg-slate-950 rounded-2xl p-2">
              <img src={selectedReceipt} alt="To'lov Cheki" className="max-h-[60vh] object-contain rounded-xl" />
            </div>

            <button onClick={() => setSelectedReceipt(null)} className="w-full py-2.5 bg-slate-800 text-slate-200 font-bold rounded-xl text-xs">
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-100 text-base">Bronni Rad Etish</h3>
            <p className="text-xs text-slate-400">
              Iltimos, bron va to'lov nima uchun rad etilayotganini belgilang (Mijozning Telegramiga yuboriladi):
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Masalan: To'lov cheki tasdiqlanmadi, iltimos qayta tekshirib ko'ring."
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-rose-500 h-24"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setRejectingBooking(null)} className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl">
                Bekor qilish
              </button>
              <button onClick={handleConfirmReject} className="px-5 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20">
                Rad etishni tasdiqlash
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
