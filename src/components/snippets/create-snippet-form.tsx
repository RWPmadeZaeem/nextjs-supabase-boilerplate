'use client';

import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createSnippetAction } from '@/actions/snippet';
import { createSnippetSchema, type CreateSnippetInput } from '@/schema/snippet';
import { onError } from '@/lib/show-error-toast';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { toast } from 'sonner';
import { LanguageSelector } from './language-selector';
import { CodeEditor } from './code-editor';

export function CreateSnippetForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { execute: createSnippet, status } = useAction(createSnippetAction, {
    onSuccess: () => {
      toast.success('Snippet created successfully');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SNIPPETS] });
      router.push(paths.home);
    },
    onError,
  });

  const form = useForm<CreateSnippetInput>({
    resolver: zodResolver(createSnippetSchema),
    defaultValues: {
      title: '',
      content: '',
      language: '',
    },
  });

  const onSubmit = (data: CreateSnippetInput) => {
    createSnippet(data);
  };

  return (
    <>
      <Button
        variant='ghost'
        onClick={() => router.back()}
        className='mb-6 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        iconLeft={ArrowLeft}
      >
        Back
      </Button>

      <Card className='mx-auto max-w-3xl rounded-3xl border-slate-800/50 bg-slate-900/80 backdrop-blur-sm shadow-2xl shadow-black/50'>
        <CardHeader className='space-y-3 text-center'>
          <CardTitle className='text-3xl font-semibold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'>
            Create New Snippet
          </CardTitle>
          <CardDescription className='text-base text-slate-400'>
            Save your code snippet for easy access later
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel className='text-sm font-medium text-slate-300'>
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., React Hook Example'
                        className='h-11 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LanguageSelector name='language' label='Language (optional)' />
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel className='text-sm font-medium text-slate-300'>
                      Code Content
                    </FormLabel>
                    <FormControl>
                      <CodeEditor
                        value={field.value}
                        onChange={field.onChange}
                        language={form.watch('language')}
                        placeholder='Paste your code here...'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex gap-4 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.back()}
                  className='flex-1 border-slate-700 text-slate-700 hover:bg-slate-800 hover:text-slate-300'
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  isLoading={status === 'executing'}
                  disabled={status === 'executing'}
                  className='flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30'
                >
                  {status === 'executing' ? 'Creating...' : 'Create Snippet'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

