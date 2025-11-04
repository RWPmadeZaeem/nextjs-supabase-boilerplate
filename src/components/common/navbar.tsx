'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { LogOut, Plus } from 'lucide-react';

import { SnippyLogo } from '@/components/common/snippy-logo';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/actions/auth';
import { paths } from '@/constants/paths';
import { useUser } from '@/hooks/queries/user';

export function Navbar() {
  const router = useRouter();
  const { data: user } = useUser();
  const { execute: logout, status: logoutStatus } = useAction(logoutAction);

  if (!user) {
    return null;
  }

  return (
    <nav className='sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-sm'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <Link
          href={paths.home}
          className='flex items-center gap-3 transition-opacity hover:opacity-80'
        >
          <SnippyLogo size='md' />
          <span className='text-xl font-semibold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'>
            Snippy
          </span>
        </Link>

        <div className='flex items-center gap-4'>
          <Button
            onClick={() => router.push(paths.snippets.create)}
            className='bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/30'
            iconLeft={Plus}
          >
            New Snippet
          </Button>
          <Button
            onClick={() => logout()}
            variant='ghost'
            size='sm'
            className='text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            iconLeft={LogOut}
            isLoading={logoutStatus === 'executing'}
          >
            Sign out
          </Button>
        </div>
      </div>
    </nav>
  );
}

