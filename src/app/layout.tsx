import 'nextra-theme-docs/style.css';
import '@metyatech/course-docs-platform/styles/course-base.css';
import '@metyatech/course-docs-platform/styles/course-admonition.css';
import type { ReactNode } from 'react';
import { Head } from 'nextra/components';
import '@/styles/globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" dir="ltr" suppressHydrationWarning>
      <Head>
        <meta name="description" content="JavaScriptの基礎から実践まで" />
        <link rel="icon" href="/img/favicon.ico" />
      </Head>
      <body>{children}</body>
    </html>
  );
}
