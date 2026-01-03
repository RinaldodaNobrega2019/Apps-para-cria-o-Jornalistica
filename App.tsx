
import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Plus, 
  Trash2, 
  LogOut, 
  LogIn, 
  Megaphone, 
  AlertCircle, 
  Filter, 
  Menu,
  X,
  Search,
  Bell,
  MapPin,
  Send,
  ShieldCheck
} from 'lucide-react';
import { NewsArticle, User, Category, Report } from './types';
import { CATEGORIES, INITIAL_NEWS } from './constants';
import { generateArticleSummary } from './services/geminiService';

const AUTHOR_EMAIL = "jornalistarinaldodanobrega@gmail.com";

const App: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | 'Tudo'>('Tudo');
  const [view, setView] = useState<'home' | 'admin' | 'denuncias' | 'detail'>('home');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persistence
  useEffect(() => {
    const savedNews = localStorage.getItem('tribuna_news');
    const savedReports = localStorage.getItem('tribuna_reports');
    if (savedNews) setNews(JSON.parse(savedNews));
    else setNews(INITIAL_NEWS);
    
    if (savedReports) setReports(JSON.parse(savedReports));
  }, []);

  useEffect(() => {
    localStorage.setItem('tribuna_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('tribuna_reports', JSON.stringify(reports));
  }, [reports]);

  // Handlers
  const handleAddNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'author') return;

    const formData = new FormData(e.currentTarget);
    const content = formData.get('content') as string;
    const summary = await generateArticleSummary(content);

    const newArticle: NewsArticle = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      content,
      summary,
      category: formData.get('category') as Category,
      author: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      imageUrl: `https://picsum.photos/seed/${Date.now()}/800/400`,
      isBreaking: (formData.get('isBreaking') === 'on')
    };

    setNews([newArticle, ...news]);
    e.currentTarget.reset();
    alert('Notícia publicada com sucesso!');
  };

  const handleDeleteNews = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta notícia?')) {
      setNews(news.filter(n => n.id !== id));
    }
  };

  const handleAddReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newReport: Report = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      date: new Date().toLocaleDateString(),
      status: 'Pendente'
    };
    setReports([newReport, ...reports]);
    e.currentTarget.reset();
    alert('Denúncia enviada com sucesso! Nossa equipe analisará em breve.');
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    // Logic: Only your specific email gets the Author role
    if (email.toLowerCase() === AUTHOR_EMAIL.toLowerCase()) {
      setCurrentUser({ id: 'admin-01', name: 'Rinaldo Nóbrega', email, role: 'author' });
    } else {
      setCurrentUser({ id: 'visitor-' + Date.now(), name: 'Leitor', email, role: 'visitor' });
    }
    setIsLoginModalOpen(false);
  };

  const filteredNews = activeCategory === 'Tudo' ? news : news.filter(n => n.category === activeCategory);
  const breakingNews = news.find(n => n.isBreaking);

  return (
    <div className={`min-h-screen flex flex-col ${currentUser?.role === 'author' ? 'border-t-4 border-amber-500' : ''}`}>
      {/* Breaking News Ticker */}
      {breakingNews && (
        <div className="bg-red-600 text-white py-2 px-4 flex items-center overflow-hidden">
          <div className="flex items-center gap-2 font-bold whitespace-nowrap animate-pulse shrink-0">
            <AlertCircle size={18} />
            <span>URGENTE:</span>
          </div>
          <div className="ml-4 font-medium overflow-hidden whitespace-nowrap">
            {breakingNews.title} — {breakingNews.summary}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
              <div 
                className="flex items-center gap-2 cursor-pointer group" 
                onClick={() => setView('home')}
              >
                <div className="bg-blue-900 p-2 rounded-lg text-white group-hover:bg-blue-800 transition-colors">
                  <Newspaper size={28} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Jornal <span className="text-blue-900">Tribuna Almense</span>
                </h1>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
              <button onClick={() => setView('home')} className={`font-semibold ${view === 'home' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-600 hover:text-blue-900'}`}>Notícias</button>
              <button onClick={() => setView('denuncias')} className={`font-semibold ${view === 'denuncias' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-600 hover:text-blue-900'}`}>Denúncias</button>
              
              {/* Only visible to the Author */}
              {currentUser?.role === 'author' && (
                <button onClick={() => setView('admin')} className={`flex items-center gap-1 font-bold text-amber-600 hover:text-amber-700 ${view === 'admin' ? 'border-b-2 border-amber-600' : ''}`}>
                  <ShieldCheck size={18} /> Painel do Autor
                </button>
              )}
            </nav>

            <div className="flex items-center gap-4">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <span className="hidden md:block text-sm font-bold text-blue-900">
                    {currentUser.role === 'author' ? 'Redator' : 'Leitor'}: {currentUser.name}
                  </span>
                  <button 
                    onClick={() => { setCurrentUser(null); setView('home'); }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} /> Sair
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-900 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-800 transition-all shadow-md"
                >
                  <LogIn size={18} /> Acesso
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="bg-gray-50 border-t overflow-x-auto">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 py-3 whitespace-nowrap scrollbar-hide">
              <button 
                onClick={() => setActiveCategory('Tudo')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === 'Tudo' ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
              >
                Tudo
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-2xl p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setIsMobileMenuOpen(false)}><X /></button>
            </div>
            <nav className="flex flex-col gap-4">
              <button onClick={() => { setView('home'); setIsMobileMenuOpen(false); }} className="text-left font-medium p-2 hover:bg-gray-100 rounded">Notícias</button>
              <button onClick={() => { setView('denuncias'); setIsMobileMenuOpen(false); }} className="text-left font-medium p-2 hover:bg-gray-100 rounded">Denúncias</button>
              {currentUser?.role === 'author' && (
                <button onClick={() => { setView('admin'); setIsMobileMenuOpen(false); }} className="text-left font-bold text-amber-600 p-2 hover:bg-amber-50 rounded">Painel do Autor</button>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {view === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              {filteredNews.length > 0 ? (
                filteredNews.map(item => (
                  <article key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow relative">
                    {/* Admin Delete Shortcut */}
                    {currentUser?.role === 'author' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteNews(item.id); }}
                        className="absolute top-2 right-2 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-600 hover:text-white transition-all z-10"
                        title="Excluir Notícia"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img src={item.imageUrl} alt={item.title} className="h-48 md:h-full w-full object-cover" />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{item.category}</span>
                          <span className="text-xs text-gray-400 font-medium">• {item.date}</span>
                        </div>
                        <h2 
                          className="text-xl md:text-2xl font-bold text-gray-900 mb-3 newspaper-font cursor-pointer hover:text-blue-900"
                          onClick={() => { setSelectedArticle(item); setView('detail'); }}
                        >
                          {item.title}
                        </h2>
                        <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2">
                          {item.summary}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-gray-500">Por {item.author}</span>
                          <button 
                            onClick={() => { setSelectedArticle(item); setView('detail'); }}
                            className="text-blue-900 font-bold text-sm hover:underline"
                          >
                            Ler mais
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                  <Search size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">Nenhuma notícia encontrada nesta categoria.</p>
                </div>
              )}
            </div>

            <aside className="lg:col-span-4 space-y-8">
              <div className="bg-blue-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <Megaphone className="mb-4 text-blue-200" size={32} />
                  <h3 className="text-xl font-bold mb-2">Viu algo de errado?</h3>
                  <p className="text-blue-100 text-sm mb-4">Envie sua denúncia sobre problemas no seu bairro diretamente para nossa redação.</p>
                  <button 
                    onClick={() => setView('denuncias')}
                    className="w-full bg-white text-blue-900 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    Fazer Denúncia
                  </button>
                </div>
                <div className="absolute -right-8 -bottom-8 bg-blue-800/50 w-32 h-32 rounded-full blur-2xl"></div>
              </div>

              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" /> Almas - TO
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">28°C</span>
                    <p className="text-sm text-gray-500">Parcialmente nublado</p>
                  </div>
                  <div className="text-yellow-500">
                    <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1s-1-.45-1-1V3c0-.55.45-1 1-1zm0 14c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1s-1-.45-1-1v-2c0-.55.45-1 1-1zM5.27 4.42c.39-.39 1.02-.39 1.41 0l1.41 1.41c.39.39.39 1.02 0 1.41s-1.02.39-1.41 0L5.27 5.83c-.39-.39-.39-1.02 0-1.41zm12.02 12.02c.39-.39 1.02-.39 1.41 0l1.41 1.41c.39.39.39 1.02 0 1.41s-1.02.39-1.41 0l-1.41-1.41c-.39-.39-.39-1.02 0-1.41zM2 12c0-.55.45-1 1-1h2c0 .55-.45 1-1 1s-1-.45-1-1H3c-.55 0-1-.45-1-1zm14 0c0-.55.45-1 1-1h2c.55 0 1 .45 1 1s-.45 1-1 1h-2c-.55 0-1-.45-1-1zM5.27 19.58c-.39-.39-.39-1.02 0-1.41l1.41-1.41c.39-.39 1.02-.39 1.41 0s.39 1.02 0 1.41l-1.41 1.41c-.39.39-1.02.39-1.41 0zm12.02-12.02c-.39-.39-.39-1.02 0-1.41l1.41-1.41c.39-.39 1.02-.39 1.41 0s.39 1.02 0 1.41l-1.41 1.41c-.39.39-1.02.39-1.41 0z"/></svg>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {view === 'detail' && selectedArticle && (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
            <button onClick={() => setView('home')} className="text-blue-900 font-bold mb-6 flex items-center gap-1 hover:underline">← Voltar para notícias</button>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase">{selectedArticle.category}</span>
              <span className="text-gray-400 text-sm">{selectedArticle.date}</span>
            </div>
            <h1 className="text-4xl font-bold newspaper-font mb-6 leading-tight text-gray-900">{selectedArticle.title}</h1>
            <div className="flex items-center gap-3 mb-8 pb-8 border-b">
              <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center text-gray-500 font-bold">
                {selectedArticle.author[0]}
              </div>
              <div>
                <p className="font-bold text-gray-900">{selectedArticle.author}</p>
                <p className="text-xs text-gray-500">Redação Tribuna Almense</p>
              </div>
            </div>
            <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-96 object-cover rounded-xl mb-8 shadow-sm" />
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              {selectedArticle.content.split('\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        )}

        {view === 'denuncias' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold newspaper-font mb-4">Área de Denúncias</h2>
              <p className="text-gray-600 max-w-xl mx-auto">Relate problemas no seu bairro. Sua contribuição ajuda a melhorar Almas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border shadow-sm">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Send size={20} className="text-blue-600" /> Nova Denúncia</h3>
                <form onSubmit={handleAddReport} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
                    <input required name="title" placeholder="Ex: Buraco na Rua das Flores" className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Localização</label>
                    <input required name="location" placeholder="Endereço ou Ponto de referência" className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
                    <textarea required name="description" rows={4} placeholder="Descreva o que está acontecendo..." className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-all shadow-md">Enviar</button>
                </form>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-xl mb-4">Histórico Recente</h3>
                {reports.length > 0 ? (
                  reports.map(rep => (
                    <div key={rep.id} className="bg-white p-5 rounded-xl border shadow-sm border-l-4 border-l-blue-900">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900">{rep.title}</h4>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${rep.status === 'Pendente' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>{rep.status}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3 flex items-center gap-1"><MapPin size={14} /> {rep.location}</p>
                      <p className="text-sm text-gray-700 italic">"{rep.description}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-8 italic">Sem denúncias no momento.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'admin' && currentUser?.role === 'author' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold newspaper-font flex items-center gap-2">
                <ShieldCheck className="text-amber-500" size={32} /> Painel Administrativo
              </h2>
            </div>

            <section className="bg-white p-8 rounded-2xl border shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-900"><Plus size={20} /> Publicar Nova Notícia</h3>
              <form onSubmit={handleAddNews} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
                  <input required name="title" placeholder="Título da notícia" className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
                  <select name="category" className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-4 p-2.5 bg-gray-50 border rounded-lg h-full">
                   <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" name="isBreaking" className="w-4 h-4 text-red-600 rounded" />
                    <span className="text-sm font-semibold text-gray-700 uppercase">Destaque Urgente</span>
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Conteúdo</label>
                  <textarea required name="content" rows={10} placeholder="Texto completo da notícia..." className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                </div>
                <div className="md:col-span-2 flex justify-end">
                   <button type="submit" className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition-all shadow-md flex items-center gap-2">
                    <Plus size={20} /> Publicar Notícia
                  </button>
                </div>
              </form>
            </section>

            <section className="bg-white p-8 rounded-2xl border shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-600"><Trash2 size={20} /> Gerenciar Notícias</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="pb-3">Título</th>
                      <th className="pb-3">Categoria</th>
                      <th className="pb-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {news.map(n => (
                      <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 font-semibold text-gray-900 truncate max-w-xs">{n.title}</td>
                        <td className="py-4"><span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{n.category}</span></td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => handleDeleteNews(n.id)}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="text-blue-900" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Jornal Tribuna Almense</h2>
              </div>
              <p className="text-gray-500 text-sm">Informação com credibilidade e compromisso com o cidadão de Almas-TO.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links</h4>
              <ul className="text-gray-500 text-sm space-y-2">
                <li onClick={() => setView('home')} className="hover:text-blue-900 cursor-pointer">Início</li>
                <li onClick={() => setView('denuncias')} className="hover:text-blue-900 cursor-pointer">Denúncias</li>
                {!currentUser && <li onClick={() => setIsLoginModalOpen(true)} className="hover:text-blue-900 cursor-pointer font-bold">Acesso Restrito</li>}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <ul className="text-gray-500 text-sm space-y-1">
                <li>Email: {AUTHOR_EMAIL}</li>
                <li>Tel: (63) 99101-4872</li>
                <li>Avenida São Sebastião, Setor Monjolo</li>
                <li>Almas, Tocantins</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
            &copy; 2024 Jornal Tribuna Almense. Criado para Rinaldo Nóbrega.
          </div>
        </div>
      </footer>

      {/* Simplified Login Modal (No Signup) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLoginModalOpen(false)}></div>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative p-8 animate-in zoom-in duration-300">
            <button 
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X />
            </button>
            <div className="text-center mb-8">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-900">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Acesso ao Portal</h2>
              <p className="text-gray-500 text-sm">Insira seu e-mail e senha para acessar.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail de Acesso</label>
                <input required name="email" type="email" placeholder="seu@email.com" className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
                <input required name="password" type="password" placeholder="••••••••" className="w-full p-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-900" /> Manter conectado
                </label>
              </div>
              <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-all shadow-md transform hover:scale-[1.02] active:scale-95">
                Entrar no Sistema
              </button>
            </form>
            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-xs text-gray-400">Este é um acesso restrito. Cadastro não disponível para novos usuários.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
