import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase/client';
import { QueryKeys } from '@/constants/query-keys';
import { snippetSchema, type Snippet } from '@/schema/snippet';

export const useSnippets = () => {
  return useQuery<Snippet[]>({
    queryKey: [QueryKeys.SNIPPETS],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map((snippet) => snippetSchema.parse(snippet));
    },
    staleTime: 1000 * 60, // 1 minute
  });
};

