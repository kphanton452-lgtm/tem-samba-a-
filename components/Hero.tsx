
import React from 'react';

const Hero: React.FC = () => {
  return (
    <header className="relative w-full h-screen overflow-hidden bg-background-dark">
      {/* Mosaic Grid */}
      <div className="mosaic-grid w-full h-full opacity-90">
        {/* Item 1 - Principal Samba Circle - A imagem principal tratada */}
        <div className="row-span-2 col-span-2 relative group overflow-hidden bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] group-hover:scale-105 filter brightness-[0.75] contrast-[1.1] saturate-[1.1]" 
            style={{ 
              backgroundImage: "url('https://ifnzywenpohlmwznadke.supabase.co/storage/v1/object/public/uploads/musicanova.jpeg')",
            }}
          ></div>
          {/* Enhanced Gradient Treatment for better text legibility */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/95 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"></div>
          
          {/* Decorative Corner Element to give it a "treated" photo look */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>

        {/* Item 2 - Pandeiro Detail */}
        <div className="hidden md:block col-span-1 row-span-1 relative bg-surface-brown overflow-hidden border-l border-white/5">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-70 grayscale hover:grayscale-0 transition-all duration-700 filter brightness-75" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1606093414909-08309a632009?auto=format&fit=crop&q=80')" }}
          ></div>
          <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
        </div>

        {/* Item 3 - Lively Dance/Celebration */}
        <div className="col-span-1 row-span-1 md:row-span-2 relative group overflow-hidden border-l border-white/5">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105 filter brightness-75 contrast-110" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80')" }}
          ></div>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Item 4 - Hands on Drums / Percussion */}
        <div className="col-span-1 md:col-span-1 relative group overflow-hidden border-t border-white/5">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105 filter brightness-90 contrast-125" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80')" }}
          ></div>
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
        </div>

        {/* Item 5 - Music Icon Accent */}
        <div className="col-span-2 md:col-span-1 row-span-1 relative bg-surface-brown/80 flex items-center justify-center border-t border-white/5">
          <div className="absolute inset-0 bg-noise opacity-20"></div>
          <span className="material-symbols-outlined text-7xl text-primary/40 rotate-12 drop-shadow-2xl">music_note</span>
        </div>

        {/* Item 6 - Wide Stage View / Crowd Celebration */}
        <div className="col-span-2 md:col-span-3 row-span-1 relative overflow-hidden border-t border-white/5">
          <div 
            className="absolute inset-0 bg-cover bg-center filter brightness-50 grayscale hover:grayscale-0 transition-all duration-1000" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-transparent to-transparent"></div>
        </div>
      </div>

      {/* Central Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 pointer-events-none">
        <div className="space-y-2 mb-6">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter leading-none mix-blend-overlay text-white opacity-95 fade-in-up drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
            SE TEM<br/>SAMBA,
          </h1>
        </div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-primary tracking-tight leading-none mb-4 fade-in-up [animation-delay:100ms] drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
          A GENTE MOSTRA.
        </h2>
        <p className="text-lg md:text-xl font-medium text-white/80 max-w-md mt-6 fade-in-up [animation-delay:200ms] drop-shadow-lg bg-black/40 backdrop-blur-md px-8 py-3 rounded-full border border-white/10 shadow-2xl">
          O radar cultural das raízes brasileiras.
        </p>
        <div className="mt-12 pointer-events-auto fade-in-up [animation-delay:300ms]">
          <a className="group flex items-center gap-3 text-white text-[10px] font-black border border-white/10 bg-black/60 backdrop-blur-md px-12 py-5 rounded-full uppercase tracking-[0.3em] hover:text-primary hover:border-primary transition-all hover:scale-105 shadow-2xl active:scale-95" href="#eventos">
            Explorar Agenda
            <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform text-lg">expand_more</span>
          </a>
        </div>
      </div>
      
      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent z-10"></div>
    </header>
  );
};

export default Hero;
