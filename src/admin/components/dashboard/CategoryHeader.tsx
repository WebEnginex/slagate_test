import React from 'react';

interface CategoryHeaderProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

/**
 * En-tête de catégorie compact et accessible
 * Optimisé pour mobile avec design épuré
 */
export function CategoryHeader({ name, description, icon, gradient }: CategoryHeaderProps) {
  return (
    <div className="relative mb-4">
      {/* Ligne de séparation subtile */}
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-sidebar-border"></div>
      </div>
      
      {/* Badge de catégorie */}
      <div className="relative flex">
        <div 
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${gradient} shadow-md`}
          role="heading"
          aria-level={2}
        >
          <div className="text-white flex-shrink-0 w-4 h-4 flex items-center justify-center" aria-hidden="true">
            {icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
              {name}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Version alternative encore plus compacte pour mobile
 */
export function CompactCategoryHeader({ name, icon, gradient }: Omit<CategoryHeaderProps, 'description'>) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div 
        className={`p-2 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center`}
        aria-hidden="true"
      >
        <div className="text-white">
          {icon}
        </div>
      </div>
      <h2 className="text-lg font-bold text-white">
        {name}
      </h2>
      <div className="flex-1 h-px bg-sidebar-border ml-2"></div>
    </div>
  );
}
