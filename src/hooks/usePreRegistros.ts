
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export const usePreRegistros = (lote: string) => {
  return useQuery({
    queryKey: ['preRegistros', lote],
    queryFn: async () => {
      if (!lote) return [];
      
      try {
        const { data, error } = await supabase
          .from('pre_registros')
          .select('*')
          .eq('lote', lote)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching pre_registros:', error);
          throw error;
        }
        
        return data || [];
      } catch (error) {
        console.error('Failed to fetch pre_registros:', error);
        return [];
      }
    },
    enabled: !!lote,
    retry: 2,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });
};
