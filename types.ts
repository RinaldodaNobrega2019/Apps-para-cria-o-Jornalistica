
export type Category = 'Geral' | 'Política' | 'Economia' | 'Esportes' | 'Cultura' | 'Segurança';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: Category;
  author: string;
  date: string;
  imageUrl: string;
  isBreaking?: boolean;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: 'Pendente' | 'Em Análise' | 'Resolvido';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'visitor' | 'author';
}
