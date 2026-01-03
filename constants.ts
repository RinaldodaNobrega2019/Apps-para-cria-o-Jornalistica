
import { NewsArticle, Category } from './types';

export const CATEGORIES: Category[] = ['Geral', 'Política', 'Economia', 'Esportes', 'Cultura', 'Segurança'];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'Nova praça será inaugurada no centro de Almas',
    summary: 'A prefeitura confirmou a entrega da revitalização da Praça da Matriz para o próximo sábado.',
    content: 'A obra, que durou seis meses, incluiu nova iluminação LED, bancos de madeira tratada e um parquinho moderno para as crianças. O prefeito ressaltou que este é um passo importante para o lazer da população local...',
    category: 'Geral',
    author: 'Redação Tribuna',
    date: '2024-05-20',
    imageUrl: 'https://picsum.photos/seed/square/800/400',
    isBreaking: true
  },
  {
    id: '2',
    title: 'Time local vence campeonato regional de futsal',
    summary: 'Em uma partida emocionante decidida nos pênaltis, o Almas FC conquistou o título inédito.',
    content: 'O ginásio municipal estava lotado. Com uma atuação brilhante do goleiro, a equipe conseguiu segurar o empate no tempo normal e brilhou nas cobranças alternadas...',
    category: 'Esportes',
    author: 'Marcos Silva',
    date: '2024-05-19',
    imageUrl: 'https://picsum.photos/seed/sports/800/400'
  },
  {
    id: '3',
    title: 'Festival de Inverno atrai turistas para a região',
    summary: 'Gastronomia e música local são os destaques da edição deste ano.',
    content: 'O Festival de Inverno de Almas começou com recorde de público. Os hotéis da cidade registram 95% de ocupação. Entre as atrações, destacam-se os pratos típicos da culinária quilombola e apresentações de artistas regionais...',
    category: 'Cultura',
    author: 'Ana Clara',
    date: '2024-05-18',
    imageUrl: 'https://picsum.photos/seed/culture/800/400'
  }
];
