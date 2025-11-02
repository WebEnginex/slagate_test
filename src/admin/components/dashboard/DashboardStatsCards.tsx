import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Settings, 
  Users, 
  Package, 
  Zap, 
  Gift, 
  Trophy,
  TrendingUp,
  Swords
} from 'lucide-react';
import type { DashboardStats } from '@/admin/types/dashboard';
import { StatsGridSkeleton } from './DashboardSkeleton';

interface DashboardStatsCardsProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

/**
 * Composant pour afficher les statistiques du dashboard
 * Affiche des cartes avec métriques clés et indicateurs visuels
 */
export function DashboardStatsCards({ stats, isLoading }: DashboardStatsCardsProps) {
  if (isLoading || !stats) {
    return <StatsGridSkeleton />;
  }

  const statsCards = [
    {
      title: 'Builds',
      value: stats.builds.total,
      icon: Settings,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-500/10',
      iconColor: 'text-violet-400',
      borderColor: 'border-violet-500/30',
      subtitle: `${Object.keys(stats.builds.byElement).length} éléments`,
      trend: null
    },
    {
      title: 'Chasseurs',
      value: stats.chasseurs.total,
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      subtitle: 'Personnages',
      trend: null
    },
    {
      title: 'Artefacts',
      value: stats.artefacts.total,
      icon: Package,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-400',
      borderColor: 'border-green-500/30',
      subtitle: 'Équipements',
      trend: null
    },
    {
      title: 'Noyaux',
      value: stats.noyaux.total,
      icon: Zap,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      subtitle: 'Disponibles',
      trend: null
    },
    {
      title: 'Armes',
      value: stats.armes.total,
      icon: Swords,
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-500/10',
      iconColor: 'text-red-400',
      borderColor: 'border-red-500/30',
      subtitle: 'De Jinwoo',
      trend: null
    },
    {
      title: 'Codes Promo',
      value: stats.promoCodes.active,
      icon: Gift,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-500/10',
      iconColor: 'text-pink-400',
      borderColor: 'border-pink-500/30',
      subtitle: `${stats.promoCodes.expired} expirés`,
      trend: stats.promoCodes.active > 0 ? 'up' : null
    },
    {
      title: 'Tier List',
      value: stats.tierList.totalArmes,
      icon: Trophy,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      subtitle: 'Armes classées',
      trend: null
    },
  ];

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      role="region"
      aria-label="Statistiques du dashboard"
    >
      {statsCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className={`${stat.bgColor} ${stat.borderColor} border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-sidebar focus-within:ring-white/50`}
            tabIndex={0}
            role="article"
            aria-label={`${stat.title}: ${stat.value}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  {/* Icône */}
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} aria-hidden="true" />
                  </div>
                  
                  {/* Titre */}
                  <h3 className="text-sm font-medium text-gray-300">
                    {stat.title}
                  </h3>
                  
                  {/* Valeur */}
                  <p className="text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  
                  {/* Sous-titre */}
                  {stat.subtitle && (
                    <p className="text-xs text-gray-400">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                
                {/* Badge de tendance */}
                {stat.trend && (
                  <div 
                    className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full"
                    aria-label="Tendance positive"
                  >
                    <TrendingUp className="h-3 w-3 text-green-400" aria-hidden="true" />
                    <span className="text-xs font-medium text-green-400">Actif</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
