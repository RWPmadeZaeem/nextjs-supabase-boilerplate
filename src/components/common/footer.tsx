'use client';

import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { appConfig } from '@/config/app';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com',
      className: 'hover:text-slate-200',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: appConfig.social.linkedin,
      className: 'hover:text-blue-400',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com',
      className: 'hover:text-blue-400',
    },
  ];

  return (
    <footer className='border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <div className='text-sm text-slate-500'>
            © {currentYear} {appConfig.appName}. All rights reserved.
          </div>
          <div className='flex items-center gap-4'>
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`text-slate-500 transition-colors ${link.className}`}
                  aria-label={link.name}
                >
                  <Icon className='h-5 w-5' />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

