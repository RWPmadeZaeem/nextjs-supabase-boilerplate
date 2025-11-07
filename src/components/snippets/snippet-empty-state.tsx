import { Code2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';

interface SnippetEmptyStateProps {
  onCreateClick: () => void;
}

export function SnippetEmptyState({ onCreateClick }: SnippetEmptyStateProps) {
  return (
    <Card className='rounded-2xl border-slate-800/50 bg-slate-900/80 backdrop-blur-sm shadow-xl shadow-black/50 min-h-[300px] sm:min-h-[400px] flex items-center'>
      <CardContent className='flex flex-col items-center justify-center py-8 sm:py-12 w-full px-4'>
        <Code2 className='h-12 w-12 sm:h-16 sm:w-16 text-slate-600 mb-4' />
        <CardTitle className='text-lg sm:text-xl font-semibold text-slate-300 mb-2 text-center'>
          No snippets yet
        </CardTitle>
        <CardDescription className='text-sm sm:text-base text-slate-500 mb-6 text-center px-4'>
          Get started by creating your first code snippet
        </CardDescription>
        <Button
          onClick={onCreateClick}
          className='bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30 text-sm sm:text-base'
        >
          Create Your First Snippet
        </Button>
      </CardContent>
    </Card>
  );
}

