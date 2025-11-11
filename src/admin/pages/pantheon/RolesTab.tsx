import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Loader2, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RolesService } from '@/admin/services/roles-service';
import { RoleCard } from './RoleCard';
import { RoleEditor } from './RoleEditor';
import type { Role } from '@/admin/types';

export const RolesTab: React.FC = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // Charger les rôles au montage
  useEffect(() => {
    loadRoles();
  }, []);

  // Appliquer le filtre de recherche
  useEffect(() => {
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      setFilteredRoles(roles.filter((r) => r.nom.toLowerCase().includes(search)));
    } else {
      setFilteredRoles(roles);
    }
  }, [roles, searchTerm]);

  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const data = await RolesService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error('Erreur lors du chargement des rôles:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de charger les rôles.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateDialog = () => {
    setSelectedRole(null);
    setEditorMode('create');
    setIsEditorOpen(true);
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setEditorMode('edit');
    setIsEditorOpen(true);
  };

  const openDeleteDialog = (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!roleToDelete) return;

    try {
      await RolesService.deleteRole(roleToDelete.id);
      toast({
        title: 'Succès',
        description: 'Le rôle a été supprimé avec succès.',
      });
      loadRoles();
    } catch (error) {
      console.error('Erreur lors de la suppression du rôle:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de supprimer le rôle.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleToggleActif = async (role: Role) => {
    try {
      await RolesService.toggleActif(role.id, !role.actif);
      toast({
        title: 'Succès',
        description: `Le rôle a été ${!role.actif ? 'activé' : 'désactivé'} avec succès.`,
      });
      loadRoles();
    } catch (error) {
      console.error('Erreur lors du changement d\'état du rôle:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de modifier l\'état du rôle.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-sidebar border-sidebar-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <Palette className="h-6 w-6 text-violet-400" />
              </div>
              <div>
                <CardTitle className="text-white">Gestion des Rôles</CardTitle>
                <p className="text-sm text-gray-400 mt-1">
                  Gérez les rôles des contributeurs (noms, couleurs, icônes)
                </p>
              </div>
            </div>
            <Button
              onClick={openCreateDialog}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau rôle
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Barre de recherche */}
      <Card className="bg-sidebar border-sidebar-border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un rôle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-sidebar-accent border-sidebar-border text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des rôles */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      ) : filteredRoles.length === 0 ? (
        <Card className="bg-sidebar border-sidebar-border">
          <CardContent className="p-12 text-center">
            <Palette className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              {searchTerm ? 'Aucun rôle trouvé' : 'Aucun rôle'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? 'Essayez avec un autre terme de recherche.'
                : 'Commencez par créer votre premier rôle.'}
            </p>
            {!searchTerm && (
              <Button
                onClick={openCreateDialog}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer un rôle
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              onToggleActif={handleToggleActif}
            />
          ))}
        </div>
      )}

      {/* Statistiques */}
      {!isLoading && roles.length > 0 && (
        <Card className="bg-sidebar border-sidebar-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Total: {roles.length} rôle(s)</span>
              <span>Actifs: {roles.filter((r) => r.actif).length}</span>
              <span>Inactifs: {roles.filter((r) => !r.actif).length}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Éditeur de rôle */}
      <RoleEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSuccess={loadRoles}
        mode={editorMode}
        role={selectedRole}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-sidebar border-sidebar-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Êtes-vous sûr de vouloir supprimer le rôle "{roleToDelete?.nom}" ?
              <br />
              <br />
              <span className="text-yellow-400">
                ⚠️ Attention: Les contributeurs ayant ce rôle verront leur role_id mis à NULL.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-sidebar-border text-white hover:bg-sidebar-accent">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

