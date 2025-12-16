
import { TELEGRAM_CONFIG } from '../data';

export const sendTelegramNotification = async (message: string): Promise<boolean> => {
  // If config is missing, just log and return
  if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.chatId || TELEGRAM_CONFIG.botToken.includes("ВАШ_")) {
    console.warn("Telegram Bot Token or Chat ID is not configured in data.ts");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.chatId,
        text: message,
        parse_mode: 'HTML' // Allows using <b>, <i>, etc.
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Telegram message:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return false;
  }
};
