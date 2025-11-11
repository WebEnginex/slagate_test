import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Eye, EyeOff, Github } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import type { Contributeur } from '@/admin/types';

interface ContributeurCardProps {
  contributeur: Contributeur;
  onEdit: (contributeur: Contributeur) => void;
  onDelete: (contributeur: Contributeur) => void;
  onToggleActif: (contributeur: Contributeur) => void;
}

export const ContributeurCard: React.FC<ContributeurCardProps> = ({
  contributeur,
  onEdit,
  onDelete,
  onToggleActif,
}) => {
  const defaultImage = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  return (
    <Card className={`bg-sidebar border-sidebar-border hover:border-violet-500/50 transition-all duration-200 ${!contributeur.actif ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-violet-500/30">
              <img
                src={contributeur.image || defaultImage}
                alt={contributeur.nom}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultImage;
                }}
              />
            </div>
          </div>

          {/* Informations */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate">
                  {contributeur.nom}
                </h3>
                {contributeur.roles && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm">{contributeur.roles.icone}</span>
                    <p className="text-sm text-violet-400 font-medium">
                      {contributeur.roles.nom}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Badges */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/30">
                  Rang {contributeur.rang}
                </Badge>
                {!contributeur.actif && (
                  <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                    Inactif
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            {contributeur.description && (
              <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                {contributeur.description}
              </p>
            )}

            {/* Liens sociaux */}
            <div className="flex items-center gap-3 mb-3">
              {contributeur.github_url && (
                <a
                  href={contributeur.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  title="GitHub"
                >
                  <Github size={18} />
                </a>
              )}
              {contributeur.discord_username && (
                <span
                  className="text-gray-400 hover:text-white transition-colors cursor-help flex items-center gap-1"
                  title={`Discord: ${contributeur.discord_username}`}
                >
                  <FaDiscord size={18} />
                  <span className="text-xs">{contributeur.discord_username}</span>
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onToggleActif(contributeur)}
                variant="outline"
                size="sm"
                className={`${
                  contributeur.actif
                    ? 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                    : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                }`}
              >
                {contributeur.actif ? (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Actif
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Inactif
                  </>
                )}
              </Button>

              <Button
                onClick={() => onEdit(contributeur)}
                variant="outline"
                size="sm"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              >
                <Pencil className="h-4 w-4 mr-1" />
                Modifier
              </Button>

              <Button
                onClick={() => onDelete(contributeur)}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

