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
import { ArtefactsService } from '@/admin/services/artefacts-service';
import { toast } from '@/hooks/use-toast';
import type { Artefact, CATEGORIE_ARTEFACT_VALUES } from '@/admin/types';
import { CATEGORIE_ARTEFACT_ICONS } from '@/admin/types';

interface ArtefactEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  artefact?: Artefact | null;
}

export const ArtefactEditor: React.FC<ArtefactEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  artefact,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // État pour les icônes de catégories
  const [categorieIcons, setCategorieIcons] = useState<Record<string, string>>({});

  // État du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    categorie: '' as typeof CATEGORIE_ARTEFACT_VALUES[number] | '',
  });

  // État pour l'image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [willReplaceImage, setWillReplaceImage] = useState(false);

  // Initialiser le formulaire quand l'artefact change
  useEffect(() => {
    if (artefact) {
      setFormData({
        nom: artefact.nom || '',
        categorie: artefact.categorie || '',
      });
      setImagePreview(artefact.image);
      setImageFile(null);
      setWillReplaceImage(false);
    } else {
      // Nouvel artefact
      setFormData({
        nom: '',
        categorie: '',
      });
      setImagePreview(null);
      setImageFile(null);
      setWillReplaceImage(false);
    }
    setError(null);
  }, [artefact, isOpen]);

  // Charger les icônes de catégories au montage
  useEffect(() => {
    const loadCategorieIcons = async () => {
      try {
        const allArtefacts = await ArtefactsService.getAllArtefacts();
        const icons: Record<string, string> = {};
        for (const [categorie, id] of Object.entries(CATEGORIE_ARTEFACT_ICONS)) {
          const referenceArtefact = allArtefacts.find(a => a.id === id);
          if (referenceArtefact?.image) {
            icons[categorie] = referenceArtefact.image;
          }
        }
        setCategorieIcons(icons);
      } catch (err) {
        console.error('Erreur lors du chargement des icônes:', err);
      }
    };

    if (isOpen) {
      loadCategorieIcons();
    }
  }, [isOpen]);

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
    setWillReplaceImage(!!artefact);

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
    if (artefact) {
      setImagePreview(artefact.image);
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
      setError('❌ Le nom de l\'artefact est obligatoire. Veuillez saisir un nom.');
      return false;
    }

    if (formData.nom.trim().length < 2) {
      setError('❌ Le nom de l\'artefact doit contenir au moins 2 caractères.');
      return false;
    }

    if (formData.nom.trim().length > 100) {
      setError('❌ Le nom de l\'artefact ne peut pas dépasser 100 caractères.');
      return false;
    }

    // Vérifier les caractères spéciaux dangereux
    const dangerousChars = /[<>{}]/;
    if (dangerousChars.test(formData.nom)) {
      setError('❌ Le nom de l\'artefact contient des caractères non autorisés (<, >, {, }).');
      return false;
    }

    // Validation de la catégorie
    if (!formData.categorie) {
      setError('❌ La catégorie de l\'artefact est obligatoire. Veuillez sélectionner une catégorie.');
      return false;
    }

    // Validation de l'image pour un nouvel artefact
    if (!artefact && !imageFile) {
      setError('❌ Une image est obligatoire pour créer un nouvel artefact. Veuillez sélectionner une image au format .webp.');
      return false;
    }

    return true;
  };

  // Sauvegarder l'artefact
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (artefact) {
        // Mise à jour
        const updateData = {
          nom: formData.nom.trim(),
          categorie: formData.categorie as typeof CATEGORIE_ARTEFACT_VALUES[number],
        };

        await ArtefactsService.updateArtefact(
          artefact.id,
          updateData,
          imageFile || undefined
        );

        toast({
          title: '✅ Artefact modifié',
          description: `${formData.nom} a été modifié avec succès.`,
        });
      } else {
        // Création
        const createData = {
          nom: formData.nom.trim(),
          categorie: formData.categorie as typeof CATEGORIE_ARTEFACT_VALUES[number],
        };

        await ArtefactsService.createArtefact(createData, imageFile!);

        toast({
          title: '✅ Artefact créé',
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
            {artefact ? `Modifier ${artefact.nom}` : 'Nouvel artefact'}
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
          {!artefact && (
            <Alert className="bg-blue-500/10 border-blue-500/50">
              <Info className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200">
                <strong>Création d'un nouvel artefact :</strong>
                <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
                  <li>Tous les champs marqués d'un * sont obligatoires</li>
                  <li>L'image doit être au format .webp (max 5 MB)</li>
                  <li>Le nom doit être unique (pas de doublon)</li>
                  <li>Sélectionnez la catégorie appropriée</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Image */}
          <div className="space-y-2">
            <Label>Image de l'artefact *</Label>
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
                  {artefact ? 'Remplacer l\'image' : 'Choisir une image'}
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
            <Label htmlFor="nom">Nom de l'artefact *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Ex: Casque du Dragon"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {formData.nom.length}/100 caractères • Le nom doit être unique
            </p>
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="categorie">Catégorie *</Label>
            <Select
              value={formData.categorie}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  categorie: value as typeof CATEGORIE_ARTEFACT_VALUES[number],
                })
              }
            >
              <SelectTrigger id="categorie">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Casque">
                  <div className="flex items-center gap-2">
                    {categorieIcons['Casque'] && (
                      <img src={categorieIcons['Casque']} alt="Casque" className="w-5 h-5 rounded object-cover" />
                    )}
                    Casque
                  </div>
                </SelectItem>
                <SelectItem value="Armure">
                  <div className="flex items-center gap-2">
                    {categorieIcons['Armure'] && (
                      <img src={categorieIcons['Armure']} alt="Armure" className="w-5 h-5 rounded object-cover" />
                    )}
                    Armure
                  </div>
                </SelectItem>
                <SelectItem value="Gants">
                  <div className="flex items-center gap-2">
                    {categorieIcons['Gants'] && (
                      <img src={categorieIcons['Gants']} alt="Gants" className="w-5 h-5 rounded object-cover" />
                    )}
                    Gants
                  </div>
                </SelectItem>
                <SelectItem value="Bottes">
                  <div className="flex items-center gap-2">
                    {categorieIcons['Bottes'] && (
                      <img src={categorieIcons['Bottes']} alt="Bottes" className="w-5 h-5 rounded object-cover" />
                    )}
                    Bottes
                  </div>
                </SelectItem>
                <SelectItem value="Collier">
                  <div className="flex items-center gap-2">
                    {categorieIcons['Collier'] && (
                      <img src={categorieIcons['Collier']} alt="Collier" className="w-5 h-5 rounded object-cover" />
                    )}
                    Collier
                  </div>
                </SelectItem>
                <SelectItem value="Bracelet">
                  <div className="flex items-center gap-2">
                    {categorieIcons['Bracelet'] && (
                      <img src={categorieIcons['Bracelet']} alt="Bracelet" className="w-5 h-5 rounded object-cover" />
                    )}
                    Bracelet
                  </div>
                </SelectItem>
                <SelectItem value="Bague">
                  <div className="flex items-center gap-2">
                    {categorieIcons['Bague'] && (
                      <img src={categorieIcons['Bague']} alt="Bague" className="w-5 h-5 rounded object-cover" />
                    )}
                    Bague
                  </div>
                </SelectItem>
                <SelectItem value="Boucles">
                  <div className="flex items-center gap-2">
                    {categorieIcons['Boucles'] && (
                      <img src={categorieIcons['Boucles']} alt="Boucles" className="w-5 h-5 rounded object-cover" />
                    )}
                    Boucles d'oreilles
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {artefact ? 'Enregistrer' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
