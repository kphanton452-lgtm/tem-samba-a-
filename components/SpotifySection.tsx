
import React from 'react';

const SpotifySection: React.FC = () => {
  return (
    <section className="relative py-32 px-4 bg-[#171717] overflow-hidden border-t border-white/5" id="escute">
      {/* Texture & Ambient Light */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-radial from-surface-brown/20 to-transparent opacity-50 pointer-events-none"></div>

      {/* Cultural Image Background - Replacing the generic neon/modern vibe */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-20 pointer-events-none">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#171717] via-[#171717]/80 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Side: Editorial Content */}
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-surface-brown/40 border border-primary/20 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Samba Session 24/7</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.85] tracking-tighter uppercase">
              A VOZ DO <br/>
              <span className="text-outline">MORRO</span> NO <br/>
              SEU FONE.
            </h2>

            <p className="text-white/50 text-lg leading-relaxed font-light max-w-sm">
              Sintonize com a herança. Uma curadoria feita por quem vive a roda, para quem respira a batida do couro.
            </p>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#171717] bg-surface-brown overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">+12k ouvindo agora</span>
            </div>
          </div>

          {/* Right Side: The Player Console */}
          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-10 bg-surface-brown/10 rounded-[3rem] blur-3xl pointer-events-none"></div>
            
            <div className="relative bg-[#1e1e1e] border border-white/10 rounded-[2.5rem] p-4 md:p-8 shadow-2xl shadow-black">
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="material-symbols-outlined text-primary text-2xl animate-spin-slow">album</span>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-tight">Tem Samba Aí</h4>
                    <p className="text-[10px] text-primary uppercase font-black tracking-widest">Raízes & Ancestralidade</p>
                  </div>
                </div>
                <div className="flex gap-1.5 h-6 items-end">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 bg-primary/40 rounded-full animate-pulse" 
                      style={{ height: `${20 + Math.random() * 80}%`, animationDelay: `${i * 150}ms` }}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/5 shadow-inner">
                <iframe 
                  data-testid="embed-iframe" 
                  style={{ borderRadius: '12px' }} 
                  src="https://open.spotify.com/embed/playlist/2d5Y6j28Xzg9ilzBvStqqD?utm_source=generator" 
                  width="100%" 
                  height="152" 
                  frameBorder="0" 
                  allowFullScreen={true} 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                ></iframe>
              </div>

              <div className="mt-8 flex justify-between items-center px-2">
                <p className="text-[10px] text-white/20 font-medium uppercase tracking-widest">© {new Date().getFullYear()} Tem Samba Aí — Editorial Sonoro</p>
                <div className="flex gap-4">
                   <span className="material-symbols-outlined text-white/20 text-lg hover:text-primary cursor-pointer transition-colors">share</span>
                   <span className="material-symbols-outlined text-white/20 text-lg hover:text-primary cursor-pointer transition-colors">cast</span>
                </div>
              </div>
            </div>

            {/* Cultural Overlay Icon */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#241e0f] rounded-full border border-primary/30 flex items-center justify-center shadow-2xl hidden md:flex animate-bounce-slow">
              <span className="material-symbols-outlined text-primary text-5xl">music_video</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SpotifySection;
