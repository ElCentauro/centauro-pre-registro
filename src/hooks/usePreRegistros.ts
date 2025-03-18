
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export const usePreRegistros = (lote: string) => {
  return useQuery({
    queryKey: ['preRegistros', lote],
    queryFn: async () => {
      if (!lote) return [];
      
      const { data, error } = await supabase
        .from('pre_registros')
        .select('*')
        .eq('lote', lote)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!lote,
  });
};
