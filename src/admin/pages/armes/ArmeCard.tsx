import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import type { JinwooArme } from '@/admin/types';

interface ArmeCardProps {
  arme: JinwooArme;
  onEdit: (arme: JinwooArme) => void;
  onDelete: (arme: JinwooArme) => void;
}

export const ArmeCard: React.FC<ArmeCardProps> = ({ arme, onEdit, onDelete }) => {
  const element = arme.element;
  const elementIconUrl = arme.arme_element; // URL directe de l'icône stockée

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Image de l'arme avec icône d'élément */}
          <div className="relative flex-shrink-0">
            {arme.image ? (
              <img 
                src={arme.image} 
                alt={arme.nom}
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
            {elementIconUrl && element && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                <img 
                  src={elementIconUrl} 
                  alt={element}
                  className="w-3.5 h-3.5 object-contain"
                  title={element}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Informations de l'arme */}
          <div className="flex-1 min-w-0 flex flex-col">
            <h3 className="font-semibold text-base truncate leading-tight mb-2" title={arme.nom}>
              {arme.nom}
            </h3>

            {/* Boutons d'action */}
            <div className="flex gap-1.5 mt-auto">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(arme)}
                className="flex items-center gap-1 h-7 text-xs px-2"
              >
                <Pencil className="w-3 h-3" />
                Modifier
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete(arme)}
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
