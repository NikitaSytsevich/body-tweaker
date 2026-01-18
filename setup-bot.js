import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь: /api/webhook.ts
const dirPath = path.join(__dirname, 'api');
const filePath = path.join(dirPath, 'webhook.ts');

// Код вебхука
const fileContent = `import type { VercelRequest, VercelResponse } from '@vercel/node';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://body-tweaker.vercel.app'; 

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    if (request.method !== 'POST') {
      return response.status(200).send('Bot is alive!');
    }

    const body = request.body;
    console.log('Incoming update:', JSON.stringify(body));

    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text;

      if (text === '/start') {
        await sendWelcomeMessage(chatId);
      } else {
        await sendMessage(chatId, 'Нажмите кнопку ниже, чтобы открыть приложение 👇');
      }
    }

    return response.status(200).json({ ok: true });

  } catch (error) {
    console.error('Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}

async function sendWelcomeMessage(chatId: number) {
  const url = \`https://api.telegram.org/bot\${BOT_TOKEN}/sendPhoto\`;
  const photoUrl = \`\${WEB_APP_URL}/icon-512.png\`;

  const payload = {
    chat_id: chatId,
    photo: photoUrl,
    caption: \`🧬 *Добро пожаловать в Body Tweaker!*\\n\\nЭто ваш персональный инструмент для управления метаболизмом, голоданием и биоритмами.\\n\\nНажмите кнопку ниже, чтобы запустить приложение.\`,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Запустить Body Tweaker",
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

async function sendMessage(chatId: number, text: string) {
  const url = \`https://api.telegram.org/bot\${BOT_TOKEN}/sendMessage\`;
  
  const payload = {
    chat_id: chatId,
    text: text,
    reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Открыть приложение",
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
}`;

// Создаем папку и файл
try {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        console.log('📁 Папка /api создана');
    }
    
    fs.writeFileSync(filePath, fileContent);
    console.log('✅ Файл /api/webhook.ts успешно создан и заполнен кодом');
    
} catch (err) {
    console.error('❌ Ошибка:', err);
}
