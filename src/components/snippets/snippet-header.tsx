import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface SnippetHeaderProps {
  onCreateClick: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

export function SnippetHeader({
  onCreateClick,
  title = 'Your Snippets',
  description = 'Manage and organize your code snippets',
  buttonText = 'New Snippet',
}: SnippetHeaderProps) {
  return (
    <div className='mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
      <div>
        <h1 className='text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2'>
          {title}
        </h1>
        <p className='text-sm sm:text-base text-slate-400'>{description}</p>
      </div>
      <Button
        onClick={onCreateClick}
        className='bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30 shrink-0 w-full sm:w-auto'
        iconLeft={Plus}
      >
        {buttonText}
      </Button>
    </div>
  );
}

