'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useUser } from '@/hooks/queries/user';
import { paths } from '@/constants/paths';
import { CreateSnippetForm } from '@/components/snippets/create-snippet-form';

export default function CreateSnippetPage() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(paths.auth.login);
    }
  }, [user, isLoading, router]);

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

  return (
    <div className='container mx-auto px-4 py-8'>
      <CreateSnippetForm />
    </div>
  );
}

