
import React, { useState } from 'react';
import { SITE_CONTENT, VideoData } from '../lib/content';
import SocialActions from './SocialActions';

const LOGO_URL = "https://ifnzywenpohlmwznadke.supabase.co/storage/v1/object/public/uploads/ChatGPT%20Image%2019%20de%20jan.%20de%202026,%2013_54_07.png";

const VideoGallery: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const videos = SITE_CONTENT.videos || [];

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getEmbedUrl = (url: string) => {
    const ytId = getYouTubeId(url);
    if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1`;
    return url;
  };

  const isDirectVideo = (url: string) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.ogg');
  };

  const filteredVideos = activeCategory === 'Todos' ? videos : videos.filter(v => v.category === activeCategory);

  return (
    <div className="min-h-screen bg-background-dark font-display text-white selection:bg-primary">
      {/* MODAL MODO CINEMA COMPLETO */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl animate-fade-in overflow-y-auto">
          <button 
            onClick={() => setSelectedVideo(null)} 
            className="fixed top-6 right-6 text-white hover:text-primary transition-all z-[110] bg-white/5 p-3 rounded-full border border-white/10"
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
          
          <div className="w-full max-w-5xl h-fit max-h-full my-auto animate-fade-in-up bg-card-dark rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl">
            {/* Player */}
            <div className="aspect-video w-full bg-black">
              {isDirectVideo(selectedVideo.video_url) ? (
                <video 
                  src={selectedVideo.video_url} 
                  poster={selectedVideo.thumbnail}
                  className="w-full h-full object-contain" 
                  controls 
                  autoPlay
                ></video>
              ) : (
                <iframe 
                  src={getEmbedUrl(selectedVideo.video_url)} 
                  className="w-full h-full" 
                  allow="autoplay; encrypted-media" 
                  allowFullScreen
                ></iframe>
              )}
            </div>

            {/* Content Info */}
            <div className="p-8 md:p-14 space-y-8 bg-gradient-to-b from-card-dark to-black overflow-y-auto max-h-[45vh]">
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-primary text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                  {selectedVideo.category || 'VÍDEO'}
                </span>
                <div className="flex-1 h-px bg-white/5"></div>
              </div>
              
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-2xl">
                {selectedVideo.title}
              </h2>
              
              <div className="border-l-4 border-primary/40 pl-8">
                <p className="text-white/50 text-xl md:text-2xl font-light leading-relaxed max-w-4xl">
                  {selectedVideo.description || 'Este vídeo faz parte do nosso acervo cultural.'}
                </p>
              </div>
              
              <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                <div className="max-w-xs w-full">
                  <SocialActions contentId={`video-${selectedVideo.id}`} />
                </div>
                <button onClick={() => setSelectedVideo(null)} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-primary transition-colors">Fechar Visualização</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER E NAVBAR DA GALERIA */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-8 py-3 flex items-center justify-between shadow-2xl transition-all hover:border-primary/20">
          <button onClick={onBack} className="flex items-center gap-3 group">
             <img src={LOGO_URL} alt="" className="w-8 h-8 object-contain group-hover:rotate-12 transition-transform duration-500" />
             <span className="font-black text-sm uppercase tracking-tighter hidden xs:block">Tem Samba Aí</span>
          </button>
          <button onClick={onBack} className="bg-primary hover:bg-white text-white hover:text-black text-[10px] font-black px-6 py-2.5 rounded-full uppercase tracking-widest transition-all">Voltar ao Início</button>
        </div>
      </nav>

      <header className="pt-48 pb-24 px-6 max-w-7xl mx-auto text-center">
        <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Nosso Acervo</span>
        <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.75] mb-12">ASSISTA <br/><span className="text-outline">AO RITMO</span></h1>
        
        <div className="flex flex-wrap justify-center gap-3 mt-16">
          {['Todos', 'Lançamento', 'Ao Vivo', 'Documentário', 'Especial'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)} 
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' 
                  : 'bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* GRID DA GALERIA */}
      <main className="max-w-7xl mx-auto px-6 pb-56 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {filteredVideos.map(video => (
          <div key={video.id} className="group space-y-6 bg-card-dark/40 p-5 rounded-[3rem] border border-white/5 hover:border-primary/20 transition-all shadow-2xl hover:shadow-primary/5">
            <div onClick={() => setSelectedVideo(video)} className="cursor-pointer block relative aspect-video rounded-[2.2rem] overflow-hidden border border-white/5 group-hover:border-primary/20 transition-all">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                <div className="bg-primary text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
                  <span className="material-symbols-outlined text-4xl filled">play_arrow</span>
                </div>
              </div>
              <div className="absolute top-5 left-5">
                 <span className="bg-black/60 backdrop-blur-md text-primary text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-primary/10">{video.category}</span>
              </div>
            </div>
            
            <div className="px-3 space-y-4">
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-[0.9] group-hover:text-primary transition-colors duration-500">
                {video.title}
              </h3>
              
              <p className="text-white/40 text-[13px] font-light leading-relaxed line-clamp-2">
                {video.description || 'Acompanhe as raízes do samba através das nossas lentes.'}
              </p>
              
              <div className="pt-6 border-t border-white/5">
                <SocialActions contentId={`video-${video.id}`} />
              </div>
            </div>
          </div>
        ))}
      </main>
      
      <div className="bg-black py-20 text-center border-t border-white/5">
         <img src={LOGO_URL} alt="" className="w-20 h-20 mx-auto opacity-10 mb-8 grayscale" />
         <p className="text-[10px] font-black uppercase text-white/10 tracking-[0.5em]">Tem Samba Aí • Radar Cultural</p>
      </div>
    </div>
  );
};

export default VideoGallery;
