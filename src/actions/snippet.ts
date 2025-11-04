'use server';

import { revalidatePath } from 'next/cache';

import { authActionClient } from '@/lib/server/safe-action';
import {
  createSnippetSchema,
  updateSnippetSchema,
  deleteSnippetSchema,
} from '@/schema/snippet';

export const createSnippetAction = authActionClient
  .schema(createSnippetSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase, authUser } = ctx;

    const { data, error } = await supabase
      .from('snippets')
      .insert({
        title: parsedInput.title,
        content: parsedInput.content,
        language: parsedInput.language || null,
        user_id: authUser.user.id,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/');
    return { success: true, snippet: data };
  });

export const updateSnippetAction = authActionClient
  .schema(updateSnippetSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase, authUser } = ctx;

    // Verify ownership
    const { data: existing } = await supabase
      .from('snippets')
      .select('user_id')
      .eq('id', parsedInput.id)
      .single();

    if (!existing) {
      throw new Error('Snippet not found');
    }

    if (existing.user_id !== authUser.user.id) {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('snippets')
      .update({
        title: parsedInput.title,
        content: parsedInput.content,
        language: parsedInput.language || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', parsedInput.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/');
    return { success: true, snippet: data };
  });

export const deleteSnippetAction = authActionClient
  .schema(deleteSnippetSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase, authUser } = ctx;

    // Verify ownership
    const { data: existing } = await supabase
      .from('snippets')
      .select('user_id')
      .eq('id', parsedInput.id)
      .single();

    if (!existing) {
      throw new Error('Snippet not found');
    }

    if (existing.user_id !== authUser.user.id) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('snippets')
      .delete()
      .eq('id', parsedInput.id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/');
    return { success: true };
  });

