import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface ArticleMeta {
  id: string;
  title: string;
  category: string; // Например "Здоровье сердца" или "Узнайте"
  summary: string;
  imageUrl: string;
  Icon?: LucideIcon; // необязательный
}

export interface Article extends ArticleMeta {
  content: ReactNode;
}
