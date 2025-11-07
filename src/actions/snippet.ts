'use server';

import { authActionClient } from '@/lib/server/safe-action';
import { upsertSnippetSchema, deleteSnippetSchema } from '@/schema/snippet';

export const upsertSnippetAction = authActionClient
  .schema(upsertSnippetSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { supabase, authUser } = ctx;
    const isUpdate = !!parsedInput.id;

    // If updating, verify ownership
    if (isUpdate) {
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

      // Update existing snippet
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

      return { success: true, snippet: data, isUpdate: true };
    }

    // Create new snippet
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

    return { success: true, snippet: data, isUpdate: false };
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

    return { success: true };
  });

