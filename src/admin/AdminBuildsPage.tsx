import React from 'react';
import { AdminLayout } from './components/layout/AdminLayout';
import BuildsAdminPage from './pages/builds/BuildsAdminPage';

/**
 * Page d'administration des builds avec authentification et layout
 */
function AdminBuildsPage() {
  return (
    <AdminLayout>
      <BuildsAdminPage />
    </AdminLayout>
  );
}

export default AdminBuildsPage;