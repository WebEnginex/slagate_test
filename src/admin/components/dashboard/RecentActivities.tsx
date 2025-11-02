import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings, 
  Users, 
  Package, 
  Zap, 
  Gift, 
  Trophy,
  Clock,
  Swords
} from 'lucide-react';
import type { RecentActivity } from '@/admin/types/dashboard';
import { RecentActivitySkeleton } from './DashboardSkeleton';
import { ActivityTracker } from '@/admin/services/activity-tracker';

interface RecentActivitiesProps {
  activities?: RecentActivity[];
  isLoading?: boolean;
}

/**
 * Icône selon le type d'activité
 */
function getActivityIcon(type: RecentActivity['type']) {
  switch (type) {
    case 'build':
      return Settings;
    case 'chasseur':
      return Users;
    case 'artefact':
      return Package;
    case 'noyau':
      return Zap;
    case 'arme':
      return Swords;
    case 'promo-code':
      return Gift;
    case 'tier-list':
      return Trophy;
    default:
      return Clock;
  }
}

/**
 * Couleur selon le type d'action
 */
function getActionColor(action: RecentActivity['action']) {
  switch (action) {
    case 'created':
      return 'text-green-400 bg-green-500/10';
    case 'updated':
      return 'text-blue-400 bg-blue-500/10';
    case 'deleted':
      return 'text-red-400 bg-red-500/10';
    default:
      return 'text-gray-400 bg-gray-500/10';
  }
}

/**
 * Label selon le type d'action
 */
function getActionLabel(action: RecentActivity['action']) {
  switch (action) {
    case 'created':
      return 'Créé';
    case 'updated':
      return 'Modifié';
    case 'deleted':
      return 'Supprimé';
    default:
      return 'Action';
  }
}

/**
 * Formatte le temps relatif
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'À l\'instant';
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;
  if (diffInDays < 7) return `Il y a ${diffInDays}j`;
  
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short' 
  });
}

/**
 * Composant pour afficher les activités récentes du dashboard
 * Affiche une timeline des dernières modifications
 */
export function RecentActivities({ activities = [], isLoading = false }: RecentActivitiesProps) {
  if (isLoading) {
    return <RecentActivitySkeleton />;
  }

  // Activités de démonstration si aucune activité n'est fournie
  const demoActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'build',
      action: 'updated',
      title: 'Build Sung Jinwoo - Général',
      description: 'Mise à jour des statistiques et artefacts',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // Il y a 15 min
    },
    {
      id: '2',
      type: 'promo-code',
      action: 'created',
      title: 'Code WELCOME2024',
      description: 'Nouveau code promo ajouté',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // Il y a 2h
    },
    {
      id: '3',
      type: 'chasseur',
      action: 'updated',
      title: 'Cha Hae-In',
      description: 'Informations mises à jour',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // Il y a 5h
    },
  ];

  const displayActivities = activities.length > 0 ? activities : demoActivities;

  return (
    <Card className="bg-sidebar border-sidebar-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-solo-purple" aria-hidden="true" />
          <span>Activités Récentes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
            <p>Aucune activité récente</p>
          </div>
        ) : (
          <div 
            className="space-y-3"
            role="feed"
            aria-label="Flux des activités récentes"
          >
            {displayActivities.slice(0, 5).map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              const actionColor = getActionColor(activity.action);
              const actionLabel = getActionLabel(activity.action);
              
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-colors"
                  role="article"
                  aria-label={`${actionLabel} ${activity.title}`}
                >
                  {/* Icône de type */}
                  <div 
                    className={`w-8 h-8 rounded-full ${actionColor} flex items-center justify-center flex-shrink-0`}
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Titre et action */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-white truncate">
                        {activity.title}
                      </p>
                      <span 
                        className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${actionColor}`}
                      >
                        {actionLabel}
                      </span>
                    </div>
                    
                    {/* Description */}
                    {activity.description && (
                      <p className="text-xs text-gray-400 mb-1 line-clamp-1">
                        {activity.description}
                      </p>
                    )}
                    
                    {/* Temps et utilisateur */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <time dateTime={activity.timestamp.toISOString()}>
                        {formatRelativeTime(activity.timestamp)}
                      </time>
                      {activity.user && (
                        <>
                          <span>•</span>
                          <span>{activity.user}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {displayActivities.length > 5 && (
          <button
            className="w-full mt-4 text-sm text-solo-purple hover:text-purple-400 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-solo-purple focus:ring-offset-2 focus:ring-offset-sidebar rounded py-2"
            aria-label="Voir toutes les activités"
          >
            Voir toutes les activités
          </button>
        )}
      </CardContent>
    </Card>
  );
}
