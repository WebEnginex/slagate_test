import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Save, Plus, Trash2, Eye, AlertTriangle, CheckCircle, CheckCircle2, Circle, Loader2, X, Sword, Shield, Heart, Zap, Target, TrendingUp, Edit3 } from 'lucide-react';
import { BuildValidator, type BuildData } from '../utils/buildValidator';
import {
  BuildsError,
  ValidationError,
  formatErrorMessage
} from '../../../services/errors';

// Composant pour afficher un item avec image et nom
const ItemWithImage = ({ image, nom, id }: { image?: string; nom: string; id: number }) => (
  <div className="flex items-center gap-2">
    {image && (
      <img 
        src={image} 
        alt={nom}
        className="w-8 h-8 object-contain bg-transparent"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    )}
    <span className="font-medium text-sm">{nom}</span>
  </div>
);

// Composant pour le trigger du Select avec image
const SelectTriggerWithImage = ({ selectedItem, placeholder }: { 
  selectedItem?: { id: number; nom: string; image?: string }; 
  placeholder: string 
}) => (
  <SelectTrigger>
    <div className="flex items-center gap-2 flex-1">
      {selectedItem ? (
        <>
          {selectedItem.image && (
            <img 
              src={selectedItem.image} 
              alt={selectedItem.nom}
              className="w-6 h-6 rounded object-cover bg-muted"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <span>{selectedItem.nom}</span>
        </>
      ) : (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
    </div>
  </SelectTrigger>
);

// Types pour les artefacts avec index signature
interface ArtefactSlots {
  casque?: { id: number; statPrincipale: string };
  armure?: { id: number; statPrincipale: string };
  gants?: { id: number; statPrincipale: string };
  bottes?: { id: number; statPrincipale: string };
  collier?: { id: number; statPrincipale: string };
  bracelet?: { id: number; statPrincipale: string };
  bague?: { id: number; statPrincipale: string };
  boucles?: { id: number; statPrincipale: string };
  [key: string]: { id: number; statPrincipale: string } | undefined;
}

// Types pour les builds
interface BuildFormData extends Record<string, unknown> {
  id?: number;
  nom?: string; // Optionnel car géré par la clé de l'objet
  stats: Record<string, string>;
  artefacts: ArtefactSlots;
  noyaux: Record<string, Array<{ id: number; statPrincipale: string }>>;
  sets_bonus: Array<{ id: number }>;
}

interface BuildEditorProps {
  chasseurData: {
    chasseur_id: number;
    chasseur_nom: string;
    element: string;
    builds_data: Record<string, unknown>;
  };
  referenceData?: {
    chasseurs: Array<{ id: number; nom: string; element: string; image?: string }>;
    artefacts: Array<{ id: number; nom: string; categorie: string; image?: string }>;
    noyaux: Array<{ id: number; nom: string; image?: string; slot?: number | null }>;
    setsBonus: Array<{ id: number; nom: string }>;
  };
  onSave: (buildName: string, buildData: BuildFormData, originalBuildName?: string) => Promise<void>;
  onDelete: (buildName: string) => Promise<void>;
  onEditingChange?: (isEditing: boolean) => void;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
}

// Stats principales disponibles
const STATS_PRINCIPALES = [
  "PV supplémentaire",
  "Défense supplémentaire", 
  "PM",
  "Attaque supplémentaire",
  "Précision",
  "Taux de coup critique",
  "Dégâts de coup critique",
  "Hausse des dégâts",
  "Pénétration de défense",
  "Réduction des dégâts",
  "Hausse des soins donnés",
  "Hausse des soins reçus",
  "Hausse du taux de récupération des PM",
  "Baisse du coût de PM"
];

// Stats principales par emplacement de noyau
const NOYAUX_STATS_PAR_SLOT: Record<number, string[]> = {
  1: [
    'Attaque (%)',
    'Attaque supplémentaire'
  ],
  2: [
    'Défense (%)',
    'Défense supplémentaire'
  ],
  3: [
    'PV (%)',
    'PV supplémentaire'
  ]
};

// Éléments disponibles
const ELEMENTS = ["Feu (%)", "Eau (%)", "Glace (%)", "Électricité (%)", "Vent (%)", "Terre (%)", "Lumière (%)", "Ombre (%)"];

const SLOTS_ARTEFACTS = [
  "casque", "armure", "gants", "bottes", 
  "collier", "bracelet", "bague", "boucles"
];

// Stats principales par catégorie d'artefact
const STATS_PAR_ARTEFACT: Record<string, string[]> = {
  "casque": [
    "Attaque supplémentaire",
    "Défense supplémentaire",
    "PV supplémentaire",
    "Attaque (%)",
    "Défense (%)",
    "PV (%)"
  ],
  "armure": [
    "Défense supplémentaire",
    "Défense (%)"
  ],
  "gants": [
    "Attaque supplémentaire",
    "Attaque (%)"
  ],
  "bottes": [
    "PV (%)",
    "Défense (%)",
    "Dégâts de coup critique",
    "Pénétration de défense"
  ],
  "collier": [
    "PV supplémentaire",
    "PV (%)"
  ],
  "bracelet": [
    "Dégâts de Feu (%)",
    "Dégâts d'Eau (%)",
    "Dégâts de Vent (%)",
    "Dégâts de Lumière (%)",
    "Dégâts de Ténèbres (%)"
  ],
  "bague": [
    "Attaque supplémentaire",
    "Attaque (%)",
    "PV supplémentaire",
    "PV (%)",
    "Défense supplémentaire",
    "Défense (%)"
  ],
  "boucles": [
    "PM supplémentaire"
  ]
};

export default function BuildEditor({ chasseurData, referenceData, onSave, onDelete, onEditingChange, onUnsavedChangesChange }: BuildEditorProps) {
  const [editingBuild, setEditingBuild] = useState<string | null>(null);
  const [originalBuildName, setOriginalBuildName] = useState<string | null>(null);
  const [formData, setFormData] = useState<BuildFormData | null>(null);
  const [newBuildName, setNewBuildName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [buildToDelete, setBuildToDelete] = useState<string | null>(null);
  const [showWarningConfirm, setShowWarningConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Notifier le parent quand l'état d'édition change
  useEffect(() => {
    onEditingChange?.(editingBuild !== null);
  }, [editingBuild, onEditingChange]);

  // Notifier le parent quand les modifications non sauvegardées changent
  useEffect(() => {
    onUnsavedChangesChange?.(hasUnsavedChanges);
  }, [hasUnsavedChanges, onUnsavedChangesChange]);

  // Détecter les modifications du formData pour marquer hasUnsavedChanges
  const formDataRef = React.useRef<BuildFormData | null>(null);
  useEffect(() => {
    // Ignorer le premier rendu et les chargements de builds
    if (formData && formDataRef.current && editingBuild) {
      // Vérifier si les données ont réellement changé
      if (JSON.stringify(formData) !== JSON.stringify(formDataRef.current)) {
        setHasUnsavedChanges(true);
      }
    }
    formDataRef.current = formData;
  }, [formData, editingBuild]);

  // Helper pour marquer les modifications lors de l'édition
  const updateFormData = React.useCallback((newData: BuildFormData) => {
    setFormData(newData);
    if (editingBuild) {
      setHasUnsavedChanges(true);
    }
  }, [editingBuild]);

  // Debug des données de référence
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Reference data loaded:', {
        artefacts: referenceData?.artefacts?.length || 0,
        noyaux: referenceData?.noyaux?.length || 0,
        categories: referenceData?.artefacts?.map(a => a.categorie).filter(Boolean) || []
      });
      
      // Debug détaillé des artefacts
      if (referenceData?.artefacts && referenceData.artefacts.length > 0) {
        console.log('🔍 Premiers artefacts:', referenceData.artefacts.slice(0, 5));
        console.log('🏷️ Toutes les catégories trouvées:', 
          [...new Set(referenceData.artefacts.map(a => a.categorie))].filter(Boolean)
        );
      }
    }
  }, [referenceData]);

  // Fonctions helper pour récupérer les noms
  const getArtefactName = (id: number): string => {
    const artefact = referenceData?.artefacts.find(a => a.id === id);
    return artefact ? artefact.nom : `Artefact #${id}`;
  };

  const getNoyauName = (id: number): string => {
    const noyau = referenceData?.noyaux.find(n => n.id === id);
    return noyau ? noyau.nom : `Noyau #${id}`;
  };

  const getSetBonusName = (id: number): string => {
    const set = referenceData?.setsBonus.find(s => s.id === id);
    return set ? set.nom : `Set #${id}`;
  };

  const getArtefactsByCategorie = (categorie: string) => {
    // Convertir les clés minuscules vers les catégories majuscules de la DB
    const categorieMapping: Record<string, string> = {
      "casque": "Casque",
      "armure": "Armure", 
      "gants": "Gants",
      "bottes": "Bottes",
      "collier": "Collier",
      "bracelet": "Bracelet",
      "bague": "Bague",
      "boucles": "Boucles"
    };
    
    const dbCategorie = categorieMapping[categorie] || categorie;
    const filtered = referenceData?.artefacts.filter(a => a.categorie === dbCategorie) || [];
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Artefacts pour catégorie "${categorie}" (DB: "${dbCategorie}"):`, filtered.length, filtered);
    }
    
    return filtered;
  };

  /**
   * Validation du formulaire (appelée uniquement à la sauvegarde)
   */
  const validateForm = React.useCallback(() => {
    if (!formData || !editingBuild) {
      setValidationErrors([]);
      setValidationWarnings([]);
      return { isValid: false, errors: [], warnings: [] };
    }

    // Validation du nom
    const nameValidation = BuildValidator.validateBuildName(editingBuild);
    
    // Validation des données (sans passer referenceData car les types ne correspondent pas exactement)
    // La validation des IDs sera faite côté serveur
    const dataValidation = BuildValidator.validateBuildData(formData as BuildData);
    
    // Combiner les erreurs
    const allErrors = [...nameValidation.errors, ...dataValidation.errors];
    const allWarnings = [...nameValidation.warnings, ...dataValidation.warnings];
    
    setValidationErrors(allErrors);
    setValidationWarnings(allWarnings);
    
    return { 
      isValid: allErrors.length === 0, 
      errors: allErrors, 
      warnings: allWarnings 
    };
  }, [formData, editingBuild]);

  // Initialiser un nouveau build
  const createNewBuild = () => {
    const newBuild: BuildFormData = {
      // Ne plus inclure le champ "nom" ici car il est géré par la clé de l'objet
      stats: {
        "PV supplémentaire": "",
        "Défense supplémentaire": "", 
        "PM": "",
        "Attaque supplémentaire": "",
        "Précision": "",
        "Taux de coup critique": "",
        "Dégâts de coup critique": "",
        "Hausse des dégâts": "",
        "Pénétration de défense": "",
        "Réduction des dégâts": "",
        "Hausse des soins donnés": "", 
        "Hausse des soins reçus": "",
        "Hausse du taux de récupération des PM": "",
        "Baisse du coût de PM": ""
      },
      artefacts: {},
      noyaux: {},
      sets_bonus: []
    };
    
    setFormData(newBuild);
    setEditingBuild(newBuildName || `build-${Date.now()}`);
    setNewBuildName('');
    setErrorMessage(null);
    setValidationErrors([]);
    setValidationWarnings([]);
    setHasUnsavedChanges(false);
  };

  // Charger un build existant pour modification
  const editBuild = (buildName: string) => {
    const buildsData = chasseurData.builds_data as { builds?: Record<string, BuildFormData> };
    const builds = buildsData?.builds;
    const build = builds?.[buildName];
    if (build) {
      setFormData({ ...build });
      setEditingBuild(buildName);
      setOriginalBuildName(buildName); // Sauvegarder l'ancien nom pour le renommage
      setErrorMessage(null);
      setValidationErrors([]);
      setValidationWarnings([]);
      setHasUnsavedChanges(false);
    }
  };

  /**
   * Initier la sauvegarde (avec validation et confirmation si nécessaire)
   */
  const saveBuild = async () => {
    if (!formData || !editingBuild) return;
    
    // Valider d'abord
    setErrorMessage(null);
    const validation = validateForm();
    
    if (!validation.isValid) {
      setErrorMessage('Veuillez corriger les erreurs avant de sauvegarder');
      return;
    }
    
    // Si il y a des avertissements, afficher la modale de confirmation
    if (validation.warnings.length > 0) {
      setShowWarningConfirm(true);
      return;
    }
    
    // Sinon, sauvegarder directement
    await performSave();
  };
  
  /**
   * Effectuer la sauvegarde réelle (après validation et confirmation)
   */
  const performSave = async () => {
    if (!formData || !editingBuild) return;
    
    try {
      setSaving(true);
      setShowWarningConfirm(false); // Fermer la modale si elle était ouverte
      
      // Exclure le champ "nom" redondant des données à sauvegarder
      const { nom, ...buildDataWithoutNom } = formData;
      
      // Passer l'ancien nom pour indiquer qu'on modifie un build existant
      // Si originalBuildName existe, on l'utilise, sinon on utilise editingBuild (= pas de renommage)
      const oldName = originalBuildName || editingBuild;
      
      await onSave(editingBuild, buildDataWithoutNom as BuildFormData, oldName);
      
      // Si la sauvegarde réussit, on peut réinitialiser
      setEditingBuild(null);
      setOriginalBuildName(null);
      setFormData(null);
      setValidationErrors([]);
      setValidationWarnings([]);
      setHasUnsavedChanges(false);
      
    } catch (error) {
      // En cas d'erreur, on garde le formulaire et on affiche l'erreur
      if (error instanceof BuildsError) {
        setErrorMessage(formatErrorMessage(error));
      } else {
        const errorMsg = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
        setErrorMessage(errorMsg);
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Erreur sauvegarde build:', error);
      }
    } finally {
      setSaving(false);
    }
  };
  
  /**
   * Annuler la confirmation des avertissements
   */
  const cancelWarningConfirm = () => {
    setShowWarningConfirm(false);
    // On garde les avertissements visibles pour que l'utilisateur puisse continuer à modifier
  };

  /**
   * Annuler l'édition avec confirmation si modifications non sauvegardées
   */
  const cancelEdit = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment annuler ?');
      if (!confirm) return;
    }
    
    setEditingBuild(null);
    setOriginalBuildName(null);
    setFormData(null);
    setNewBuildName('');
    setErrorMessage(null);
    setValidationErrors([]);
    setValidationWarnings([]);
    setHasUnsavedChanges(false);
  };

  /**
   * Suppression avec confirmation
   */
  const handleDeleteBuild = async (buildName: string) => {
    setBuildToDelete(buildName);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!showDeleteConfirm || !buildToDelete) return;
    
    try {
      setDeleting(true);
      await onDelete(buildToDelete);
      setShowDeleteConfirm(false);
      setBuildToDelete(null);
      
      // Si on supprime le build en cours d'édition, fermer l'éditeur
      if (editingBuild === buildToDelete) {
        setEditingBuild(null);
        setOriginalBuildName(null);
        setFormData(null);
        setErrorMessage(null);
        setValidationErrors([]);
        setValidationWarnings([]);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      if (error instanceof BuildsError) {
        setErrorMessage(formatErrorMessage(error));
      } else {
        const errorMsg = error instanceof Error ? error.message : 'Erreur lors de la suppression';
        setErrorMessage(errorMsg);
      }
    } finally {
      setDeleting(false);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setBuildToDelete(null);
  };

  const existingBuilds = (chasseurData.builds_data as { builds?: Record<string, BuildFormData> })?.builds || {};

  return (
    <div className="space-y-6">
      {/* Vue des builds existants */}
      {!editingBuild && (
        <Card>
          <CardHeader>
            <CardTitle>Builds de {chasseurData.chasseur_nom}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Créer un nouveau build */}
              <div className="flex gap-2">
                <Input
                  placeholder="Nom du nouveau build (ex: Général, POD, PvP...)"
                  value={newBuildName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBuildName(e.target.value)}
                />
                <Button onClick={createNewBuild} disabled={!newBuildName.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer
                </Button>
              </div>

              {/* Builds existants */}
              {Object.keys(existingBuilds).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(existingBuilds).map(([buildName, build]) => (
                    <Card key={buildName} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{buildName}</h4>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          Artefacts: {Object.keys(build.artefacts || {}).length}/8 | 
                          Noyaux: {Object.values(build.noyaux || {}).flat().length} | 
                          Sets: {(build.sets_bonus || []).length}
                        </p>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editBuild(buildName)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteBuild(buildName)}
                            disabled={deleting}
                          >
                            {deleting ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Aucun build configuré. Créez votre premier build ci-dessus.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Éditeur de build */}
      {editingBuild && formData && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Édition: {editingBuild}</CardTitle>
              <div className="flex gap-2">
                <Button onClick={saveBuild} disabled={!editingBuild || saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  Annuler
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Affichage des erreurs */}
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            {/* Affichage des erreurs de validation */}
            {validationErrors.length > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erreurs de validation</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    {validationErrors.map((error, idx) => (
                      <li key={idx} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Affichage des avertissements de validation */}
            {validationWarnings.length > 0 && (
              <Alert className="mb-4 border-orange-600 bg-orange-950/50">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <AlertTitle className="text-orange-300">Avertissements</AlertTitle>
                <AlertDescription className="text-orange-200">
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    {validationWarnings.map((warning, idx) => (
                      <li key={idx} className="text-sm">{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            {/* Indicateur de progression */}
            <Card className="mb-4 border-slate-700 bg-slate-800/50">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-400" />
                      Progression du Build
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {(() => {
                        let completed = 0;
                        const total = 5; // Nom, Stats, Artefacts, Noyaux, Sets Bonus
                        
                        // Vérifier le nom
                        if (editingBuild && editingBuild.trim().length > 0) completed++;
                        
                        // Vérifier les stats (au moins une stat remplie)
                        const hasStats = formData?.stats && Object.values(formData.stats).some(v => 
                          v !== '' && v !== null && v !== undefined
                        );
                        if (hasStats) completed++;
                        
                        // Vérifier les artefacts (au moins un artefact)
                        const hasArtefacts = formData?.artefacts && Object.keys(formData.artefacts).length > 0;
                        if (hasArtefacts) completed++;
                        
                        // Vérifier les noyaux (au moins un noyau)
                        const hasNoyaux = formData?.noyaux && Object.values(formData.noyaux).some(slot => 
                          Array.isArray(slot) && slot.length > 0
                        );
                        if (hasNoyaux) completed++;
                        
                        // Vérifier les sets bonus (au moins un set)
                        const hasSets = formData?.sets_bonus && formData.sets_bonus.length > 0;
                        if (hasSets) completed++;
                        
                        return `${completed}/${total} complété`;
                      })()}
                    </span>
                  </div>
                  
                  {/* Liste des éléments à remplir */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                    {/* Nom du build */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                      editingBuild && editingBuild.trim().length > 0
                        ? 'bg-green-900/20 border border-green-700/30'
                        : 'bg-slate-700/30 border border-slate-600/30'
                    }`}>
                      {editingBuild && editingBuild.trim().length > 0 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="text-xs truncate">Nom du build</span>
                    </div>
                    
                    {/* Statistiques */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                      formData?.stats && Object.values(formData.stats).some(v => v !== '' && v !== null && v !== undefined)
                        ? 'bg-green-900/20 border border-green-700/30'
                        : 'bg-slate-700/30 border border-slate-600/30'
                    }`}>
                      {formData?.stats && Object.values(formData.stats).some(v => v !== '' && v !== null && v !== undefined) ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="text-xs truncate">
                        Statistiques
                        {formData?.stats && (() => {
                          const filledStats = Object.values(formData.stats).filter(v => v !== '' && v !== null && v !== undefined).length;
                          return filledStats > 0 ? ` (${filledStats})` : '';
                        })()}
                      </span>
                    </div>
                    
                    {/* Artefacts */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                      formData?.artefacts && Object.keys(formData.artefacts).length > 0
                        ? 'bg-green-900/20 border border-green-700/30'
                        : 'bg-slate-700/30 border border-slate-600/30'
                    }`}>
                      {formData?.artefacts && Object.keys(formData.artefacts).length > 0 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="text-xs truncate">
                        Artefacts
                        {formData?.artefacts ? ` (${Object.keys(formData.artefacts).length}/8)` : ' (0/8)'}
                      </span>
                    </div>
                    
                    {/* Noyaux */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                      formData?.noyaux && Object.values(formData.noyaux).some(slot => Array.isArray(slot) && slot.length > 0)
                        ? 'bg-green-900/20 border border-green-700/30'
                        : 'bg-slate-700/30 border border-slate-600/30'
                    }`}>
                      {formData?.noyaux && Object.values(formData.noyaux).some(slot => Array.isArray(slot) && slot.length > 0) ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="text-xs truncate">
                        Noyaux
                        {formData?.noyaux && (() => {
                          const totalNoyaux = Object.values(formData.noyaux).reduce((acc, slot) => 
                            acc + (Array.isArray(slot) ? slot.length : 0), 0
                          );
                          return totalNoyaux > 0 ? ` (${totalNoyaux})` : '';
                        })()}
                      </span>
                    </div>
                    
                    {/* Sets Bonus */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                      formData?.sets_bonus && formData.sets_bonus.length > 0
                        ? 'bg-green-900/20 border border-green-700/30'
                        : 'bg-slate-700/30 border border-slate-600/30'
                    }`}>
                      {formData?.sets_bonus && formData.sets_bonus.length > 0 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="text-xs truncate">
                        Sets Bonus
                        {formData?.sets_bonus && formData.sets_bonus.length > 0 ? ` (${formData.sets_bonus.length})` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  <span>Général</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Statistiques</span>
                </TabsTrigger>
                <TabsTrigger value="artefacts" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Artefacts</span>
                </TabsTrigger>
                <TabsTrigger value="noyaux" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Noyaux</span>
                </TabsTrigger>
                <TabsTrigger value="sets" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Sets Bonus</span>
                </TabsTrigger>
              </TabsList>

              {/* Onglet Général */}
              <TabsContent value="general" className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="buildName" className="text-sm font-medium">Nom du Build</Label>
                  <Input
                    id="buildName"
                    value={editingBuild || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingBuild(e.target.value)}
                    placeholder="Ex: Général, POD, PvP, Boss Raid..."
                    className="h-10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Donnez un nom unique et reconnaissable à votre build
                  </p>
                </div>
              </TabsContent>

              {/* Onglet Statistiques */}
              <TabsContent value="stats" className="space-y-3">
                {/* Groupe Attributs de Base */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-amber-400" />
                    <h4 className="text-sm font-semibold">Attributs de Base</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {['Force', 'Vitalité', 'Agilité', 'Intelligence', 'Perception'].map(stat => (
                      <div key={stat} className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{stat}</Label>
                        <Input
                          value={formData.stats[stat] || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
                            ...formData,
                            stats: {...formData.stats, [stat]: e.target.value}
                          })}
                          placeholder=""
                          className="h-9 text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Groupe Offensif */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Sword className="h-4 w-4 text-red-400" />
                    <h4 className="text-sm font-semibold">Statistiques Offensives</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {['Attaque supplémentaire', 'Précision', 'Taux de coup critique', 'Dégâts de coup critique', 'Hausse des dégâts', 'Pénétration de défense'].map(stat => (
                      <div key={stat} className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{stat}</Label>
                        <Input
                          value={formData.stats[stat] || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
                            ...formData,
                            stats: {...formData.stats, [stat]: e.target.value}
                          })}
                          placeholder=""
                          className="h-9 text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Groupe Défensif */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <h4 className="text-sm font-semibold">Statistiques Défensives</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Défense supplémentaire', 'Réduction des dégâts'].map(stat => (
                      <div key={stat} className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{stat}</Label>
                        <Input
                          value={formData.stats[stat] || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
                            ...formData,
                            stats: {...formData.stats, [stat]: e.target.value}
                          })}
                          placeholder=""
                          className="h-9 text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Groupe Vitalité & Soins */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-green-400" />
                    <h4 className="text-sm font-semibold">Vitalité & Soins</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['PV supplémentaire', 'Hausse des soins donnés', 'Hausse des soins reçus'].map(stat => (
                      <div key={stat} className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{stat}</Label>
                        <Input
                          value={formData.stats[stat] || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
                            ...formData,
                            stats: {...formData.stats, [stat]: e.target.value}
                          })}
                          placeholder=""
                          className="h-9 text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Groupe Points de Mana (PM) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-400" />
                    <h4 className="text-sm font-semibold">Gestion des PM</h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['PM', 'Hausse du taux de récupération des PM', 'Baisse du coût de PM'].map(stat => (
                      <div key={stat} className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{stat}</Label>
                        <Input
                          value={formData.stats[stat] || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
                            ...formData,
                            stats: {...formData.stats, [stat]: e.target.value}
                          })}
                          placeholder=""
                          className="h-9 text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Onglet Artefacts */}
              <TabsContent value="artefacts" className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  {SLOTS_ARTEFACTS.map(slot => {
                    const artefactsRecord = formData.artefacts as Record<string, { id: number; statPrincipale: string } | undefined>;
                    const selectedArtefact = artefactsRecord[slot]?.id 
                      ? referenceData?.artefacts.find(a => a.id === artefactsRecord[slot]!.id)
                      : undefined;
                    
                    return (
                    <Card key={slot} className="p-3 hover:border-primary/50 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                          <h4 className="text-sm font-medium capitalize">{slot}</h4>
                        </div>
                        
                        <div className="space-y-2">
                          <Select
                            value={artefactsRecord[slot]?.id?.toString() || ''}
                            onValueChange={(value) => {
                              const artefactId = parseInt(value);
                              setFormData({
                                ...formData,
                                artefacts: {
                                  ...formData.artefacts,
                                  [slot]: {
                                    ...artefactsRecord[slot],
                                    id: artefactId,
                                    statPrincipale: artefactsRecord[slot]?.statPrincipale || ""
                                  }
                                }
                              });
                            }}
                          >
                            <SelectTriggerWithImage
                              selectedItem={selectedArtefact}
                              placeholder={`Choisir ${slot}`}
                            />
                            <SelectContent>
                              {getArtefactsByCategorie(slot).map(artefact => (
                                <SelectItem key={artefact.id} value={artefact.id.toString()}>
                                  <ItemWithImage
                                    image={artefact.image}
                                    nom={artefact.nom}
                                    id={artefact.id}
                                  />
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Select
                            value={artefactsRecord[slot]?.statPrincipale || ''}
                            onValueChange={(value) => setFormData({
                              ...formData,
                              artefacts: {
                                ...formData.artefacts,
                                [slot]: {
                                  ...artefactsRecord[slot],
                                  id: artefactsRecord[slot]?.id || 0,
                                  statPrincipale: value
                                }
                              }
                            })}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Stat" />
                            </SelectTrigger>
                            <SelectContent>
                              {(STATS_PAR_ARTEFACT[slot] || []).map(stat => (
                                <SelectItem key={stat} value={stat}>{stat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Onglet Noyaux */}
              <TabsContent value="noyaux" className="space-y-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                  {[1, 2, 3].map(slotNumber => (
                    <Card key={slotNumber} className="p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          <div>
                            <h4 className="text-sm font-semibold">Slot {slotNumber}</h4>
                            <p className="text-xs text-muted-foreground">
                              {(formData?.noyaux[slotNumber.toString()] || []).length} noyau(x)
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newNoyaux = { ...formData?.noyaux };
                            if (!newNoyaux[slotNumber.toString()]) newNoyaux[slotNumber.toString()] = [];
                            newNoyaux[slotNumber.toString()].push({ id: 0, statPrincipale: "" });
                            setFormData({ ...formData!, noyaux: newNoyaux });
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {(formData?.noyaux[slotNumber.toString()] || []).map((noyau, index) => {
                          const selectedNoyau = noyau.id 
                            ? referenceData?.noyaux.find(n => n.id === noyau.id)
                            : undefined;
                          
                          return (
                            <div key={index} className="rounded-lg p-2 border space-y-2 bg-card/50">
                              <div className="space-y-2">
                                <Select
                                  value={noyau.id?.toString() || ''}
                                  onValueChange={(value: string) => {
                                    const noyauId = parseInt(value);
                                    const newNoyaux = { ...formData?.noyaux };
                                    if (!newNoyaux[slotNumber.toString()]) newNoyaux[slotNumber.toString()] = [];
                                    newNoyaux[slotNumber.toString()][index] = {
                                      ...noyau,
                                      id: noyauId
                                    };
                                    setFormData({ ...formData!, noyaux: newNoyaux });
                                  }}
                                >
                                  <SelectTriggerWithImage
                                    selectedItem={selectedNoyau}
                                    placeholder="Noyau"
                                  />
                                  <SelectContent>
                                    {referenceData?.noyaux
                                      .filter(noyauRef => noyauRef.slot === slotNumber)
                                      .map(noyauRef => (
                                        <SelectItem key={noyauRef.id} value={noyauRef.id.toString()}>
                                          <ItemWithImage
                                            image={noyauRef.image}
                                            nom={noyauRef.nom}
                                            id={noyauRef.id}
                                          />
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                                
                                <div className="flex gap-2">
                                  <Select
                                    value={noyau.statPrincipale}
                                    onValueChange={(value: string) => {
                                      const newNoyaux = { ...formData?.noyaux };
                                      newNoyaux[slotNumber.toString()][index] = {
                                        ...noyau,
                                        statPrincipale: value
                                      };
                                      setFormData({ ...formData!, noyaux: newNoyaux });
                                    }}
                                  >
                                    <SelectTrigger className="flex-1 h-9">
                                      <SelectValue placeholder="Stat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {(NOYAUX_STATS_PAR_SLOT[slotNumber] || []).map(stat => (
                                        <SelectItem key={stat} value={stat}>{stat}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      const newNoyaux = { ...formData?.noyaux };
                                      newNoyaux[slotNumber.toString()].splice(index, 1);
                                      setFormData({ ...formData!, noyaux: newNoyaux });
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {(formData?.noyaux[slotNumber.toString()] || []).length === 0 && (
                          <div className="text-center py-6 text-muted-foreground">
                            <Zap className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-xs">Aucun noyau</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Onglet Sets Bonus */}
              <TabsContent value="sets" className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-400" />
                    <h4 className="text-sm font-semibold">
                      Sets Bonus ({(formData?.sets_bonus || []).length})
                    </h4>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      const newSets = [...(formData?.sets_bonus || []), { id: 0 }];
                      setFormData({ ...formData!, sets_bonus: newSets });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(formData?.sets_bonus || []).map((set, index) => {
                    const selectedSet = set.id 
                      ? referenceData?.setsBonus.find(s => s.id === set.id)
                      : undefined;
                    
                    return (
                      <Card key={index} className="p-3 hover:border-primary/50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <Target className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-medium">Set #{index + 1}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const newSets = [...(formData?.sets_bonus || [])];
                              newSets.splice(index, 1);
                              setFormData({ ...formData!, sets_bonus: newSets });
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        
                        <Select
                          value={set.id?.toString() || ''}
                          onValueChange={(value: string) => {
                            const setId = parseInt(value);
                            const newSets = [...(formData?.sets_bonus || [])];
                            newSets[index] = { id: setId };
                            setFormData({ ...formData!, sets_bonus: newSets });
                          }}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Choisir set" />
                          </SelectTrigger>
                          <SelectContent>
                            {referenceData?.setsBonus.map(setRef => (
                              <SelectItem key={setRef.id} value={setRef.id.toString()}>
                                {setRef.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Card>
                    );
                  })}
                </div>
                
                {(formData?.sets_bonus || []).length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <Target className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-sm text-muted-foreground mb-2">Aucun set bonus</p>
                    <Button
                      size="sm"
                      onClick={() => {
                        const newSets = [...(formData?.sets_bonus || []), { id: 0 }];
                        setFormData({ ...formData!, sets_bonus: newSets });
                      }}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter votre premier set
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Confirmation dialog for delete */}
      {showDeleteConfirm && buildToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirmer la suppression</h3>
            <p className="text-muted-foreground mb-4">
              Êtes-vous sûr de vouloir supprimer le build <span className="font-semibold text-foreground">{buildToDelete}</span> ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={cancelDelete}
                disabled={deleting}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation dialog for warnings */}
      {showWarningConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Build incomplet</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Votre build contient des éléments manquants. Voulez-vous vraiment sauvegarder ?
                </p>
                
                {/* Liste des avertissements */}
                <div className="bg-orange-950/30 border border-orange-600/30 rounded-lg p-3 mb-4">
                  <ul className="list-disc pl-4 space-y-1">
                    {validationWarnings.map((warning, idx) => (
                      <li key={idx} className="text-xs text-orange-200">{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={cancelWarningConfirm}
                disabled={saving}
              >
                Continuer à modifier
              </Button>
              <Button
                onClick={performSave}
                disabled={saving}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder quand même
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}