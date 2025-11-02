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

  return (
    <div className="space-y-4">
      {/* En-tête compact */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Noyaux</h1>
          <p className="text-sm text-muted-foreground">
            {filteredNoyaux.length !== noyaux.length &&
              `${filteredNoyaux.length} / `}{noyaux.length} noyau{noyaux.length > 1 ? 'x' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadNoyaux} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </Button>
          <Button size="sm" onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Nouveau noyau</span>
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

      {/* Filtres horizontaux */}
      <Card className="bg-sidebar border-sidebar-border">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Slots */}
            <div className="flex-1">
              <Label className="text-xs font-medium mb-2 block text-muted-foreground">
                Slot
              </Label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterSlot('tous')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    filterSlot === 'tous'
                      ? 'bg-solo-purple border-solo-purple text-white shadow-lg'
                      : 'bg-background border-border hover:bg-accent'
                  }`}
                >
                  <span>Tous</span>
                </button>
                <button
                  onClick={() => setFilterSlot('1')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    filterSlot === '1'
                      ? 'bg-solo-purple border-solo-purple text-white shadow-lg'
                      : 'bg-background border-border hover:bg-accent'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="hidden sm:inline">Slot 1</span>
                </button>
                <button
                  onClick={() => setFilterSlot('2')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    filterSlot === '2'
                      ? 'bg-solo-purple border-solo-purple text-white shadow-lg'
                      : 'bg-background border-border hover:bg-accent'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="hidden sm:inline">Slot 2</span>
                </button>
                <button
                  onClick={() => setFilterSlot('3')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    filterSlot === '3'
                      ? 'bg-solo-purple border-solo-purple text-white shadow-lg'
                      : 'bg-background border-border hover:bg-accent'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="hidden sm:inline">Slot 3</span>
                </button>
              </div>
            </div>

            {/* Recherche et réinitialisation */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Recherche */}
              <div className="w-full sm:w-48">
                <Label className="text-xs font-medium mb-2 block">Rechercher</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-10"
                  />
                </div>
              </div>

              {/* Réinitialiser */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-10 w-full sm:w-auto"
                >
                  Réinitialiser
                </Button>
              </div>
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
