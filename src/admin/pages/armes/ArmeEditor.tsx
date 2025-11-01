import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Upload, X, AlertCircle, Loader2, Info } from 'lucide-react';
import { ArmesService } from '@/admin/services/armes-service';
import { toast } from '@/hooks/use-toast';
import type { JinwooArme, ELEMENT_ARME_VALUES } from '@/admin/types';

interface ArmeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  arme?: JinwooArme | null;
}

export const ArmeEditor: React.FC<ArmeEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  arme,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    element: '' as typeof ELEMENT_ARME_VALUES[number] | '',
  });

  // État pour l'image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [willReplaceImage, setWillReplaceImage] = useState(false);

  // Initialiser le formulaire quand l'arme change
  useEffect(() => {
    if (arme) {
      setFormData({
        nom: arme.nom || '',
        element: (arme.element || arme.arme_element || '') as typeof ELEMENT_ARME_VALUES[number] | '',
      });
      setImagePreview(arme.image);
      setImageFile(null);
      setWillReplaceImage(false);
    } else {
      // Nouvelle arme
      setFormData({
        nom: '',
        element: '',
      });
      setImagePreview(null);
      setImageFile(null);
      setWillReplaceImage(false);
    }
    setError(null);
  }, [arme, isOpen]);

  // Gérer la sélection d'une image
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le format
    if (!file.type.includes('webp')) {
      setError('❌ Format d\'image non valide. Seul le format .webp est accepté.');
      return;
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(`❌ L'image est trop volumineuse (${fileSizeMB} MB). La taille maximale est de 5 MB.`);
      return;
    }

    setImageFile(file);
    setWillReplaceImage(!!arme);
    setError(null);

    // Créer une preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      setError('❌ Impossible de lire le fichier image. Le fichier est peut-être corrompu.');
    };
    reader.readAsDataURL(file);
  };

  // Retirer l'image sélectionnée
  const handleRemoveImage = () => {
    setImageFile(null);
    setWillReplaceImage(false);
    if (arme) {
      setImagePreview(arme.image);
    } else {
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Valider le formulaire
  const validateForm = (): boolean => {
    // Vérifier le nom
    if (!formData.nom.trim()) {
      setError('❌ Le nom de l\'arme est obligatoire.');
      return false;
    }

    if (formData.nom.trim().length < 2) {
      setError('❌ Le nom de l\'arme doit contenir au moins 2 caractères.');
      return false;
    }

    if (formData.nom.trim().length > 100) {
      setError('❌ Le nom de l\'arme ne peut pas dépasser 100 caractères.');
      return false;
    }

    // Vérifier les caractères dangereux
    if (/<|>|{|}/.test(formData.nom)) {
      setError('❌ Le nom contient des caractères non autorisés (< > { }).');
      return false;
    }

    return true;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (arme) {
        // Mise à jour
        await ArmesService.updateArme(
          arme.id,
          {
            nom: formData.nom.trim(),
            element: formData.element || null,
          },
          imageFile || undefined
        );

        toast({
          title: '✅ Arme modifiée',
          description: `L'arme "${formData.nom}" a été mise à jour avec succès.`,
        });
      } else {
        // Création
        await ArmesService.createArme(
          {
            nom: formData.nom.trim(),
            element: formData.element || null,
          },
          imageFile || undefined
        );

        toast({
          title: '✅ Arme créée',
          description: `L'arme "${formData.nom}" a été créée avec succès.`,
        });
      }

      onSave();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l\'arme:', err);
      setError(err instanceof Error ? err.message : 'Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {arme ? '✏️ Modifier l\'arme' : '➕ Créer une nouvelle arme'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Alerte d'erreur */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Nom de l'arme */}
          <div className="space-y-2">
            <Label htmlFor="nom" className="text-sm font-medium">
              Nom de l'arme <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nom"
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: Dague du Démon"
              maxLength={100}
              required
              disabled={isLoading}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {formData.nom.length}/100 caractères
            </p>
          </div>

          {/* Elément de l'arme */}
          <div className="space-y-2">
            <Label htmlFor="element" className="text-sm font-medium">
              Élément
            </Label>
            <Select
              value={formData.element || 'none'}
              onValueChange={(value) => setFormData({ ...formData, element: value === 'none' ? '' : value as typeof ELEMENT_ARME_VALUES[number] })}
              disabled={isLoading}
            >
              <SelectTrigger id="element" className="w-full">
                <SelectValue placeholder="Sélectionner un élément (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun élément</SelectItem>
                <SelectItem value="Feu">🔥 Feu</SelectItem>
                <SelectItem value="Eau">💧 Eau</SelectItem>
                <SelectItem value="Vent">💨 Vent</SelectItem>
                <SelectItem value="Lumière">☀️ Lumière</SelectItem>
                <SelectItem value="Ténèbres">🌙 Ténèbres</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload d'image */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Image de l'arme</Label>
            
            {/* Info sur les images */}
            <Alert className="bg-blue-500/10 border-blue-500/50">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-xs">
                Format accepté : <strong>.webp</strong> uniquement. Taille maximale : <strong>5 MB</strong>
              </AlertDescription>
            </Alert>

            {/* Preview de l'image */}
            {imagePreview && (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border-2 border-border"
                />
                {imageFile && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
                {willReplaceImage && (
                  <p className="text-xs text-amber-500 mt-1">
                    ⚠️ L'ancienne image sera remplacée
                  </p>
                )}
              </div>
            )}

            {/* Bouton d'upload */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/webp"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {imagePreview ? 'Changer l\'image' : 'Ajouter une image'}
              </Button>
            </div>
          </div>

          {/* Boutons d'action */}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {arme ? 'Modification...' : 'Création...'}
                </>
              ) : (
                <>{arme ? 'Enregistrer' : 'Créer'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
