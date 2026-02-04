
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Badge from './components/Badge';
import EventList from './components/EventList';
import WatchSection from './components/WatchSection';
import ReadSection from './components/ReadSection';
import CommentSection from './components/CommentSection';
import SpotifySection from './components/SpotifySection';
import Footer from './components/Footer';
import InteractiveAgenda from './components/InteractiveAgenda';
import VideoGallery from './components/VideoGallery';
import ArticleGallery from './components/ArticleGallery';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'agenda' | 'videos' | 'articles'>('home');

  const navigateTo = (view: 'home' | 'agenda' | 'videos' | 'articles') => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  if (currentView === 'agenda') {
    return <InteractiveAgenda onBack={() => navigateTo('home')} />;
  }

  if (currentView === 'videos') {
    return <VideoGallery onBack={() => navigateTo('home')} />;
  }

  if (currentView === 'articles') {
    return <ArticleGallery onBack={() => navigateTo('home')} />;
  }

  return (
    <div className="min-h-screen bg-background-dark">
      <Navbar />
      
      <Hero />
      
      <div className="relative w-full h-24 bg-background-dark overflow-visible z-20">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <Badge />
        </div>
      </div>

      <main className="relative bg-background-dark bg-noise pt-12 pb-32 px-4 sm:px-8 md:px-16 overflow-hidden" id="eventos">
        <EventList onViewFullSchedule={() => navigateTo('agenda')} />
      </main>

      <section className="max-w-7xl mx-auto px-6 py-20 text-center relative z-10">
        <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary text-[10px] font-bold tracking-widest mb-6 border border-primary/20 uppercase">Radar Ativo</span>
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-white uppercase">
          BATIDA <br/><span className="text-outline">DIRETA</span>
        </h2>
        <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
          Sincronize sua alma com o ritmo que nunca para. Nossa curadoria é atualizada em tempo real para celebrar a tradição.
        </p>
      </section>

      <WatchSection onViewAll={() => navigateTo('videos')} />

      <div className="w-full overflow-hidden py-16 opacity-10 select-none bg-black/20">
        <div className="whitespace-nowrap flex gap-12 animate-marquee">
          <span className="text-6xl md:text-8xl font-black text-outline uppercase">O SAMBA NÃO MORRE</span>
          <span className="text-6xl md:text-8xl font-black text-primary">★</span>
          <span className="text-6xl md:text-8xl font-black text-outline uppercase">O SAMBA NÃO MORRE</span>
          <span className="text-6xl md:text-8xl font-black text-primary">★</span>
          <span className="text-6xl md:text-8xl font-black text-outline uppercase">O SAMBA NÃO MORRE</span>
          <span className="text-6xl md:text-8xl font-black text-primary">★</span>
        </div>
      </div>

      <ReadSection onViewAll={() => navigateTo('articles')} />
      <CommentSection />
      <SpotifySection />

      <Footer />
    </div>
  );
};

export default App;
