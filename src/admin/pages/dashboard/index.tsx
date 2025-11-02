import React from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import DashboardPage from './DashboardPage';

function AdminDashboard() {
  return (
    <AdminLayout>
      <DashboardPage />
    </AdminLayout>
  );
}

export default AdminDashboard;
