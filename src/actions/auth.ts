'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { safeActionClient } from '@/lib/server/safe-action';
import { createSupabaseServerClient } from '@/lib/supabase/server';

import { loginSchema, signupSchema } from '@/schema/auth';

export const loginAction = safeActionClient
  .schema(loginSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsedInput.email,
      password: parsedInput.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Failed to sign in');
    }

    revalidatePath('/', 'layout');
    return { success: true, user: data.user };
  });

export const signupAction = safeActionClient
  .schema(signupSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signUp({
      email: parsedInput.email,
      password: parsedInput.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Failed to create account');
    }

    revalidatePath('/', 'layout');
    return { success: true, user: data.user };
  });

export const logoutAction = safeActionClient.action(async () => {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
  redirect('/auth/login');
});


