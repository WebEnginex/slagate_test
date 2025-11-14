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
import { JinwooCompetencesService } from '@/admin/services/jinwoo-competences-service';
import { toast } from '@/hooks/use-toast';
import type { JinwooCompetence, ELEMENT_COMPETENCE_VALUES } from '@/admin/types';

interface CompetenceEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  competence?: JinwooCompetence | null;
}

export const CompetenceEditor: React.FC<CompetenceEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  competence,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    element: '' as typeof ELEMENT_COMPETENCE_VALUES[number] | '',
    element2: '' as typeof ELEMENT_COMPETENCE_VALUES[number] | '',
    description: '',
  });

  // État pour l'image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [willReplaceImage, setWillReplaceImage] = useState(false);

  // Initialiser le formulaire quand la compétence change
  useEffect(() => {
    if (competence) {
      setFormData({
        nom: competence.nom || '',
        element: (competence.element || '') as typeof ELEMENT_ARME_VALUES[number] | '',
        element2: (competence.element2 || '') as typeof ELEMENT_ARME_VALUES[number] | '',
        description: competence.description || '',
      });
      setImagePreview(competence.image);
      setImageFile(null);
      setWillReplaceImage(false);
    } else {
      // Nouvelle compétence
      setFormData({
        nom: '',
        element: '',
        element2: '',
        description: '',
      });
      setImagePreview(null);
      setImageFile(null);
      setWillReplaceImage(false);
    }
    setError(null);
  }, [competence, isOpen]);

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
    setWillReplaceImage(!!competence);
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
    if (competence) {
      setImagePreview(competence.image);
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
      setError('❌ Le nom de la compétence est obligatoire.');
      return false;
    }

    if (formData.nom.trim().length < 2) {
      setError('❌ Le nom de la compétence doit contenir au moins 2 caractères.');
      return false;
    }

    if (formData.nom.trim().length > 100) {
      setError('❌ Le nom de la compétence ne peut pas dépasser 100 caractères.');
      return false;
    }

    // Vérifier les caractères dangereux
    if (/<|>|{|}/.test(formData.nom)) {
      setError('❌ Le nom contient des caractères non autorisés (< > { }).');
      return false;
    }

    return true;
  };

  // Sauvegarder la compétence
  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = {
        nom: formData.nom.trim(),
        element: formData.element || null,
        element2: formData.element2 || null,
        description: formData.description.trim() || null,
      };

      if (competence) {
        // Mise à jour
        await JinwooCompetencesService.updateCompetence(
          competence.id,
          data,
          imageFile || undefined
        );
        toast({
          title: 'Succès',
          description: `La compétence "${data.nom}" a été mise à jour avec succès.`,
        });
      } else {
        // Création
        await JinwooCompetencesService.createCompetence(data, imageFile || undefined);
        toast({
          title: 'Succès',
          description: `La compétence "${data.nom}" a été créée avec succès.`,
        });
      }

      onSave();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {competence ? 'Modifier la compétence' : 'Nouvelle compétence'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Message d'erreur */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="nom">
              Nom de la compétence <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: Dague du Monarque"
              disabled={isLoading}
            />
          </div>

          {/* Élément principal */}
          <div className="space-y-2">
            <Label htmlFor="element">Élément principal</Label>
            <Select
              value={formData.element}
              onValueChange={(value) => setFormData({ ...formData, element: value as typeof ELEMENT_COMPETENCE_VALUES[number] | '' })}
              disabled={isLoading}
            >
              <SelectTrigger id="element">
                <SelectValue placeholder="Sélectionner un élément" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                <SelectItem value="Feu">Feu</SelectItem>
                <SelectItem value="Eau">Eau</SelectItem>
                <SelectItem value="Vent">Vent</SelectItem>
                <SelectItem value="Lumière">Lumière</SelectItem>
                <SelectItem value="Ténèbres">Ténèbres</SelectItem>
                <SelectItem value="Bris">Bris</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Élément secondaire */}
          <div className="space-y-2">
            <Label htmlFor="element2">Élément secondaire</Label>
            <Select
              value={formData.element2}
              onValueChange={(value) => setFormData({ ...formData, element2: value as typeof ELEMENT_COMPETENCE_VALUES[number] | '' })}
              disabled={isLoading}
            >
              <SelectTrigger id="element2">
                <SelectValue placeholder="Sélectionner un élément secondaire" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                <SelectItem value="Feu">Feu</SelectItem>
                <SelectItem value="Eau">Eau</SelectItem>
                <SelectItem value="Vent">Vent</SelectItem>
                <SelectItem value="Lumière">Lumière</SelectItem>
                <SelectItem value="Ténèbres">Ténèbres</SelectItem>
                <SelectItem value="Bris">Bris</SelectItem>
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
              placeholder="Description de la compétence..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Image (.webp uniquement, max 5 MB)</Label>

            {imagePreview && (
              <div className="relative w-full aspect-square max-w-xs mx-auto bg-sidebar-accent rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {imageFile && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {willReplaceImage && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  L'ancienne image sera remplacée par la nouvelle lors de la sauvegarde.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef}
                id="image"
                type="file"
                accept=".webp,image/webp"
                onChange={handleImageSelect}
                disabled={isLoading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {imagePreview ? 'Changer l\'image' : 'Uploader une image'}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

