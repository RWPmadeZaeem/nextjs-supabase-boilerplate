import { Edit2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type Snippet } from '@/schema/snippet';
import { CodeViewer } from './code-viewer';

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SnippetCard({ snippet, onEdit, onDelete }: SnippetCardProps) {
  return (
    <Card className='rounded-2xl border-slate-800/50 bg-slate-900/80 backdrop-blur-sm shadow-xl shadow-black/50 transition-all duration-300 hover:shadow-black/70 hover:border-slate-700/50'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='text-lg font-semibold text-slate-100 mb-1'>
              {snippet.title}
            </CardTitle>
            {snippet.language && (
              <CardDescription className='text-xs text-emerald-400 font-mono'>
                {snippet.language}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <CodeViewer
          value={snippet.content}
          language={snippet.language || undefined}
          height='200px'
          showWindowControls={true}
          windowTitle={
            snippet.language
              ? snippet.language.charAt(0).toUpperCase() +
                snippet.language.slice(1)
              : undefined
          }
        />
        <div className='flex items-center justify-between pt-2 border-t border-slate-800'>
          <span className='text-xs text-slate-500'>
            {new Date(snippet.created_at).toLocaleDateString()}
          </span>
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onEdit(snippet.id)}
              className='h-8 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50'
              iconLeft={Edit2}
            >
              Edit
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onDelete(snippet.id)}
              className='h-8 text-slate-400 hover:text-red-400 hover:bg-slate-800/50'
              iconLeft={Trash2}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

