import React from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { AdminOmbresPage } from './AdminOmbresPage';

function AdminOmbresPageWrapper() {
  return (
    <AdminLayout>
      <AdminOmbresPage />
    </AdminLayout>
  );
}

export default AdminOmbresPageWrapper;

