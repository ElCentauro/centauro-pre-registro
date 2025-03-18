
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export const usePreRegistros = (lote: string) => {
  return useQuery({
    queryKey: ['preRegistros', lote],
    queryFn: async () => {
      if (!lote) return [];
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const { data, error } = await supabase
          .from('pre_registros')
          .select('*')
          .eq('lote', lote)
          .order('created_at', { ascending: false })
          .abortSignal(controller.signal);
          
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('Error fetching pre_registros:', error);
          throw error;
        }
        
        return data || [];
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.error('Request timed out');
          return []; // Return empty array on timeout instead of throwing
        }
        console.error('Failed to fetch pre_registros:', error);
        return []; // Return empty array on error instead of throwing
      }
    },
    enabled: !!lote,
    retry: 1, // Only retry once
    retryDelay: 1000, // Retry after 1 second
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });
};
