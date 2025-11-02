import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface AdminCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  buttonColor: string;
  hoverColor?: string;
  stat?: number | string;
  statLabel?: string;
}

/**
 * Carte admin modernisée avec design épuré
 * Icônes plus grandes, meilleure accessibilité et navigation au clavier
 */
export function AdminCard({
  title,
  description,
  icon,
  to,
  iconBg,
  iconColor,
  borderColor,
  buttonColor,
  hoverColor = 'group-hover:text-solo-purple',
  stat,
  statLabel
}: AdminCardProps) {
  return (
    <Card 
      className={`${borderColor} border-2 bg-sidebar transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-sidebar focus-within:ring-white/50 group`}
    >
      <CardContent className="p-4 space-y-3 h-full flex flex-col">
        {/* Header avec icône et stat */}
        <div className="flex items-start justify-between gap-2">
          {/* Icône */}
          <div className={`p-2.5 rounded-xl ${iconBg} transition-transform group-hover:scale-110`}>
            <div className={`${iconColor} w-6 h-6 flex items-center justify-center`} aria-hidden="true">
              {icon}
            </div>
          </div>
          
          {/* Statistique optionnelle */}
          {stat !== undefined && (
            <div className="text-right">
              <p className="text-xl font-bold text-white" aria-label={statLabel}>
                {stat}
              </p>
              {statLabel && (
                <p className="text-xs text-gray-400">
                  {statLabel}
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Titre */}
        <div className="flex-1">
          <h3 className={`text-base font-semibold text-white mb-1.5 ${hoverColor} transition-colors`}>
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
        
        {/* Bouton d'accès */}
        <Button 
          asChild 
          className={`w-full text-xs font-medium ${buttonColor} border-0 shadow-md hover:shadow-lg transition-all group/button py-2`}
        >
          <Link 
            to={to}
            className="flex items-center justify-center gap-2"
          >
            <span>Gérer</span>
            <ArrowRight 
              className="h-3 w-3 transition-transform group-hover/button:translate-x-1" 
              aria-hidden="true" 
            />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Version compacte de la carte admin
 */
export function CompactAdminCard({
  title,
  icon,
  to,
  iconBg,
  iconColor,
  borderColor,
  stat
}: Omit<AdminCardProps, 'description' | 'buttonColor' | 'statLabel'>) {
  return (
    <Link 
      to={to}
      className={`block ${borderColor} border-2 bg-sidebar rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-offset-sidebar focus:ring-white/50 group`}
    >
      <div className="flex items-center gap-3">
        {/* Icône */}
        <div className={`p-2 rounded-lg ${iconBg} transition-transform group-hover:scale-110 flex-shrink-0`}>
          <div className={`${iconColor} w-5 h-5 flex items-center justify-center`} aria-hidden="true">
            {icon}
          </div>
        </div>
        
        {/* Titre et stat */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white group-hover:text-solo-purple transition-colors truncate">
            {title}
          </h3>
          {stat !== undefined && (
            <p className="text-xs text-gray-400">
              {stat} éléments
            </p>
          )}
        </div>
        
        {/* Flèche */}
        <ArrowRight 
          className="h-4 w-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" 
          aria-hidden="true" 
        />
      </div>
    </Link>
  );
}
