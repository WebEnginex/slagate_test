import React from 'react';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminArtefactsPage } from './pages/artefacts/AdminArtefactsPage';

/**
 * Page d'administration des artefacts avec authentification et layout
 */
function AdminArtefactsPageWrapper() {
  return (
    <AdminLayout>
      <AdminArtefactsPage />
    </AdminLayout>
  );
}

export default AdminArtefactsPageWrapper;
