import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - Digital Invitation',
  description: 'Admin panel untuk mengelola undangan digital',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
