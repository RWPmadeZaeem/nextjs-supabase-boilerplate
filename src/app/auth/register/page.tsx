'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { signupAction } from '@/actions/auth';
import { SnippyLogo } from '@/components/common/snippy-logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { ControlledPasswordInput } from '@/components/ui/form/controlled-password-input';
import { onError } from '@/lib/show-error-toast';
import { signupSchema, type SignupInput } from '@/schema/auth';
import { paths } from '@/constants/paths';
import { useUser } from '@/hooks/queries/user';

export default function RegisterPage() {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useUser();

  const { execute, status } = useAction(signupAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        router.push('/');
        router.refresh();
      }
    },
    onError,
  });

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const onSubmit = (data: SignupInput) => {
    execute(data);
  };

  if (isUserLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
        <div className='text-muted-foreground'>Loading...</div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4'>
      {/* Grid pattern overlay - code editor style */}
      <div className='absolute inset-0 -z-20 bg-[linear-gradient(to_right,hsl(217,33%,17%)_1px,transparent_1px),linear-gradient(to_bottom,hsl(217,33%,17%)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 dark:opacity-60' />
      
      {/* Syntax highlighting inspired gradient orbs */}
      <div className='absolute inset-0 -z-10'>
        {/* Emerald green - for strings */}
        <div className='absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl' />
        {/* Blue - for keywords */}
        <div className='absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl' />
        {/* Purple - for functions */}
        <div className='absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/8 blur-3xl' />
      </div>

      {/* Decorative code brackets */}
      <div className='absolute left-8 top-1/4 -z-10 text-6xl font-mono text-emerald-500/10 select-none'>
        {'{'}
      </div>
      <div className='absolute right-8 bottom-1/4 -z-10 text-6xl font-mono text-blue-500/10 select-none'>
        {'}'}
      </div>

      <Card className='w-full max-w-md rounded-3xl border-slate-800/50 bg-slate-900/80 backdrop-blur-sm shadow-2xl shadow-black/50 transition-all duration-300 hover:shadow-black/70 hover:border-slate-700/50'>
        <CardHeader className='space-y-3 text-center'>
          <div className='mx-auto mb-2'>
            <SnippyLogo size='lg' />
          </div>
          <CardTitle className='text-3xl font-semibold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'>
            Join Snippy
          </CardTitle>
          <CardDescription className='text-base text-slate-400'>
            Create your account to start saving snippets
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel className='text-sm font-medium text-slate-300'>
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='you@example.com'
                        className='h-11 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='space-y-2'>
                <ControlledPasswordInput
                  name='password'
                  placeholder='Create a strong password'
                  label='Password'
                  hideInstructions={false}
                />
              </div>
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel className='text-sm font-medium text-slate-300'>
                      Confirm password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Confirm your password'
                        className='h-11 bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='mt-6 h-11 w-full text-base font-medium bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30'
                isLoading={status === 'executing'}
                disabled={status === 'executing'}
              >
                {status === 'executing' ? 'Creating account...' : 'Create account'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-1 pt-4'>
          <div className='text-sm text-slate-400'>
            Already have an account?{' '}
            <Link
              href={paths.auth.login}
              className='font-medium text-emerald-400 underline-offset-4 transition-colors hover:text-emerald-300 hover:underline'
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

