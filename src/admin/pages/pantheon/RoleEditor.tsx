import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RolesService } from '@/admin/services/roles-service';
import type { Role, CreateRoleData, UpdateRoleData } from '@/admin/types';

interface RoleEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
  role?: Role | null;
}

export const RoleEditor: React.FC<RoleEditorProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode,
  role,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    couleur_gradient: 'from-violet-500 to-purple-500',
    couleur_border: 'border-violet-500',
    icone: '🌟',
    ordre: 0,
    actif: true,
  });

  // Initialiser le formulaire avec les données du rôle en mode édition
  useEffect(() => {
    if (mode === 'edit' && role) {
      setFormData({
        nom: role.nom,
        couleur_gradient: role.couleur_gradient,
        couleur_border: role.couleur_border,
        icone: role.icone || '🌟',
        ordre: role.ordre,
        actif: role.actif,
      });
    } else {
      // Reset en mode création
      setFormData({
        nom: '',
        couleur_gradient: 'from-violet-500 to-purple-500',
        couleur_border: 'border-violet-500',
        icone: '🌟',
        ordre: 0,
        actif: true,
      });
    }
  }, [mode, role, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.nom.trim()) {
        toast({
          title: 'Erreur',
          description: 'Le nom du rôle est requis.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Vérifier si le nom existe déjà
      const nameExists = await RolesService.roleNameExists(
        formData.nom,
        mode === 'edit' ? role?.id : undefined
      );

      if (nameExists) {
        toast({
          title: 'Erreur',
          description: 'Un rôle avec ce nom existe déjà.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      if (mode === 'create') {
        const createData: CreateRoleData = {
          nom: formData.nom.trim(),
          couleur_gradient: formData.couleur_gradient,
          couleur_border: formData.couleur_border,
          icone: formData.icone || null,
          ordre: formData.ordre,
          actif: formData.actif,
        };
        await RolesService.createRole(createData);
        toast({
          title: 'Succès',
          description: 'Le rôle a été créé avec succès.',
        });
      } else if (mode === 'edit' && role) {
        const updateData: UpdateRoleData = {
          nom: formData.nom.trim(),
          couleur_gradient: formData.couleur_gradient,
          couleur_border: formData.couleur_border,
          icone: formData.icone || null,
          ordre: formData.ordre,
          actif: formData.actif,
        };
        await RolesService.updateRole(role.id, updateData);
        toast({
          title: 'Succès',
          description: 'Le rôle a été mis à jour avec succès.',
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du rôle:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-sidebar border-sidebar-border">
        <DialogHeader>
          <DialogTitle className="text-white">
            {mode === 'create' ? 'Créer un nouveau rôle' : 'Modifier le rôle'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {mode === 'create'
              ? 'Ajoutez un nouveau rôle pour les contributeurs.'
              : 'Modifiez les informations du rôle.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="nom" className="text-white">
              Nom du rôle <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: Développeur, Designer, etc."
              className="bg-sidebar-accent border-sidebar-border text-white"
              required
            />
          </div>

          {/* Icône */}
          <div className="space-y-2">
            <Label htmlFor="icone" className="text-white">
              Icône (emoji)
            </Label>
            <Input
              id="icone"
              value={formData.icone}
              onChange={(e) => setFormData({ ...formData, icone: e.target.value })}
              placeholder="Ex: 💻, 🎨, ✨"
              className="bg-sidebar-accent border-sidebar-border text-white"
              maxLength={2}
            />
            <p className="text-xs text-gray-400">
              Utilisez un emoji pour représenter le rôle (optionnel)
            </p>
          </div>

          {/* Couleur Gradient */}
          <div className="space-y-2">
            <Label htmlFor="couleur_gradient" className="text-white">
              Couleur du gradient (classes Tailwind) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="couleur_gradient"
              value={formData.couleur_gradient}
              onChange={(e) => setFormData({ ...formData, couleur_gradient: e.target.value })}
              placeholder="Ex: from-blue-500 to-cyan-500"
              className="bg-sidebar-accent border-sidebar-border text-white"
              required
            />
            <p className="text-xs text-gray-400">
              Classes Tailwind pour le gradient du badge (ex: from-blue-500 to-cyan-500)
            </p>
            {/* Aperçu du gradient */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Aperçu:</span>
              <div
                className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${formData.couleur_gradient}`}
              >
                {formData.icone} {formData.nom || 'Rôle'}
              </div>
            </div>
          </div>

          {/* Couleur Border */}
          <div className="space-y-2">
            <Label htmlFor="couleur_border" className="text-white">
              Couleur de la bordure (classe Tailwind) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="couleur_border"
              value={formData.couleur_border}
              onChange={(e) => setFormData({ ...formData, couleur_border: e.target.value })}
              placeholder="Ex: border-blue-500"
              className="bg-sidebar-accent border-sidebar-border text-white"
              required
            />
            <p className="text-xs text-gray-400">
              Classe Tailwind pour la bordure de l'avatar (ex: border-blue-500)
            </p>
            {/* Aperçu de la bordure */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Aperçu:</span>
              <div className={`w-16 h-16 rounded-full border-4 ${formData.couleur_border} bg-gray-700`} />
            </div>
          </div>

          {/* Ordre */}
          <div className="space-y-2">
            <Label htmlFor="ordre" className="text-white">
              Ordre d'affichage
            </Label>
            <Input
              id="ordre"
              type="number"
              value={formData.ordre}
              onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) || 0 })}
              className="bg-sidebar-accent border-sidebar-border text-white"
              min={0}
            />
            <p className="text-xs text-gray-400">
              Plus le nombre est petit, plus le rôle apparaît en premier (0 = premier)
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-sidebar-border text-white hover:bg-sidebar-accent"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Création...' : 'Mise à jour...'}
                </>
              ) : mode === 'create' ? (
                'Créer le rôle'
              ) : (
                'Mettre à jour'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

