import React from 'react';
import { AdminProtection } from './auth/components/AdminProtection';
import { AdminLayout } from './components/layout/AdminLayout';

interface AdminAppProps {
  children: React.ReactNode;
}

export function AdminApp({ children }: AdminAppProps) {
  return (
    <AdminProtection>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AdminProtection>
  );
}