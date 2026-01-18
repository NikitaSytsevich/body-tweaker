import type { VercelRequest, VercelResponse } from '@vercel/node';

// Эти переменные мы добавим в настройках Vercel
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL; 

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // 1. Проверяем, что это POST запрос от Телеграма
  if (request.method !== 'POST') {
    return response.status(200).send('Bot is active!');
  }

  try {
    const body = request.body;

    // 2. Проверяем, есть ли сообщение
    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text;

      // 3. Логика ответа
      if (text === '/start') {
        await sendWelcome(chatId);
      } else {
        // На любой другой текст — просто кнопка
        await sendMessage(chatId, 'Нажмите кнопку ниже, чтобы запустить приложение 👇');
      }
    }

    // 4. Всегда отвечаем 200 OK, чтобы Телеграм не слал повторы
    return response.status(200).json({ ok: true });

  } catch (error) {
    console.error('Error sending message:', error);
    return response.status(200).json({ ok: false }); // Все равно 200, чтобы не зациклить
  }
}

// --- ФУНКЦИЯ: Приветствие с картинкой ---
async function sendWelcome(chatId: number) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
  
  // Берем иконку прямо с вашего сайта
  const photoUrl = `${WEB_APP_URL}/icon-512.png`;

  const payload = {
    chat_id: chatId,
    photo: photoUrl,
    caption: `🧬 *Добро пожаловать в Body Tweaker!*\n\nЭто ваш персональный инструмент для биохакинга:\n\n• Интервальное голодание\n• Дыхательные практики\n• Биоритмы\n\nНажмите кнопку ниже, чтобы начать.`,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Запустить приложение",
            web_app: { url: WEB_APP_URL } // 👈 Эта кнопка открывает Mini App
          }
        ]
      ]
    }
  };

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

// --- ФУНКЦИЯ: Просто текст с кнопкой ---
async function sendMessage(chatId: number, text: string) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const payload = {
    chat_id: chatId,
    text: text,
    reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Открыть Body Tweaker",
              web_app: { url: WEB_APP_URL }
            }
          ]
        ]
      }
  };

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
