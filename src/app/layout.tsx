import type { Metadata } from 'next'
import { ShellProvider } from '@/components/shell/ShellProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chronos',
  description: 'Collaborative timeline application for curating and visualizing events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ShellProvider>{children}</ShellProvider>
      </body>
    </html>
  )
}
