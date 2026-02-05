import type { VercelRequest, VercelResponse } from '@vercel/node';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') {
    return response.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!BOT_TOKEN) {
    return response.status(500).json({ ok: false, error: 'BOT token missing' });
  }

  const fileId = typeof request.query.file_id === 'string' ? request.query.file_id : '';
  if (!fileId) {
    return response.status(400).json({ ok: false, error: 'file_id is required' });
  }

  try {
    const metaResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${encodeURIComponent(fileId)}`
    );
    const meta = await metaResponse.json();

    if (!meta?.ok || !meta?.result?.file_path) {
      return response.status(500).json({ ok: false, error: 'Failed to resolve file' });
    }

    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${meta.result.file_path}`;
    const fileResponse = await fetch(fileUrl);

    if (!fileResponse.ok) {
      return response.status(500).json({ ok: false, error: 'Failed to fetch file' });
    }

    const buffer = Buffer.from(await fileResponse.arrayBuffer());
    response.setHeader('Content-Type', 'application/x-tgsticker');
    response.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    return response.status(200).send(buffer);
  } catch (error) {
    console.error('[Telegram Sticker] Error:', error);
    return response.status(500).json({ ok: false, error: 'Unexpected error' });
  }
}
