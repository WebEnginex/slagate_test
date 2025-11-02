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
import { Plus, Search, RefreshCw, AlertCircle, Loader2, Swords } from 'lucide-react';
import { ArmesService } from '@/admin/services/armes-service';
import { ArmeCard } from './ArmeCard';
import { ArmeEditor } from './ArmeEditor';
import { toast } from '@/hooks/use-toast';
import type { JinwooArme } from '@/admin/types';

export default function AdminArmesPage() {
  return <AdminArmesPageComponent />;
}

const AdminArmesPageComponent: React.FC = () => {
  // États
  const [armes, setArmes] = useState<JinwooArme[]>([]);
  const [filteredArmes, setFilteredArmes] = useState<JinwooArme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterElement, setFilterElement] = useState<string>('tous');

  // Éditeur
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedArme, setSelectedArme] = useState<JinwooArme | null>(null);

  // Suppression
  const [armeToDelete, setArmeToDelete] = useState<JinwooArme | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Charger les armes
  const loadArmes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await ArmesService.getAllArmes();
      setArmes(data);
      setFilteredArmes(data);
    } catch (err) {
      console.error('Erreur lors du chargement des armes:', err);
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
    loadArmes();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...armes];

    // Filtre par recherche (nom)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((a) =>
        a.nom.toLowerCase().includes(search)
      );
    }

    // Filtre par élément
    if (filterElement !== 'tous') {
      filtered = filtered.filter((a) => {
        const element = a.element || a.arme_element;
        return element === filterElement;
      });
    }

    // Tri par ID décroissant (plus récent en premier)
    filtered.sort((a, b) => b.id - a.id);

    setFilteredArmes(filtered);
  }, [armes, searchTerm, filterElement]);

  // Ouvrir l'éditeur pour création
  const handleCreate = () => {
    setSelectedArme(null);
    setIsEditorOpen(true);
  };

  // Ouvrir l'éditeur pour modification
  const handleEdit = (arme: JinwooArme) => {
    setSelectedArme(arme);
    setIsEditorOpen(true);
  };

  // Fermer l'éditeur
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedArme(null);
  };

  // Après sauvegarde dans l'éditeur
  const handleSaveEditor = () => {
    loadArmes();
  };

  // Ouvrir la confirmation de suppression
  const handleDeleteClick = (arme: JinwooArme) => {
    setArmeToDelete(arme);
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!armeToDelete) return;

    setIsDeleting(true);

    try {
      await ArmesService.deleteArme(armeToDelete.id);

      toast({
        title: '✅ Arme supprimée',
        description: `${armeToDelete.nom} a été supprimée avec succès`,
      });

      await loadArmes();
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
      setArmeToDelete(null);
    }
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setArmeToDelete(null);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterElement('tous');
  };

  return (
    <div className="space-y-4">
      {/* En-tête compact */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Armes</h1>
          <p className="text-sm text-muted-foreground">
            {filteredArmes.length !== armes.length &&
              `${filteredArmes.length} / `}{armes.length} arme{armes.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadArmes} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </Button>
          <Button size="sm" onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Nouvelle Arme</span>
          </Button>
        </div>
      </div>

      {/* Erreur générale */}
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filtres horizontaux */}
      <Card className="bg-sidebar border-sidebar-border">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Éléments */}
            <div className="flex-1">
              <Label className="text-xs font-medium mb-2 block text-muted-foreground">
                Élément
              </Label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterElement('tous')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    filterElement === 'tous'
                      ? 'bg-solo-purple border-solo-purple text-white shadow-lg'
                      : 'bg-background border-border hover:bg-accent'
                  }`}
                >
                  <span>Tous</span>
                </button>
                <button
                  onClick={() => setFilterElement('Feu')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    filterElement === 'Feu'
                      ? 'bg-solo-purple border-solo-purple text-white shadow-lg'
                      : 'bg-background border-border hover:bg-accent'
                  }`}
                >
                  <img 
                    src="https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Feu_element.webp"
                    alt="Feu"
                    className="w-4 h-4 rounded object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="hidden sm:inline">Feu</span>
                </button>
                <button
                  onClick={() => setFilterElement('Eau')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    filterElement === 'Eau'
                      ? 'bg-solo-purple border-solo-purple text-white shadow-lg'
                      : 'bg-background border-border hover:bg-accent'
                  }`}
                >
                  <img 
                    src="https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Eau_element.webp"
                    alt="Eau"
                    className="w-4 h-4 rounded object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="hidden sm:inline">Eau</span>
                </button>
                <button
                  onClick={() => setFilterElement('Vent')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    filterElement === 'Vent'
                      ? 'bg-solo-purple border-solo-purple text-white shadow-lg'
                      : 'bg-background border-border hover:bg-accent'
                  }`}
                >
                  <img 
                    src="https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Vent_element.webp"
                    alt="Vent"
                    className="w-4 h-4 rounded object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="hidden sm:inline">Vent</span>
                </button>
                <button
                  onClick={() => setFilterElement('Lumière')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    filterElement === 'Lumière'
                      ? 'bg-solo-purple border-solo-purple text-white shadow-lg'
                      : 'bg-background border-border hover:bg-accent'
                  }`}
                >
                  <img 
                    src="https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Lumiere_element.webp"
                    alt="Lumière"
                    className="w-4 h-4 rounded object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="hidden sm:inline">Lumière</span>
                </button>
                <button
                  onClick={() => setFilterElement('Ténèbres')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    filterElement === 'Ténèbres'
                      ? 'bg-solo-purple border-solo-purple text-white shadow-lg'
                      : 'bg-background border-border hover:bg-accent'
                  }`}
                >
                  <img 
                    src="https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Tenebre_element.webp"
                    alt="Ténèbres"
                    className="w-4 h-4 rounded object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="hidden sm:inline">Ténèbres</span>
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

      {/* Liste des armes */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des armes...</p>
        </div>
      ) : filteredArmes.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              {armes.length === 0 ? (
                <>
                  <Swords className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Aucune arme pour le moment</p>
                  <p className="text-sm mt-2">Cliquez sur "Nouvelle Arme" pour commencer</p>
                </>
              ) : (
                <>
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Aucune arme ne correspond aux filtres</p>
                  <p className="text-sm mt-2">Essayez de modifier vos critères de recherche</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredArmes.map((arme) => (
            <ArmeCard
              key={arme.id}
              arme={arme}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Éditeur */}
      <ArmeEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveEditor}
        arme={selectedArme}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!armeToDelete} onOpenChange={() => !isDeleting && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'arme <strong>{armeToDelete?.nom}</strong> ?
              <br />
              <br />
              Cette action est irréversible et supprimera également l'image associée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
