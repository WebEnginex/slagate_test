import React from 'react';
import { AdminLayout } from './components/layout/AdminLayout';
import DashboardPage from './pages/dashboard';

function AdminDashboard() {
  return (
    <AdminLayout>
      <DashboardPage />
    </AdminLayout>
  );
}

export default AdminDashboard;
