
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export const usePreRegistros = (lote: string) => {
  return useQuery({
    queryKey: ['preRegistros', lote],
    queryFn: async () => {
      if (!lote) return [];
      
      try {
        // Create abort controller with a slightly shorter timeout (12 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        
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
          console.error('Request timed out after 12 seconds');
          return []; // Return empty array on timeout
        }
        console.error('Failed to fetch pre_registros:', error);
        throw error; // Changed: throw the error to trigger the error state
      }
    },
    enabled: !!lote,
    retry: 2, // Changed: retry twice
    retryDelay: 800, // Changed: retry after 800ms
    staleTime: 30000, // Changed: 30 seconds (from 60000)
    gcTime: 180000, // Changed: 3 minutes (from 300000)
  });
};
