
import React from 'react';

const CultureSection: React.FC = () => {
  return (
    <section className="bg-surface-brown relative py-20 px-4 overflow-hidden border-t border-white/5" id="cultura">
      <div className="pattern-overlay absolute inset-0"></div>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center relative z-10">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
            <span className="w-8 h-px bg-primary"></span>
            História
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            A ALMA DO <br/><span className="text-primary">NEGÓCIO</span>
          </h2>
          <p className="text-lg text-white/70 leading-relaxed font-light">
            O Cavaquinho não é apenas um instrumento; é o coração pulsante da roda. Trazido pelos portugueses, ele encontrou no Brasil sua verdadeira voz, chorando nas mãos de Waldir Azevedo e sorrindo no samba de raiz.
          </p>
          <a className="inline-block border-b-2 border-white/20 pb-1 text-white hover:text-primary hover:border-primary transition-colors font-medium" href="#">
            Ler artigo completo
          </a>
        </div>
        
        <div className="flex-1 w-full relative">
          <div className="aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden relative shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border border-white/10">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80')" }}
            ></div>
            {/* Decorative Frame */}
            <div className="absolute inset-0 border-[12px] border-white/5 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CultureSection;
