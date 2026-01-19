import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface Article {
  id: string;
  title: string;
  category: string; // Например "Здоровье сердца" или "Узнайте"
  summary: string;
  imageUrl: string; // 👈 Новое поле
  Icon?: LucideIcon; // Делаем необязательным, так как теперь главная - картинка
  content: ReactNode;
}
