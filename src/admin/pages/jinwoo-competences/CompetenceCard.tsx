import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ImageIcon } from 'lucide-react';
import type { JinwooCompetence } from '@/admin/types';
import { ELEMENT_ICONS } from '@/admin/constants';

interface CompetenceCardProps {
  competence: JinwooCompetence;
  onEdit: (competence: JinwooCompetence) => void;
  onDelete: (competence: JinwooCompetence) => void;
}

export const CompetenceCard: React.FC<CompetenceCardProps> = ({
  competence,
  onEdit,
  onDelete,
}) => {
  // Formater la description pour gérer les sauts de ligne (<br> et \n)
  const formatDescription = (text: string) => {
    // Remplacer les <br />, <br/>, <br> par un marqueur temporaire
    const normalized = text
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');

    return normalized.split('\n').map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardContent className="p-2 sm:p-3 flex-1">
        {/* Image avec icônes d'éléments en overlay */}
        <div className="relative aspect-square w-full mb-2 bg-sidebar-accent rounded-md overflow-hidden flex items-center justify-center">
          {competence.image ? (
            <img
              src={competence.image}
              alt={competence.nom}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
          )}

          {/* Icônes d'éléments en overlay (en haut à gauche) */}
          {(competence.element || competence.element2) && (
            <div className="absolute top-1.5 left-1.5 flex gap-1">
              {competence.element && ELEMENT_ICONS[competence.element] && (
                <div className="bg-black/70 backdrop-blur-sm rounded-full p-1">
                  <img
                    src={ELEMENT_ICONS[competence.element]}
                    alt={competence.element}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </div>
              )}
              {competence.element2 && ELEMENT_ICONS[competence.element2] && (
                <div className="bg-black/70 backdrop-blur-sm rounded-full p-1">
                  <img
                    src={ELEMENT_ICONS[competence.element2]}
                    alt={competence.element2}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nom */}
        <h3 className="font-semibold text-sm sm:text-base mb-1.5 line-clamp-2">
          {competence.nom}
        </h3>

        {/* Description avec gestion des sauts de ligne - SANS line-clamp */}
        {competence.description && (
          <div className="text-xs text-muted-foreground leading-relaxed">
            {formatDescription(competence.description)}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-2 sm:p-3 pt-0 flex gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(competence)}
          className="flex-1 h-8 text-xs px-2"
        >
          <Edit className="w-3 h-3 sm:mr-1.5" />
          <span className="hidden sm:inline">Modifier</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(competence)}
          className="flex-1 h-8 text-xs px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-3 h-3 sm:mr-1.5" />
          <span className="hidden sm:inline">Supprimer</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

