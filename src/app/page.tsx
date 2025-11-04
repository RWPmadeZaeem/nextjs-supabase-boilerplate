'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useUser } from '@/hooks/queries/user';
import { paths } from '@/constants/paths';
import { Button } from '@/components/ui/button';
import { useAction } from 'next-safe-action/hooks';
import { logoutAction } from '@/actions/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const { execute: logout } = useAction(logoutAction);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(paths.auth.login);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-muted-foreground'>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-background p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Welcome!</CardTitle>
          <CardDescription>You are successfully logged in.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <p className='text-sm text-muted-foreground'>
              <strong>Email:</strong> {user.email}
            </p>
            <p className='text-sm text-muted-foreground'>
              <strong>User ID:</strong> {user.id}
            </p>
          </div>
          <Button
            onClick={() => logout()}
            variant='outline'
            className='w-full'
          >
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
