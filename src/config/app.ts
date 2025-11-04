import { Metadata } from 'next';

import { env } from '@/env';

export const appConfig = {
  title: 'Snippy',
  description:
    'Snippy - Your modern code snippet manager',
  keywords: 'snippy, code snippets, developer tools, code management',
  logo: '/logo/main.png',
  defaultLocale: 'en-US',
  defaultCurrency: 'USD',
  defaultCountryCode: 'US',
  appUrl: env.NEXT_PUBLIC_APP_URL,
  appName: 'Snippy',
  emails: {
    support: 'support@example.com',
    sender: 'noreply@example.com',
  },
  social: {
    linkedin: 'https://www.linkedin.com/in/zaeemkhalid070/',
  },
  author: {
    name: 'Zaeem Khalid',
    linkedin: 'https://www.linkedin.com/in/zaeemkhalid070/',
  },
} as const;

export default function getMetadata(): Metadata {
  return {
    metadataBase: new URL(appConfig.appUrl),
    title: { template: `%s | ${appConfig.title}`, default: appConfig.title },
    description: appConfig.description,
    robots: { index: true, follow: true },
    icons: {
      icon: '/icon.svg',
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
    openGraph: {
      url: appConfig.appUrl,
      title: appConfig.title,
      description: appConfig.description,
      siteName: appConfig.title,
      images: [`/main/logo.png`],
      type: 'website',
      locale: appConfig.defaultLocale.replace('-', '_'),
    },

    twitter: {
      card: 'summary_large_image',
      title: appConfig.title,
      description: appConfig.description,
      images: [`/main/logo.png`],
    },
    keywords: [
      'next.js',
      'supabase',
      'react-query',
      'typescript',
      'boilerplate',
      'web development',
    ],
  };
}
