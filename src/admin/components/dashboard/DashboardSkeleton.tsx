import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Skeleton pour une carte de statistique
 */
export function StatsCardSkeleton() {
  return (
    <Card className="bg-sidebar border-sidebar-border overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            {/* Icône skeleton */}
            <div className="w-12 h-12 bg-gray-700/50 rounded-xl animate-pulse" />
            
            {/* Titre skeleton */}
            <div className="h-4 w-24 bg-gray-700/50 rounded animate-pulse" />
            
            {/* Nombre skeleton */}
            <div className="h-8 w-16 bg-gray-700/50 rounded animate-pulse" />
          </div>
          
          {/* Badge skeleton */}
          <div className="h-6 w-20 bg-gray-700/50 rounded-full animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton pour la grille de statistiques
 */
export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <StatsCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Skeleton pour une carte admin
 */
export function AdminCardSkeleton() {
  return (
    <Card className="bg-sidebar/50 border-sidebar-border overflow-hidden">
      <CardContent className="p-6 space-y-4">
        {/* Header avec icône */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700/50 rounded-lg animate-pulse" />
          <div className="h-5 w-32 bg-gray-700/50 rounded animate-pulse" />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-700/50 rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-gray-700/50 rounded animate-pulse" />
        </div>
        
        {/* Bouton */}
        <div className="h-10 w-full bg-gray-700/50 rounded-lg animate-pulse" />
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton pour l'activité récente
 */
export function RecentActivitySkeleton() {
  return (
    <Card className="bg-sidebar border-sidebar-border">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Titre */}
          <div className="h-6 w-48 bg-gray-700/50 rounded animate-pulse" />
          
          {/* Items d'activité */}
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30">
                {/* Icône */}
                <div className="w-8 h-8 bg-gray-700/50 rounded-full animate-pulse flex-shrink-0" />
                
                <div className="flex-1 space-y-2">
                  {/* Titre de l'activité */}
                  <div className="h-4 w-3/4 bg-gray-700/50 rounded animate-pulse" />
                  
                  {/* Temps */}
                  <div className="h-3 w-24 bg-gray-700/50 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton pour le header du dashboard
 */
export function DashboardHeaderSkeleton() {
  return (
    <div className="relative overflow-hidden bg-sidebar/80 rounded-2xl border border-sidebar-border">
      <div className="p-8 md:p-10">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] space-y-4">
            {/* Badge */}
            <div className="h-7 w-32 bg-gray-700/50 rounded-full animate-pulse" />
            
            {/* Titre */}
            <div className="h-10 w-80 bg-gray-700/50 rounded animate-pulse" />
            
            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full max-w-2xl bg-gray-700/50 rounded animate-pulse" />
              <div className="h-4 w-3/4 max-w-xl bg-gray-700/50 rounded animate-pulse" />
            </div>
          </div>
          
          {/* Avatar utilisateur */}
          <div className="flex items-center gap-3 bg-gray-800/50 px-4 py-3 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gray-700/50 animate-pulse" />
            <div className="w-24 h-4 bg-gray-700/50 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton complet pour le dashboard
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeaderSkeleton />
      
      {/* Statistiques */}
      <StatsGridSkeleton />
      
      {/* Activités récentes */}
      <RecentActivitySkeleton />
      
      {/* Catégories de cartes */}
      <div className="space-y-6">
        {[...Array(2)].map((_, categoryIndex) => (
          <div key={categoryIndex} className="space-y-4">
            {/* En-tête de catégorie */}
            <div className="h-16 w-64 bg-gray-700/50 rounded-lg animate-pulse" />
            
            {/* Grille de cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, cardIndex) => (
                <AdminCardSkeleton key={cardIndex} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
