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
import { Plus, Search, RefreshCw, AlertCircle, Loader2, Package } from 'lucide-react';
import { ArtefactsService } from '@/admin/services/artefacts-service';
import { ArtefactCard } from './ArtefactCard';
import { ArtefactEditor } from './ArtefactEditor';
import { toast } from '@/hooks/use-toast';
import type { Artefact } from '@/admin/types';
import { CATEGORIE_ARTEFACT_ICONS } from '@/admin/types';

export const AdminArtefactsPage: React.FC = () => {
  // États
  const [artefacts, setArtefacts] = useState<Artefact[]>([]);
  const [filteredArtefacts, setFilteredArtefacts] = useState<Artefact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Icônes de catégories (images des artefacts de référence)
  const [categorieIcons, setCategorieIcons] = useState<Record<string, string>>({});

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState<string>('tous');

  // Éditeur
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedArtefact, setSelectedArtefact] = useState<Artefact | null>(null);

  // Suppression
  const [artefactToDelete, setArtefactToDelete] = useState<Artefact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Charger les artefacts
  const loadArtefacts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await ArtefactsService.getAllArtefacts();
      setArtefacts(data);
      setFilteredArtefacts(data);

      // Charger les images des artefacts de référence pour les icônes de catégories
      const icons: Record<string, string> = {};
      for (const [categorie, id] of Object.entries(CATEGORIE_ARTEFACT_ICONS)) {
        const referenceArtefact = data.find(a => a.id === id);
        if (referenceArtefact?.image) {
          icons[categorie] = referenceArtefact.image;
        }
      }
      setCategorieIcons(icons);
    } catch (err) {
      console.error('Erreur lors du chargement des artefacts:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Une erreur inattendue est survenue lors du chargement des artefacts.';
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
    loadArtefacts();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...artefacts];

    // Filtre par recherche (nom)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((a) =>
        a.nom.toLowerCase().includes(search)
      );
    }

    // Filtre par catégorie
    if (filterCategorie !== 'tous') {
      filtered = filtered.filter((a) => a.categorie === filterCategorie);
    }

    setFilteredArtefacts(filtered);
  }, [artefacts, searchTerm, filterCategorie]);

  // Ouvrir l'éditeur pour création
  const handleCreate = () => {
    setSelectedArtefact(null);
    setIsEditorOpen(true);
  };

  // Ouvrir l'éditeur pour modification
  const handleEdit = (artefact: Artefact) => {
    setSelectedArtefact(artefact);
    setIsEditorOpen(true);
  };

  // Fermer l'éditeur
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedArtefact(null);
  };

  // Après sauvegarde dans l'éditeur
  const handleSaveEditor = () => {
    loadArtefacts();
  };

  // Ouvrir la confirmation de suppression
  const handleDeleteClick = (artefact: Artefact) => {
    setArtefactToDelete(artefact);
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!artefactToDelete) return;

    setIsDeleting(true);

    try {
      await ArtefactsService.deleteArtefact(artefactToDelete.id);

      toast({
        title: '✅ Artefact supprimé',
        description: `${artefactToDelete.nom} a été supprimé avec succès.`,
      });

      await loadArtefacts();
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
      setArtefactToDelete(null);
    }
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setArtefactToDelete(null);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterCategorie('tous');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestion des Artefacts</h1>
            <p className="text-muted-foreground">
              {artefacts.length} artefact{artefacts.length > 1 ? 's' : ''} au total
              {filteredArtefacts.length !== artefacts.length &&
                ` • ${filteredArtefacts.length} affiché${filteredArtefacts.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadArtefacts} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel artefact
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recherche */}
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom de l'artefact..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Filtre catégorie */}
            <div className="space-y-2">
              <Label htmlFor="categorie">Catégorie</Label>
              <Select value={filterCategorie} onValueChange={setFilterCategorie}>
                <SelectTrigger id="categorie">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Toutes les catégories</SelectItem>
                  <SelectItem value="Casque">
                    <div className="flex items-center gap-2">
                      {categorieIcons['Casque'] && (
                        <img src={categorieIcons['Casque']} alt="Casque" className="w-4 h-4 rounded" />
                      )}
                      Casque
                    </div>
                  </SelectItem>
                  <SelectItem value="Armure">
                    <div className="flex items-center gap-2">
                      {categorieIcons['Armure'] && (
                        <img src={categorieIcons['Armure']} alt="Armure" className="w-4 h-4 rounded" />
                      )}
                      Armure
                    </div>
                  </SelectItem>
                  <SelectItem value="Gants">
                    <div className="flex items-center gap-2">
                      {categorieIcons['Gants'] && (
                        <img src={categorieIcons['Gants']} alt="Gants" className="w-4 h-4 rounded" />
                      )}
                      Gants
                    </div>
                  </SelectItem>
                  <SelectItem value="Bottes">
                    <div className="flex items-center gap-2">
                      {categorieIcons['Bottes'] && (
                        <img src={categorieIcons['Bottes']} alt="Bottes" className="w-4 h-4 rounded" />
                      )}
                      Bottes
                    </div>
                  </SelectItem>
                  <SelectItem value="Collier">
                    <div className="flex items-center gap-2">
                      {categorieIcons['Collier'] && (
                        <img src={categorieIcons['Collier']} alt="Collier" className="w-4 h-4 rounded" />
                      )}
                      Collier
                    </div>
                  </SelectItem>
                  <SelectItem value="Bracelet">
                    <div className="flex items-center gap-2">
                      {categorieIcons['Bracelet'] && (
                        <img src={categorieIcons['Bracelet']} alt="Bracelet" className="w-4 h-4 rounded" />
                      )}
                      Bracelet
                    </div>
                  </SelectItem>
                  <SelectItem value="Bague">
                    <div className="flex items-center gap-2">
                      {categorieIcons['Bague'] && (
                        <img src={categorieIcons['Bague']} alt="Bague" className="w-4 h-4 rounded" />
                      )}
                      Bague
                    </div>
                  </SelectItem>
                  <SelectItem value="Boucles">
                    <div className="flex items-center gap-2">
                      {categorieIcons['Boucles'] && (
                        <img src={categorieIcons['Boucles']} alt="Boucles" className="w-4 h-4 rounded" />
                      )}
                      Boucles d'oreilles
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

      {/* Liste des artefacts */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredArtefacts.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun artefact trouvé</p>
              <p className="text-sm mt-1">
                {artefacts.length === 0
                  ? 'Cliquez sur "Nouvel artefact" pour commencer'
                  : 'Essayez de modifier vos filtres'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredArtefacts.map((artefact) => (
            <ArtefactCard
              key={artefact.id}
              artefact={artefact}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              categorieIcon={artefact.categorie ? categorieIcons[artefact.categorie] : undefined}
            />
          ))}
        </div>
      )}

      {/* Éditeur */}
      <ArtefactEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveEditor}
        artefact={selectedArtefact}
      />

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog
        open={!!artefactToDelete}
        onOpenChange={(open) => !open && handleCancelDelete()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer <strong>{artefactToDelete?.nom}</strong> ?
              <br />
              <br />
              Cette action est irréversible. L'artefact et son image seront
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
