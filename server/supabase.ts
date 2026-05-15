import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase] SUPABASE_URL ou SUPABASE_ANON_KEY não configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Função para testar conexão com Supabase
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('count()', { count: 'exact', head: true });
    
    if (error) {
      console.error('[Supabase] Erro ao conectar:', error.message);
      return false;
    }
    
    console.log('[Supabase] Conexão bem-sucedida!');
    return true;
  } catch (error) {
    console.error('[Supabase] Erro ao testar conexão:', error);
    return false;
  }
}
