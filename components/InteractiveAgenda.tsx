
import React, { useState, useEffect } from 'react';
import { SITE_CONTENT, EventData } from '../lib/content';
import { supabase } from '../lib/supabase';
import SocialActions from './SocialActions';

const LOGO_URL = "https://ifnzywenpohlmwznadke.supabase.co/storage/v1/object/public/uploads/ChatGPT%20Image%2019%20de%20jan.%20de%202026,%2013_54_07.png";

const InteractiveAgenda: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [filter, setFilter] = useState('Todos');
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data && data.length > 0) {
          setEvents(data);
        } else {
          setEvents(SITE_CONTENT.events);
        }
      } catch (err) {
        setEvents(SITE_CONTENT.events);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAction = (ticket_url?: string) => {
    if (ticket_url) {
      window.open(ticket_url, '_blank');
    } else {
      window.open('https://instagram.com/temsambaai', '_blank');
    }
  };

  const filteredEvents = filter === 'Todos' 
    ? events 
    : events.filter(e => e.location.toLowerCase().includes(filter.toLowerCase()) || e.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="bg-background-dark min-h-screen font-display text-white">
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-3xl">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
          <button onClick={onBack} className="flex items-center gap-3 group font-black text-sm uppercase tracking-tighter">
            <img src={LOGO_URL} alt="" className="w-7 h-7 object-contain group-hover:rotate-12 transition-transform" />
            TEM SAMBA AÍ
          </button>
          <button onClick={onBack} className="bg-primary text-white text-xs font-bold px-5 py-2 rounded-full uppercase">Voltar</button>
        </div>
      </nav>

      <header className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] uppercase">AGENDA <span className="text-outline">CULTURAL</span></h1>
        <div className="flex flex-wrap gap-4 mt-8">
          {['Todos', 'Salvador', 'Rio de Janeiro'].map(city => (
            <button key={city} onClick={() => setFilter(city)} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${filter === city ? 'bg-primary border-primary' : 'border-white/10 text-white/40'}`}>{city}</button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {loading ? (
          <div className="col-span-full text-center py-20"><div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div></div>
        ) : filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-20 text-white/20 font-black uppercase">Nenhuma roda encontrada para esta busca.</div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="bg-card-dark rounded-[2.5rem] overflow-hidden border border-white/5 flex flex-col h-full hover:border-primary/30 transition-all group">
              <div className="relative h-64 overflow-hidden">
                 <img src={event.image_url} alt={event.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
                 <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 shadow-xl">
                    <span className="block text-primary font-black text-xs uppercase">{event.month}</span>
                    <span className="block text-white font-black text-3xl">{event.day}</span>
                 </div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2 leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                  <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest mb-4">
                    <span className="material-symbols-outlined text-sm">location_on</span> {event.location}
                  </div>
                  <button onClick={() => handleAction(event.ticket_url)} className="w-full bg-white/5 border border-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:border-primary transition-all">
                    {event.ticket_url ? 'Garantir Ingresso' : 'Saiba Mais'}
                  </button>
                </div>
                <SocialActions contentId={`event-${event.id}`} />
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default InteractiveAgenda;
