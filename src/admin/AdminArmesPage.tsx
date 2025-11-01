import React from 'react';
import { AdminLayout } from './components/layout/AdminLayout';
import AdminArmesPage from './pages/armes/AdminArmesPage';

/**
 * Page d'administration des armes avec authentification et layout
 */
function AdminArmesPageWrapper() {
  return (
    <AdminLayout>
      <AdminArmesPage />
    </AdminLayout>
  );
}

export default AdminArmesPageWrapper;
