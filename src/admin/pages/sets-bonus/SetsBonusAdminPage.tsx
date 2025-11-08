/**
 * Page d'administration des Sets Bonus
 */

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { SetsBonusService } from './services/setsBonusService';
import type { SetBonus, SetBonusInput } from './types';
import { toast } from '@/hooks/use-toast';

const SetsBonusAdminPage: React.FC = () => {
  const [setsBonus, setSetsBonus] = useState<SetBonus[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSetBonus, setEditingSetBonus] = useState<SetBonus | null>(null);
  const [deleteConfirmSetBonus, setDeleteConfirmSetBonus] = useState<SetBonus | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState<SetBonusInput>({
    nom: '',
    description: ''
  });

  useEffect(() => {
    loadSetsBonus();
  }, []);

  const loadSetsBonus = async () => {
    setLoading(true);
    try {
      const data = await SetsBonusService.getAllSetsBonus();
      setSetsBonus(data);
    } catch (error) {
      console.error('Erreur lors du chargement des sets bonus:', error);
      toast({ 
        title: "Erreur", 
        description: "Impossible de charger les sets bonus", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      description: ''
    });
    setEditingSetBonus(null);
  };

  const handleCreateSetBonus = async () => {
    try {
      // Validation
      if (!formData.nom.trim()) {
        toast({ 
          title: "Erreur", 
          description: "Le nom est obligatoire", 
          variant: "destructive" 
        });
        return;
      }

      await SetsBonusService.createSetBonus(formData);
      
      toast({ 
        title: "Succès", 
        description: "Set bonus créé avec succès" 
      });
      
      resetForm();
      setIsCreateDialogOpen(false);
      loadSetsBonus();
    } catch (error) {
      console.error('Erreur lors de la création du set bonus:', error);
      toast({ 
        title: "Erreur", 
        description: "Impossible de créer le set bonus", 
        variant: "destructive" 
      });
    }
  };

  const handleUpdateSetBonus = async () => {
    if (!editingSetBonus) return;

    try {
      // Validation
      if (!formData.nom.trim()) {
        toast({ 
          title: "Erreur", 
          description: "Le nom est obligatoire", 
          variant: "destructive" 
        });
        return;
      }

      await SetsBonusService.updateSetBonus({
        id: editingSetBonus.id,
        nom: formData.nom,
        description: formData.description
      });
      
      toast({ 
        title: "Succès", 
        description: "Set bonus modifié avec succès" 
      });
      
      resetForm();
      setIsCreateDialogOpen(false);
      loadSetsBonus();
    } catch (error) {
      console.error('Erreur lors de la modification du set bonus:', error);
      toast({ 
        title: "Erreur", 
        description: "Impossible de modifier le set bonus", 
        variant: "destructive" 
      });
    }
  };

  const handleDeleteSetBonus = async (setBonus: SetBonus) => {
    try {
      await SetsBonusService.deleteSetBonus(setBonus.id);
      
      toast({ 
        title: "Succès", 
        description: "Set bonus supprimé avec succès" 
      });
      
      setDeleteConfirmSetBonus(null);
      loadSetsBonus();
    } catch (error) {
      console.error('Erreur lors de la suppression du set bonus:', error);
      toast({ 
        title: "Erreur", 
        description: "Impossible de supprimer le set bonus", 
        variant: "destructive" 
      });
    }
  };

  const openEditDialog = (setBonus: SetBonus) => {
    setEditingSetBonus(setBonus);
    setFormData({
      nom: setBonus.nom,
      description: setBonus.description
    });
    setIsCreateDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  // Filtrage en temps réel côté client
  const filteredSetsBonus = searchTerm.trim()
    ? setsBonus.filter(setBonus => 
        setBonus.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setBonus.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : setsBonus;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Package className="h-8 w-8 text-violet-400" />
              Gestion des Sets Bonus
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérer les bonus de set du jeu
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un set bonus
          </Button>
        </div>

        {/* Barre de recherche */}
        <Card className="bg-sidebar border-sidebar-border">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Rechercher par nom ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-sidebar-accent border-sidebar-border text-white"
              />
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm('')}
                  className="border-sidebar-border"
                >
                  Réinitialiser
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Liste des sets bonus */}
        <Card className="bg-sidebar border-sidebar-border">
          <CardHeader className="bg-sidebar-accent py-3 sm:py-4 px-3 sm:px-5 border-b border-sidebar-border">
            <CardTitle className="text-base sm:text-lg text-white">
              Sets Bonus ({filteredSetsBonus.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Chargement...
              </div>
            ) : filteredSetsBonus.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'Aucun résultat trouvé' : 'Aucun set bonus configuré'}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSetsBonus.map((setBonus) => (
                  <Card key={setBonus.id} className="bg-sidebar-accent border-sidebar-border">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <h3 className="text-lg font-semibold text-white">
                            {setBonus.nom}
                          </h3>
                          {setBonus.description && (
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {setBonus.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Dernière modification : {new Date(setBonus.last_modified).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(setBonus)}
                            className="border-sidebar-border"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteConfirmSetBonus(setBonus)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog Créer/Modifier */}
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogContent className="bg-sidebar border-sidebar-border sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingSetBonus ? 'Modifier le set bonus' : 'Ajouter un set bonus'}
              </DialogTitle>
              <DialogDescription>
                {editingSetBonus 
                  ? 'Modifiez les informations du set bonus'
                  : 'Ajoutez un nouveau bonus de set au jeu'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-white">
                  Nom *
                </Label>
                <Input
                  id="nom"
                  placeholder="Ex: Set du Berserker"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="bg-sidebar-accent border-sidebar-border text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Description du bonus de set..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-sidebar-accent border-sidebar-border text-white min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground">
                  Décrivez les effets et bonus apportés par ce set
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}
                className="border-sidebar-border"
              >
                Annuler
              </Button>
              <Button
                onClick={editingSetBonus ? handleUpdateSetBonus : handleCreateSetBonus}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                {editingSetBonus ? 'Modifier' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Confirmer suppression */}
        <AlertDialog open={!!deleteConfirmSetBonus} onOpenChange={() => setDeleteConfirmSetBonus(null)}>
          <AlertDialogContent className="bg-sidebar border-sidebar-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Confirmer la suppression
              </AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer le set bonus "{deleteConfirmSetBonus?.nom}" ?
                Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-sidebar-border">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirmSetBonus && handleDeleteSetBonus(deleteConfirmSetBonus)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default SetsBonusAdminPage;
