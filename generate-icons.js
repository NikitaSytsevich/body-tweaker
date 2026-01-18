import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем пути (для совместимости с ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_FILE = path.join(__dirname, 'public', 'logo.svg');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Список иконок, которые нужно сгенерировать
const targets = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  // Для iOS делаем 180x180. 
  // Мы добавляем flatten, чтобы убрать прозрачность (iOS любит непрозрачные иконки)
  // и заливаем цветом фона вашего логотипа (#0F172A), чтобы не было черных рамок.
  { name: 'apple-touch-icon.png', size: 180, bg: '#0F172A' }
];

async function generate() {
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error('❌ Ошибка: Не найден файл public/logo.svg');
    process.exit(1);
  }

  console.log('🎨 Начинаю генерацию иконок...');

  for (const target of targets) {
    const outputPath = path.join(PUBLIC_DIR, target.name);
    
    let pipeline = sharp(SOURCE_FILE).resize(target.size, target.size);

    // Если указан фон (для iOS), накладываем его
    if (target.bg) {
      pipeline = pipeline.flatten({ background: target.bg });
    }

    await pipeline.png().toFile(outputPath);
    console.log(`✅ Создан: public/${target.name} (${target.size}x${target.size})`);
  }

  console.log('🎉 Готово! Иконки лежат в папке public.');
}

generate().catch(err => {
  console.error('❌ Ошибка генерации:', err);
});
