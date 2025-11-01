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
import { ChasseursService } from '@/admin/services/chasseurs-service';
import { toast } from '@/hooks/use-toast';
import type { Chasseur, ELEMENT_CHASSEUR_VALUES, RARETE_VALUES } from '@/admin/types';

interface ChasseurEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  chasseur?: Chasseur | null;
}

export const ChasseurEditor: React.FC<ChasseurEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  chasseur,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    element_chasseur: '' as typeof ELEMENT_CHASSEUR_VALUES[number] | '',
    rarete: '' as typeof RARETE_VALUES[number] | '',
    image_body: '',
  });

  // État pour l'image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [willReplaceImage, setWillReplaceImage] = useState(false);

  // Initialiser le formulaire quand le chasseur change
  useEffect(() => {
    if (chasseur) {
      setFormData({
        nom: chasseur.nom || '',
        element_chasseur: chasseur.element_chasseur || '',
        rarete: chasseur.rarete || '',
        image_body: chasseur.image_body || '',
      });
      setImagePreview(chasseur.image);
      setImageFile(null);
      setWillReplaceImage(false);
    } else {
      // Nouveau chasseur
      setFormData({
        nom: '',
        element_chasseur: '',
        rarete: '',
        image_body: '',
      });
      setImagePreview(null);
      setImageFile(null);
      setWillReplaceImage(false);
    }
    setError(null);
  }, [chasseur, isOpen]);

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
    setWillReplaceImage(!!chasseur);

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
    if (chasseur) {
      setImagePreview(chasseur.image);
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

    // Validation du nom
    if (!formData.nom.trim()) {
      setError('❌ Le nom du chasseur est obligatoire. Veuillez saisir un nom.');
      return false;
    }

    if (formData.nom.trim().length < 2) {
      setError('❌ Le nom du chasseur doit contenir au moins 2 caractères.');
      return false;
    }

    if (formData.nom.trim().length > 100) {
      setError('❌ Le nom du chasseur ne peut pas dépasser 100 caractères.');
      return false;
    }

    // Vérifier les caractères spéciaux dangereux
    const dangerousChars = /[<>{}]/;
    if (dangerousChars.test(formData.nom)) {
      setError('❌ Le nom du chasseur contient des caractères non autorisés (<, >, {, }).');
      return false;
    }

    // Validation de l'élément
    if (!formData.element_chasseur) {
      setError('❌ L\'élément du chasseur est obligatoire. Veuillez sélectionner un élément.');
      return false;
    }

    // Validation de la rareté
    if (!formData.rarete) {
      setError('❌ La rareté du chasseur est obligatoire. Veuillez sélectionner une rareté (SR ou SSR).');
      return false;
    }

    // Validation de l'image pour un nouveau chasseur
    if (!chasseur && !imageFile) {
      setError('❌ Une image est obligatoire pour créer un nouveau chasseur. Veuillez sélectionner une image au format .webp.');
      return false;
    }

    // Validation de l'URL image_body si fournie
    if (formData.image_body && formData.image_body.trim().length > 0) {
      try {
        const url = new URL(formData.image_body.trim());
        if (!url.protocol.startsWith('http')) {
          setError('❌ L\'URL de l\'image corps doit commencer par http:// ou https://');
          return false;
        }
      } catch (urlError) {
        setError('❌ L\'URL de l\'image corps n\'est pas valide. Format attendu : https://exemple.com/image.webp');
        return false;
      }
    }

    return true;
  };

  // Sauvegarder le chasseur
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (chasseur) {
        // Mise à jour
        const updateData = {
          nom: formData.nom.trim(),
          element_chasseur: formData.element_chasseur as typeof ELEMENT_CHASSEUR_VALUES[number],
          rarete: formData.rarete as typeof RARETE_VALUES[number],
          image_body: formData.image_body?.trim() || null,
        };

        await ChasseursService.updateChasseur(
          chasseur.id,
          updateData,
          imageFile || undefined
        );

        toast({
          title: '✅ Chasseur modifié',
          description: `${formData.nom} a été modifié avec succès.`,
        });
      } else {
        // Création
        const createData = {
          nom: formData.nom.trim(),
          element_chasseur: formData.element_chasseur as typeof ELEMENT_CHASSEUR_VALUES[number],
          rarete: formData.rarete as typeof RARETE_VALUES[number],
          image_body: formData.image_body?.trim() || null,
        };

        await ChasseursService.createChasseur(createData, imageFile!);

        toast({
          title: '✅ Chasseur créé',
          description: `${formData.nom} a été créé avec succès.`,
        });
      }

      onSave();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      
      // Afficher le message d'erreur avec un préfixe visuel
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue est survenue lors de la sauvegarde.';
      setError(errorMessage.startsWith('❌') ? errorMessage : `❌ ${errorMessage}`);
      
      // Toast d'erreur également
      toast({
        title: '❌ Erreur',
        description: err instanceof Error ? err.message : 'Une erreur est survenue',
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
            {chasseur ? `Modifier ${chasseur.nom}` : 'Nouveau chasseur'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Erreur globale */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Info d'aide pour création */}
          {!chasseur && (
            <Alert className="bg-blue-500/10 border-blue-500/50">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200">
                <strong>Création d'un nouveau chasseur :</strong>
                <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
                  <li>Tous les champs marqués d'un * sont obligatoires</li>
                  <li>L'image doit être au format .webp (max 5 MB)</li>
                  <li>Le nom doit être unique (pas de doublon)</li>
                  <li>L'URL image corps est optionnelle</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Image */}
          <div className="space-y-2">
            <Label>Image du chasseur *</Label>
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
                  {chasseur ? 'Remplacer l\'image' : 'Choisir une image'}
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
            <Label htmlFor="nom">Nom du chasseur *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: Sung Jinwoo"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {formData.nom.length}/100 caractères • Le nom doit être unique
            </p>
          </div>

          {/* Élément */}
          <div className="space-y-2">
            <Label htmlFor="element_chasseur">Élément *</Label>
            <Select
              value={formData.element_chasseur}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  element_chasseur: value as typeof ELEMENT_CHASSEUR_VALUES[number],
                })
              }
            >
              <SelectTrigger id="element_chasseur">
                <SelectValue placeholder="Sélectionner un élément" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Feu">🔥 Feu</SelectItem>
                <SelectItem value="Eau">💧 Eau</SelectItem>
                <SelectItem value="Vent">🌪️ Vent</SelectItem>
                <SelectItem value="Lumière">✨ Lumière</SelectItem>
                <SelectItem value="Ténèbres">🌑 Ténèbres</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rareté */}
          <div className="space-y-2">
            <Label htmlFor="rarete">Rareté *</Label>
            <Select
              value={formData.rarete}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  rarete: value as typeof RARETE_VALUES[number],
                })
              }
            >
              <SelectTrigger id="rarete">
                <SelectValue placeholder="Sélectionner une rareté" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SR">SR (Super Rare)</SelectItem>
                <SelectItem value="SSR">SSR (Super Super Rare)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Body (optionnel) */}
          <div className="space-y-2">
            <Label htmlFor="image_body">URL Image Corps (optionnel)</Label>
            <Input
              id="image_body"
              value={formData.image_body}
              onChange={(e) => setFormData({ ...formData, image_body: e.target.value })}
              placeholder="https://..."
              type="url"
            />
            <p className="text-xs text-muted-foreground">
              Image complète du chasseur (corps entier)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {chasseur ? 'Enregistrer' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
