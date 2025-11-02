import React from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { AdminNoyauxPage } from './AdminNoyauxPage';

function AdminNoyauxPageWrapper() {
  return (
    <AdminLayout>
      <AdminNoyauxPage />
    </AdminLayout>
  );
}

export default AdminNoyauxPageWrapper;
