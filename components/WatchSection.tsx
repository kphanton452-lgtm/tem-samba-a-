
import React, { useState, useEffect } from 'react';
import { SITE_CONTENT, VideoData } from '../lib/content';
import { supabase } from '../lib/supabase';

const WatchSection: React.FC<{ onViewAll: () => void }> = ({ onViewAll }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        if (data && data.length > 0) {
          setVideos(data);
        } else {
          setVideos(SITE_CONTENT.videos.slice(0, 3));
        }
      } catch (err) {
        setVideos(SITE_CONTENT.videos.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getEmbedUrl = (url: string) => {
    const ytId = getYouTubeId(url);
    if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
    return url;
  };

  const isDirectVideo = (url: string) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.ogg');
  };

  return (
    <section className="max-w-7xl mx-auto px-6 mb-32" id="assista">
      {/* MODAL DE VÍDEO - MODO CINEMA */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/98 backdrop-blur-3xl animate-fade-in overflow-y-auto">
          <button 
            onClick={() => setSelectedVideo(null)} 
            className="fixed top-6 right-6 md:top-10 md:right-10 text-white hover:text-primary transition-all z-[110] bg-white/5 hover:bg-white/10 p-3 rounded-full border border-white/10"
          >
            <span className="material-symbols-outlined text-3xl md:text-4xl">close</span>
          </button>
          
          <div className="w-full max-w-5xl h-fit max-h-full my-auto animate-fade-in-up bg-card-dark rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            {/* Player Container */}
            <div className="aspect-video w-full bg-black relative group">
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
                  allow="autoplay; encrypted-media; picture-in-picture" 
                  allowFullScreen
                  title="Video Player"
                ></iframe>
              )}
            </div>
            
            {/* Info Container */}
            <div className="p-8 md:p-12 space-y-6 max-h-[40vh] overflow-y-auto custom-scrollbar bg-gradient-to-b from-card-dark to-black">
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-primary text-white font-black uppercase text-[10px] px-4 py-1.5 rounded-full tracking-widest border border-primary/20 shadow-lg shadow-primary/10">
                  {selectedVideo.category || 'VÍDEO'}
                </span>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>
              
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                {selectedVideo.title}
              </h3>
              
              <p className="text-white/50 text-base md:text-xl font-light leading-relaxed max-w-4xl">
                {selectedVideo.description || 'Sem descrição adicional para este conteúdo.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TÍTULO DA SEÇÃO */}
      <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-6">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter flex items-center gap-4 uppercase">
          <span className="material-symbols-outlined text-primary text-5xl md:text-7xl filled">play_circle</span>
          Assista
        </h2>
        <button onClick={onViewAll} className="text-primary hover:text-white transition-colors font-bold text-xs uppercase tracking-widest flex items-center gap-2 group">
          Ver acervo completo
          <span className="material-symbols-outlined text-lg group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
        </button>
      </div>

      {/* GRID DE VÍDEOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[300px]">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          </div>
        ) : videos.length > 0 ? (
          <>
            <div onClick={() => setSelectedVideo(videos[0])} className="cursor-pointer md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-card-dark border border-white/5 shadow-2xl">
              <img src={videos[0].thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" alt={videos[0].title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                <div className="bg-primary text-white p-8 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-all duration-500">
                  <span className="material-symbols-outlined text-5xl filled">play_arrow</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 p-10">
                <span className="text-primary text-[10px] font-black uppercase mb-2 block tracking-widest">{videos[0].category}</span>
                <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">{videos[0].title}</h3>
              </div>
            </div>

            {videos.slice(1).map(video => (
              <div key={video.id} onClick={() => setSelectedVideo(video)} className="cursor-pointer relative group overflow-hidden rounded-[2.5rem] bg-card-dark border border-white/5 hover:border-primary/30 transition-all">
                <img src={video.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all" alt={video.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 p-8">
                  <span className="text-primary text-[10px] font-black uppercase mb-1 block tracking-widest">{video.category}</span>
                  <h3 className="text-xl font-bold text-white uppercase line-clamp-2 tracking-tight">{video.title}</h3>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="col-span-full py-20 text-center text-white/10 uppercase font-black text-xs">Nenhum vídeo publicado ainda.</div>
        )}
      </div>
    </section>
  );
};

export default WatchSection;
