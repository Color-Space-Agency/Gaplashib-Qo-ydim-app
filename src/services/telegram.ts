const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8970242428:AAF_7ihVIyhEpj6ZxmOv83tKBmOQh2ISs2c';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Telegram Bot API orqali foydalanuvchiga xabar yuboruvchi asinxron funksiya
 */
export async function sendTelegramNotification(chatId: string, text: string): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    if (!chatId || chatId.trim() === '') {
      return { success: false, error: 'Telegram Chat ID kiritilmagan' };
    }

    // Format chat ID if needed (e.g. numeric ID or @username)
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
