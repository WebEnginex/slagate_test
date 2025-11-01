import React from 'react';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminChasseursPage } from './pages/chasseurs/AdminChasseursPage';

/**
 * Page d'administration des chasseurs avec authentification et layout
 */
function AdminChasseursPageWrapper() {
  return (
    <AdminLayout>
      <AdminChasseursPage />
    </AdminLayout>
  );
}

export default AdminChasseursPageWrapper;
