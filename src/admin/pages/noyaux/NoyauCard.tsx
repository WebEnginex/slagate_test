import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import type { Noyau } from '@/admin/types';

interface NoyauCardProps {
  noyau: Noyau;
  onEdit: (noyau: Noyau) => void;
  onDelete: (noyau: Noyau) => void;
}

// Couleurs des badges selon le slot
const SLOT_COLORS: Record<number, string> = {
  1: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
  2: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
  3: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
};

export const NoyauCard: React.FC<NoyauCardProps> = ({ noyau, onEdit, onDelete }) => {
  const slotColor = noyau.slot ? SLOT_COLORS[noyau.slot] : '';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Image du noyau */}
          <div className="relative flex-shrink-0">
            {noyau.image ? (
              <img
                src={noyau.image}
                alt={noyau.nom}
                className="w-16 h-16 rounded-md object-cover"
                onError={(e) => {
                  // En cas d'erreur de chargement, afficher un placeholder local
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-16 h-16 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs border border-border">
                        <span class="text-center px-1">Image<br/>introuvable</span>
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs border border-border">
                Pas d'image
              </div>
            )}
          </div>

          {/* Informations du noyau */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-base truncate leading-tight" title={noyau.nom}>
                {noyau.nom}
              </h3>
              
              {/* Badge de slot à droite */}
              {noyau.slot && (
                <Badge 
                  variant="outline" 
                  className={`text-[10px] font-bold flex-shrink-0 h-5 px-1.5 ${slotColor}`}
                >
                  Slot {noyau.slot}
                </Badge>
              )}
            </div>

            {/* Description */}
            {noyau.description && (
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2" title={noyau.description}>
                {noyau.description}
              </p>
            )}

            {/* Boutons d'action */}
            <div className="flex gap-1.5 mt-auto">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(noyau)}
                className="flex items-center gap-1 h-7 text-xs px-2"
              >
                <Pencil className="w-3 h-3" />
                Modifier
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete(noyau)}
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
