'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';

import { useUser } from '@/hooks/queries/user';

import { logoutAction } from '@/actions/auth';

import { SnippyLogo } from '@/components/common/snippy-logo';
import { Button } from '@/components/ui/button';

import { paths } from '@/constants/paths';

export function Navbar() {
  
  const { data: user } = useUser();
  const { execute: logout, status: logoutStatus } = useAction(logoutAction);

  if (!user) {
    return null;
  }

  return (
    <nav className='sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-sm'>
      <div className='container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6'>
        <Link
          href={paths.home}
          className='flex items-center gap-2 sm:gap-3 transition-opacity hover:opacity-80'
        >
          <SnippyLogo size='md' />
          <span className='text-lg sm:text-xl font-semibold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'>
            Snippy
          </span>
        </Link>

        <div className='flex items-center gap-2 sm:gap-4'>
          <Button
            onClick={() => logout()}
            variant='ghost'
            size='sm'
            className='text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 text-xs sm:text-sm'
            iconLeft={LogOut}
            isLoading={logoutStatus === 'executing'}
          >
            <span className='hidden sm:inline'>Sign out</span>
            <span className='sm:hidden'>Out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}

