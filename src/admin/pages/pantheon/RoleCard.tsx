import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import type { Role } from '@/admin/types';

interface RoleCardProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onToggleActif: (role: Role) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  onEdit,
  onDelete,
  onToggleActif,
}) => {
  return (
    <Card className="bg-sidebar border-sidebar-border hover:border-violet-500/50 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Informations du rôle */}
          <div className="flex-1 space-y-3">
            {/* Badge avec gradient */}
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${role.couleur_gradient}`}
              >
                {role.icone} {role.nom}
              </div>
              {!role.actif && (
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                  Inactif
                </span>
              )}
            </div>

            {/* Aperçu de la bordure */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full border-4 ${role.couleur_border} bg-gray-700 flex items-center justify-center text-xl`}>
                {role.icone}
              </div>
              <div className="text-xs text-gray-400">
                <div>Ordre: {role.ordre}</div>
                <div className="font-mono text-[10px] mt-1">
                  Gradient: {role.couleur_gradient}
                </div>
                <div className="font-mono text-[10px]">
                  Border: {role.couleur_border}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(role)}
              className="h-8 px-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onToggleActif(role)}
              className={`h-8 px-2 ${
                role.actif
                  ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                  : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
              }`}
            >
              {role.actif ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(role)}
              className="h-8 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

