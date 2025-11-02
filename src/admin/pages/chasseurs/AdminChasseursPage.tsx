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
  const [filterRarity, setFilterRarity] = useState<string>('tous');
  const [filterJinwoo, setFilterJinwoo] = useState(false);

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
    if (filterRarity !== 'tous') {
      filtered = filtered.filter((c) => c.rarete === filterRarity);
    }

    // Filtre Sung Jinwoo
    if (filterJinwoo) {
      filtered = filtered.filter((c) => c.nom.toLowerCase() === 'sung jinwoo');
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
  }, [chasseurs, searchTerm, filterElement, filterRarity, filterJinwoo]);

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
    setFilterRarity('tous');
    setFilterJinwoo(false);
  };

  return (
    <div className="space-y-4">
      {/* En-tête compact */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Chasseurs</h1>
          <p className="text-sm text-muted-foreground">
            {chasseurs.length} chasseur{chasseurs.length > 1 ? 's' : ''}
            {filteredChasseurs.length !== chasseurs.length &&
              ` • ${filteredChasseurs.length} affiché${filteredChasseurs.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadChasseurs} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </Button>
          <Button size="sm" onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Nouveau</span>
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

      {/* Filtres horizontaux compacts */}
      <Card className="bg-sidebar border-sidebar-border">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 lg:items-end">
            {/* Filtre par élément avec icônes */}
            <div className="flex-1">
              <Label className="text-xs font-medium mb-2 block">
                Filtrer par élément
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
                
                {/* Filtre spécial Sung Jinwoo */}
                <button
                  onClick={() => setFilterJinwoo(!filterJinwoo)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 ${
                    filterJinwoo
                      ? 'bg-solo-purple border-solo-purple text-white shadow-lg'
                      : 'bg-background border-border hover:bg-accent'
                  }`}
                >
                  <img 
                    src="https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/chasseurs_body/Sung%20Jinwoo%20(Ombre).webp"
                    alt="Sung Jinwoo"
                    className="w-4 h-4 rounded object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="hidden sm:inline">Sung Jinwoo</span>
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

            {/* Filtre rareté et recherche */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Recherche */}
              <div className="w-full sm:w-48">
                <Label className="text-xs font-medium mb-2 block">Rechercher</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-10 text-sm"
                  />
                </div>
              </div>

              {/* Rareté */}
              <div className="w-full sm:w-32">
                <Label className="text-xs font-medium mb-2 block">Rareté</Label>
                <Select value={filterRarity} onValueChange={setFilterRarity}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Toutes</SelectItem>
                    <SelectItem value="SR">SR</SelectItem>
                    <SelectItem value="SSR">SSR</SelectItem>
                  </SelectContent>
                </Select>
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
