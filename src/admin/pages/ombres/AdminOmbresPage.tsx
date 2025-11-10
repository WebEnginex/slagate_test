import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Search, RefreshCw, AlertCircle, Loader2, Ghost } from 'lucide-react';
import { OmbresService } from '@/admin/services/ombres-service';
import { OmbreCard } from './OmbreCard';
import { OmbreEditor } from './OmbreEditor';
import { toast } from '@/hooks/use-toast';
import type { Ombre } from '@/admin/types';

export const AdminOmbresPage: React.FC = () => {
  // États
  const [ombres, setOmbres] = useState<Ombre[]>([]);
  const [filteredOmbres, setFilteredOmbres] = useState<Ombre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');

  // Éditeur
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedOmbre, setSelectedOmbre] = useState<Ombre | null>(null);

  // Suppression
  const [ombreToDelete, setOmbreToDelete] = useState<Ombre | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Charger les ombres
  const loadOmbres = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await OmbresService.getAllOmbres();
      setOmbres(data);
      setFilteredOmbres(data);
    } catch (err) {
      console.error('Erreur lors du chargement des ombres:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Une erreur inattendue est survenue lors du chargement des ombres.';
      setError(errorMessage);
      
      // Toast d'erreur
      toast({
        title: '❌ Erreur de chargement',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Charger au montage
  useEffect(() => {
    loadOmbres();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...ombres];

    // Filtre par recherche (nom)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((o) =>
        o.nom.toLowerCase().includes(search)
      );
    }

    setFilteredOmbres(filtered);
  }, [ombres, searchTerm]);

  // Ouvrir l'éditeur pour création
  const handleCreate = () => {
    setSelectedOmbre(null);
    setIsEditorOpen(true);
  };

  // Ouvrir l'éditeur pour modification
  const handleEdit = (ombre: Ombre) => {
    setSelectedOmbre(ombre);
    setIsEditorOpen(true);
  };

  // Fermer l'éditeur
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedOmbre(null);
  };

  // Après sauvegarde dans l'éditeur
  const handleSaveEditor = () => {
    loadOmbres();
  };

  // Ouvrir la confirmation de suppression
  const handleDeleteClick = (ombre: Ombre) => {
    setOmbreToDelete(ombre);
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!ombreToDelete) return;

    setIsDeleting(true);

    try {
      await OmbresService.deleteOmbre(ombreToDelete.id);

      toast({
        title: '✅ Ombre supprimée',
        description: `${ombreToDelete.nom} a été supprimée avec succès.`,
      });

      await loadOmbres();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Une erreur inattendue est survenue lors de la suppression.';
      
      toast({
        title: '❌ Erreur de suppression',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setOmbreToDelete(null);
    }
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setOmbreToDelete(null);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
  };

  return (
    <div className="space-y-4">
      {/* En-tête compact */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Ombres</h1>
          <p className="text-sm text-muted-foreground">
            {ombres.length} ombre{ombres.length > 1 ? 's' : ''}
            {filteredOmbres.length !== ombres.length &&
              ` • ${filteredOmbres.length} affichée${filteredOmbres.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadOmbres} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </Button>
          <Button size="sm" onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Nouvelle</span>
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

      {/* Filtres */}
      <Card className="bg-sidebar border-sidebar-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            {/* Recherche */}
            <div className="flex-1">
              <Label className="text-xs font-medium mb-2 block">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Nom de l'ombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-10 text-sm"
                />
              </div>
            </div>

            {/* Réinitialiser */}
            <div className="w-full sm:w-auto">
              <Label className="text-xs font-medium mb-2 block sm:invisible">Action</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="w-full sm:w-auto h-10"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des ombres */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredOmbres.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Ghost className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucune ombre trouvée</p>
              <p className="text-sm mt-1">
                {ombres.length === 0
                  ? 'Cliquez sur "Nouvelle ombre" pour commencer'
                  : 'Essayez de modifier vos filtres'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredOmbres.map((ombre) => (
            <OmbreCard
              key={ombre.id}
              ombre={ombre}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Éditeur */}
      <OmbreEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveEditor}
        ombre={selectedOmbre}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog
        open={!!ombreToDelete}
        onOpenChange={(open) => !open && handleCancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer <strong>{ombreToDelete?.nom}</strong> ?
              <br />
              <br />
              Cette action est irréversible. L'ombre et son image seront
              définitivement supprimées.
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

