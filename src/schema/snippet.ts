import { z } from 'zod';

export const upsertSnippetSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  language: z.string().optional(),
});

export const deleteSnippetSchema = z.object({
  id: z.string(),
});

export type UpsertSnippetInput = z.infer<typeof upsertSnippetSchema>;
export type DeleteSnippetInput = z.infer<typeof deleteSnippetSchema>;

export const snippetSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  language: z.string().nullable(),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Snippet = z.infer<typeof snippetSchema>;

