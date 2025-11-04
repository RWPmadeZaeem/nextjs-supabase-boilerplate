'use client';

import { Navbar } from '@/components/common/navbar';
import { Footer } from '@/components/common/footer';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
      <Navbar />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}

