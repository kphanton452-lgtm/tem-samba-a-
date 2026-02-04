
import React from 'react';

const LOGO_URL = "https://ifnzywenpohlmwznadke.supabase.co/storage/v1/object/public/uploads/ChatGPT%20Image%2019%20de%20jan.%20de%202026,%2013_54_07.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#121212] pt-20 pb-10 px-4 border-t border-white/5 text-white/60" id="sobre">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 text-white mb-6">
            <img src={LOGO_URL} alt="" className="w-10 h-10 object-contain" />
            <span className="font-bold text-2xl tracking-tighter">TEM SAMBA AÍ</span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed mb-6">
            O radar cultural das raízes brasileiras. Conectando a tradição à tecnologia para manter viva a chama do samba.
          </p>
          <div className="flex gap-4">
            <a target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-white" href="https://instagram.com/temsambaai">
              <span className="font-bold text-xs">IG</span>
            </a>
            <a target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors text-white" href="https://youtube.com/@temsambaai">
              <span className="font-bold text-xs">YT</span>
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Explorar</h4>
          <ul className="space-y-3 text-sm">
            <li><a className="hover:text-primary transition-colors" href="#eventos">Agenda</a></li>
            <li><a className="hover:text-primary transition-colors" href="#assista">Vídeos</a></li>
            <li><a className="hover:text-primary transition-colors" href="#leia">Editorial</a></li>
            <li><a className="hover:text-primary transition-colors" href="#escute">Spotify</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Contato</h4>
          <p className="text-xs mb-4">Parcerias e Divulgação:</p>
          <a href="mailto:contato@temsambaai.com.br" className="text-primary font-bold text-sm">contato@temsambaai.com.br</a>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
        <div className="flex items-center gap-4">
          <p>© {new Date().getFullYear()} Tem Samba Aí. Todos os direitos reservados.</p>
        </div>
        <div className="flex gap-6">
          <a className="hover:text-white transition-colors" href="#">Privacidade</a>
          <a className="hover:text-white transition-colors" href="#">Termos</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
