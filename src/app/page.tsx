'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { Code2, Plus, Search, X } from 'lucide-react';

import { useUser } from '@/hooks/queries/user';
import { useSnippets } from '@/hooks/queries/snippet';
import { paths } from '@/constants/paths';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SnippetCard } from '@/components/snippets/snippet-card';
import { SnippetCardSkeleton } from '@/components/snippets/snippet-card-skeleton';
import { CreateSnippetForm } from '@/components/snippets/create-snippet-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { deleteSnippetAction } from '@/actions/snippet';
import { onError } from '@/lib/show-error-toast';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export default function Home() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const { data: snippets, isLoading: snippetsLoading } = useSnippets();
  const queryClient = useQueryClient();
  const [deletingSnippet, setDeletingSnippet] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create');
  const [editingSnippetId, setEditingSnippetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const { execute: deleteSnippet, status: deleteStatus } = useAction(
    deleteSnippetAction,
    {
      onSuccess: () => {
        toast.success('Snippet deleted successfully');
        setDeletingSnippet(null);
        queryClient.invalidateQueries({ queryKey: [QueryKeys.SNIPPETS] });
      },
      onError,
    },
  );

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(paths.auth.login);
    }
  }, [user, isLoading, router]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className='flex min-h-full items-center justify-center'>
        <div className='text-muted-foreground'>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const handleEdit = (snippetId: string) => {
    setEditingSnippetId(snippetId);
    setSheetMode('edit');
    setIsSheetOpen(true);
  };

  const handleDelete = (snippetId: string) => {
    setDeletingSnippet(snippetId);
  };

  const handleCreate = () => {
    setEditingSnippetId(null);
    setSheetMode('create');
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setEditingSnippetId(null);
    setSheetMode('create');
  };

  const handleConfirmDelete = () => {
    if (deletingSnippet) {
      deleteSnippet({ id: deletingSnippet });
    }
  };

  // Filter snippets based on debounced search query
  const filteredSnippets = snippets?.filter((snippet) => {
    if (!debouncedSearchQuery.trim()) return true;
    const query = debouncedSearchQuery.toLowerCase();
    return (
      snippet.title.toLowerCase().includes(query) ||
      snippet.content.toLowerCase().includes(query) ||
      (snippet.language && snippet.language.toLowerCase().includes(query))
    );
  }) || [];

  const hasSnippets = snippets && snippets.length > 0;
  const hasSearchResults = filteredSnippets.length > 0;
  const showEmptyState = !snippetsLoading && !hasSnippets;
  const showNoResults = !snippetsLoading && hasSnippets && debouncedSearchQuery.trim() && !hasSearchResults;

  return (
    <div className='container mx-auto px-4 sm:px-6 py-6 sm:py-8'>
        <div className='mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
          <div>
            <h1 className='text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2'>
              Your Snippets
            </h1>
            <p className='text-sm sm:text-base text-slate-400'>
              Manage and organize your code snippets
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className='bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30 shrink-0 w-full sm:w-auto'
            iconLeft={Plus}
          >
            New Snippet
          </Button>
        </div>

        {/* Search Bar */}
        {hasSnippets && (
          <div className='mb-6 sm:mb-8'>
            <div className='relative max-w-md'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
              <Input
                type='text'
                placeholder='Search snippets by title, content, or language...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10 pr-10 h-11 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50'
              />
              {searchQuery && (
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => setSearchQuery('')}
                  className='absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </div>
        )}

        <div className='min-h-[400px] sm:min-h-[500px]'>
          {snippetsLoading ? (
            <div className='grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, index) => (
                <SnippetCardSkeleton key={index} />
              ))}
            </div>
          ) : showNoResults ? (
            <Card className='rounded-2xl border-slate-800/50 bg-slate-900/80 backdrop-blur-sm shadow-xl shadow-black/50 min-h-[300px] sm:min-h-[400px] flex items-center'>
              <CardContent className='flex flex-col items-center justify-center py-8 sm:py-12 w-full px-4'>
                <Search className='h-12 w-12 sm:h-16 sm:w-16 text-slate-600 mb-4' />
                <CardTitle className='text-lg sm:text-xl font-semibold text-slate-300 mb-2 text-center'>
                  No results found
                </CardTitle>
                <CardDescription className='text-sm sm:text-base text-slate-500 mb-6 text-center px-4'>
                  No snippets match your search query &quot;{debouncedSearchQuery}&quot;
                </CardDescription>
                <Button
                  onClick={() => setSearchQuery('')}
                  variant='outline'
                  className='border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                >
                  Clear search
                </Button>
              </CardContent>
            </Card>
          ) : showEmptyState ? (
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
                  onClick={handleCreate}
                  className='bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30 text-sm sm:text-base'
                >
                  Create Your First Snippet
                </Button>
              </CardContent>
            </Card>
          ) : hasSearchResults ? (
            <div className='grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredSnippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : null}
        </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deletingSnippet !== null}
        onOpenChange={(open) => !open && setDeletingSnippet(null)}
      >
        <DialogContent className='w-[calc(100%-2rem)] sm:max-w-[425px] bg-slate-900 border-slate-800 mx-4'>
          <DialogHeader>
            <DialogTitle className='text-lg sm:text-xl font-semibold text-slate-100'>
              Delete Snippet
            </DialogTitle>
            <DialogDescription className='text-sm sm:text-base text-slate-400'>
              Are you sure you want to delete this snippet? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex-col sm:flex-row gap-2 sm:gap-0'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setDeletingSnippet(null)}
              className='border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-100 w-full sm:w-auto'
            >
              Cancel
            </Button>
            <Button
              type='button'
              variant='destructive'
              onClick={handleConfirmDelete}
              isLoading={deleteStatus === 'executing'}
              className='w-full sm:w-auto'
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Snippet Sheet (Create/Edit) */}
      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleSheetClose();
          }
        }}
      >
        <SheetContent side='right' className='w-full sm:max-w-2xl bg-slate-900 border-slate-800 overflow-y-auto p-4 sm:p-6'>
          <SheetHeader className='pr-8'>
            <SheetTitle className='text-xl sm:text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'>
              {sheetMode === 'edit' ? 'Edit Snippet' : 'Create New Snippet'}
            </SheetTitle>
            <SheetDescription className='text-slate-400 text-sm'>
              {sheetMode === 'edit' 
                ? 'Update your code snippet' 
                : 'Save your code snippet for easy access later'}
            </SheetDescription>
          </SheetHeader>
          <div className='mt-4 sm:mt-6'>
            {isSheetOpen && (
              <CreateSnippetForm
                mode={sheetMode}
                initialValues={
                  sheetMode === 'edit' && editingSnippetId && snippets
                    ? (() => {
                        const snippet = snippets.find((s) => s.id === editingSnippetId);
                        return snippet
                          ? {
                              id: snippet.id,
                              title: snippet.title,
                              content: snippet.content,
                              language: snippet.language || '',
                            }
                          : undefined;
                      })()
                    : undefined
                }
                onSuccess={handleSheetClose}
                onClose={handleSheetClose}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
      </div>
  );
}
