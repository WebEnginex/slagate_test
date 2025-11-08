/**
 * Page d'administration des liens YouTube
 */

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Youtube, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import { YoutubeService } from './services/youtubeService';
import type { YoutubeLink, YoutubeLinkInput } from './types';
import { toast } from '@/hooks/use-toast';

const YoutubeAdminPage: React.FC = () => {
  const [youtubeLinks, setYoutubeLinks] = useState<YoutubeLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<YoutubeLink | null>(null);
  const [deleteConfirmLink, setDeleteConfirmLink] = useState<YoutubeLink | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    url: '',
    is_active: true
  });

  useEffect(() => {
    loadYoutubeLinks();
  }, []);

  const loadYoutubeLinks = async () => {
    setLoading(true);
    try {
      const links = await YoutubeService.getAllLinks();
      setYoutubeLinks(links);
    } catch (error) {
      console.error('Erreur lors du chargement des liens YouTube:', error);
      toast({ 
        title: "Erreur", 
        description: "Impossible de charger les liens YouTube", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      url: '',
      is_active: true
    });
    setEditingLink(null);
  };

  const handleCreateLink = async () => {
    try {
      // Validation de l'URL
      const validation = YoutubeService.validateYoutubeUrl(formData.url);
      if (!validation.isValid) {
        toast({ 
          title: "URL invalide", 
          description: validation.error, 
          variant: "destructive" 
        });
        return;
      }

      const newLink: YoutubeLinkInput = {
        url: formData.url.trim(),
        is_active: formData.is_active
      };

      await YoutubeService.createLink(newLink);
      
      toast({ 
        title: "Succès", 
        description: "Lien YouTube créé avec succès" 
      });
      
      resetForm();
      setIsCreateDialogOpen(false);
      loadYoutubeLinks();
    } catch (error) {
      console.error('Erreur lors de la création du lien:', error);
      toast({ 
        title: "Erreur", 
        description: "Impossible de créer le lien YouTube", 
        variant: "destructive" 
      });
    }
  };

  const handleUpdateLink = async () => {
    if (!editingLink) return;

    try {
      // Validation de l'URL
      const validation = YoutubeService.validateYoutubeUrl(formData.url);
      if (!validation.isValid) {
        toast({ 
          title: "URL invalide", 
          description: validation.error, 
          variant: "destructive" 
        });
        return;
      }

      await YoutubeService.updateLink({
        id: editingLink.id,
        url: formData.url.trim(),
        is_active: formData.is_active
      });
      
      toast({ 
        title: "Succès", 
        description: "Lien YouTube modifié avec succès" 
      });
      
      resetForm();
      setIsCreateDialogOpen(false);
      loadYoutubeLinks();
    } catch (error) {
      console.error('Erreur lors de la modification du lien:', error);
      toast({ 
        title: "Erreur", 
        description: "Impossible de modifier le lien YouTube", 
        variant: "destructive" 
      });
    }
  };

  const handleDeleteLink = async (link: YoutubeLink) => {
    try {
      await YoutubeService.deleteLink(link.id);
      
      toast({ 
        title: "Succès", 
        description: "Lien YouTube supprimé avec succès" 
      });
      
      setDeleteConfirmLink(null);
      loadYoutubeLinks();
    } catch (error) {
      console.error('Erreur lors de la suppression du lien:', error);
      toast({ 
        title: "Erreur", 
        description: "Impossible de supprimer le lien YouTube", 
        variant: "destructive" 
      });
    }
  };

  const handleToggleActive = async (link: YoutubeLink) => {
    try {
      await YoutubeService.updateLink({
        id: link.id,
        is_active: !link.is_active
      });
      
      toast({ 
        title: "Succès", 
        description: link.is_active ? "Lien désactivé" : "Lien activé"
      });
      
      loadYoutubeLinks();
    } catch (error) {
      console.error('Erreur lors de la modification du statut:', error);
      toast({ 
        title: "Erreur", 
        description: "Impossible de modifier le statut du lien", 
        variant: "destructive" 
      });
    }
  };

  const openEditDialog = (link: YoutubeLink) => {
    setEditingLink(link);
    setFormData({
      url: link.url,
      is_active: link.is_active
    });
    setIsCreateDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const getVideoPreview = (url: string) => {
    const embedUrl = YoutubeService.getEmbedUrl(url);
    if (!embedUrl) return null;
    
    return (
      <div className="aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Youtube className="h-8 w-8 text-red-500" />
              Gestion YouTube
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérer les vidéos YouTube affichées sur la page d'accueil
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une vidéo
          </Button>
        </div>

        {/* Liste des liens */}
        <Card className="bg-sidebar border-sidebar-border">
          <CardHeader className="bg-sidebar-accent py-3 sm:py-4 px-3 sm:px-5 border-b border-sidebar-border">
            <CardTitle className="text-base sm:text-lg text-white">
              Vidéos YouTube ({youtubeLinks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Chargement...
              </div>
            ) : youtubeLinks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune vidéo YouTube configurée
              </div>
            ) : (
              <div className="space-y-4">
                {youtubeLinks.map((link) => (
                  <Card key={link.id} className="bg-sidebar-accent border-sidebar-border">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row gap-4">
                        {/* Aperçu vidéo */}
                        <div className="flex-shrink-0 lg:w-64">
                          {getVideoPreview(link.url)}
                        </div>
                        
                        {/* Informations */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-white flex items-center gap-2">
                                {link.title || 'Sans titre'}
                                {link.is_active ? (
                                  <Badge className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Inactive
                                  </Badge>
                                )}
                              </h3>
                              {link.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {link.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Voir sur YouTube
                                </a>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Créé le {new Date(link.created_at).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleActive(link)}
                              className="border-sidebar-border"
                            >
                              {link.is_active ? 'Désactiver' : 'Activer'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(link)}
                              className="border-sidebar-border"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Modifier
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeleteConfirmLink(link)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Supprimer
                            </Button>
                          </div>
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
                {editingLink ? 'Modifier la vidéo YouTube' : 'Ajouter une vidéo YouTube'}
              </DialogTitle>
              <DialogDescription>
                {editingLink 
                  ? 'Modifiez les informations de la vidéo YouTube'
                  : 'Ajoutez une nouvelle vidéo YouTube à afficher sur la page d\'accueil'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="url" className="text-white">
                  URL YouTube *
                </Label>
                <Input
                  id="url"
                  placeholder="https://www.youtube.com/watch?v=... ou youtu.be/... ou ID de vidéo"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="bg-sidebar-accent border-sidebar-border text-white"
                />
                <p className="text-xs text-muted-foreground">
                  Formats acceptés : URL complète YouTube ou ID de vidéo
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, is_active: checked as boolean })
                  }
                />
                <Label htmlFor="is_active" className="text-white cursor-pointer">
                  Activer cette vidéo (seule une vidéo active sera affichée sur le site)
                </Label>
              </div>

              {/* Aperçu */}
              {formData.url && YoutubeService.getEmbedUrl(formData.url) && (
                <div className="space-y-2">
                  <Label className="text-white">Aperçu</Label>
                  {getVideoPreview(formData.url)}
                </div>
              )}
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
                onClick={editingLink ? handleUpdateLink : handleCreateLink}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {editingLink ? 'Modifier' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Confirmer suppression */}
        <AlertDialog open={!!deleteConfirmLink} onOpenChange={() => setDeleteConfirmLink(null)}>
          <AlertDialogContent className="bg-sidebar border-sidebar-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Confirmer la suppression
              </AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer cette vidéo YouTube ?
                Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-sidebar-border">
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirmLink && handleDeleteLink(deleteConfirmLink)}
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

export default YoutubeAdminPage;
