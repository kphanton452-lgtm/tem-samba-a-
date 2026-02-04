
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string | undefined => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}

  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}

  return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

/**
 * Verifica se as chaves de ambiente foram fornecidas e não são os placeholders iniciais.
 */
export const IS_SUPABASE_CONFIGURED = !!(
  supabaseUrl && 
  supabaseUrl !== 'https://seu-projeto.supabase.co' && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
);

if (!IS_SUPABASE_CONFIGURED) {
  console.warn(
    'Supabase: Chaves de API não configuradas. O site está operando em MODO LOCAL/DEMO.\n' +
    'Para habilitar o banco de dados e a IA, configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no seu painel de deploy.'
  );
}

/**
 * Inicialização do cliente. 
 * Se não configurado, aponta para um endereço inválido mas evita crash imediato.
 */
export const supabase = createClient(
  IS_SUPABASE_CONFIGURED ? supabaseUrl! : 'https://dummy-url.supabase.co', 
  IS_SUPABASE_CONFIGURED ? supabaseAnonKey! : 'dummy-key',
  {
    auth: {
      persistSession: IS_SUPABASE_CONFIGURED,
      autoRefreshToken: IS_SUPABASE_CONFIGURED,
      detectSessionInUrl: IS_SUPABASE_CONFIGURED
    }
  }
);
