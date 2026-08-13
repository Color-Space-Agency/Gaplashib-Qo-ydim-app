import { Booking, Venue } from '../types';

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8970242428:AAF_7ihVIyhEpj6ZxmOv83tKBmOQh2ISs2c';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Telegram Chat ID ga HTML xabar yuborish
 */
export async function sendTelegramMessage(chatId: string, text: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    if (!chatId || chatId.trim() === '') {
      return { success: false, error: 'Telegram Chat ID kiritilmagan' };
    }

    // Agar chat ID username ko'rinishida bo'lsa (masalan @username), uni ham qo'llab-quvvatlaymiz
    const formattedChatId = chatId.startsWith('@') || !isNaN(Number(chatId)) ? chatId.trim() : `@${chatId.trim()}`;

    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: formattedChatId,
        text: text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.warn('Telegram API Error:', data);
      return { success: false, error: data.description || 'Telegram xabarini yuborishda xatolik' };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Telegram notification error:', err);
    return { success: false, error: err.message || 'Tarmoq xatoligi' };
  }
}

/**
 * Telegram Chat ID ga Rasm (Masalan Chek yoki Vaucher) yuborish
 */
export async function sendTelegramPhoto(chatId: string, photoUrl: string, caption?: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    if (!chatId) return { success: false, error: 'Chat ID yoq' };

    const formattedChatId = chatId.startsWith('@') || !isNaN(Number(chatId)) ? chatId.trim() : `@${chatId.trim()}`;

    const response = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: formattedChatId,
        photo: photoUrl,
        caption: caption || '',
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    return { success: data.ok, data, error: data.description };
  } catch (err: any) {
    console.error('Telegram sendPhoto error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Yangi bandlov yuborilganda Telegram orqali bildirishnoma
 */
export async function notifyNewBookingSubmitted(booking: Booking, venue?: Venue) {
  const message = `
<b>📝 YANGI BANDLOV QABUL QILINDI!</b>

<b>Loyiha:</b> Gaplashib Qo'ydim 🤝
<b>Joy:</b> ${booking.venue_name} (${booking.category})
<b>Sana:</b> 📅 ${booking.date}
<b>Vaqt:</b> ⏰ ${booking.time_slot}
<b>Mijoz:</b> 👤 ${booking.user_name}
<b>Telefon:</b> 📞 ${booking.user_phone}
<b>Summa:</b> 💳 ${booking.total_price.toLocaleString('uz-UZ')} so'm
<b>Holati:</b> ⏳ Tekshirilmoqda (To'lov cheki yuklandi)

<i>To'lov cheki administrator tomonidan tekshirilgandan so'ng, sizga tasdiqlangan Voucher ID yuboriladi!</i>
  `.trim();

  return await sendTelegramMessage(booking.user_telegram, message);
}

/**
 * Admin bandlovni TASDIQLAGANDA (Approve) Telegram orqali Voucher yuborish
 */
export async function notifyBookingApproved(booking: Booking, voucherId: string) {
  const message = `
<b>🎉 TABRIKLAYMIZ! BANDLOVINGIZ TASDIQLANDI!</b>

<b>Loyiha:</b> Gaplashib Qo'ydim 🤝
----------------------------------
<b>🎫 VOUCHER ID:</b> <code>${voucherId}</code>
----------------------------------
<b>🏢 Xizmat ko'rsatuvchi:</b> ${booking.venue_name} (${booking.category})
<b>📅 Sana:</b> ${booking.date}
<b>⏰ Vaqt:</b> ${booking.time_slot}
<b>👤 Mijoz:</b> ${booking.user_name}
<b>📞 Tel:</b> ${booking.user_phone}
<b>💰 To'lov:</b> ${booking.total_price.toLocaleString('uz-UZ')} so'm (To'liq to'landi)
<b>✅ Holati:</b> TASDIQLANDI VA BAND ETILDI

📌 <i>Xizmat joyiga borganingizda ma'muriyatga ushbu Voucher ID (<b>${voucherId}</b>) ni taqdim eting.</i>
<i>"Gaplashib Qo'ydim" xizmatidan foydalanganingiz uchun rahmat!</i>
  `.trim();

  // Telegram rasm bormi yoki yo'qligini tekshirib yuborish
  if (booking.receipt_url && booking.receipt_url.startsWith('http')) {
    await sendTelegramPhoto(booking.user_telegram, booking.receipt_url, `<b>Voucher:</b> <code>${voucherId}</code> - ${booking.venue_name}`);
  }

  return await sendTelegramMessage(booking.user_telegram, message);
}

/**
 * Admin bandlovni RAD ETGANDA (Reject)
 */
export async function notifyBookingRejected(booking: Booking, reason?: string) {
  const message = `
<b>❌ BANDLOV RAD ETILDI</b>

<b>Loyiha:</b> Gaplashib Qo'ydim 🤝
<b>Joy:</b> ${booking.venue_name}
<b>Sana:</b> ${booking.date} (${booking.time_slot})
<b>Sabab:</b> ${reason || "To'lov cheki tasdiqlanmadi yoki vaqt band qilingan."}

<i>Savollar bo'lsa, iltimos qo'llab-quvvatlash xizmati bilan bog'laning.</i>
  `.trim();

  return await sendTelegramMessage(booking.user_telegram, message);
}
