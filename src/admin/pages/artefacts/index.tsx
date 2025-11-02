import React from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { AdminArtefactsPage } from './AdminArtefactsPage';

function AdminArtefactsPageWrapper() {
  return (
    <AdminLayout>
      <AdminArtefactsPage />
    </AdminLayout>
  );
}

export default AdminArtefactsPageWrapper;
