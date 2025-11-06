'use client';

import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createSnippetAction, updateSnippetAction } from '@/actions/snippet';
import { createSnippetSchema, updateSnippetSchema, type CreateSnippetInput, type UpdateSnippetInput } from '@/schema/snippet';
import { onError } from '@/lib/show-error-toast';
import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/constants/query-keys';
import { toast } from 'sonner';
import { LanguageSelector } from './language-selector';
import { CodeEditor } from './code-editor';
import { useEffect } from 'react';

interface SnippetFormProps {
  mode?: 'create' | 'edit';
  initialValues?: {
    id?: string;
    title?: string;
    content?: string;
    language?: string;
  };
  onSuccess?: () => void;
  onClose?: () => void;
}

export function CreateSnippetForm({ mode = 'create', initialValues, onSuccess, onClose }: SnippetFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = mode === 'edit';

  const { execute: createSnippet, status: createStatus } = useAction(createSnippetAction, {
    onSuccess: () => {
      toast.success('Snippet created successfully');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SNIPPETS] });
      form.reset();
      onSuccess?.();
    },
    onError,
  });

  const { execute: updateSnippet, status: updateStatus } = useAction(updateSnippetAction, {
    onSuccess: () => {
      toast.success('Snippet updated successfully');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SNIPPETS] });
      form.reset();
      onSuccess?.();
    },
    onError,
  });

  const form = useForm<CreateSnippetInput | UpdateSnippetInput>({
    resolver: zodResolver(isEditMode ? updateSnippetSchema : createSnippetSchema),
    defaultValues: initialValues || {
      title: '',
      content: '',
      language: '',
      ...(isEditMode && { id: '' }),
    },
  });

  // Reset form with initial values when they change
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [form]);

  const onSubmit = (data: CreateSnippetInput | UpdateSnippetInput) => {
    if (isEditMode) {
      updateSnippet(data as UpdateSnippetInput);
    } else {
      createSnippet(data as CreateSnippetInput);
    }
  };

  const status = isEditMode ? updateStatus : createStatus;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
        <div className='flex flex-col sm:flex-row gap-4 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onSuccess}
            className='flex-1 border-slate-700 text-slate-700 hover:bg-slate-800 hover:text-slate-100 w-full sm:w-auto'
          >
            Cancel
          </Button>
          <Button
            type='submit'
            isLoading={status === 'executing'}
            disabled={status === 'executing'}
            className='flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30 w-full sm:w-auto'
          >
            {status === 'executing' 
              ? (isEditMode ? 'Updating...' : 'Creating...') 
              : (isEditMode ? 'Update Snippet' : 'Create Snippet')}
          </Button>
        </div>
      </form>
    </Form>
  );
}

