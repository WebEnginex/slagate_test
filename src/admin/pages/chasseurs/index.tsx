import React from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { AdminChasseursPage } from './AdminChasseursPage';

function AdminChasseursPageWrapper() {
  return (
    <AdminLayout>
      <AdminChasseursPage />
    </AdminLayout>
  );
}

export default AdminChasseursPageWrapper;
