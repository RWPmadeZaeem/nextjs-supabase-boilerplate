'use client';

import { Check,Copy, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.content);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  };

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
            Created on {new Date(snippet.created_at).toLocaleDateString()}
          </span>
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleCopy}
              className='h-8 w-8 text-slate-400 hover:text-blue-400 hover:bg-slate-800/50'
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onEdit(snippet.id)}
              className='h-8 w-8 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50'
            >
              <Edit2 size={16} />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onDelete(snippet.id)}
              className='h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-slate-800/50'
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

