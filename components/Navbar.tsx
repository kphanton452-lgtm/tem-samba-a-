
import React, { useState, useEffect } from 'react';

const LOGO_URL = "https://ifnzywenpohlmwznadke.supabase.co/storage/v1/object/public/uploads/ChatGPT%20Image%2019%20de%20jan.%20de%202026,%2013_54_07.png";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { name: 'Eventos', id: 'eventos' },
    { name: 'Assista', id: 'assista' },
    { name: 'Leia', id: 'leia' },
    { name: 'Escute', id: 'escute' },
    { name: 'Comente', id: 'comente' },
    { name: 'Sobre', id: 'sobre' },
  ];

  return (
    <>
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-4xl transition-all duration-500 ${scrolled ? 'top-4' : 'top-6'}`}>
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl px-4 md:px-8 py-3 flex items-center justify-between transition-all duration-300 hover:border-primary/20">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsMenuOpen(false);
            }}
          >
            <img src={LOGO_URL} alt="Logo Tem Samba Aí" className="w-8 h-8 md:w-10 md:h-10 object-contain group-hover:rotate-12 transition-transform duration-500" />
            <span className="font-black tracking-tighter text-sm md:text-base hidden xs:block">TEM SAMBA AÍ</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 lg:gap-6 text-[11px] uppercase font-black tracking-widest text-white/60">
            {navLinks.map((link) => (
              <a 
                key={link.id}
                className="hover:text-primary transition-colors py-2 px-1 cursor-pointer" 
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
              >
                {link.name}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => scrollToSection(e as any, 'eventos')}
              className="bg-primary hover:bg-white text-white hover:text-black text-[10px] md:text-xs font-black px-4 md:px-6 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20 uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-[16px] md:text-[18px]">confirmation_number</span>
              <span className="hidden sm:inline">Ingressos</span>
            </button>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
            >
              <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </nav>

      <div 
        className={`fixed inset-0 z-[55] bg-black/95 backdrop-blur-2xl transition-all duration-500 md:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6 text-center">
          <div className="absolute top-10 left-10 opacity-10">
             <img src={LOGO_URL} alt="" className="w-40 h-40 object-contain grayscale" />
          </div>
          
          <nav className="flex flex-col gap-6">
            {navLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={(e) => scrollToSection(e as any, link.id)}
                className={`text-4xl font-black uppercase tracking-tighter text-white hover:text-primary transition-all duration-300 transform ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {link.name}
              </button>
            ))}
          </nav>

          <div className={`mt-12 flex gap-6 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDelay: '350ms' }}>
             <a href="https://instagram.com/temsambaai" target="_blank" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white"><span className="font-black text-xs">IG</span></a>
             <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white"><span className="font-black text-xs">YT</span></a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
