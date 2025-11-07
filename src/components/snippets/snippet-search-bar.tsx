'use client';

import { useEffect } from 'react';
import { Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SnippetSearchBarProps {
  value: string;
  onValueChange: (value: string) => void;
  onDebouncedChange: (debouncedValue: string) => void;
  placeholder?: string;
  className?: string;
}

export function SnippetSearchBar({
  value,
  onValueChange,
  onDebouncedChange,
  placeholder = 'Search snippets by title, content, or language...',
  className,
}: SnippetSearchBarProps) {
  // Debounce the value and call onDebouncedChange
  useEffect(() => {
    const timer = setTimeout(() => {
      onDebouncedChange(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onDebouncedChange]);

  const handleClear = () => {
    onValueChange('');
  };

  return (
    <div className={className}>
      <div className='relative max-w-md'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
        <Input
          type='text'
          placeholder={placeholder}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className='pl-10 pr-10 h-11 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50'
        />
        {value && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={handleClear}
            className='absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          >
            <X size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}

