'use client';

import { AdminLayoutContent } from './components/admin-content';

// This layout will override the root layout for the admin section
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
