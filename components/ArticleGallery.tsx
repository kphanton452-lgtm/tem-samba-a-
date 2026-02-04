
import React, { useState } from 'react';
import { SITE_CONTENT, ArticleData } from '../lib/content';
import SocialActions from './SocialActions';

const ArticleGallery: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
  const articles = SITE_CONTENT.articles;

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-background-dark text-white font-display">
        <button onClick={() => setSelectedArticle(null)} className="fixed top-10 left-10 z-50 bg-white/5 border border-white/10 w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <article className="max-w-4xl mx-auto pt-32 pb-40 px-6">
          <span className="text-primary font-black uppercase tracking-widest text-xs mb-4 block">{selectedArticle.category} — {selectedArticle.read_time}</span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-12">{selectedArticle.title}</h1>
          <div className="rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl mb-12">
            <img src={selectedArticle.image_url} alt={selectedArticle.title} className="w-full aspect-video object-cover" />
          </div>
          <div className="prose prose-invert max-w-none space-y-8 text-xl text-white/60 font-light leading-relaxed whitespace-pre-wrap">
            {selectedArticle.content}
          </div>
          <div className="mt-20 pt-20 border-t border-white/5">
            <h4 className="text-center text-white/20 uppercase font-black text-[10px] tracking-[0.3em] mb-8">Reações e Comentários</h4>
            <div className="max-w-md mx-auto">
              <SocialActions contentId={`article-${selectedArticle.id}`} />
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark font-display text-white">
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-8 py-3 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 group">
             <span className="material-symbols-outlined text-primary">auto_stories</span>
             <span className="font-black text-sm uppercase tracking-tighter">Editorial Digital</span>
          </button>
          <button onClick={onBack} className="bg-white/5 text-white/60 text-[10px] font-black px-4 py-2 rounded-full uppercase border border-white/10 hover:text-white transition-all">Início</button>
        </div>
      </nav>

      <header className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter uppercase leading-[0.7] mb-12 text-center md:text-left">
          LEIA A <br/><span className="text-outline">HISTÓRIA</span>
        </h1>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {articles.map(article => (
            <div key={article.id} className="group cursor-pointer" onClick={() => setSelectedArticle(article)}>
              <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-6 border border-white/5 shadow-2xl">
                <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100" />
                <div className="absolute top-6 left-6">
                  <span className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{article.category}</span>
                </div>
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4 group-hover:text-primary transition-colors">{article.title}</h3>
              <p className="text-white/40 text-lg font-light line-clamp-2 mb-6">{article.excerpt}</p>
              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <span className="text-[10px] font-black text-white/20 uppercase">{article.read_time} de leitura</span>
                <span className="text-primary font-black uppercase text-xs flex items-center gap-2">Abrir Artigo <span className="material-symbols-outlined">arrow_forward</span></span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ArticleGallery;
