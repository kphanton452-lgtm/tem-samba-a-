
import React from 'react';
import { SITE_CONTENT } from '../lib/content';

interface ReadSectionProps {
  onViewAll?: () => void;
}

const ReadSection: React.FC<ReadSectionProps> = ({ onViewAll }) => {
  const articles = SITE_CONTENT.articles.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-6 mb-32 pt-20" id="leia">
      <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-8">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter flex items-center gap-4 uppercase">
          <span className="material-symbols-outlined text-primary text-5xl md:text-7xl">auto_stories</span>
          Leia
        </h2>
        <button 
          onClick={onViewAll}
          className="text-primary hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest border border-primary/20 px-6 py-3 rounded-full hover:bg-primary"
        >
          Ver todos artigos
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {articles.length === 0 ? (
          <div className="col-span-full text-center py-10 bg-white/5 rounded-[2rem] border border-white/5">
            <p className="text-white/20 uppercase font-black text-sm tracking-widest">Nenhum artigo publicado no editorial.</p>
          </div>
        ) : (
          articles.map((article, index) => (
            <article 
              key={article.id} 
              onClick={onViewAll} 
              className={`cursor-pointer rounded-[2rem] overflow-hidden border border-white/5 hover:border-primary/30 transition-all group h-full flex flex-col shadow-xl ${index === 2 ? 'lg:col-span-2 bg-gradient-to-br from-surface-brown/50 to-background-dark' : 'bg-card-dark'}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={article.image_url} alt={article.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                <div className="absolute top-6 left-6">
                  <span className="bg-primary text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{article.category}</span>
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h3 className={`${index === 2 ? 'text-3xl md:text-4xl' : 'text-xl'} font-black text-white mb-4 group-hover:text-primary transition-colors tracking-tight uppercase leading-tight`}>
                  {article.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6 line-clamp-2 font-light">
                  {article.excerpt}
                </p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{article.read_time}</span>
                  <span className="text-primary font-black uppercase text-[10px] flex items-center gap-1">Ler Mais</span>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
};

export default ReadSection;
