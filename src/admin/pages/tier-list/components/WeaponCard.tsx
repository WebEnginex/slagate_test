import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArmeForTierList } from "@/admin/services/tier-list-service";
import { LazyImage } from "@/lib/lazy/LazyImage";

interface WeaponCardProps {
  weapon: ArmeForTierList;
  isDragging?: boolean;
  dragId?: string;
}

export const WeaponCard: React.FC<WeaponCardProps> = ({ 
  weapon, 
  isDragging = false, 
  dragId 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: dragId || `weapon-${weapon.id}`,
    disabled: isDragging, // Désactiver si c'est l'overlay
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Fonction pour récupérer l'URL de l'image d'élément depuis Supabase Storage
  const getElementImageUrl = (element: string | null) => {
    if (!element) return null;
    
    const baseUrl = 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements';
    const elementMap: { [key: string]: string } = {
      'Feu': 'Feu_element.webp',
      'Eau': 'Eau_element.webp', 
      'Terre': 'Terre_element.webp',
      'Vent': 'Vent_element.webp',
      'Lumière': 'Lumiere_element.webp',
      'Ténèbres': 'Tenebre_element.webp'
    };
    
    const fileName = elementMap[element];
    return fileName ? `${baseUrl}/${fileName}` : null;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative bg-sidebar-accent rounded-lg shadow-md p-2 text-center 
        cursor-grab transition-all duration-200
        border border-sidebar-border hover:border-solo-purple
        hover:scale-[1.02]
        ${isSortableDragging ? 'opacity-50' : ''}
        ${isDragging ? 'shadow-lg rotate-3' : ''}
      `.trim()}
      {...attributes}
      {...listeners}
    >
      {/* Élément icon en haut à gauche - Utiliser arme_element (URL directe) */}
      {weapon.arme_element && (
        <div className="absolute top-1 left-1 z-10 w-4 h-4 sm:w-5 sm:h-5">
          <img
            src={weapon.arme_element}
            alt={`Élément ${weapon.element || 'Element'}`}
            className="w-full h-full object-contain filter drop-shadow-sm"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}
          />
        </div>
      )}

      {/* Image de l'arme - Style page publique */}
      <div className="relative mx-auto w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-1 sm:mb-2">
        {weapon.image ? (
          <img
            src={weapon.image}
            alt={weapon.nom}
            className="w-full h-full object-contain"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sidebar-foreground/60 text-xs bg-sidebar rounded">
            Pas d'image
          </div>
        )}
      </div>

      {/* Nom de l'arme - Style page publique */}
      <p className="font-medium text-xs leading-tight truncate px-1 text-white">
        {weapon.nom}
      </p>
    </div>
  );
};