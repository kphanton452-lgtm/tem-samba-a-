import React, { useState, useEffect } from 'react';
import { supabase, IS_SUPABASE_CONFIGURED } from '../lib/supabase';
import { parseContentWithAI, reviseContentWithAI } from '../lib/gemini';
import type { Session } from '@supabase/supabase-js';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'radar' | 'redacao' | 'acervo' | 'stats'>('radar');
  const [manageType, setManageType] = useState<'events' | 'videos' | 'articles'>('events');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncText, setSyncText] = useState('');
  const [redacaoInput, setRedacaoInput] = useState('');
  const [redacaoOutput, setRedacaoOutput] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [stats, setStats] = useState({ events: 0, videos: 0, articles: 0 });

  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) {
      console.log("Supabase não configurado. Interface de login em modo Demo.");
      return;
    }

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
      } catch (err) {
        console.warn("Erro ao verificar sessão.");
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setAuthError(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && IS_SUPABASE_CONFIGURED) {
      fetchStats();
      if (activeTab === 'acervo') fetchItems();
    }
  }, [session, activeTab, manageType]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!IS_SUPABASE_CONFIGURED) {
      setAuthError("BANCO NÃO CONFIGURADO: Você precisa adicionar VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no seu ambiente de deploy para fazer login.");
      return;
    }

    setLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
        setAuthError('E-mail ou senha incorretos.');
      } else {
        setAuthError(`ERRO DE CONEXÃO: O sistema não conseguiu falar com o Supabase. Verifique se a URL do projeto está correta.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (IS_SUPABASE_CONFIGURED) await supabase.auth.signOut();
    } catch (e) {}
    onClose();
  };

  const fetchStats = async () => {
    if (!IS_SUPABASE_CONFIGURED) return;
    try {
      const { count: e } = await supabase.from('events').select('*', { count: 'exact', head: true });
      const { count: v } = await supabase.from('videos').select('*', { count: 'exact', head: true });
      const { count: a } = await supabase.from('articles').select('*', { count: 'exact', head: true });
      setStats({ events: e || 0, videos: v || 0, articles: a || 0 });
    } catch (e) {
      console.warn("Falha ao buscar estatísticas reais.");
    }
  };

  const fetchItems = async () => {
    if (!IS_SUPABASE_CONFIGURED) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.from(manageType).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      console.error(`Erro ao buscar ${manageType}:`, err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (type: 'event' | 'video' | 'article') => {
    if (!syncText.trim()) return alert("Cole o conteúdo para a IA analisar.");
    setLoading(true);
    try {
      const result = await parseContentWithAI(syncText, type);
      if (!result) throw new Error("A IA não conseguiu processar este conteúdo. Verifique sua API Key.");
      const parsed = result.data;
      const targetTable = type === 'event' ? 'events' : type === 'video' ? 'videos' : 'articles';
      setEditingItem({ 
        ...parsed,
        type: targetTable,
        image_url: parsed.image_url || parsed.thumbnail || 'https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80',
        thumbnail: parsed.image_url || parsed.thumbnail || 'https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80',
      });
      setSyncText('');
      setActiveTab('acervo');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRevise = async () => {
    if (!redacaoInput.trim()) return alert("Digite ou cole o texto para revisar.");
    setLoading(true);
    try {
      const result = await reviseContentWithAI(redacaoInput);
      if (result) setRedacaoOutput(result);
      else alert("Não foi possível revisar o texto. Verifique se a API Key do Gemini está configurada.");
    } catch (e) {
      alert("Erro na revisão.");
    } finally {
      setLoading(false);
    }
  };

  const refinarCampoComIA = async (field: 'content' | 'excerpt') => {
    const originalText = editingItem[field];
    if (!originalText) return alert("O campo está vazio.");
    setLoading(true);
    try {
      const result = await reviseContentWithAI(originalText);
      if (result) {
        setEditingItem({ ...editingItem, [field]: result });
      }
    } catch (e) {
      alert("Erro ao refinar com IA.");
    } finally {
      setLoading(false);
    }
  };

  const saveItem = async () => {
    if (!IS_SUPABASE_CONFIGURED) return alert("Banco de dados não configurado.");
    if (!editingItem.title) return alert("O título é obrigatório.");
    setLoading(true);
    try {
      const table = editingItem.type || manageType;
      const { type, created_at, ...payload } = editingItem;
      
      if (table === 'videos' && payload.thumbnail && !payload.image_url) {
        payload.image_url = payload.thumbnail;
      }

      let result;
      if (editingItem.id) {
        result = await supabase.from(table).update(payload).eq('id', editingItem.id);
      } else {
        const { id, ...newPayload } = payload;
        result = await supabase.from(table).insert([newPayload]);
      }
      
      if (result.error) throw result.error;
      alert("Salvo com sucesso!");
      setEditingItem(null);
      fetchItems();
      fetchStats();
    } catch (e: any) {
      alert("Erro ao salvar: O banco de dados não respondeu. Verifique se as variáveis de ambiente do Supabase estão corretas no painel de controle da sua hospedagem.");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!IS_SUPABASE_CONFIGURED) return;
    if (!confirm("Tem certeza que deseja excluir permanentemente este registro?")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from(manageType).delete().eq('id', id);
      if (error) throw error;
      setItems(items.filter(i => i.id !== id));
      fetchStats();
    } catch (e: any) {
      alert("Erro ao excluir: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center font-display p-6">
        <div className="w-full max-sm:px-4 max-w-sm p-10 bg-card-dark rounded-[3rem] border border-white/10 shadow-3xl text-center relative overflow-hidden">
          {/* Status Indicator */}
          <div className={`absolute top-4 right-6 flex items-center gap-2 px-3 py-1 rounded-full border ${IS_SUPABASE_CONFIGURED ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${IS_SUPABASE_CONFIGURED ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-[8px] font-black uppercase tracking-widest">{IS_SUPABASE_CONFIGURED ? 'Online' : 'Desconectado'}</span>
          </div>

          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
            <span className="material-symbols-outlined text-primary text-4xl">admin_panel_settings</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">SambaSync Admin</h2>
          <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-8">Acesso ao Radar Cultural</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <input type="email" placeholder="E-mail" className="w-full bg-white/5 border border-white/10 focus:border-primary p-5 rounded-2xl transition-all text-white outline-none" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Senha" className="w-full bg-white/5 border border-white/10 focus:border-primary p-5 rounded-2xl transition-all text-white outline-none" value={password} onChange={e => setPassword(e.target.value)} required />
            
            {authError && (
              <div className="text-red-500 text-[9px] font-black uppercase leading-tight text-center bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-fade-in">
                {authError}
              </div>
            )}
            
            <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-white text-white hover:text-black font-black py-5 rounded-2xl uppercase text-xs tracking-widest transition-all disabled:opacity-50">
              {loading ? 'Validando...' : 'Entrar'}
            </button>
          </form>
          
          <button onClick={onClose} className="mt-8 text-[10px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors">Voltar ao site</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background-dark text-white font-display flex overflow-hidden">
      <aside className="w-24 md:w-72 bg-card-dark border-r border-white/5 flex flex-col p-6 md:p-10">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-xl shadow-primary/20">
            <span className="material-symbols-outlined text-white text-2xl">hub</span>
          </div>
          <div className="hidden md:block overflow-hidden">
            <h1 className="font-black text-sm uppercase tracking-tighter truncate">SAMBA<span className="text-primary">SYNC</span></h1>
            <p className="text-[8px] text-white/30 uppercase font-bold tracking-widest truncate">{session.user.email}</p>
          </div>
        </div>

        <nav className="space-y-4 flex-1">
          <button onClick={() => setActiveTab('radar')} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'radar' ? 'bg-primary text-white' : 'text-white/30 hover:bg-white/5'}`}>
            <span className="material-symbols-outlined">bolt</span>
            <span className="hidden md:block font-black text-[10px] uppercase tracking-widest">Radar IA</span>
          </button>
          <button onClick={() => setActiveTab('redacao')} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'redacao' ? 'bg-primary text-white' : 'text-white/30 hover:bg-white/5'}`}>
            <span className="material-symbols-outlined">edit_note</span>
            <span className="hidden md:block font-black text-[10px] uppercase tracking-widest">Redação</span>
          </button>
          <button onClick={() => setActiveTab('acervo')} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'acervo' ? 'bg-primary text-white' : 'text-white/30 hover:bg-white/5'}`}>
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="hidden md:block font-black text-[10px] uppercase tracking-widest">Acervo</span>
          </button>
          <button onClick={() => setActiveTab('stats')} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeTab === 'stats' ? 'bg-primary text-white' : 'text-white/30 hover:bg-white/5'}`}>
            <span className="material-symbols-outlined">analytics</span>
            <span className="hidden md:block font-black text-[10px] uppercase tracking-widest">Estatísticas</span>
          </button>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-4 p-4 rounded-2xl text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all mt-auto border border-transparent hover:border-red-500/20">
          <span className="material-symbols-outlined">logout</span>
          <span className="hidden md:block font-black text-[10px] uppercase tracking-widest">Sair</span>
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 md:p-16 bg-noise">
        {activeTab === 'radar' && (
          <div className="max-w-3xl mx-auto space-y-12 animate-fade-in-up">
            <header>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">CAPTURAR <br/><span className="text-primary">CONTEÚDO</span></h2>
              <p className="text-white/40 text-sm font-light uppercase tracking-widest">A IA analisa links de posts ou textos para alimentar o radar.</p>
            </header>
            <div className="bg-card-dark p-8 rounded-[3rem] border border-white/10 shadow-2xl relative">
              <textarea className="w-full bg-black/30 border border-white/5 p-8 rounded-[2rem] text-white outline-none focus:border-primary/50 h-56 font-light text-xl mb-8 placeholder:text-white/10 resize-none transition-all" placeholder="Link do Instagram, post do Facebook, Sympla ou rascunho..." value={syncText} onChange={e => setSyncText(e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={() => handleSync('event')} className="bg-white/5 hover:bg-primary p-8 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all group shadow-lg"><span className="material-symbols-outlined text-4xl text-primary group-hover:text-white transition-colors">event</span><span className="font-black text-[9px] uppercase tracking-widest">Novo Evento</span></button>
                <button onClick={() => handleSync('video')} className="bg-white/5 hover:bg-primary p-8 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all group shadow-lg"><span className="material-symbols-outlined text-4xl text-primary group-hover:text-white transition-colors">movie</span><span className="font-black text-[9px] uppercase tracking-widest">Novo Vídeo</span></button>
                <button onClick={() => handleSync('article')} className="bg-white/5 hover:bg-primary p-8 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all group shadow-lg"><span className="material-symbols-outlined text-4xl text-primary group-hover:text-white transition-colors">article</span><span className="font-black text-[9px] uppercase tracking-widest">Novo Artigo</span></button>
              </div>
              {loading && <div className="absolute inset-0 bg-black/90 backdrop-blur-xl rounded-[3rem] flex flex-col items-center justify-center z-50"><div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">Consultando Oráculo...</p></div>}
            </div>
          </div>
        )}

        {activeTab === 'redacao' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
             <header>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">EDITOR <br/><span className="text-primary">CULTURAL</span></h2>
              <p className="text-white/40 text-sm font-light uppercase tracking-widest">A IA refina seus rascunhos preservando a ancestralidade e a alma do samba.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-card-dark p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                  <h3 className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-6 border-b border-white/5 pb-2">Rascunho Bruto</h3>
                  <textarea className="w-full bg-black/20 border border-white/5 p-6 rounded-2xl text-white outline-none h-[400px] font-light text-lg resize-none focus:border-primary/30 transition-all" placeholder="Digite ou cole aqui o texto que deseja revisar..." value={redacaoInput} onChange={e => setRedacaoInput(e.target.value)} />
                  <button onClick={handleRevise} disabled={loading} className="w-full mt-6 bg-primary py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-primary/20 disabled:opacity-50">{loading ? 'Editor em Transe...' : 'Revisar com Identidade'}</button>
               </div>
               <div className="bg-card-dark p-8 rounded-[2.5rem] border border-white/5 relative shadow-xl">
                  <h3 className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-6 border-b border-white/5 pb-2">Texto Lapidado</h3>
                  <div className="w-full bg-white/5 p-6 rounded-2xl text-white/80 h-[400px] font-light text-lg overflow-y-auto whitespace-pre-wrap leading-relaxed prose-invert prose-sm scrollbar-hide">
                    {redacaoOutput || <span className="opacity-20 italic">A revisão cultural aparecerá aqui...</span>}
                  </div>
                  <button onClick={() => {navigator.clipboard.writeText(redacaoOutput); alert('Copiado para a área de transferência!')}} className="absolute top-8 right-8 text-primary hover:text-white transition-colors bg-black/40 p-2 rounded-lg"><span className="material-symbols-outlined">content_copy</span></button>
                  <button onClick={() => {setEditingItem({ title: 'Novo Artigo do Radar', content: redacaoOutput, excerpt: redacaoOutput.substring(0, 150) + '...', type: 'articles', category: 'Cultura' }); setActiveTab('acervo');}} className="w-full mt-6 border border-white/10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all">Criar Post deste Conteúdo</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'acervo' && (
          <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
              <div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">GESTÃO DO <br/><span className="text-primary">ACERVO</span></h2>
                <div className="flex gap-4">
                  {(['events', 'videos', 'articles'] as const).map(t => (
                    <button key={t} onClick={() => setManageType(t)} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${manageType === t ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-white/10 text-white/30 hover:text-white'}`}>{t==='events'?'Agenda':t==='videos'?'Vídeos':'Editorial'}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setEditingItem({ id: null, type: manageType, title: '', image_url: '', location: '', price: '', day: '', month: '', category: '', excerpt: '', content: '', video_url: '', read_time: '', ticket_url: '' })} className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5">+ Adicionar Manual</button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading && items.length === 0 ? <div className="col-span-full py-20 text-center"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div></div> : items.length > 0 ? items.map(item => (
                <div key={item.id} className="bg-card-dark border border-white/5 rounded-3xl p-6 flex flex-col gap-6 hover:border-primary/40 transition-all group relative overflow-hidden shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black shrink-0 border border-white/5"><img src={item.image_url || item.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" /></div>
                    <div className="flex-1 min-w-0"><h4 className="font-black uppercase text-xs truncate text-white mb-1">{item.title}</h4><p className="text-[8px] text-white/30 font-bold uppercase truncate tracking-widest">{item.location || item.category || 'Destaque'}</p></div>
                  </div>
                  <div className="flex gap-2 mt-auto"><button onClick={() => setEditingItem({...item, type: manageType})} className="flex-1 bg-white/5 py-3 rounded-xl font-black uppercase text-[9px] hover:bg-primary transition-all">Editar</button><button onClick={() => deleteItem(item.id)} className="w-12 bg-red-500/10 text-red-500 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><span className="material-symbols-outlined text-lg">delete</span></button></div>
                </div>
              )) : (
                <div className="col-span-full py-32 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10 opacity-30">
                  <span className="material-symbols-outlined text-6xl mb-4">folder_open</span>
                  <p className="font-black uppercase text-[10px] tracking-widest">Nada encontrado nesta seção</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
             <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12">NÚMEROS DO <br/><span className="text-primary">SAMBA</span></h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-card-dark p-10 rounded-[3rem] border border-white/5 text-center shadow-2xl"><h4 className="text-primary font-black text-6xl mb-2">{stats.events}</h4><p className="text-[10px] uppercase font-black tracking-widest text-white/30">Eventos Ativos</p></div>
                <div className="bg-card-dark p-10 rounded-[3rem] border border-white/5 text-center shadow-2xl"><h4 className="text-primary font-black text-6xl mb-2">{stats.videos}</h4><p className="text-[10px] uppercase font-black tracking-widest text-white/30">Vídeos no Acervo</p></div>
                <div className="bg-card-dark p-10 rounded-[3rem] border border-white/5 text-center shadow-2xl"><h4 className="text-primary font-black text-6xl mb-2">{stats.articles}</h4><p className="text-[10px] uppercase font-black tracking-widest text-white/30">Artigos Publicados</p></div>
             </div>
          </div>
        )}
      </main>

      {editingItem && (
        <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 overflow-y-auto font-display">
          <div className="w-full max-w-2xl bg-card-dark border border-white/10 rounded-[3rem] p-10 shadow-3xl animate-fade-in-up">
            <header className="flex justify-between items-center mb-10">
              <div><h3 className="text-3xl font-black uppercase text-primary tracking-tighter">Ficha de Edição</h3><p className="text-[9px] uppercase font-bold text-white/30 tracking-widest">Tabela: {editingItem.type || manageType}</p></div>
              <button onClick={() => setEditingItem(null)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500 transition-all"><span className="material-symbols-outlined">close</span></button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="col-span-full"><label className="text-[9px] font-black uppercase text-white/20 mb-2 block tracking-widest">Título do Conteúdo</label><input type="text" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="w-full bg-white/5 border border-white/10 focus:border-primary p-5 rounded-2xl outline-none font-bold text-white" /></div>
              
              {(editingItem.type === 'events' || manageType === 'events') && (
                <>
                  <div><label className="text-[9px] font-black uppercase text-white/20 mb-2 block tracking-widest">Dia</label><input type="text" value={editingItem.day || ''} onChange={e => setEditingItem({...editingItem, day: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white" placeholder="Ex: 15" /></div>
                  <div><label className="text-[9px] font-black uppercase text-white/20 mb-2 block tracking-widest">Mês</label><input type="text" value={editingItem.month || ''} onChange={e => setEditingItem({...editingItem, month: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white" placeholder="Ex: MAR" /></div>
                  <div className="col-span-full"><label className="text-[9px] font-black uppercase text-white/20 mb-2 block tracking-widest">Localização / Horário</label><input type="text" value={editingItem.location || ''} onChange={e => setEditingItem({...editingItem, location: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white" /></div>
                  <div className="col-span-full"><label className="text-[9px] font-black uppercase text-white/20 mb-2 block tracking-widest">Preço / Atrações</label><input type="text" value={editingItem.price || ''} onChange={e => setEditingItem({...editingItem, price: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white" /></div>
                  <div className="col-span-full"><label className="text-[9px] font-black uppercase text-white/20 mb-2 block tracking-widest">Link de Venda / Ticket</label><input type="text" value={editingItem.ticket_url || ''} onChange={e => setEditingItem({...editingItem, ticket_url: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white" placeholder="URL Sympla, Instagram, etc" /></div>
                </>
              )}

              {(editingItem.type === 'videos' || manageType === 'videos') && (
                <>
                  <div className="col-span-full"><label className="text-[9px] font-black uppercase text-white/20 mb-2 block tracking-widest">Link do YouTube</label><input type="text" value={editingItem.video_url || ''} onChange={e => setEditingItem({...editingItem, video_url: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white" /></div>
                  <div><label className="text-[9px] font-black uppercase text-white/20 mb-2 block tracking-widest">Categoria</label><input type="text" value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white" /></div>
                </>
              )}

              {(editingItem.type === 'articles' || manageType === 'articles') && (
                <>
                  <div className="col-span-full relative"><label className="text-[9px] font-black uppercase text-white/20 mb-2 block tracking-widest">Resumo (Chamada)</label><textarea value={editingItem.excerpt || ''} onChange={e => setEditingItem({...editingItem, excerpt: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none h-24 text-white resize-none" /><button onClick={() => refinarCampoComIA('excerpt')} className="absolute top-8 right-4 text-primary hover:text-white text-[8px] font-black uppercase tracking-widest bg-black/60 px-3 py-1.5 rounded-full border border-primary/30 transition-all">{loading ? '...' : '✨ Lapidar IA'}</button></div>
                  <div className="col-span-full relative"><label className="text-[9px] font-black uppercase text-white/20 mb-2 block tracking-widest">Corpo do Texto</label><textarea value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none h-48 text-white resize-none" /><button onClick={() => refinarCampoComIA('content')} className="absolute top-8 right-4 text-primary hover:text-white text-[8px] font-black uppercase tracking-widest bg-black/60 px-3 py-1.5 rounded-full border border-primary/30 transition-all">{loading ? '...' : '✨ Lapidar IA'}</button></div>
                  <div><label className="text-[9px] font-black uppercase text-white/20 mb-2 block tracking-widest">Leitura (minutos)</label><input type="text" value={editingItem.read_time || ''} onChange={e => setEditingItem({...editingItem, read_time: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white" placeholder="Ex: 4 min" /></div>
                  <div><label className="text-[9px] font-black uppercase text-white/20 mb-2 block tracking-widest">Categoria</label><input type="text" value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white" /></div>
                </>
              )}

              <div className="col-span-full"><label className="text-[9px] font-black uppercase text-white/20 mb-2 block tracking-widest">URL da Imagem / Capa</label><input type="text" value={editingItem.image_url || editingItem.thumbnail || ''} onChange={e => setEditingItem({...editingItem, image_url: e.target.value, thumbnail: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-[10px] text-white/50" /></div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setEditingItem(null)} className="flex-1 py-5 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all">Cancelar</button>
              <button onClick={saveItem} disabled={loading} className="flex-1 py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">{loading ? 'Trabalhando...' : 'Salvar no Acervo'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;