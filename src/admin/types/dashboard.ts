/**
 * Types pour le dashboard administrateur
 */

export interface DashboardStats {
  builds: {
    total: number;
    byElement: Record<string, number>;
  };
  chasseurs: {
    total: number;
  };
  artefacts: {
    total: number;
  };
  noyaux: {
    total: number;
  };
  armes: {
    total: number;
  };
  promoCodes: {
    total: number;
    active: number;
    expired: number;
  };
  tierList: {
    totalArmes: number;
  };
}

export interface RecentActivity {
  id: string;
  type: 'build' | 'chasseur' | 'artefact' | 'noyau' | 'arme' | 'promo-code' | 'tier-list';
  action: 'created' | 'updated' | 'deleted';
  title: string;
  description?: string;
  timestamp: Date;
  user?: string;
}

export interface DashboardCategory {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  panels: DashboardPanel[];
}

export interface DashboardPanel {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color: string;
  iconBg: string;
  iconColor: string;
  buttonColor: string;
  statKey?: keyof DashboardStats;
}
