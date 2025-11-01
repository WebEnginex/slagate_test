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

  // Compter les armes par élément
  const countByElement = (element: string) => {
    return armes.filter(a => {
      const armeElement = a.element || a.arme_element;
      return armeElement === element;
    }).length;
  };

  // Compter les armes sans élément
  const countWithoutElement = () => {
    return armes.filter(a => !a.element && !a.arme_element).length;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Swords className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestion des Armes</h1>
            <p className="text-muted-foreground">
              {armes.length} arme{armes.length > 1 ? 's' : ''} au total
              {filteredArmes.length !== armes.length &&
                ` • ${filteredArmes.length} affichée${filteredArmes.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadArmes} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Arme
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

      {/* Statistiques */}
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Swords className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{armes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">🔥 Feu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countByElement('Feu')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">💧 Eau</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countByElement('Eau')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">💨 Vent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countByElement('Vent')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">☀️ Lumière</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countByElement('Lumière')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">🌙 Ténèbres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countByElement('Ténèbres')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Recherche */}
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Nom de l'arme..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Filtre élément */}
            <div className="space-y-2">
              <Label htmlFor="filter-element">Élément</Label>
              <Select value={filterElement} onValueChange={setFilterElement}>
                <SelectTrigger id="filter-element">
                  <SelectValue placeholder="Tous les éléments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les éléments</SelectItem>
                  <SelectItem value="Feu">🔥 Feu</SelectItem>
                  <SelectItem value="Eau">💧 Eau</SelectItem>
                  <SelectItem value="Vent">💨 Vent</SelectItem>
                  <SelectItem value="Lumière">☀️ Lumière</SelectItem>
                  <SelectItem value="Ténèbres">🌙 Ténèbres</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bouton reset */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button variant="outline" onClick={handleResetFilters} className="w-full">
                Réinitialiser
              </Button>
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
