import type { Metadata } from 'next'

// These styles apply to every route in the application
import './globals.css'
import { ToastProvider } from "./components/Toast"

export const metadata: Metadata = {
  title: 'Adz Admin Panel',
  description: 'adz',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>

          {children}
        </ToastProvider>

      </body>
    </html>
  )
}