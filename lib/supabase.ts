
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string | undefined => {
  // Tentar Vite env (import.meta.env)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}

  // Tentar process.env (Vercel/Node)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}

  // Tentar window (Fallback)
  try {
    // @ts-ignore
    if (typeof window !== 'undefined' && window[key]) {
      // @ts-ignore
      return window[key];
    }
  } catch (e) {}

  return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Corrigido: usando optional chaining (?.) para evitar crash se supabaseUrl for undefined
export const IS_SUPABASE_CONFIGURED = !!(
  supabaseUrl?.startsWith('http') && 
  supabaseAnonKey && 
  supabaseAnonKey.length > 20
);

if (!IS_SUPABASE_CONFIGURED && typeof window !== 'undefined') {
  console.warn(
    'Supabase: Chaves de API não configuradas ou inválidas. O site está operando em MODO DEMO.\n' +
    'Verifique as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no painel da Vercel.'
  );
}

// Inicializa o cliente com URLs seguras para evitar erro de 'invalid URL' que causa tela preta
export const supabase = createClient(
  IS_SUPABASE_CONFIGURED ? supabaseUrl! : 'https://dummy-project.supabase.co', 
  IS_SUPABASE_CONFIGURED ? supabaseAnonKey! : 'dummy-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
