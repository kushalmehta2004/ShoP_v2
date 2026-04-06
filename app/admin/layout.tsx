import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Ends With P',
  description: 'Manage your luxury catalogue',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
