import React from 'react';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminNoyauxPage } from './pages/noyaux/AdminNoyauxPage';

/**
 * Page d'administration des noyaux avec authentification et layout
 */
function AdminNoyauxPageWrapper() {
  return (
    <AdminLayout>
      <AdminNoyauxPage />
    </AdminLayout>
  );
}

export default AdminNoyauxPageWrapper;
