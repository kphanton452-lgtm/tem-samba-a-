
export interface EventData {
  id: string;
  day: string;
  month: string;
  title: string;
  location: string;
  image_url: string;
  label?: string;
  price?: string;
  ticket_url?: string;
}

export interface VideoData {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  video_url: string;
  image_url?: string;
  description?: string;
  duration?: string;
}

export interface ArticleData {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time: string;
  image_url: string;
}

export const SITE_CONTENT = {
  events: [
    {
      id: 'quinta-carioca-carnaval-05',
      day: '05',
      month: 'FEV',
      title: 'Quinta Carioca',
      location: 'Av. Octávio Mangabeira — Pituba — 19h',
      image_url: 'https://ifnzywenpohlmwznadke.supabase.co/storage/v1/object/public/uploads/fsdfsdf.PNG',
      label: 'Carnaval',
      price: 'O Carnaval começa antes… e começa aqui! 🎉',
      ticket_url: 'https://www.instagram.com/temsambaai/'
    },
    {
      id: 'quinta-carioca-90-especial',
      day: '22',
      month: 'JAN',
      title: 'Quinta Carioca - Pagode 90',
      location: 'Av. Octávio Mangabeira, Pituba, Salvador — 19h',
      image_url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80',
      label: 'Especial',
      price: 'Katinguelê, Soweto, SPC, Pixote, Altasamba &+',
      ticket_url: 'https://www.instagram.com/temsambaai/'
    },
    {
      id: 'samba-raiz-bahia',
      day: '29',
      month: 'JAN',
      title: 'Samba de Roda Tradicional',
      location: 'Pelourinho, Salvador — 18h',
      image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80',
      label: 'Raiz',
      price: 'Entrada Franca',
      ticket_url: ''
    }
  ] as EventData[],

  videos: [
    {
      id: 'v-quinta-carioca-nova',
      title: 'Quinta Carioca - Amor e Conquista (Lançamento)',
      category: 'Lançamento',
      thumbnail: 'https://ifnzywenpohlmwznadke.supabase.co/storage/v1/object/public/uploads/musicanova.jpeg',
      video_url: 'https://ifnzywenpohlmwznadke.supabase.co/storage/v1/object/public/uploads/musicanovavideo.mp4',
      description: 'A nova música do Quinta Carioca chegou emocionando quem ama samba moderno com letras cheias de sentimento. Uma vibe romântica que traduz o amor em melodia.'
    },
    {
      id: 'v1',
      title: 'Grandes Clássicos do Pagode 90',
      category: 'Especial',
      thumbnail: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Uma viagem no tempo pelos hits que definiram uma geração do pagode brasileiro.'
    },
    {
      id: 'v2',
      title: 'A História do Samba de Roda',
      category: 'Documentário',
      thumbnail: 'https://images.unsplash.com/photo-1606093414909-08309a632009?auto=format&fit=crop&q=80',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Documentário exclusivo sobre as origens e a evolução do samba de roda na Bahia.'
    }
  ] as VideoData[],

  articles: [
    {
      id: 'a-quinta-carioca-amor',
      title: 'Nova Música do Quinta Carioca Fala de Amor',
      excerpt: 'Apostando em uma vibe romântica, o grupo transforma o amor em melodia com letra cheia de sentimento.',
      content: `A nova música do Quinta Carioca chegou emocionando quem ama samba moderno com letras cheias de sentimento. Apostando em uma vibe romântica, o grupo transforma o amor em melodia, trazendo uma canção que já está sendo considerada uma das mais bonitas da fase atual da banda.

❤️ Uma Canção Que Traduz o Amor em Cada Verso
A letra aborda o amor de forma simples e verdadeira, mostrando o valor dos pequenos gestos, da parceria e da saudade boa que existe quando se ama de verdade. É aquele tipo de música que faz lembrar momentos especiais e pessoas importantes. Com um refrão envolvente e harmonias suaves, o Quinta Carioca cria uma atmosfera perfeita para quem gosta de músicas que tocam o coração.

🎶 O Estilo Inconfundível do Quinta Carioca
Conhecido por unir romantismo e alegria em suas composições, o grupo mantém sua identidade musical nesta nova faixa:
- Samba moderno com pegada emocional
- Letra fácil de cantar e memorizar
- Clima perfeito para playlists românticas

Essa combinação vem conquistando novos ouvintes e fortalecendo ainda mais a base de fãs.

🌹 Por Que Essa Música Está Fazendo Sucesso?
✔ Conecta com histórias reais de amor
✔ Tem refrão forte e marcante
✔ Mistura emoção com leveza
✔ Perfeita para momentos especiais

É uma música que vai além de ouvir — é para sentir.`,
      category: 'Música',
      read_time: '3 min',
      image_url: 'https://ifnzywenpohlmwznadke.supabase.co/storage/v1/object/public/uploads/musicanova.jpeg'
    },
    {
      id: 'a1',
      title: 'Por que os anos 90 mudaram o Samba?',
      excerpt: 'A explosão do pagode romântico e os grupos que definiram uma geração.',
      content: 'Os anos 90 foram marcados por uma transformação rítmica e visual no samba...',
      category: 'Cultura',
      read_time: '5 min',
      image_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80'
    }
  ] as ArticleData[]
};
