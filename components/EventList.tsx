
import React, { useEffect, useState } from 'react';
import { SITE_CONTENT, EventData } from '../lib/content';
import { supabase } from '../lib/supabase';

interface EventCardProps {
  day: string;
  month: string;
  title: string;
  location: string;
  image: string;
  label?: string;
  align?: 'start' | 'end';
  price?: string;
  width?: string;
  ticket_url?: string;
}

const EventCard: React.FC<EventCardProps> = ({ 
  day, month, title, location, image, label, align = 'start', price, width = 'w-[90%]', ticket_url 
}) => {
  const isStart = align === 'start';
  const handleAction = () => {
    if (ticket_url) window.open(ticket_url, '_blank');
    else window.open('https://instagram.com/temsambaai', '_blank');
  };

  return (
    <article className={`group relative w-full md:${width} ${isStart ? 'self-start' : 'self-end'} bg-card-dark rounded-3xl flex flex-col md:flex-row overflow-hidden hover:bg-surface-brown transition-all duration-500 border border-white/5 hover:border-primary/30 shadow-2xl`}>
      <div className={`w-full md:w-32 bg-white/5 flex flex-row md:flex-col items-center justify-center p-6 gap-2 border-b md:border-b-0 md:border-r border-white/10 shrink-0`}>
        <span className="text-white/60 font-black text-xs uppercase tracking-[0.2em]">{month}</span>
        <span className="text-primary font-black text-5xl md:text-6xl">{day}</span>
      </div>

      <div className="flex-1 p-8 flex flex-col justify-between gap-6">
        <div>
          <div className="flex justify-between items-start mb-4">
            {label && <span className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary/20">{label}</span>}
            <span className="material-symbols-outlined text-white/10 hover:text-primary transition-colors cursor-pointer">favorite</span>
          </div>
          <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter group-hover:text-primary transition-colors leading-none">{title}</h3>
          <div className="flex items-center gap-3 text-white/40 text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-lg text-primary">location_on</span>
            <span>{location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-[10px] font-black uppercase text-white/20 tracking-widest max-w-[60%] line-clamp-1">{price || 'ENTRADA FRANCA'}</p>
          <button onClick={handleAction} className={`bg-primary text-white text-[10px] font-black px-8 py-4 rounded-xl transition-all hover:scale-105 uppercase tracking-widest shadow-xl shadow-primary/10 whitespace-nowrap`}>
            {ticket_url ? 'INGRESSOS' : 'DETALHES'}
          </button>
        </div>
      </div>

      <div className="w-full md:w-72 h-56 md:h-auto shrink-0 relative overflow-hidden order-first md:order-last">
        <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" alt={title} />
        <div className="absolute inset-0 bg-gradient-to-r from-card-dark via-card-dark/20 to-transparent"></div>
      </div>
    </article>
  );
};

const EventList: React.FC<{ onViewFullSchedule: () => void }> = ({ onViewFullSchedule }) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        if (data && data.length > 0) {
          setEvents(data);
        } else {
          setEvents(SITE_CONTENT.events.slice(0, 3));
        }
      } catch (err) {
        setEvents(SITE_CONTENT.events.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="w-full">
      <div className="max-w-6xl mx-auto mb-20 relative flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-5xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase">ONDE A <br/><span className="text-outline">BATUQUE</span> ROLA</h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {loading ? (
           <div className="flex flex-col items-center py-32 gap-6">
             <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
             <p className="text-xs font-black uppercase tracking-widest text-primary animate-pulse">Consultando Radar Cultural...</p>
           </div>
        ) : (
          events.map((event, idx) => (
            <EventCard key={event.id} {...event} image={event.image_url} align={idx % 2 === 0 ? 'start' : 'end'} />
          ))
        )}
      </div>

      <div className="flex justify-center mt-24">
        <button onClick={onViewFullSchedule} className="group flex items-center gap-6 px-10 py-5 bg-white/5 border border-white/10 rounded-full text-white font-black hover:border-primary hover:bg-primary transition-all uppercase text-[10px] tracking-[0.2em] shadow-2xl">
          Ver Agenda Completa
          <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">calendar_month</span>
        </button>
      </div>
    </section>
  );
};

export default EventList;
