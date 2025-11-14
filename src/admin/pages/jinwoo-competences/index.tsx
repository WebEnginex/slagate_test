import React from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { AdminJinwooCompetencesPage } from './AdminJinwooCompetencesPage';

function AdminJinwooCompetencesPageWrapper() {
  return (
    <AdminLayout>
      <AdminJinwooCompetencesPage />
    </AdminLayout>
  );
}

export default AdminJinwooCompetencesPageWrapper;

