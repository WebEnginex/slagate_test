import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import type { Ombre } from '@/admin/types';

interface OmbreCardProps {
  ombre: Ombre;
  onEdit: (ombre: Ombre) => void;
  onDelete: (ombre: Ombre) => void;
}

export const OmbreCard: React.FC<OmbreCardProps> = ({ ombre, onEdit, onDelete }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Image de l'ombre */}
          <div className="relative flex-shrink-0">
            {ombre.image ? (
              <img 
                src={ombre.image} 
                alt={ombre.nom}
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
          </div>

          {/* Informations de l'ombre */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-base truncate leading-tight" title={ombre.nom}>
                {ombre.nom}
              </h3>
            </div>

            {/* Description (si présente) */}
            {ombre.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2" title={ombre.description}>
                {ombre.description}
              </p>
            )}

            {/* Boutons d'action */}
            <div className="flex gap-1.5 mt-auto pt-1">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(ombre)}
                className="flex items-center gap-1 h-7 text-xs px-2"
              >
                <Pencil className="w-3 h-3" />
                Modifier
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete(ombre)}
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

