'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { Edit2, Trash2, Code2 } from 'lucide-react';

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateSnippetAction, deleteSnippetAction } from '@/actions/snippet';
import { onError } from '@/lib/show-error-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateSnippetSchema, type UpdateSnippetInput } from '@/schema/snippet';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const { data: snippets, isLoading: snippetsLoading } = useSnippets();
  const queryClient = useQueryClient();
  const [editingSnippet, setEditingSnippet] = useState<string | null>(null);
  const [deletingSnippet, setDeletingSnippet] = useState<string | null>(null);

  const { execute: updateSnippet, status: updateStatus } = useAction(
    updateSnippetAction,
    {
      onSuccess: () => {
        toast.success('Snippet updated successfully');
        setEditingSnippet(null);
        queryClient.invalidateQueries({ queryKey: [QueryKeys.SNIPPETS] });
      },
      onError,
    },
  );

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

  const form = useForm<UpdateSnippetInput>({
    resolver: zodResolver(updateSnippetSchema),
    defaultValues: {
      id: '',
      title: '',
      content: '',
      language: '',
    },
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(paths.auth.login);
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (editingSnippet && snippets) {
      const snippet = snippets.find((s) => s.id === editingSnippet);
      if (snippet) {
        form.reset({
          id: snippet.id,
          title: snippet.title,
          content: snippet.content,
          language: snippet.language || '',
        });
      }
    }
  }, [editingSnippet, snippets, form]);

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
    setEditingSnippet(snippetId);
  };

  const handleDelete = (snippetId: string) => {
    setDeletingSnippet(snippetId);
  };

  const onSubmitEdit = (data: UpdateSnippetInput) => {
    updateSnippet(data);
  };

  const handleConfirmDelete = () => {
    if (deletingSnippet) {
      deleteSnippet({ id: deletingSnippet });
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2'>
            Your Snippets
          </h1>
          <p className='text-slate-400'>
            Manage and organize your code snippets
          </p>
        </div>

        <div className='min-h-[500px]'>
          {snippetsLoading ? (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className='rounded-2xl border-slate-800/50 bg-slate-900/80 backdrop-blur-sm shadow-xl shadow-black/50'
              >
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
            ))}
          </div>
        ) : snippets && snippets.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {snippets.map((snippet) => (
              <Card
                key={snippet.id}
                className='rounded-2xl border-slate-800/50 bg-slate-900/80 backdrop-blur-sm shadow-xl shadow-black/50 transition-all duration-300 hover:shadow-black/70 hover:border-slate-700/50'
              >
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
                  <div className='rounded-lg bg-slate-950/50 border border-slate-800 p-3'>
                    <pre className='text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap break-words max-h-32 overflow-y-auto'>
                      {snippet.content}
                    </pre>
                  </div>
                  <div className='flex items-center justify-between pt-2 border-t border-slate-800'>
                    <span className='text-xs text-slate-500'>
                      {new Date(snippet.created_at).toLocaleDateString()}
                    </span>
                    <div className='flex gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleEdit(snippet.id)}
                        className='h-8 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50'
                        iconLeft={Edit2}
                      >
                        Edit
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDelete(snippet.id)}
                        className='h-8 text-slate-400 hover:text-red-400 hover:bg-slate-800/50'
                        iconLeft={Trash2}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className='rounded-2xl border-slate-800/50 bg-slate-900/80 backdrop-blur-sm shadow-xl shadow-black/50 min-h-[400px] flex items-center'>
            <CardContent className='flex flex-col items-center justify-center py-12 w-full'>
              <Code2 className='h-16 w-16 text-slate-600 mb-4' />
              <CardTitle className='text-xl font-semibold text-slate-300 mb-2'>
                No snippets yet
              </CardTitle>
              <CardDescription className='text-slate-500 mb-6 text-center'>
                Get started by creating your first code snippet
              </CardDescription>
              <Button
                onClick={() => router.push(paths.snippets.create)}
                className='bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30'
              >
                Create Your First Snippet
              </Button>
            </CardContent>
          </Card>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog
        open={editingSnippet !== null}
        onOpenChange={(open) => !open && setEditingSnippet(null)}
      >
        <DialogContent className='sm:max-w-[600px] bg-slate-900 border-slate-800'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'>
              Edit Snippet
            </DialogTitle>
            <DialogDescription className='text-slate-400'>
              Update your code snippet
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitEdit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-slate-300'>Title</FormLabel>
                    <FormControl>
                      <Input
                        className='bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='language'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-slate-300'>
                      Language (optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., JavaScript, Python, TypeScript'
                        className='bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-slate-300'>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={12}
                        className='bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 font-mono text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setEditingSnippet(null)}
                  className='border-slate-700 text-slate-700 hover:bg-slate-800 hover:text-slate-300'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  isLoading={updateStatus === 'executing'}
                  className='bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white'
                >
                  Update Snippet
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deletingSnippet !== null}
        onOpenChange={(open) => !open && setDeletingSnippet(null)}
      >
        <DialogContent className='sm:max-w-[425px] bg-slate-900 border-slate-800'>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold text-slate-100'>
              Delete Snippet
            </DialogTitle>
            <DialogDescription className='text-slate-400'>
              Are you sure you want to delete this snippet? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setDeletingSnippet(null)}
              className='border-slate-700 text-slate-700 hover:bg-slate-800 hover:text-slate-300'
            >
              Cancel
            </Button>
            <Button
              type='button'
              variant='destructive'
              onClick={handleConfirmDelete}
              isLoading={deleteStatus === 'executing'}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
  );
}
