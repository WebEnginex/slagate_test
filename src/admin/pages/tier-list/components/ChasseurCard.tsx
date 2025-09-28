import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import LazyImage from '@/lib/lazy';

// Mapping des éléments vers les vraies images du storage Supabase
const getElementImageUrl = (element: string | null): string | null => {
  if (!element) return null;
  
  // Mapping exact des éléments de votre base de données (avec majuscules et accents)
  const elementMap: Record<string, string> = {
    "Feu": "Feu_element.webp",
    "Eau": "Eau_element.webp", 
    "Vent": "Vent_element.webp",
    "Lumière": "Lumiere_element.webp",
    "Ténèbres": "Tenebre_element.webp"
  };
  
  const filename = elementMap[element.trim()];
  return filename 
    ? `https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/${filename}`
    : null;
};

export interface ChasseurForTierList {
  id: number;
  nom: string;
  image: string | null;
  image_body: string | null;
  element_chasseur: string | null;
  rarete: string | null;
  last_modified: string | null;
}

interface ChasseurCardProps {
  chasseur: ChasseurForTierList;
  isDragging?: boolean;
  dragId?: string;
}

export const ChasseurCard: React.FC<ChasseurCardProps> = ({ 
  chasseur, 
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
    id: dragId || chasseur.id,
    disabled: isDragging, // Désactiver si c'est l'overlay
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Couleur selon la rareté
  const getRarityColor = (rarete: string | null) => {
    if (!rarete) return "border-gray-400";
    
    const rarityMap: { [key: string]: string } = {
      'SSR': 'border-yellow-400',
      'SR': 'border-purple-400', 
      'R': 'border-blue-400',
      'A': 'border-green-400',
      'B': 'border-gray-400',
    };
    
    return rarityMap[rarete.toUpperCase()] || "border-gray-400";
  };



  // Image à utiliser (priorité à image_body puis image)
  const imageUrl = chasseur.image_body || chasseur.image;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative group cursor-grab active:cursor-grabbing select-none
        transition-all duration-200 hover:scale-105
        ${isSortableDragging || isDragging ? 'opacity-50 z-50' : 'opacity-100'}
        ${isDragging ? 'rotate-3 shadow-2xl' : 'hover:shadow-lg'}
      `}
      title={`${chasseur.nom} (${chasseur.rarete || 'N/A'})${chasseur.element_chasseur ? ` - ${chasseur.element_chasseur}` : ''}`}
    >
      {/* Carte du chasseur */}
      <div className={`
        w-16 h-20 sm:w-20 sm:h-24 bg-sidebar-accent rounded-lg border-2 
        ${getRarityColor(chasseur.rarete)} 
        overflow-hidden relative
        shadow-md hover:shadow-lg transition-shadow
      `}>
        {/* Image du chasseur */}
        <div className="w-full h-full relative">
          {imageUrl ? (
            <LazyImage
              src={imageUrl}
              alt={chasseur.nom}
              fallbackClassName="w-full h-full object-cover"
              showSpinner={true}
            />
          ) : (
            <div className="w-full h-full bg-gray-600 flex items-center justify-center">
              <span className="text-xs text-gray-300 text-center px-1">
                {chasseur.nom.substring(0, 8)}
              </span>
            </div>
          )}
        </div>

        {/* Badge d'élément en haut à droite - Image de l'élément */}
        {chasseur.element_chasseur && getElementImageUrl(chasseur.element_chasseur) && (
          <div className="absolute top-0.5 right-0.5 w-4 h-4 z-10">
            <img 
              src={getElementImageUrl(chasseur.element_chasseur)!} 
              alt="Élément" 
              className="w-full h-full object-contain filter drop-shadow-sm"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}
            />
          </div>
        )}

        {/* Badge de rareté en bas */}
        {chasseur.rarete && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs text-center py-0.5">
            {chasseur.rarete}
          </div>
        )}

        {/* Overlay de survol avec le nom */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity text-center px-1 leading-tight">
            {chasseur.nom}
          </span>
        </div>
      </div>
    </div>
  );
};