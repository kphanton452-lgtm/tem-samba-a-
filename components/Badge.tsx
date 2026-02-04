
import React from 'react';

const LOGO_URL = "https://ifnzywenpohlmwznadke.supabase.co/storage/v1/object/public/uploads/ChatGPT%20Image%2019%20de%20jan.%20de%202026,%2013_54_07.png";

const Badge: React.FC = () => {
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-surface-brown rounded-full border border-primary/30 shadow-2xl"></div>
      
      {/* SVG Text on Path */}
      <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
        <defs>
          <path d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" id="circlePath"></path>
        </defs>
        <text fill="#b88700" fontSize="10.5" fontWeight="bold" letterSpacing="1.2">
          <textPath href="#circlePath" startOffset="0%">
            • CULTURA • RODA • SAMBA • RAIZ
          </textPath>
        </text>
      </svg>
      
      {/* Inner Icon replaced with Logo */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <img src={LOGO_URL} alt="Tem Samba Aí" className="w-full h-full object-contain" />
      </div>
    </div>
  );
};

export default Badge;
