import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PlanIt - Family Planner',
  description: 'Manage your family schedule with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
}
