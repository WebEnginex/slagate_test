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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, AlertCircle, Loader2, Info } from 'lucide-react';
import { NoyauxService } from '@/admin/services/noyaux-service';
import { toast } from '@/hooks/use-toast';
import type { Noyau, SLOT_NOYAU_VALUES } from '@/admin/types';

interface NoyauEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  noyau?: Noyau | null;
}

export const NoyauEditor: React.FC<NoyauEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  noyau,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    slot: '' as typeof SLOT_NOYAU_VALUES[number] | '',
    description: '',
  });

  // État pour l'image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [willReplaceImage, setWillReplaceImage] = useState(false);

  // Initialiser le formulaire quand le noyau change
  useEffect(() => {
    if (noyau) {
      setFormData({
        nom: noyau.nom || '',
        slot: noyau.slot || '',
        description: noyau.description || '',
      });
      setImagePreview(noyau.image);
      setImageFile(null);
      setWillReplaceImage(false);
    } else {
      // Nouveau noyau
      setFormData({
        nom: '',
        slot: '',
        description: '',
      });
      setImagePreview(null);
      setImageFile(null);
      setWillReplaceImage(false);
    }
    setError(null);
  }, [noyau, isOpen]);

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
    setWillReplaceImage(!!noyau);
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
    if (noyau) {
      setImagePreview(noyau.image);
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
      setError('❌ Le nom du noyau est obligatoire.');
      return false;
    }

    if (formData.nom.trim().length < 2) {
      setError('❌ Le nom du noyau doit contenir au moins 2 caractères.');
      return false;
    }

    if (formData.nom.trim().length > 100) {
      setError('❌ Le nom du noyau ne peut pas dépasser 100 caractères.');
      return false;
    }

    // Vérifier les caractères dangereux
    if (/<|>|{|}/.test(formData.nom)) {
      setError('❌ Le nom contient des caractères non autorisés (< > { }).');
      return false;
    }

    // Vérifier le slot
    if (!formData.slot) {
      setError('❌ Le slot du noyau est obligatoire.');
      return false;
    }

    // Vérifier la description
    if (formData.description && formData.description.length > 500) {
      setError('❌ La description ne peut pas dépasser 500 caractères.');
      return false;
    }

    // Pour un nouveau noyau, l'image est obligatoire
    if (!noyau && !imageFile) {
      setError('❌ Une image est obligatoire pour un nouveau noyau.');
      return false;
    }

    return true;
  };

  // Sauvegarder le noyau
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (noyau) {
        // Mise à jour
        const updateData = {
          nom: formData.nom,
          slot: formData.slot as typeof SLOT_NOYAU_VALUES[number],
          description: formData.description || null,
        };

        await NoyauxService.updateNoyau(
          noyau.id,
          updateData,
          imageFile || undefined
        );

        toast({
          title: '✅ Noyau modifié',
          description: `${formData.nom} a été modifié avec succès`,
        });
      } else {
        // Création
        const createData = {
          nom: formData.nom,
          slot: formData.slot as typeof SLOT_NOYAU_VALUES[number],
          description: formData.description || null,
        };

        await NoyauxService.createNoyau(createData, imageFile!);

        toast({
          title: '✅ Noyau créé',
          description: `${formData.nom} a été créé avec succès`,
        });
      }

      onSave();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      const errorMsg = err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
      setError(errorMsg.startsWith('❌') ? errorMsg : `❌ ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {noyau ? `Modifier ${noyau.nom}` : 'Nouveau noyau'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info pour création */}
          {!noyau && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                📘 Tous les champs marqués d'une * sont obligatoires. L'image doit être au format .webp.
              </AlertDescription>
            </Alert>
          )}

          {/* Erreur globale */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Image */}
          <div className="space-y-2">
            <Label>Image du noyau *</Label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="flex-shrink-0">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-lg object-cover border-2 border-border"
                    />
                    {willReplaceImage && (
                      <div className="absolute top-1 right-1 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                        Nouvelle
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center text-muted-foreground text-sm text-center p-2">
                    Aucune image
                  </div>
                )}
              </div>

              {/* Boutons */}
              <div className="flex-1 space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".webp,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {noyau ? 'Remplacer l\'image' : 'Choisir une image'}
                </Button>
                {imageFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                )}
                <p className="text-xs text-muted-foreground">
                  Format : .webp uniquement • Taille max : 5 MB
                </p>
                {willReplaceImage && (
                  <p className="text-xs text-amber-600">
                    ⚠️ L'ancienne image sera supprimée
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="nom">Nom du noyau *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: Noyau de puissance"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {formData.nom.length}/100 caractères
            </p>
          </div>

          {/* Slot */}
          <div className="space-y-2">
            <Label htmlFor="slot">Slot *</Label>
            <Select
              value={formData.slot.toString()}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  slot: parseInt(value) as typeof SLOT_NOYAU_VALUES[number],
                })
              }
            >
              <SelectTrigger id="slot">
                <SelectValue placeholder="Sélectionner un slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    Slot 1
                  </div>
                </SelectItem>
                <SelectItem value="2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    Slot 2
                  </div>
                </SelectItem>
                <SelectItem value="3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    Slot 3
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description du noyau (optionnelle)"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/500 caractères
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {noyau ? 'Enregistrer' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
