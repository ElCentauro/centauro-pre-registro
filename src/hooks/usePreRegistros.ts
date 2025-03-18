
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

export const usePreRegistros = (lote: string) => {
  return useQuery({
    queryKey: ['preRegistros', lote],
    queryFn: async () => {
      if (!lote) return [];
      
      try {
        // Shorter timeout (8 seconds) to fail faster
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const { data, error } = await supabase
          .from('pre_registros')
          .select('*')
          .eq('lote', lote)
          .order('created_at', { ascending: false })
          .abortSignal(controller.signal);
          
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('Error fetching pre_registros:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        return data || [];
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.error('Request timed out after 8 seconds');
          throw new Error('La solicitud ha excedido el tiempo de espera. Por favor intente nuevamente.');
        }
        console.error('Failed to fetch pre_registros:', error);
        throw error;
      }
    },
    enabled: !!lote,
    retry: 1, // Only retry once to fail faster
    retryDelay: 1000, // 1 second retry delay
    staleTime: 15000, // 15 seconds stale time
    gcTime: 60000, // 1 minute gc time
  });
};
