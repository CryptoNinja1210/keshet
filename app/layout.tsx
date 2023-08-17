import './globals.css'
import { Inter } from 'next/font/google';
import { Providers } from './redux';
import { Analytics } from '@vercel/analytics/react'
import {Navbar} from './components';
import NavBar2 from './components/navbar/NavBar2';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Remedie Genie',
  description: 'Homeophatic assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar/>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
