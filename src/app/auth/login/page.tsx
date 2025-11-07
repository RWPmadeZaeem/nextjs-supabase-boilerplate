'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';

import { loginAction } from '@/actions/auth';

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
import { ControlledPasswordInput } from '@/components/ui/form/controlled-password-input';
import { Input } from '@/components/ui/input';

import { onError } from '@/lib/show-error-toast';

import { paths } from '@/constants/paths';
import { type LoginInput,loginSchema } from '@/schema/auth';

export default function LoginPage() {
  const router = useRouter();

  const { execute, status } = useAction(loginAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        router.push('/');
        router.refresh();
      }
    },
    onError,
  });

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginInput) => {
    execute(data);
  };

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6'>
      {/* Decorative code brackets */}
      <div className='absolute left-2 top-1/4 -z-10 text-4xl sm:text-6xl font-mono text-emerald-500/10 select-none hidden sm:block'>
        {'{'}
      </div>
      <div className='absolute right-2 bottom-1/4 -z-10 text-4xl sm:text-6xl font-mono text-blue-500/10 select-none hidden sm:block'>
        {'}'}
      </div>

      <Card className='w-full max-w-md rounded-2xl sm:rounded-3xl border-slate-800/50 bg-slate-900/80 backdrop-blur-sm shadow-2xl shadow-black/50 transition-all duration-300 hover:shadow-black/70 hover:border-slate-700/50'>
        <CardHeader className='space-y-2 sm:space-y-3 text-center px-4 sm:px-6 pt-6 sm:pt-8'>
          <div className='mx-auto mb-2'>
            <SnippyLogo size='lg' />
          </div>
          <CardTitle className='text-2xl sm:text-3xl font-semibold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'>
            Welcome to Snippy
          </CardTitle>
          <CardDescription className='text-sm sm:text-base text-slate-400'>
            Sign in to access your code snippets
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-4 sm:pt-6 px-4 sm:px-6'>
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
              <ControlledPasswordInput
                name='password'
                placeholder='Enter your password'
                label='Password'
                hideInstructions={true}
              />
              <Button
                type='submit'
                className='mt-6 h-11 w-full text-base font-medium bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30'
                isLoading={status === 'executing'}
                disabled={status === 'executing'}
              >
                {status === 'executing' ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-1 pt-4 pb-6 sm:pb-8 px-4 sm:px-6'>
          <div className='text-xs sm:text-sm text-slate-400 text-center'>
            Don't have an account?{' '}
            <Link
              href={paths.auth.register}
              className='font-medium text-emerald-400 underline-offset-4 transition-colors hover:text-emerald-300 hover:underline'
            >
              Create one
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

