import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Search, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ContributeursService } from '@/admin/services/contributeurs-service';
import { ContributeurCard } from './ContributeurCard';
import { ContributeurEditor } from './ContributeurEditor';
import type { Contributeur, CreateContributeurData, UpdateContributeurData } from '@/admin/types';

export const ContributeursTab: React.FC = () => {
  const { toast } = useToast();
  const [contributeurs, setContributeurs] = useState<Contributeur[]>([]);
  const [filteredContributeurs, setFilteredContributeurs] = useState<Contributeur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActif, setFilterActif] = useState<'tous' | 'actifs' | 'inactifs'>('tous');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [selectedContributeur, setSelectedContributeur] = useState<Contributeur | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contributeurToDelete, setContributeurToDelete] = useState<Contributeur | null>(null);

  // Charger les contributeurs au montage
  useEffect(() => {
    loadContributeurs();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...contributeurs];

    // Filtre par recherche (nom ou rôle)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.nom.toLowerCase().includes(search) ||
          c.role.toLowerCase().includes(search)
      );
    }

    // Filtre par état actif
    if (filterActif === 'actifs') {
      filtered = filtered.filter((c) => c.actif);
    } else if (filterActif === 'inactifs') {
      filtered = filtered.filter((c) => !c.actif);
    }

    setFilteredContributeurs(filtered);
  }, [contributeurs, searchTerm, filterActif]);

  const loadContributeurs = async () => {
    setIsLoading(true);
    try {
      const data = await ContributeursService.getAllContributeurs();
      setContributeurs(data);
    } catch (error) {
      console.error('Erreur lors du chargement des contributeurs:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de charger les contributeurs.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateDialog = () => {
    setSelectedContributeur(null);
    setEditorMode('create');
    setIsEditorOpen(true);
  };

  const openEditDialog = (contributeur: Contributeur) => {
    setSelectedContributeur(contributeur);
    setEditorMode('edit');
    setIsEditorOpen(true);
  };

  const openDeleteDialog = (contributeur: Contributeur) => {
    setContributeurToDelete(contributeur);
    setDeleteDialogOpen(true);
  };

  const handleSave = async (
    data: CreateContributeurData | UpdateContributeurData,
    imageFile?: File
  ) => {
    try {
      if (editorMode === 'create') {
        await ContributeursService.createContributeur(data as CreateContributeurData, imageFile);
        toast({
          title: 'Succès',
          description: 'Le contributeur a été créé avec succès.',
        });
      } else if (selectedContributeur) {
        await ContributeursService.updateContributeur(
          selectedContributeur.id,
          data as UpdateContributeurData,
          imageFile
        );
        toast({
          title: 'Succès',
          description: 'Le contributeur a été modifié avec succès.',
        });
      }
      await loadContributeurs();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error; // Re-throw pour que l'éditeur puisse afficher l'erreur
    }
  };

  const handleDelete = async () => {
    if (!contributeurToDelete) return;

    try {
      await ContributeursService.deleteContributeur(contributeurToDelete.id);
      toast({
        title: 'Succès',
        description: 'Le contributeur a été supprimé avec succès.',
      });
      await loadContributeurs();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de supprimer le contributeur.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setContributeurToDelete(null);
    }
  };

  const handleToggleActif = async (contributeur: Contributeur) => {
    try {
      await ContributeursService.toggleActif(contributeur.id);
      toast({
        title: 'Succès',
        description: `Le contributeur a été ${contributeur.actif ? 'désactivé' : 'activé'} avec succès.`,
      });
      await loadContributeurs();
    } catch (error) {
      console.error('Erreur lors du changement d\'état:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de modifier l\'état du contributeur.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="h-8 w-8 text-violet-400" />
            Gestion du Panthéon
          </h1>
          <p className="text-gray-400 mt-1">
            Gérez les contributeurs affichés sur la page Panthéon
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau contributeur
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-sidebar border-sidebar-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white">{contributeurs.length}</p>
              </div>
              <Users className="h-8 w-8 text-violet-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sidebar border-sidebar-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Actifs</p>
                <p className="text-2xl font-bold text-green-400">
                  {contributeurs.filter((c) => c.actif).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sidebar border-sidebar-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Inactifs</p>
                <p className="text-2xl font-bold text-red-400">
                  {contributeurs.filter((c) => !c.actif).length}
                </p>
              </div>
              <Users className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="bg-sidebar border-sidebar-border">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <Label className="text-xs font-medium mb-2 block text-muted-foreground">
                Rechercher
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Nom ou rôle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-sidebar-border text-white"
                />
              </div>
            </div>

            {/* Filtre Actif */}
            <div className="w-full md:w-48">
              <Label className="text-xs font-medium mb-2 block text-muted-foreground">
                État
              </Label>
              <Select value={filterActif} onValueChange={(value: any) => setFilterActif(value)}>
                <SelectTrigger className="bg-background border-sidebar-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-sidebar border-sidebar-border">
                  <SelectItem value="tous">Tous</SelectItem>
                  <SelectItem value="actifs">Actifs uniquement</SelectItem>
                  <SelectItem value="inactifs">Inactifs uniquement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des contributeurs */}
      <Card className="bg-sidebar border-sidebar-border">
        <CardHeader>
          <CardTitle className="text-white">
            Contributeurs ({filteredContributeurs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </div>
          ) : filteredContributeurs.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">
                {searchTerm || filterActif !== 'tous'
                  ? 'Aucun contributeur ne correspond aux filtres.'
                  : 'Aucun contributeur pour le moment.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContributeurs.map((contributeur) => (
                <ContributeurCard
                  key={contributeur.id}
                  contributeur={contributeur}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                  onToggleActif={handleToggleActif}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Éditeur de contributeur */}
      <ContributeurEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        contributeur={selectedContributeur}
        mode={editorMode}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-sidebar border-sidebar-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Êtes-vous sûr de vouloir supprimer le contributeur{' '}
              <span className="font-semibold text-white">{contributeurToDelete?.nom}</span> ?
              Cette action est irréversible.
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

