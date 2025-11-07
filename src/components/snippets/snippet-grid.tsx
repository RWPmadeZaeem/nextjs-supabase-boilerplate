import { SnippetCard } from './snippet-card';
import { type Snippet } from '@/schema/snippet';

interface SnippetGridProps {
  snippets: Snippet[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SnippetGrid({
  snippets,
  onEdit,
  onDelete,
}: SnippetGridProps) {
  return (
    <div className='grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

