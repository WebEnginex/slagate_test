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
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, AlertCircle, Loader2, Info } from 'lucide-react';
import { OmbresService } from '@/admin/services/ombres-service';
import { toast } from '@/hooks/use-toast';
import type { Ombre } from '@/admin/types';

interface OmbreEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  ombre?: Ombre | null;
}

export const OmbreEditor: React.FC<OmbreEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  ombre,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
  });

  // État pour l'image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [willReplaceImage, setWillReplaceImage] = useState(false);

  // Initialiser le formulaire quand l'ombre change
  useEffect(() => {
    if (ombre) {
      setFormData({
        nom: ombre.nom || '',
        description: ombre.description || '',
      });
      setImagePreview(ombre.image);
      setImageFile(null);
      setWillReplaceImage(false);
    } else {
      // Nouvelle ombre
      setFormData({
        nom: '',
        description: '',
      });
      setImagePreview(null);
      setImageFile(null);
      setWillReplaceImage(false);
    }
    setError(null);
  }, [ombre, isOpen]);

  // Gérer la sélection d'une image
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Vérifier le format
    if (!file.type.includes('webp')) {
      setError('❌ Format d\'image non valide. Veuillez sélectionner une image au format .webp uniquement.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en octets
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(`❌ L'image est trop volumineuse (${sizeMB} MB). La taille maximale autorisée est de 5 MB.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Vérifier que le fichier est bien une image
    if (!file.type.startsWith('image/')) {
      setError('❌ Le fichier sélectionné n\'est pas une image valide.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setImageFile(file);
    setWillReplaceImage(!!ombre);

    // Créer une preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      setError('❌ Impossible de charger la prévisualisation de l\'image. Veuillez réessayer.');
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // Retirer l'image sélectionnée
  const handleRemoveImage = () => {
    setImageFile(null);
    setWillReplaceImage(false);
    if (ombre) {
      setImagePreview(ombre.image);
    } else {
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Valider le formulaire
  const validateForm = (): boolean => {
    setError(null);

    // Nom obligatoire
    if (!formData.nom.trim()) {
      setError('❌ Le nom de l\'ombre est obligatoire.');
      return false;
    }

    if (formData.nom.trim().length > 100) {
      setError('❌ Le nom de l\'ombre ne peut pas dépasser 100 caractères.');
      return false;
    }

    // Image obligatoire pour une nouvelle ombre
    if (!ombre && !imageFile) {
      setError('❌ L\'image est obligatoire pour créer une nouvelle ombre.');
      return false;
    }

    return true;
  };

  // Sauvegarder
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (ombre) {
        // Mise à jour
        await OmbresService.updateOmbre(
          ombre.id,
          {
            nom: formData.nom.trim(),
            description: formData.description.trim() || null,
          },
          imageFile || undefined
        );

        toast({
          title: '✅ Ombre modifiée',
          description: `${formData.nom} a été modifiée avec succès.`,
        });
      } else {
        // Création
        await OmbresService.createOmbre(
          {
            nom: formData.nom.trim(),
            description: formData.description.trim() || null,
          },
          imageFile || undefined
        );

        toast({
          title: '✅ Ombre créée',
          description: `${formData.nom} a été créée avec succès.`,
        });
      }

      onSave();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Une erreur inattendue est survenue lors de la sauvegarde.';
      setError(errorMessage);
      
      toast({
        title: '❌ Erreur de sauvegarde',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {ombre ? 'Modifier l\'ombre' : 'Créer une nouvelle ombre'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Erreur globale */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="nom">
              Nom de l'ombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: Igris, Beru, Iron..."
              disabled={isLoading}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {formData.nom.length}/100 caractères
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-muted-foreground">(optionnel)</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description de l'ombre..."
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label>
              Image {!ombre && <span className="text-destructive">*</span>}
            </Label>
            
            {/* Preview de l'image */}
            {imagePreview && (
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Preview"
                  className="w-32 h-32 rounded-md object-cover border"
                />
                {imageFile && (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={handleRemoveImage}
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}

            {/* Input file */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <Upload className="w-4 h-4 mr-2" />
                {imageFile ? 'Changer l\'image' : ombre ? 'Remplacer l\'image' : 'Sélectionner une image'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".webp,image/webp"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isLoading}
              />
            </div>

            {/* Info sur le remplacement */}
            {willReplaceImage && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  L'ancienne image sera remplacée par la nouvelle lors de la sauvegarde.
                </AlertDescription>
              </Alert>
            )}

            {/* Contraintes */}
            <p className="text-xs text-muted-foreground">
              Format accepté : .webp uniquement • Taille max : 5 MB
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {ombre ? 'Enregistrer' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

