import type { Metadata } from 'next';
import { Epilogue, Lexend } from 'next/font/google';
import './globals.css';

const epilogue = Epilogue({
  subsets: ['latin'],
  variable: '--font-epilogue',
  display: 'swap',
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MoodCerdos - Tu refugio interior',
  description: 'Diario de ánimo y claridad mental.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${epilogue.variable} ${lexend.variable} dark`}>
      <body className="min-h-screen pb-24 md:pb-0" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
