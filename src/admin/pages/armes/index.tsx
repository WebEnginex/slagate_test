import React from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import AdminArmesPage from './AdminArmesPage';

function AdminArmesPageWrapper() {
  return (
    <AdminLayout>
      <AdminArmesPage />
    </AdminLayout>
  );
}

export default AdminArmesPageWrapper;
