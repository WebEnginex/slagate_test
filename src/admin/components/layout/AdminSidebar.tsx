import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Sword, 
  Users, 
  Gem, 
  Shield, 
  Settings,
  Database
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Builds',
    href: '/admin/builds',
    icon: Sword,
  },
  {
    name: 'Derniers chasseurs',
    href: '/admin/latest-chasseurs',
    icon: Users,
  },
  {
    name: 'Chasseurs',
    href: '/admin/hunters',
    icon: Users,
    disabled: true, // À activer plus tard
  },
  {
    name: 'Artefacts',
    href: '/admin/artifacts',
    icon: Gem,
    disabled: true, // À activer plus tard
  },
  {
    name: 'Noyaux',
    href: '/admin/cores',
    icon: Shield,
    disabled: true, // À activer plus tard
  },
  {
    name: 'Données',
    href: '/admin/data',
    icon: Database,
    disabled: true, // À activer plus tard
  },
  {
    name: 'Paramètres',
    href: '/admin/settings',
    icon: Settings,
    disabled: true, // À activer plus tard
  },
];

export function AdminSidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <span className="text-lg font-semibold text-sidebar-foreground">
          Admin Panel
        </span>
      </div>
      
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          
          if (item.disabled) {
            return (
              <div
                key={item.name}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
                  'text-sidebar-foreground/50 cursor-not-allowed'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
                <span className="ml-auto text-xs text-sidebar-foreground/30">
                  Bientôt
                </span>
              </div>
            );
          }
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}