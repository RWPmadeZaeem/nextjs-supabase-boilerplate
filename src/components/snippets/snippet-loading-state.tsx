import { SnippetCardSkeleton } from './snippet-card-skeleton';

export function SnippetLoadingState() {
  return (
    <div className='grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: 6 }).map((_, index) => (
        <SnippetCardSkeleton key={index} />
      ))}
    </div>
  );
}

