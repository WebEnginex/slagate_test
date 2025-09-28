import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Save, Download, Upload, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
// Layout géré par AdminLayout, pas besoin d'import
import { BuildsSupabaseService } from './services/buildsSupabaseService';
import { ReferenceDataManager } from '../../utils/referenceDataManager';
import { BuildEditor } from './components/BuildEditor';
import { ChasseurSelector } from './components/ChasseurSelector';
import ModernBuildEditor from './components/ModernBuildEditor';
import type { ChasseurBuild, EditorReferenceData, BuildValidationResult } from '../../types';

const buildsService = new BuildsSupabaseService();

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
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [validationResult, setValidationResult] = useState<BuildValidationResult | null>(null);
  
  // États pour le filtrage des chasseurs
  const [elementFilter, setElementFilter] = useState<string>("tous");
  const [showJinwooOnly, setShowJinwooOnly] = useState(false);

  // Filtrage des chasseurs
  const filteredChasseurs = React.useMemo(() => {
    let filtered = chasseurs;
    
    // Filtrage spécial pour Sung Jinwoo
    if (elementFilter === "jinwoo") {
      filtered = chasseurs.filter(c => 
        c.chasseur_nom.toLowerCase().includes("jinwoo") || 
        c.chasseur_nom.toLowerCase().includes("sung")
      );
    } else if (elementFilter !== "tous") {
      filtered = chasseurs.filter(c => c.element.toLowerCase() === elementFilter);
    }
    
    return filtered;
  }, [chasseurs, elementFilter]);

  const loadReferenceData = React.useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des données de référence depuis Supabase...');
      const data = await ReferenceDataManager.loadAllReferenceData();
      setReferenceData(data);
      console.log('✅ Données de référence chargées:', {
        chasseurs: data.chasseurs.length,
        artefacts: data.artefacts.length,
        noyaux: data.noyaux.length,
        setsBonus: data.setsBonus.length
      });
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      showMessage('error', `Erreur lors du chargement des données de référence: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadChasseurs = React.useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des chasseurs depuis Supabase...');
      const data = await buildsService.getAllChasseurs();
      console.log('✅ Chasseurs chargés:', data);
      setChasseurs(data);
      if (data.length === 0) {
        showMessage('warning', 'Aucun chasseur trouvé dans la base de données');
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des chasseurs:', error);
      showMessage('error', `Erreur lors du chargement des chasseurs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Chargement des données
  useEffect(() => {
    loadReferenceData();
    loadChasseurs();
  }, [loadReferenceData, loadChasseurs]);

  const showMessage = (type: 'success' | 'error' | 'warning', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

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

  // Sauvegarde d'un build spécifique
  const saveBuild = async (chasseurId: number, buildName: string, buildData: Record<string, unknown>, originalBuildName?: string) => {
    try {
      setSaving(true);
      
      // Valider le build
      const buildErrors = buildsService.validateBuildData(buildData);
      if (buildErrors.length > 0) {
        const errorMessage = `Validation échouée: ${buildErrors.join(', ')}`;
        showMessage('error', errorMessage);
        throw new Error(errorMessage);
      }

      // Sauvegarder dans Supabase (avec gestion du renommage)
      await buildsService.saveChasseurBuild(chasseurId, buildName, buildData, originalBuildName);
      
      // Recharger les chasseurs
      await loadChasseurs();
      
      showMessage('success', 'Build sauvegardé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // Ne pas afficher de message ici car l'erreur sera gérée par ModernBuildEditor
      throw error; // Re-lancer l'erreur pour qu'elle remonte
    } finally {
      setSaving(false);
    }
  };

  // Sélectionner un chasseur pour l'édition
  const selectChasseur = (chasseurId: number) => {
    setSelectedChasseurId(chasseurId);
  };

  // Suppression d'un build de chasseur 
  const removeChasseurBuild = async (chasseurId: number, buildName: string) => {
    try {
      await buildsService.deleteChasseurBuild(chasseurId, buildName);
      await loadChasseurs();
      showMessage('success', 'Build supprimé avec succès !');
    } catch (error) {
      console.error('Erreur suppression build:', error);
      showMessage('error', 'Erreur lors de la suppression');
    }
  };

  // Alias pour la fonction de suppression
  const removeBuild = removeChasseurBuild;

  const selectedChasseurData = chasseurs.find(c => c.chasseur_id === selectedChasseurId);
  const selectedChasseur = referenceData?.chasseurs.find(c => c.id === selectedChasseurId);

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Administration des Builds</h1>
            <p className="text-muted-foreground">
              Gestion des configurations de chasseurs
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={validateBuilds}
              variant="outline"
              disabled={loading}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Valider
            </Button>
            
            <Button
              onClick={() => loadChasseurs()}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{chasseurs.length}</div>
                <div className="text-sm text-muted-foreground">Chasseurs configurés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {chasseurs.reduce((acc, chasseur) => {
                    const builds = (chasseur.builds_data as { builds?: Record<string, unknown> })?.builds || {};
                    return acc + Object.keys(builds).length;
                  }, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Builds totaux</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {referenceData?.chasseurs.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Chasseurs disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {referenceData?.artefacts.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Artefacts disponibles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        {message && (
          <Alert className={message.type === 'error' ? 'border-destructive' : message.type === 'warning' ? 'border-yellow-500' : 'border-green-500'}>
            {message.type === 'error' ? (
              <AlertTriangle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Résultats de validation */}
        {validationResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {validationResult.isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                Résultats de la validation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Badge variant={validationResult.isValid ? "default" : "destructive"}>
                    {validationResult.isValid ? "Valide" : "Invalide"}
                  </Badge>
                  <Badge variant="outline">
                    {validationResult.errors.length} erreur(s)
                  </Badge>
                  <Badge variant="outline">
                    {validationResult.warnings.length} avertissement(s)
                  </Badge>
                </div>

                {validationResult.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Erreurs:</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      {validationResult.errors.slice(0, 10).map((error, i) => (
                        <li key={i} className="text-sm text-red-600">{error}</li>
                      ))}
                    </ul>
                    {validationResult.errors.length > 10 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        ... et {validationResult.errors.length - 10} autres erreurs
                      </p>
                    )}
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-yellow-600 mb-2">Avertissements:</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      {validationResult.warnings.slice(0, 5).map((warning, i) => (
                        <li key={i} className="text-sm text-yellow-600">{warning}</li>
                      ))}
                    </ul>
                    {validationResult.warnings.length > 5 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        ... et {validationResult.warnings.length - 5} autres avertissements
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interface principale */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Sélection et filtrage des chasseurs */}
          <div className="xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Sélection du chasseur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filtre par élément avec boutons visuels */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Filtrer par élément
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {ELEMENT_OPTIONS.map(option => (
                      <button
                        key={option.id}
                        onClick={() => setElementFilter(option.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105 ${
                          elementFilter === option.id
                            ? 'bg-primary border-primary text-primary-foreground shadow-lg'
                            : 'bg-background border-border hover:bg-accent'
                        }`}
                      >
                        {option.image && (
                          <img 
                            src={option.image} 
                            alt={option.label}
                            className="w-5 h-5 rounded object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sélection du chasseur */}
                <div>
                  <Label htmlFor="chasseur-select" className="text-sm font-medium">
                    Chasseur ({filteredChasseurs.length} disponible{filteredChasseurs.length > 1 ? 's' : ''})
                  </Label>
                  
                  {filteredChasseurs.length === 0 ? (
                    <p className="text-muted-foreground text-sm mt-2">
                      Aucun chasseur trouvé pour ce filtre
                    </p>
                  ) : (
                    <Select 
                      value={selectedChasseurId?.toString() || ""} 
                      onValueChange={(value) => setSelectedChasseurId(parseInt(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir un chasseur">
                          {selectedChasseurId && (
                            <ChasseurItem 
                              chasseur={chasseurs.find(c => c.chasseur_id === selectedChasseurId)!}
                              referenceData={referenceData}
                            />
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {filteredChasseurs.map(chasseur => (
                          <SelectItem 
                            key={chasseur.chasseur_id} 
                            value={chasseur.chasseur_id.toString()}
                            className="py-3"
                          >
                            <ChasseurItem 
                              chasseur={chasseur}
                              referenceData={referenceData}
                            />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Éditeur de builds moderne */}
          <div className="xl:col-span-2">
            {selectedChasseurData ? (
              <ModernBuildEditor
                chasseurData={selectedChasseurData}
                referenceData={referenceData}
                onSave={(buildName: string, buildData: Record<string, unknown>, originalBuildName?: string) => saveBuild(selectedChasseurData.chasseur_id, buildName, buildData, originalBuildName)}
                onDelete={(buildName: string) => removeBuild(selectedChasseurData.chasseur_id, buildName)}
              />
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center min-h-96">
                  <div className="text-center text-muted-foreground">
                    <p>Sélectionnez un chasseur pour commencer l'édition des builds</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

    </div>
  );
}