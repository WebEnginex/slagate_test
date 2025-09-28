// Administration exports

// Main App
export { AdminApp } from './AdminApp';

// Auth
export * from './auth';

// Layout
export { AdminLayout } from './components/layout/AdminLayout';

// Pages
export { BuildsAdminPage } from './pages/builds';
export { default as DashboardPage } from './pages/dashboard/DashboardPage';

// Utils
export { BuildsFileManager } from './utils/buildsFileManager';
export { ReferenceDataManager } from './utils/referenceDataManager';
export * from './utils/testUtils';

// Types
export type {
  BuildEditorData,
  EditorReferenceData,
  BuildValidationResult,
  ArtefactFormData,
  NoyauFormData,
  BuildFormData,
  ChasseurBuildFormData,
  ArtefactSlot,
  Element,
  StatOption,
  ChasseurBuild
} from './types';