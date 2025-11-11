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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, X, Loader2 } from 'lucide-react';
import { RolesService } from '@/admin/services/roles-service';
import type { Contributeur, CreateContributeurData, UpdateContributeurData, Role } from '@/admin/types';

interface ContributeurEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateContributeurData | UpdateContributeurData, imageFile?: File) => Promise<void>;
  contributeur?: Contributeur | null;
  mode: 'create' | 'edit';
}

export const ContributeurEditor: React.FC<ContributeurEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  contributeur,
  mode,
}) => {
  const [nom, setNom] = useState('');
  const [roleId, setRoleId] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [rang, setRang] = useState(0);
  const [githubUrl, setGithubUrl] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [actif, setActif] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // États pour les rôles
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  // Charger les rôles au montage
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setIsLoadingRoles(true);
    try {
      const data = await RolesService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error('Erreur lors du chargement des rôles:', error);
      setErrors({ roles: 'Impossible de charger les rôles.' });
    } finally {
      setIsLoadingRoles(false);
    }
  };

  // Initialiser les champs quand le contributeur change
  useEffect(() => {
    if (mode === 'edit' && contributeur) {
      setNom(contributeur.nom);
      setRoleId(contributeur.role_id);
      setDescription(contributeur.description || '');
      setRang(contributeur.rang);
      setGithubUrl(contributeur.github_url || '');
      setDiscordUsername(contributeur.discord_username || '');
      setActif(contributeur.actif);
      setImagePreview(contributeur.image);
    } else {
      resetForm();
    }
  }, [contributeur, mode]);

  const resetForm = () => {
    setNom('');
    setRoleId(null);
    setDescription('');
    setRang(0);
    setGithubUrl('');
    setDiscordUsername('');
    setActif(true);
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du format
    if (!file.type.includes('webp')) {
      setErrors({ ...errors, image: 'Seul le format .webp est accepté.' });
      return;
    }

    // Validation de la taille (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setErrors({ ...errors, image: 'La taille de l\'avatar ne doit pas dépasser 2MB.' });
      return;
    }

    setImageFile(file);
    setErrors({ ...errors, image: '' });

    // Créer une preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(mode === 'edit' && contributeur ? contributeur.image : null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nom.trim()) {
      newErrors.nom = 'Le nom est requis.';
    }

    if (!roleId) {
      newErrors.role_id = 'Le rôle est requis.';
    }

    if (rang < 0) {
      newErrors.rang = 'Le rang doit être un nombre positif.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data: CreateContributeurData | UpdateContributeurData = {
        nom: nom.trim(),
        role_id: roleId!,
        description: description.trim() || null,
        rang,
        github_url: githubUrl.trim() || null,
        discord_username: discordUsername.trim() || null,
        actif,
      };

      await onSave(data, imageFile || undefined);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Une erreur est survenue.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-sidebar border-sidebar-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {mode === 'create' ? 'Nouveau contributeur' : 'Modifier le contributeur'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {mode === 'create'
              ? 'Ajoutez un nouveau contributeur au Panthéon.'
              : 'Modifiez les informations du contributeur.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <Label htmlFor="nom" className="text-white">
              Nom <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex: Fab"
              className="bg-background border-sidebar-border text-white"
              disabled={isSubmitting}
            />
            {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
          </div>

          {/* Rôle */}
          <div>
            <Label htmlFor="role_id" className="text-white">
              Rôle <span className="text-red-500">*</span>
            </Label>
            {isLoadingRoles ? (
              <div className="flex items-center justify-center py-2 text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Chargement des rôles...
              </div>
            ) : (
              <Select
                value={roleId?.toString() || ''}
                onValueChange={(value) => setRoleId(parseInt(value))}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-background border-sidebar-border text-white">
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent className="bg-sidebar border-sidebar-border">
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()} className="text-white">
                      <div className="flex items-center gap-2">
                        <span>{role.icone}</span>
                        <span>{role.nom}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.role_id && <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>}
            {errors.roles && <p className="text-red-500 text-sm mt-1">{errors.roles}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez la contribution de cette personne..."
              rows={3}
              className="bg-background border-sidebar-border text-white resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Rang */}
          <div>
            <Label htmlFor="rang" className="text-white">
              Rang (ordre d'affichage)
            </Label>
            <Input
              id="rang"
              type="number"
              value={rang}
              onChange={(e) => setRang(parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
              className="bg-background border-sidebar-border text-white"
              disabled={isSubmitting}
            />
            {errors.rang && <p className="text-red-500 text-sm mt-1">{errors.rang}</p>}
            <p className="text-gray-400 text-xs mt-1">
              Les contributeurs sont affichés par ordre croissant de rang (0 = premier).
            </p>
          </div>

          {/* GitHub URL */}
          <div>
            <Label htmlFor="github_url" className="text-white">
              Lien GitHub
            </Label>
            <Input
              id="github_url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="bg-background border-sidebar-border text-white"
              disabled={isSubmitting}
            />
          </div>

          {/* Discord Username */}
          <div>
            <Label htmlFor="discord_username" className="text-white">
              Pseudo Discord
            </Label>
            <Input
              id="discord_username"
              value={discordUsername}
              onChange={(e) => setDiscordUsername(e.target.value)}
              placeholder="username#0000"
              className="bg-background border-sidebar-border text-white"
              disabled={isSubmitting}
            />
          </div>

          {/* Avatar */}
          <div>
            <Label htmlFor="image" className="text-white">
              Avatar (.webp, max 2MB)
            </Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-violet-500/30"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    disabled={isSubmitting}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-sidebar-border rounded-full cursor-pointer hover:border-violet-500/50 transition-colors"
                >
                  <Upload className="text-gray-400" size={24} />
                  <input
                    id="image"
                    type="file"
                    accept=".webp"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>
              )}
            </div>
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
          </div>

          {/* Actif */}
          <div className="flex items-center justify-between">
            <Label htmlFor="actif" className="text-white">
              Afficher sur la page publique
            </Label>
            <Switch
              id="actif"
              checked={actif}
              onCheckedChange={setActif}
              disabled={isSubmitting}
            />
          </div>

          {/* Erreur de soumission */}
          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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
              {isSubmitting ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

