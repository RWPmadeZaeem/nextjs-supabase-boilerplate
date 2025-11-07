'use client';

import { useMemo } from 'react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CreateSnippetForm } from './create-snippet-form';
import { type Snippet } from '@/schema/snippet';

interface SnippetSheetProps {
  open: boolean;
  mode: 'create' | 'edit';
  editingSnippetId: string | null;
  snippets: Snippet[] | undefined;
  onClose: () => void;
  onSuccess: () => void;
}

export function SnippetSheet({
  open,
  mode,
  editingSnippetId,
  snippets,
  onClose,
  onSuccess,
}: SnippetSheetProps) {
  const initialValues = useMemo(() => {
    if (mode === 'edit' && editingSnippetId && snippets) {
      const snippet = snippets.find((s) => s.id === editingSnippetId);
      return snippet
        ? {
            id: snippet.id,
            title: snippet.title,
            content: snippet.content,
            language: snippet.language || '',
          }
        : undefined;
    }
    return undefined;
  }, [mode, editingSnippetId, snippets]);

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side='right'
        className='w-full sm:max-w-2xl bg-slate-900 border-slate-800 overflow-y-auto p-4 sm:p-6'
      >
        <SheetHeader className='pr-8'>
          <SheetTitle className='text-xl sm:text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'>
            {mode === 'edit' ? 'Edit Snippet' : 'Create New Snippet'}
          </SheetTitle>
          <SheetDescription className='text-slate-400 text-sm'>
            {mode === 'edit'
              ? 'Update your code snippet'
              : 'Save your code snippet for easy access later'}
          </SheetDescription>
        </SheetHeader>
        <div className='mt-4 sm:mt-6'>
          {open && (
            <CreateSnippetForm
              mode={mode}
              initialValues={initialValues}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

