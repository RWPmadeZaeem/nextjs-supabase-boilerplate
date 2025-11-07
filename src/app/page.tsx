'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useSnippets } from '@/hooks/queries/snippet';

import { deleteSnippetAction } from '@/actions/snippet';

import { DeleteSnippetDialog } from '@/components/snippets/delete-snippet-dialog';
import { SnippetContent } from '@/components/snippets/snippet-content';
import { SnippetHeader } from '@/components/snippets/snippet-header';
import { SnippetSearchBar } from '@/components/snippets/snippet-search-bar';
import { SnippetSheet } from '@/components/snippets/snippet-sheet';

import { onError } from '@/lib/show-error-toast';

import { QueryKeys } from '@/constants/query-keys';

export default function Home() {
  const { data: snippets, isLoading: snippetsLoading } = useSnippets();
  const queryClient = useQueryClient();
  const [deletingSnippet, setDeletingSnippet] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'create' | 'edit'>('create');
  const [editingSnippetId, setEditingSnippetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const { execute: deleteSnippet, isPending: isDeleting } = useAction(
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

  const handleSearchValueChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleSearchDebouncedChange = useCallback((debouncedValue: string) => {
    setDebouncedSearchQuery(debouncedValue);
  }, []);

  const handleEdit = useCallback((snippetId: string) => {
    setEditingSnippetId(snippetId);
    setSheetMode('edit');
    setIsSheetOpen(true);
  }, []);

  const handleDelete = useCallback((snippetId: string) => {
    setDeletingSnippet(snippetId);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingSnippetId(null);
    setSheetMode('create');
    setIsSheetOpen(true);
  }, []);

  const handleSheetClose = useCallback(() => {
    setIsSheetOpen(false);
    setEditingSnippetId(null);
    setSheetMode('create');
  }, []);

  const handleConfirmDelete = useCallback(
    (snippetId: string) => {
      deleteSnippet({ id: snippetId });
    },
    [deleteSnippet]
  );

  // Memoized filter function for snippets
  const filterSnippet = useCallback((snippet: NonNullable<typeof snippets>[0], query: string) => {
    if (!query.trim()) return true;
    const lowerQuery = query.toLowerCase();
    return (
      snippet.title.toLowerCase().includes(lowerQuery) ||
      snippet.content.toLowerCase().includes(lowerQuery) ||
      (snippet.language && snippet.language.toLowerCase().includes(lowerQuery))
    );
  }, []);

  // Memoized filtered snippets based on debounced search query
  const filteredSnippets = useMemo(() => {
    if (!snippets) return [];
    return snippets.filter((snippet) => filterSnippet(snippet, debouncedSearchQuery));
  }, [snippets, debouncedSearchQuery, filterSnippet]);

  // Memoized derived state values
  const hasSnippets = useMemo(() => snippets && snippets.length > 0, [snippets]);

  return (
    <div className='container mx-auto px-4 sm:px-6 py-6 sm:py-8'>
      <SnippetHeader onCreateClick={handleCreate} />

        {/* Search Bar */}
        {hasSnippets && (
          <div className='mb-6 sm:mb-8'>
            <SnippetSearchBar
              value={searchQuery}
              onValueChange={handleSearchValueChange}
              onDebouncedChange={handleSearchDebouncedChange}
            />
          </div>
        )}

        <div className='min-h-[400px] sm:min-h-[500px]'>
          <SnippetContent
            isLoading={snippetsLoading}
            snippets={snippets}
            filteredSnippets={filteredSnippets}
            searchQuery={debouncedSearchQuery}
            onCreateClick={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClearSearch={() => setSearchQuery('')}
          />
        </div>

      {/* Delete Confirmation Dialog */}
      <DeleteSnippetDialog
        open={deletingSnippet !== null}
        snippetId={deletingSnippet}
        isDeleting={isDeleting}
        onClose={() => setDeletingSnippet(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Snippet Sheet (Create/Edit) */}
      <SnippetSheet
        open={isSheetOpen}
        mode={sheetMode}
        editingSnippetId={editingSnippetId}
        snippets={snippets}
        onClose={handleSheetClose}
        onSuccess={handleSheetClose}
      />
      </div>
  );
}
