import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Plus, Search, RefreshCw, AlertCircle, Loader2, Zap } from 'lucide-react';
import { NoyauxService } from '@/admin/services/noyaux-service';
import { NoyauCard } from './NoyauCard';
import { NoyauEditor } from './NoyauEditor';
import { toast } from '@/hooks/use-toast';
import type { Noyau } from '@/admin/types';

export const AdminNoyauxPage: React.FC = () => {
  // États
  const [noyaux, setNoyaux] = useState<Noyau[]>([]);
  const [filteredNoyaux, setFilteredNoyaux] = useState<Noyau[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSlot, setFilterSlot] = useState<string>('tous');

  // Éditeur
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedNoyau, setSelectedNoyau] = useState<Noyau | null>(null);

  // Suppression
  const [noyauToDelete, setNoyauToDelete] = useState<Noyau | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Charger les noyaux
  const loadNoyaux = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await NoyauxService.getAllNoyaux();
      setNoyaux(data);
      setFilteredNoyaux(data);
    } catch (err) {
      console.error('Erreur lors du chargement des noyaux:', err);
      const errorMsg = err instanceof Error ? err.message : 'Erreur inattendue lors du chargement';
      setError(errorMsg);
      toast({
        title: '❌ Erreur de chargement',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Charger au montage
  useEffect(() => {
    loadNoyaux();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...noyaux];

    // Filtre par recherche (nom ou description)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((n) =>
        n.nom.toLowerCase().includes(search) ||
        n.description?.toLowerCase().includes(search)
      );
    }

    // Filtre par slot
    if (filterSlot !== 'tous') {
      const slot = parseInt(filterSlot);
      filtered = filtered.filter((n) => n.slot === slot);
    }

    // Tri par slot puis par nom pour un affichage ordonné
    filtered.sort((a, b) => {
      // D'abord trier par slot
      if (a.slot !== b.slot) {
        return a.slot - b.slot;
      }
      // Ensuite trier par nom alphabétique
      return a.nom.localeCompare(b.nom);
    });

    setFilteredNoyaux(filtered);
  }, [noyaux, searchTerm, filterSlot]);

  // Ouvrir l'éditeur pour création
  const handleCreate = () => {
    setSelectedNoyau(null);
    setIsEditorOpen(true);
  };

  // Ouvrir l'éditeur pour modification
  const handleEdit = (noyau: Noyau) => {
    setSelectedNoyau(noyau);
    setIsEditorOpen(true);
  };

  // Fermer l'éditeur
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedNoyau(null);
  };

  // Après sauvegarde dans l'éditeur
  const handleSaveEditor = () => {
    loadNoyaux();
  };

  // Ouvrir la confirmation de suppression
  const handleDeleteClick = (noyau: Noyau) => {
    setNoyauToDelete(noyau);
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!noyauToDelete) return;

    setIsDeleting(true);

    try {
      await NoyauxService.deleteNoyau(noyauToDelete.id);

      toast({
        title: '✅ Noyau supprimé',
        description: `${noyauToDelete.nom} a été supprimé avec succès`,
      });

      await loadNoyaux();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      const errorMsg = err instanceof Error ? err.message : 'Erreur inattendue lors de la suppression';
      toast({
        title: '❌ Erreur de suppression',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setNoyauToDelete(null);
    }
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setNoyauToDelete(null);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterSlot('tous');
  };

  // Compter les noyaux par slot
  const countBySlot = (slot: number) => noyaux.filter(n => n.slot === slot).length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestion des Noyaux</h1>
            <p className="text-muted-foreground">
              {noyaux.length} noyau{noyaux.length > 1 ? 'x' : ''} au total
              {filteredNoyaux.length !== noyaux.length &&
                ` • ${filteredNoyaux.length} affiché${filteredNoyaux.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadNoyaux} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau noyau
          </Button>
        </div>
      </div>

      {/* Erreur globale */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistiques par slot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Slot 1</p>
                <p className="text-2xl font-bold">{countBySlot(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Slot 2</p>
                <p className="text-2xl font-bold">{countBySlot(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Slot 3</p>
                <p className="text-2xl font-bold">{countBySlot(3)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recherche */}
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Filtre slot */}
            <div className="space-y-2">
              <Label htmlFor="slot">Slot</Label>
              <Select value={filterSlot} onValueChange={setFilterSlot}>
                <SelectTrigger id="slot">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les slots</SelectItem>
                  <SelectItem value="1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      Slot 1
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      Slot 2
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      Slot 3
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Réinitialiser */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="w-full"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des noyaux */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredNoyaux.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun noyau trouvé</p>
              <p className="text-sm mt-1">
                {noyaux.length === 0
                  ? 'Cliquez sur "Nouveau noyau" pour commencer'
                  : 'Essayez de modifier vos filtres'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredNoyaux.map((noyau) => (
            <NoyauCard
              key={noyau.id}
              noyau={noyau}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Éditeur */}
      <NoyauEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveEditor}
        noyau={selectedNoyau}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog
        open={!!noyauToDelete}
        onOpenChange={(open) => !open && handleCancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer <strong>{noyauToDelete?.nom}</strong> ?
              <br />
              <br />
              Cette action est irréversible. Le noyau et son image seront
              définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
