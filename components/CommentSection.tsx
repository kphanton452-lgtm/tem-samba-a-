
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CommentSection: React.FC = () => {
  const [instagram, setInstagram] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data } = await supabase
      .from('interactions')
      .select('*')
      .eq('type', 'comment')
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setComments(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !instagram.trim()) {
      alert("Por favor, preencha o Instagram e sua mensagem.");
      return;
    }

    setLoading(true);
    try {
      const user_insta = instagram.startsWith('@') ? instagram : `@${instagram}`;
      const { error } = await supabase.from('interactions').insert([{
        content_id: 'home-feedback',
        type: 'comment',
        user_insta,
        text: comment
      }]);

      if (error) throw error;
      
      setComment('');
      fetchComments();
      alert("Valeu! Seu comentário foi publicado.");
    } catch (err: any) {
      alert("Erro ao publicar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 mb-32" id="comente">
      <div className="bg-card-dark rounded-[3rem] p-10 md:p-16 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter uppercase">Soltar o Verbo</h2>
            <p className="text-white/40 font-light max-w-sm mx-auto uppercase text-[10px] tracking-widest">Deixa seu recado pra comunidade bamba</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-primary font-black text-sm">@</span>
                </div>
                <input 
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:ring-0 text-white pl-10 py-4 transition-all placeholder-white/10 rounded-t-2xl font-bold outline-none" 
                  placeholder="seu_instagram" 
                  type="text"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  required
                />
              </div>
              <div>
                <input 
                  className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:ring-0 text-white px-6 py-4 transition-all placeholder-white/10 rounded-t-2xl font-bold outline-none" 
                  placeholder="seu email (opcional)" 
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <textarea 
                className="w-full bg-white/5 border-0 border-b-2 border-white/10 focus:border-primary focus:ring-0 text-white px-6 py-5 transition-all placeholder-white/10 resize-none rounded-t-2xl font-light text-lg outline-none" 
                placeholder="Mande sua mensagem..." 
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex justify-end pt-4">
              <button 
                disabled={loading}
                className="bg-primary hover:bg-white text-white hover:text-black font-black py-5 px-12 rounded-2xl transition-all shadow-2xl shadow-primary/20 flex items-center gap-3 w-full md:w-auto justify-center uppercase tracking-widest text-xs disabled:opacity-50"
              >
                <span>{loading ? 'Publicando...' : 'Publicar Agora'}</span>
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
          </form>

          <div className="mt-20 pt-12 border-t border-white/5">
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-10">Mensagens Recentes</h4>
            <div className="space-y-10">
              {comments.map((c, i) => (
                <div key={i} className="flex gap-6 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary font-black text-xs shrink-0 shadow-lg">
                    {c.user_insta.substring(1,3).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-primary font-black text-sm tracking-tight">{c.user_insta}</span>
                      <span className="text-white/20 text-[8px] font-bold uppercase tracking-widest">Acabou de comentar</span>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed font-light">{c.text}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-white/10 text-center uppercase font-black text-[10px] tracking-widest py-10">Nenhuma mensagem ainda. Seja o primeiro!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
