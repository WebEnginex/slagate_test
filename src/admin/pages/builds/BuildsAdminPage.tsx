import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Save, Download, Upload, AlertTriangle, CheckCircle, RefreshCw, Users, WifiOff, Database } from 'lucide-react';
// Layout géré par AdminLayout, pas besoin d'import
import { BuildsSupabaseService } from './services/buildsSupabaseService';
import { ReferenceDataManager } from '../../utils/referenceDataManager';
import ModernBuildEditor from './components/ModernBuildEditor';
import type { ChasseurBuild, EditorReferenceData, BuildValidationResult } from '../../types';
import {
  BuildsError,
  ValidationError,
  NetworkError,
  ConflictError,
  NotFoundError,
  ReferenceDataError,
  formatErrorMessage
} from '../../services/errors';

const buildsService = new BuildsSupabaseService();

// Style pour masquer la scrollbar tout en gardant le scroll
const scrollbarStyle = `
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;

// Type pour un build individuel
interface BuildData {
  stats?: { hp?: number; atq?: number; def?: number; critique?: number };
  artefacts?: Record<string, unknown>;
  noyaux?: Record<string, unknown>;
  setsBonus?: string[];
}

// Options de filtrage par élément avec images
const ELEMENT_OPTIONS = [
  { 
    id: "tous", 
    label: "Tous", 
    image: null 
  },
  {
    id: "jinwoo",
    label: "Jinwoo",
    image: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/hunter-portrait//SungJinWoo_Jeju_Portrait.png",
  },
  {
    id: "feu",
    label: "Feu",
    image: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Feu_element.webp",
  },
  {
    id: "eau",
    label: "Eau", 
    image: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Eau_element.webp",
  },
  {
    id: "vent",
    label: "Vent",
    image: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Vent_element.webp",
  },
  {
    id: "lumiere",
    label: "Lumière",
    image: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Lumiere_element.webp",
  },
  {
    id: "tenebres",
    label: "Ténèbres",
    image: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Tenebre_element.webp",
  },
];

// Composant pour afficher un chasseur avec son image
const ChasseurItem = ({ chasseur, referenceData }: { 
  chasseur: { chasseur_id: number; chasseur_nom: string; element: string }; 
  referenceData: EditorReferenceData | null;
}) => {
  const chasseurRef = referenceData?.chasseurs.find(c => c.id === chasseur.chasseur_id);
  
  // Trouver l'icône d'élément correspondante
  const elementIcon = ELEMENT_OPTIONS.find(el => 
    el.id === chasseur.element.toLowerCase() || 
    (chasseur.chasseur_nom.toLowerCase().includes("jinwoo") && el.id === "jinwoo")
  );
  
  return (
    <div className="flex items-center gap-3">
      {chasseurRef?.image && (
        <img 
          src={chasseurRef.image} 
          alt={chasseur.chasseur_nom}
          className="w-8 h-8 rounded object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{chasseur.chasseur_nom}</p>
          {elementIcon?.image && (
            <img 
              src={elementIcon.image} 
              alt={elementIcon.label}
              className="w-4 h-4 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default function BuildsAdminPage() {
  // États principaux
  const [chasseurs, setChasseurs] = useState<{ chasseur_id: number; chasseur_nom: string; element: string; builds_data: Record<string, unknown> }[]>([]);
  const [referenceData, setReferenceData] = useState<EditorReferenceData | null>(null);
  const [selectedChasseurId, setSelectedChasseurId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingReferenceData, setLoadingReferenceData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; text: string; details?: string } | null>(null);
  const [validationResult, setValidationResult] = useState<BuildValidationResult | null>(null);
  const [hasLoadError, setHasLoadError] = useState(false);
  
  // États pour la gestion de l'édition
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingChasseurId, setPendingChasseurId] = useState<number | null>(null);
  const [showChangeConfirm, setShowChangeConfirm] = useState(false);
  
  // États pour le filtrage des chasseurs
  const [elementFilter, setElementFilter] = useState<string>("tous");
  const [showJinwooOnly, setShowJinwooOnly] = useState(false);
  
  // État pour le drag du carrousel
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  // Filtrage des chasseurs
  const filteredChasseurs = React.useMemo(() => {
    let filtered = chasseurs;
    
    // Filtrage spécial pour Sung Jinwoo
    if (elementFilter === "jinwoo") {
      filtered = chasseurs.filter(c => 
        c.chasseur_nom.toLowerCase() === "sung jinwoo"
      );
    } else if (elementFilter !== "tous") {
      filtered = chasseurs.filter(c => c.element.toLowerCase() === elementFilter);
    }
    
    return filtered;
  }, [chasseurs, elementFilter]);

  /**
   * Affiche un message à l'utilisateur
   */
  const showMessage = React.useCallback((type: 'success' | 'error' | 'warning' | 'info', text: string, details?: string) => {
    setMessage({ type, text, details });
    // Auto-masquer après 5 secondes sauf pour les erreurs critiques
    if (type !== 'error' || !details) {
      setTimeout(() => setMessage(null), 5000);
    }
  }, []);

  /**
   * Gère les erreurs de manière centralisée avec messages utilisateur appropriés
   */
  const handleError = React.useCallback((error: unknown, context: string) => {
    if (error instanceof BuildsError) {
      // Erreurs personnalisées avec messages utilisateur
      const errorMessage = formatErrorMessage(error);
      
      // Déterminer le type de message
      let messageType: 'error' | 'warning' = 'error';
      if (error instanceof ValidationError) {
        messageType = 'warning';
      }
      
      // Afficher le message avec détails si disponibles
      if (error instanceof ValidationError && error.validationErrors.length > 0) {
        showMessage(messageType, error.userMessage, error.validationErrors.join('\n'));
      } else if (error instanceof NetworkError) {
        showMessage('error', error.userMessage, 'Vérifiez votre connexion internet et réessayez.');
      } else if (error instanceof ConflictError) {
        showMessage('error', error.userMessage, 'Rechargez la page pour obtenir les dernières données.');
      } else {
        showMessage(messageType, error.userMessage);
      }
      
      // Log en développement
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${context}:`, error);
      }
    } else {
      // Erreurs inattendues
      const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
      showMessage('error', `${context}: ${errorMsg}`);
      console.error(`❌ ${context}:`, error);
    }
  }, [showMessage]);

  const loadReferenceData = React.useCallback(async () => {
    try {
      setLoadingReferenceData(true);
      setHasLoadError(false);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Chargement des données de référence depuis Supabase...');
      }
      
      const data = await ReferenceDataManager.loadAllReferenceData();
      
      // Vérifier que les données ne sont pas vides
      if (!data.chasseurs.length || !data.artefacts.length || !data.noyaux.length || !data.setsBonus.length) {
        const missingData: string[] = [];
        if (!data.chasseurs.length) missingData.push('chasseurs');
        if (!data.artefacts.length) missingData.push('artefacts');
        if (!data.noyaux.length) missingData.push('noyaux');
        if (!data.setsBonus.length) missingData.push('sets bonus');
        
        throw new ReferenceDataError(
          'Données de référence incomplètes',
          missingData
        );
      }
      
      setReferenceData(data);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Données de référence chargées:', {
          chasseurs: data.chasseurs.length,
          artefacts: data.artefacts.length,
          noyaux: data.noyaux.length,
          setsBonus: data.setsBonus.length
        });
      }
    } catch (error) {
      setHasLoadError(true);
      handleError(error, 'Chargement des données de référence');
    } finally {
      setLoadingReferenceData(false);
    }
  }, [handleError]);

  const loadChasseurs = React.useCallback(async () => {
    try {
      setLoading(true);
      setHasLoadError(false);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Chargement des chasseurs depuis Supabase...');
      }
      
      const data = await buildsService.getAllChasseurs();
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Chasseurs chargés:', data);
      }
      
      setChasseurs(data);
      
      if (data.length === 0) {
        showMessage('info', 'Aucun chasseur trouvé dans la base de données');
      }
    } catch (error) {
      setHasLoadError(true);
      handleError(error, 'Chargement des chasseurs');
    } finally {
      setLoading(false);
    }
  }, [handleError, showMessage]);

  // Chargement des données
  useEffect(() => {
    loadReferenceData();
    loadChasseurs();
  }, [loadReferenceData, loadChasseurs]);

  /**
   * Gère le changement de chasseur avec confirmation si modifications non sauvegardées
   */
  const handleChasseurChange = React.useCallback((newChasseurId: number) => {
    // Si on est en édition avec des modifications non sauvegardées
    if (isEditing && hasUnsavedChanges && newChasseurId !== selectedChasseurId) {
      setPendingChasseurId(newChasseurId);
      setShowChangeConfirm(true);
      return;
    }
    
    // Sinon, changement direct
    setSelectedChasseurId(newChasseurId);
    setIsEditing(false);
    setHasUnsavedChanges(false);
  }, [isEditing, hasUnsavedChanges, selectedChasseurId]);

  /**
   * Confirme le changement de chasseur (abandonne les modifications)
   */
  const confirmChasseurChange = React.useCallback(() => {
    if (pendingChasseurId !== null) {
      setSelectedChasseurId(pendingChasseurId);
      setIsEditing(false);
      setHasUnsavedChanges(false);
      setPendingChasseurId(null);
      setShowChangeConfirm(false);
      showMessage('info', 'Modifications abandonnées');
    }
  }, [pendingChasseurId, showMessage]);

  /**
   * Annule le changement de chasseur
   */
  const cancelChasseurChange = React.useCallback(() => {
    setPendingChasseurId(null);
    setShowChangeConfirm(false);
  }, []);

  // Validation des builds
  const validateBuilds = () => {
    const errors: string[] = [];
    const warnings: string[] = [];
    let validCount = 0;
    let totalCount = 0;

    chasseurs.forEach(chasseur => {
      const buildsData = chasseur.builds_data as Record<string, unknown>;
      if (buildsData?.builds) {
        Object.entries(buildsData.builds as Record<string, Record<string, unknown>>).forEach(([buildName, buildData]) => {
          totalCount++;
          const buildErrors = buildsService.validateBuildData(buildData);
          if (buildErrors.length === 0) {
            validCount++;
          } else {
            errors.push(`${chasseur.chasseur_nom} - ${buildName}: ${buildErrors.join(', ')}`);
          }
        });
      }
    });

    const result: BuildValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings
    };
    
    setValidationResult(result);
    return result;
  };

  /**
   * Sauvegarde un build avec validation et gestion d'erreurs complète
   */
  const saveBuild = React.useCallback(async (
    chasseurId: number,
    buildName: string,
    buildData: Record<string, unknown>,
    originalBuildName?: string
  ) => {
    try {
      setSaving(true);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`💾 Sauvegarde du build "${buildName}" pour le chasseur ${chasseurId}...`);
      }

      // Vérifier que les données de référence sont chargées
      if (!referenceData) {
        throw new ReferenceDataError(
          'Données de référence non disponibles',
          ['Toutes les données de référence']
        );
      }

      // Sauvegarder dans Supabase (la validation est faite dans le service)
      await buildsService.saveChasseurBuild(chasseurId, buildName, buildData, originalBuildName);
      
      // Recharger les chasseurs pour avoir les dernières données
      await loadChasseurs();
      
      showMessage('success', `Build "${buildName}" sauvegardé avec succès !`);
    } catch (error) {
      handleError(error, 'Sauvegarde du build');
      throw error; // Re-lancer pour que ModernBuildEditor puisse aussi gérer l'erreur
    } finally {
      setSaving(false);
    }
  }, [referenceData, loadChasseurs, showMessage, handleError]);

  /**
   * Suppression d'un build avec confirmation et gestion d'erreurs
   */
  const removeChasseurBuild = React.useCallback(async (chasseurId: number, buildName: string) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log(`🗑️ Suppression du build "${buildName}" pour le chasseur ${chasseurId}...`);
      }

      await buildsService.deleteChasseurBuild(chasseurId, buildName);
      await loadChasseurs();
      
      showMessage('success', `Build "${buildName}" supprimé avec succès !`);
    } catch (error) {
      handleError(error, 'Suppression du build');
    }
  }, [loadChasseurs, showMessage, handleError]);

  // Alias pour la fonction de suppression
  const removeBuild = removeChasseurBuild;

  const selectedChasseurData = chasseurs.find(c => c.chasseur_id === selectedChasseurId);
  const selectedChasseur = referenceData?.chasseurs.find(c => c.id === selectedChasseurId);

  // Affichage pendant le chargement initial
  if ((loading || loadingReferenceData) && chasseurs.length === 0 && !referenceData) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
            <div>
              <p className="font-medium">Chargement des données...</p>
              <p className="text-sm text-muted-foreground mt-1">
                {loadingReferenceData ? 'Chargement des données de référence...' : 'Chargement des chasseurs...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur critique de chargement
  if (hasLoadError && chasseurs.length === 0 && !referenceData) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center min-h-96">
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Database className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Erreur de chargement</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Impossible de charger les données nécessaires.
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => {
                    setHasLoadError(false);
                    loadReferenceData();
                    loadChasseurs();
                  }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden space-y-4">
        {/* Style pour masquer la scrollbar */}
        <style>{scrollbarStyle}</style>
        
        {/* En-tête compact */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h1 className="text-xl font-bold">Gestion des Builds</h1>
            <p className="text-xs text-muted-foreground">
              Configuration des chasseurs
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={validateBuilds}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <CheckCircle className="h-3.5 w-3.5 sm:mr-2" />
              <span className="hidden sm:inline">Valider</span>
            </Button>
            
            <Button
              onClick={() => loadChasseurs()}
              size="sm"
              disabled={loading}
            >
              <RefreshCw className="h-3.5 w-3.5 sm:mr-2" />
              <span className="hidden sm:inline">Actualiser</span>
            </Button>
          </div>
        </div>

        {/* Messages avec support des détails et icônes appropriées */}
        {message && (
          <Alert className={`py-3 ${
            message.type === 'error' ? 'border-destructive bg-destructive/10' : 
            message.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 
            message.type === 'info' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
            'border-green-500 bg-green-50 dark:bg-green-900/30'
          }`}>
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {message.type === 'error' ? (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                ) : message.type === 'warning' ? (
                  <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                ) : message.type === 'info' ? (
                  <WifiOff className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div className="flex-1">
                <AlertDescription className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-green-900 dark:text-green-100' :
                  message.type === 'warning' ? 'text-yellow-900 dark:text-yellow-100' :
                  message.type === 'info' ? 'text-blue-900 dark:text-blue-100' :
                  ''
                }`}>
                  {message.text}
                </AlertDescription>
                {message.details && (
                  <div className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">
                    {message.details}
                  </div>
                )}
              </div>
              <button
                onClick={() => setMessage(null)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fermer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </Alert>
        )}

        {/* Résultats de validation compacts */}
        {validationResult && (
          <Card className="bg-sidebar border-sidebar-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                {validationResult.isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <Badge variant={validationResult.isValid ? "default" : "destructive"} className="text-xs">
                  {validationResult.isValid ? "Valide" : "Invalide"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {validationResult.errors.length} erreur(s)
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {validationResult.warnings.length} avertissement(s)
                </Badge>
              </div>

              {validationResult.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-600 mb-1.5 text-sm">Erreurs:</h4>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {validationResult.errors.slice(0, 5).map((error, i) => (
                      <li key={i} className="text-xs text-red-600">{error}</li>
                    ))}
                  </ul>
                  {validationResult.errors.length > 5 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ... et {validationResult.errors.length - 5} autres erreurs
                    </p>
                  )}
                </div>
              )}

              {validationResult.warnings.length > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-600 mb-1.5 text-sm">Avertissements:</h4>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {validationResult.warnings.slice(0, 3).map((warning, i) => (
                      <li key={i} className="text-xs text-yellow-600">{warning}</li>
                    ))}
                  </ul>
                  {validationResult.warnings.length > 3 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ... et {validationResult.warnings.length - 3} autres avertissements
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Interface principale - Sélection horizontale */}
        <Card className="bg-sidebar border-sidebar-border overflow-hidden max-w-full">
          <CardContent className="p-2 sm:p-3 max-w-full overflow-hidden">
            {/* Filtre par élément */}
            <div className="mb-3">
              <Label className="text-xs font-medium mb-1.5 block">
                Filtrer par élément
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {ELEMENT_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setElementFilter(option.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 ${
                      elementFilter === option.id
                        ? 'bg-solo-purple border-solo-purple text-white shadow-lg'
                        : 'bg-background border-border hover:bg-accent'
                    }`}
                    title={option.label}
                  >
                    {option.image && (
                      <img 
                        src={option.image} 
                        alt={option.label}
                        className="w-4 h-4 rounded object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <span className="hidden sm:inline">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Carrousel de chasseurs */}
            <div className="max-w-full overflow-hidden">
              <Label className="text-xs font-medium mb-2 block">
                Sélectionner un chasseur ({filteredChasseurs.length})
              </Label>
              
              {filteredChasseurs.length === 0 ? (
                <div className="h-20 flex items-center justify-center rounded-lg border border-border bg-muted">
                  <p className="text-muted-foreground text-xs">
                    Aucun chasseur trouvé
                  </p>
                </div>
              ) : (
                <div className="relative max-w-full">
                  {/* Overlay si édition en cours */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/20 z-10 rounded-lg flex items-center justify-center">
                      <div className="bg-sidebar border border-sidebar-border rounded-lg p-4 shadow-lg">
                        <p className="text-sm text-white/80">Édition en cours...</p>
                      </div>
                    </div>
                  )}
                  
                  <div 
                    ref={carouselRef}
                    className="overflow-x-auto overflow-y-hidden pb-2 hide-scrollbar max-w-full"
                    style={{ 
                      cursor: isDragging ? 'grabbing' : (isEditing ? 'not-allowed' : 'grab'),
                      WebkitOverflowScrolling: 'touch',
                      opacity: isEditing ? 0.6 : 1,
                      pointerEvents: isEditing ? 'none' : 'auto'
                    }}
                    onMouseDown={(e) => {
                      if (!carouselRef.current || isEditing) return;
                      e.preventDefault();
                      setIsDragging(true);
                      setStartX(e.pageX - carouselRef.current.offsetLeft);
                      setScrollLeft(carouselRef.current.scrollLeft);
                      setDragDistance(0);
                    }}
                    onMouseMove={(e) => {
                      if (!isDragging || !carouselRef.current) return;
                      e.preventDefault();
                      const x = e.pageX - carouselRef.current.offsetLeft;
                      const walk = x - startX;
                      setDragDistance(Math.abs(walk));
                      carouselRef.current.scrollLeft = scrollLeft - walk;
                    }}
                    onMouseUp={(e) => {
                      if (!isDragging) return;
                      // Si on a peu bougé (moins de 5px), c'est un clic
                      if (dragDistance < 5) {
                        const target = e.target as HTMLElement;
                        const card = target.closest('[data-chasseur-id]') as HTMLElement;
                        if (card) {
                          const chasseurId = parseInt(card.getAttribute('data-chasseur-id') || '0');
                          if (chasseurId) {
                            handleChasseurChange(chasseurId);
                          }
                        }
                      }
                      setIsDragging(false);
                      setDragDistance(0);
                    }}
                    onMouseLeave={() => {
                      setIsDragging(false);
                      setDragDistance(0);
                    }}
                  >
                    <div className="flex flex-nowrap gap-3 py-2 px-1">
                      {filteredChasseurs.map(chasseur => {
                        const chasseurRef = referenceData?.chasseurs.find(c => c.id === chasseur.chasseur_id);
                        const elementIcon = ELEMENT_OPTIONS.find(el => 
                          el.id === chasseur.element.toLowerCase() || 
                          (chasseur.chasseur_nom.toLowerCase().includes("jinwoo") && el.id === "jinwoo")
                        );
                        
                        return (
                          <div
                            key={chasseur.chasseur_id}
                            data-chasseur-id={chasseur.chasseur_id}
                            className={`flex-shrink-0 w-32 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                              selectedChasseurId === chasseur.chasseur_id
                                ? 'border-solo-purple shadow-lg shadow-solo-purple/20 scale-105'
                                : 'border-border/50 hover:border-solo-purple/50 hover:shadow-md'
                            }`}
                            style={{ userSelect: 'none' }}
                          >
                            {/* Image du chasseur */}
                            <div className="relative aspect-[3/4] bg-gradient-to-b from-slate-800 to-slate-900">
                              {chasseurRef?.image ? (
                                <img 
                                  src={chasseurRef.image} 
                                  alt={chasseur.chasseur_nom}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Users className="h-12 w-12 text-muted-foreground opacity-30" />
                                </div>
                              )}
                              
                              {/* Badge élément */}
                              {elementIcon?.image && (
                                <div className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm p-1 border border-white/20">
                                  <img 
                                    src={elementIcon.image} 
                                    alt={elementIcon.label}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                            
                            {/* Nom du chasseur */}
                            <div className="p-1.5 bg-card/80 backdrop-blur-sm">
                              <p className="text-xs font-medium text-center truncate">
                                {chasseur.chasseur_nom}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Indicateurs de scroll (dégradés) */}
                  {filteredChasseurs.length > 4 && (
                    <>
                      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-sidebar/80 to-transparent pointer-events-none" />
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-sidebar/80 to-transparent pointer-events-none" />
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Éditeur de builds - Pleine largeur */}
        <div className="w-full max-w-full overflow-hidden">
          {selectedChasseurData ? (
            <ModernBuildEditor
              chasseurData={selectedChasseurData}
              referenceData={referenceData}
              onSave={(buildName: string, buildData: Record<string, unknown>, originalBuildName?: string) => saveBuild(selectedChasseurData.chasseur_id, buildName, buildData, originalBuildName)}
              onDelete={(buildName: string) => removeBuild(selectedChasseurData.chasseur_id, buildName)}
              onEditingChange={setIsEditing}
              onUnsavedChangesChange={setHasUnsavedChanges}
            />
          ) : (
            <Card className="bg-sidebar border-sidebar-border">
              <CardContent className="flex items-center justify-center py-16 sm:py-24">
                <div className="text-center text-muted-foreground space-y-2">
                  <Users className="h-12 w-12 mx-auto opacity-50" />
                  <p className="text-sm">Sélectionnez un chasseur pour commencer</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

      {/* Modal de confirmation pour changement de chasseur */}
      {showChangeConfirm && pendingChasseurId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Modifications non sauvegardées</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Vous avez des modifications non sauvegardées pour ce chasseur. Voulez-vous vraiment changer de chasseur ?
                </p>
                <p className="text-xs text-orange-400">
                  Les modifications seront perdues si vous continuez.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={cancelChasseurChange}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={confirmChasseurChange}
              >
                Abandonner les modifications
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}