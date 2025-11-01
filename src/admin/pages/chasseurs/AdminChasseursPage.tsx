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
import { Plus, Search, RefreshCw, AlertCircle, Loader2, Users } from 'lucide-react';
import { ChasseursService } from '@/admin/services/chasseurs-service';
import { ChasseurCard } from './ChasseurCard';
import { ChasseurEditor } from './ChasseurEditor';
import { toast } from '@/hooks/use-toast';
import type { Chasseur, ELEMENT_CHASSEUR_VALUES, RARETE_VALUES } from '@/admin/types';

export const AdminChasseursPage: React.FC = () => {
  // États
  const [chasseurs, setChasseurs] = useState<Chasseur[]>([]);
  const [filteredChasseurs, setFilteredChasseurs] = useState<Chasseur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterElement, setFilterElement] = useState<string>('tous');
  const [filterRarete, setFilterRarete] = useState<string>('tous');

  // Éditeur
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedChasseur, setSelectedChasseur] = useState<Chasseur | null>(null);

  // Suppression
  const [chasseurToDelete, setChasseurToDelete] = useState<Chasseur | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Charger les chasseurs
  const loadChasseurs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await ChasseursService.getAllChasseurs();
      setChasseurs(data);
      setFilteredChasseurs(data);
    } catch (err) {
      console.error('Erreur lors du chargement des chasseurs:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Une erreur inattendue est survenue lors du chargement des chasseurs.';
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
    loadChasseurs();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...chasseurs];

    // Filtre par recherche (nom)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((c) =>
        c.nom.toLowerCase().includes(search)
      );
    }

    // Filtre par élément
    if (filterElement !== 'tous') {
      filtered = filtered.filter((c) => c.element_chasseur === filterElement);
    }

    // Filtre par rareté
    if (filterRarete !== 'tous') {
      filtered = filtered.filter((c) => c.rarete === filterRarete);
    }

    // Tri : Sung Jinwoo en premier, puis par ID décroissant
    filtered.sort((a, b) => {
      const isJinwooA = a.nom.toLowerCase() === 'sung jinwoo';
      const isJinwooB = b.nom.toLowerCase() === 'sung jinwoo';
      
      // Si A est Jinwoo et B n'est pas Jinwoo, A vient en premier
      if (isJinwooA && !isJinwooB) return -1;
      // Si B est Jinwoo et A n'est pas Jinwoo, B vient en premier
      if (!isJinwooA && isJinwooB) return 1;
      // Sinon, tri par ID décroissant
      return b.id - a.id;
    });

    setFilteredChasseurs(filtered);
  }, [chasseurs, searchTerm, filterElement, filterRarete]);

  // Ouvrir l'éditeur pour création
  const handleCreate = () => {
    setSelectedChasseur(null);
    setIsEditorOpen(true);
  };

  // Ouvrir l'éditeur pour modification
  const handleEdit = (chasseur: Chasseur) => {
    setSelectedChasseur(chasseur);
    setIsEditorOpen(true);
  };

  // Fermer l'éditeur
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedChasseur(null);
  };

  // Après sauvegarde dans l'éditeur
  const handleSaveEditor = () => {
    loadChasseurs();
  };

  // Ouvrir la confirmation de suppression
  const handleDeleteClick = (chasseur: Chasseur) => {
    setChasseurToDelete(chasseur);
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!chasseurToDelete) return;

    setIsDeleting(true);

    try {
      await ChasseursService.deleteChasseur(chasseurToDelete.id);

      toast({
        title: '✅ Chasseur supprimé',
        description: `${chasseurToDelete.nom} a été supprimé avec succès.`,
      });

      await loadChasseurs();
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
      setChasseurToDelete(null);
    }
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setChasseurToDelete(null);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterElement('tous');
    setFilterRarete('tous');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestion des Chasseurs</h1>
            <p className="text-muted-foreground">
              {chasseurs.length} chasseur{chasseurs.length > 1 ? 's' : ''} au total
              {filteredChasseurs.length !== chasseurs.length &&
                ` • ${filteredChasseurs.length} affiché${filteredChasseurs.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadChasseurs} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau chasseur
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom du chasseur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Filtre élément */}
            <div className="space-y-2">
              <Label htmlFor="element">Élément</Label>
              <Select value={filterElement} onValueChange={setFilterElement}>
                <SelectTrigger id="element">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les éléments</SelectItem>
                  <SelectItem value="Feu">🔥 Feu</SelectItem>
                  <SelectItem value="Eau">💧 Eau</SelectItem>
                  <SelectItem value="Vent">🌪️ Vent</SelectItem>
                  <SelectItem value="Lumière">✨ Lumière</SelectItem>
                  <SelectItem value="Ténèbres">🌑 Ténèbres</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre rareté */}
            <div className="space-y-2">
              <Label htmlFor="rarete">Rareté</Label>
              <Select value={filterRarete} onValueChange={setFilterRarete}>
                <SelectTrigger id="rarete">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Toutes les raretés</SelectItem>
                  <SelectItem value="SR">SR</SelectItem>
                  <SelectItem value="SSR">SSR</SelectItem>
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

      {/* Liste des chasseurs */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredChasseurs.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun chasseur trouvé</p>
              <p className="text-sm mt-1">
                {chasseurs.length === 0
                  ? 'Cliquez sur "Nouveau chasseur" pour commencer'
                  : 'Essayez de modifier vos filtres'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredChasseurs.map((chasseur) => (
            <ChasseurCard
              key={chasseur.id}
              chasseur={chasseur}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Éditeur */}
      <ChasseurEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveEditor}
        chasseur={selectedChasseur}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog
        open={!!chasseurToDelete}
        onOpenChange={(open) => !open && handleCancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer <strong>{chasseurToDelete?.nom}</strong> ?
              <br />
              <br />
              Cette action est irréversible. Le chasseur et son image seront
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
