import { type Snippet } from '@/schema/snippet';

import { SnippetEmptyState } from './snippet-empty-state';
import { SnippetGrid } from './snippet-grid';
import { SnippetLoadingState } from './snippet-loading-state';
import { SnippetNoResultsState } from './snippet-no-results-state';

interface SnippetContentProps {
  isLoading: boolean;
  snippets: Snippet[] | undefined;
  filteredSnippets: Snippet[];
  searchQuery: string;
  onCreateClick: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onClearSearch: () => void;
}

export function SnippetContent({
  isLoading,
  snippets,
  filteredSnippets,
  searchQuery,
  onCreateClick,
  onEdit,
  onDelete,
  onClearSearch,
}: SnippetContentProps) {
  const hasSnippets = snippets && snippets.length > 0;
  const hasSearchResults = filteredSnippets.length > 0;
  const showEmptyState = !isLoading && !hasSnippets;
  const showNoResults =
    !isLoading && hasSnippets && searchQuery.trim() && !hasSearchResults;

  if (isLoading) {
    return <SnippetLoadingState />;
  }

  if (showNoResults) {
    return (
      <SnippetNoResultsState
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
      />
    );
  }

  if (showEmptyState) {
    return <SnippetEmptyState onCreateClick={onCreateClick} />;
  }

  if (hasSearchResults) {
    return (
      <SnippetGrid snippets={filteredSnippets} onEdit={onEdit} onDelete={onDelete} />
    );
  }

  return null;
}

