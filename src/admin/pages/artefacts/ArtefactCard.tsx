import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import type { Artefact } from '@/admin/types';

interface ArtefactCardProps {
  artefact: Artefact;
  onEdit: (artefact: Artefact) => void;
  onDelete: (artefact: Artefact) => void;
  categorieIcon?: string;
}

// Couleurs des badges selon la catégorie
const CATEGORIE_COLORS: Record<string, string> = {
  'Casque': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
  'Armure': 'bg-green-500/20 text-green-300 border-green-500/50',
  'Gants': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
  'Bottes': 'bg-orange-500/20 text-orange-300 border-orange-500/50',
  'Collier': 'bg-purple-500/20 text-purple-300 border-purple-500/50',
  'Bracelet': 'bg-pink-500/20 text-pink-300 border-pink-500/50',
  'Bague': 'bg-red-500/20 text-red-300 border-red-500/50',
  'Boucles': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
};

export const ArtefactCard: React.FC<ArtefactCardProps> = ({ artefact, onEdit, onDelete, categorieIcon }) => {
  const categorieColor = artefact.categorie ? CATEGORIE_COLORS[artefact.categorie] : '';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Image de l'artefact */}
          <div className="relative flex-shrink-0">
            {artefact.image ? (
              <img 
                src={artefact.image} 
                alt={artefact.nom}
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

          {/* Informations de l'artefact */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-base truncate leading-tight" title={artefact.nom}>
                {artefact.nom}
              </h3>
              
              {/* Badge de catégorie à droite */}
              {artefact.categorie && (
                <Badge 
                  variant="outline" 
                  className={`text-[10px] font-bold flex-shrink-0 h-5 px-1.5 ${categorieColor}`}
                >
                  {artefact.categorie}
                </Badge>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-1.5 mt-auto pt-1">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(artefact)}
                className="flex items-center gap-1 h-7 text-xs px-2"
              >
                <Pencil className="w-3 h-3" />
                Modifier
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete(artefact)}
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
