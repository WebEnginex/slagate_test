import React from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import BuildsAdminPage from './BuildsAdminPage';

function AdminBuildsPage() {
  return (
    <AdminLayout>
      <BuildsAdminPage />
    </AdminLayout>
  );
}

export default AdminBuildsPage;
