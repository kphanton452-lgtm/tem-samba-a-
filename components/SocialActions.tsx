
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SocialActionsProps {
  contentId: string;
}

const SocialActions: React.FC<SocialActionsProps> = ({ contentId }) => {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');
  const [instagram, setInstagram] = useState('');
  const [commentsList, setCommentsList] = useState<{user_insta: string, text: string}[]>([]);

  useEffect(() => {
    fetchInteractions();
  }, [contentId, instagram]);

  const fetchInteractions = async () => {
    try {
      // Buscar curtidas
      const { count } = await supabase.from('interactions').select('*', { count: 'exact', head: true }).eq('content_id', contentId).eq('type', 'like');
      setLikes(count || 0);

      // Buscar se o usuário já curtiu
      if (instagram) {
          const { data } = await supabase.from('interactions').select('*').eq('content_id', contentId).eq('type', 'like').eq('user_insta', instagram);
          if (data && data.length > 0) setHasLiked(true);
          else setHasLiked(false);
      }

      // Buscar comentários
      const { data: comments } = await supabase.from('interactions').select('user_insta, text').eq('content_id', contentId).eq('type', 'comment').order('created_at', { ascending: false });
      setCommentsList(comments || []);
    } catch (err) { console.error(err); }
  };

  const handleLike = async () => {
    let currentInsta = instagram;
    if (!currentInsta) {
      const input = prompt("Para interagir, digite seu @ do Instagram:");
      if (input) {
        currentInsta = input.startsWith('@') ? input : `@${input}`;
        setInstagram(currentInsta);
      } else return;
    }

    try {
      if (hasLiked) {
        await supabase.from('interactions').delete().eq('content_id', contentId).eq('type', 'like').eq('user_insta', currentInsta);
        setHasLiked(false);
        setLikes(prev => prev - 1);
      } else {
        await supabase.from('interactions').insert([{ content_id: contentId, type: 'like', user_insta: currentInsta }]);
        setHasLiked(true);
        setLikes(prev => prev + 1);
      }
    } catch (err) { alert('Erro na conexão.'); }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    let currentInsta = instagram;
    if (!currentInsta) {
      const input = prompt("Seu @ do Instagram para comentar:");
      if (input) {
        currentInsta = input.startsWith('@') ? input : `@${input}`;
        setInstagram(currentInsta);
      } else return;
    }

    try {
      const { error } = await supabase.from('interactions').insert([{ content_id: contentId, type: 'comment', user_insta: currentInsta, text: comment }]);
      if (error) throw error;
      setCommentsList(prev => [{ user_insta: currentInsta, text: comment }, ...prev]);
      setComment('');
    } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-6">
        <button onClick={handleLike} className={`flex items-center gap-2 group transition-all ${hasLiked ? 'text-primary' : 'text-white/40 hover:text-white'}`}>
          <span className={`material-symbols-outlined text-2xl ${hasLiked ? 'filled' : ''}`}>{hasLiked ? 'favorite' : 'favorite'}</span>
          <span className="text-[10px] font-black uppercase tracking-widest">{likes} curtidas</span>
        </button>

        <button onClick={() => setShowCommentInput(!showCommentInput)} className="flex items-center gap-2 text-white/40 hover:text-white group">
          <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">chat_bubble</span>
          <span className="text-[10px] font-black uppercase tracking-widest">{commentsList.length}</span>
        </button>

        {instagram && (
          <div className="ml-auto flex items-center gap-2 opacity-30">
             <span className="text-[9px] font-black text-primary uppercase">{instagram}</span>
             <button onClick={() => { setInstagram(''); }} className="material-symbols-outlined text-xs">close</button>
          </div>
        )}
      </div>

      {showCommentInput && (
        <div className="pt-4 animate-fade-in-up">
          <form onSubmit={handleComment} className="flex gap-2 mb-4">
            <input type="text" value={comment} onChange={e => setComment(e.target.value)} placeholder="Comentar..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-primary outline-none" />
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-xl"><span className="material-symbols-outlined text-sm">send</span></button>
          </form>
          <div className="space-y-3 max-h-[120px] overflow-y-auto pr-2 no-scrollbar">
            {commentsList.map((c, i) => (
              <div key={i} className="flex flex-col gap-1 border-l border-primary/20 pl-3">
                <span className="text-primary font-bold text-[10px]">{c.user_insta}</span>
                <span className="text-white/60 text-xs font-light">{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialActions;
