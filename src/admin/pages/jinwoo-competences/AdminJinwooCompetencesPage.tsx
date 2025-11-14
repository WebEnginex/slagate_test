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
import { Plus, RefreshCw, Search, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { JinwooCompetencesService } from '@/admin/services/jinwoo-competences-service';
import { CompetenceCard } from './CompetenceCard';
import { CompetenceEditor } from './CompetenceEditor';
import { toast } from '@/hooks/use-toast';
import type { JinwooCompetence } from '@/admin/types';

export const AdminJinwooCompetencesPage: React.FC = () => {
  // États
  const [competences, setCompetences] = useState<JinwooCompetence[]>([]);
  const [filteredCompetences, setFilteredCompetences] = useState<JinwooCompetence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterElement, setFilterElement] = useState<string>('tous');

  // Éditeur
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedCompetence, setSelectedCompetence] = useState<JinwooCompetence | null>(null);

  // Suppression
  const [competenceToDelete, setCompetenceToDelete] = useState<JinwooCompetence | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Charger les compétences
  const loadCompetences = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await JinwooCompetencesService.getAllCompetences();
      setCompetences(data);
    } catch (err) {
      console.error('Erreur lors du chargement des compétences:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Charger au montage
  useEffect(() => {
    loadCompetences();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...competences];

    // Filtre par recherche (nom)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((c) =>
        c.nom.toLowerCase().includes(search)
      );
    }

    // Filtre par élément
    if (filterElement !== 'tous') {
      filtered = filtered.filter((c) => c.element === filterElement || c.element2 === filterElement);
    }

    // Tri par ID décroissant (plus récent en premier)
    filtered.sort((a, b) => b.id - a.id);

    setFilteredCompetences(filtered);
  }, [competences, searchTerm, filterElement]);

  // Ouvrir l'éditeur pour création
  const handleCreate = () => {
    setSelectedCompetence(null);
    setIsEditorOpen(true);
  };

  // Ouvrir l'éditeur pour modification
  const handleEdit = (competence: JinwooCompetence) => {
    setSelectedCompetence(competence);
    setIsEditorOpen(true);
  };

  // Fermer l'éditeur
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedCompetence(null);
  };

  // Sauvegarder depuis l'éditeur
  const handleSaveEditor = async () => {
    await loadCompetences();
    handleCloseEditor();
  };

  // Demander confirmation de suppression
  const handleDeleteClick = (competence: JinwooCompetence) => {
    setCompetenceToDelete(competence);
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!competenceToDelete) return;

    try {
      setIsDeleting(true);
      await JinwooCompetencesService.deleteCompetence(competenceToDelete.id);
      
      toast({
        title: 'Succès',
        description: `La compétence "${competenceToDelete.nom}" a été supprimée avec succès.`,
      });

      await loadCompetences();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setCompetenceToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* En-tête compact */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Compétences de Jinwoo</h1>
          <p className="text-sm text-muted-foreground">
            {filteredCompetences.length !== competences.length &&
              `${filteredCompetences.length} / `}{competences.length} compétence{competences.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadCompetences} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
          </Button>
          <Button size="sm" onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Nouvelle compétence</span>
            <span className="sm:hidden">Nouveau</span>
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recherche par nom */}
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher par nom</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom de la compétence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Filtre par élément */}
            <div className="space-y-2">
              <Label htmlFor="element">Filtrer par élément</Label>
              <Select value={filterElement} onValueChange={setFilterElement}>
                <SelectTrigger id="element">
                  <SelectValue placeholder="Tous les éléments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les éléments</SelectItem>
                  <SelectItem value="Feu">Feu</SelectItem>
                  <SelectItem value="Eau">Eau</SelectItem>
                  <SelectItem value="Vent">Vent</SelectItem>
                  <SelectItem value="Lumière">Lumière</SelectItem>
                  <SelectItem value="Ténèbres">Ténèbres</SelectItem>
                  <SelectItem value="Bris">Bris</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message d'erreur */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Liste des compétences */}
      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Chargement des compétences...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredCompetences.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              {competences.length === 0 ? (
                <>
                  <p className="text-muted-foreground">Aucune compétence enregistrée</p>
                  <p className="text-sm mt-2">Cliquez sur "Nouvelle compétence" pour commencer</p>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">Aucune compétence ne correspond aux filtres</p>
                  <p className="text-sm mt-2">Essayez de modifier vos critères de recherche</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredCompetences.map((competence) => (
            <CompetenceCard
              key={competence.id}
              competence={competence}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Éditeur */}
      <CompetenceEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveEditor}
        competence={selectedCompetence}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!competenceToDelete} onOpenChange={() => setCompetenceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la compétence <strong>"{competenceToDelete?.nom}"</strong> ?
              Cette action est irréversible et supprimera également l'image associée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminJinwooCompetencesPage;

