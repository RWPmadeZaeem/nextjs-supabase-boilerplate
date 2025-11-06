import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SnippetCardSkeleton() {
  return (
    <Card className='rounded-2xl border-slate-800/50 bg-slate-900/80 backdrop-blur-sm shadow-xl shadow-black/50'>
      <CardHeader>
        <Skeleton className='h-6 w-3/4 bg-slate-800' />
        <Skeleton className='h-4 w-1/4 mt-2 bg-slate-800' />
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='rounded-lg bg-slate-950/50 border border-slate-800 p-3'>
          <Skeleton className='h-24 w-full bg-slate-800' />
        </div>
        <div className='flex items-center justify-between pt-2 border-t border-slate-800'>
          <Skeleton className='h-3 w-20 bg-slate-800' />
          <div className='flex gap-2'>
            <Skeleton className='h-8 w-16 bg-slate-800' />
            <Skeleton className='h-8 w-16 bg-slate-800' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

