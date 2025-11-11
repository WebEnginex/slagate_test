import React from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { AdminPantheonPage } from './AdminPantheonPage';

function AdminPantheonPageWrapper() {
  return (
    <AdminLayout>
      <AdminPantheonPage />
    </AdminLayout>
  );
}

export default AdminPantheonPageWrapper;

