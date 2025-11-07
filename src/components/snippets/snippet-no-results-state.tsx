import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';

interface SnippetNoResultsStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

export function SnippetNoResultsState({
  searchQuery,
  onClearSearch,
}: SnippetNoResultsStateProps) {
  return (
    <Card className='rounded-2xl border-slate-800/50 bg-slate-900/80 backdrop-blur-sm shadow-xl shadow-black/50 min-h-[300px] sm:min-h-[400px] flex items-center'>
      <CardContent className='flex flex-col items-center justify-center py-8 sm:py-12 w-full px-4'>
        <Search className='h-12 w-12 sm:h-16 sm:w-16 text-slate-600 mb-4' />
        <CardTitle className='text-lg sm:text-xl font-semibold text-slate-300 mb-2 text-center'>
          No results found
        </CardTitle>
        <CardDescription className='text-sm sm:text-base text-slate-500 mb-6 text-center px-4'>
          No snippets match your search query &quot;{searchQuery}&quot;
        </CardDescription>
        <Button
          onClick={onClearSearch}
          variant='outline'
          className='border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-100'
        >
          Clear search
        </Button>
      </CardContent>
    </Card>
  );
}

