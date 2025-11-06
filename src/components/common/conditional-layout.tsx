'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/common/navbar';
import { Footer } from '@/components/common/footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth') ?? false;

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
      <Navbar />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}

