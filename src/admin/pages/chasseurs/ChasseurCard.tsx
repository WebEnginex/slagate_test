import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import type { Chasseur } from '@/admin/types';

interface ChasseurCardProps {
  chasseur: Chasseur;
  onEdit: (chasseur: Chasseur) => void;
  onDelete: (chasseur: Chasseur) => void;
}

// Mapping des éléments vers leurs icônes
const ELEMENT_ICONS: Record<string, string> = {
  'Feu': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Feu_element.webp',
  'Eau': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Eau_element.webp',
  'Vent': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Vent_element.webp',
  'Lumière': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Lumiere_element.webp',
  'Ténèbres': 'https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Tenebre_element.webp',
};

// Couleurs des badges selon la rareté
const RARETE_COLORS: Record<string, string> = {
  'SR': 'bg-purple-500/20 text-purple-300 border-purple-500/50',
  'SSR': 'bg-amber-500/20 text-amber-300 border-amber-500/50',
};

export const ChasseurCard: React.FC<ChasseurCardProps> = ({ chasseur, onEdit, onDelete }) => {
  const elementIcon = chasseur.element_chasseur ? ELEMENT_ICONS[chasseur.element_chasseur] : null;
  const rareteColor = chasseur.rarete ? RARETE_COLORS[chasseur.rarete] : '';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Image du chasseur avec icône d'élément */}
          <div className="relative flex-shrink-0">
            {chasseur.image ? (
              <img 
                src={chasseur.image} 
                alt={chasseur.nom}
                className="w-16 h-16 rounded-md object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=No+Image';
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                Pas d'image
              </div>
            )}
            
            {/* Icône d'élément en overlay sur l'image */}
            {elementIcon && chasseur.element_chasseur && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                <img 
                  src={elementIcon} 
                  alt={chasseur.element_chasseur}
                  className="w-3.5 h-3.5 object-contain"
                  title={chasseur.element_chasseur}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Informations du chasseur */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-base truncate leading-tight" title={chasseur.nom}>
                {chasseur.nom}
              </h3>
              
              {/* Badge de rareté à droite */}
              {chasseur.rarete && (
                <Badge 
                  variant="outline" 
                  className={`text-[10px] font-bold flex-shrink-0 h-5 px-1.5 ${rareteColor}`}
                >
                  {chasseur.rarete}
                </Badge>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-1.5 mt-auto pt-1">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(chasseur)}
                className="flex items-center gap-1 h-7 text-xs px-2"
              >
                <Pencil className="w-3 h-3" />
                Modifier
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete(chasseur)}
                className="flex items-center gap-1 h-7 text-xs px-2"
              >
                <Trash2 className="w-3 h-3" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
