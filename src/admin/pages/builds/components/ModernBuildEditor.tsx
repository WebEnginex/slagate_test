import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Plus, Trash2, Eye, AlertTriangle } from 'lucide-react';

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
    <div className="flex flex-col">
      <span className="font-medium text-sm">{nom}</span>
      <span className="text-xs text-muted-foreground">#{id}</span>
    </div>
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

export default function BuildEditor({ chasseurData, referenceData, onSave, onDelete }: BuildEditorProps) {
  const [editingBuild, setEditingBuild] = useState<string | null>(null);
  const [originalBuildName, setOriginalBuildName] = useState<string | null>(null); // Pour traquer l'ancien nom lors du renommage
  const [formData, setFormData] = useState<BuildFormData | null>(null);
  const [newBuildName, setNewBuildName] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    }
  };

  // Sauvegarder le build
  const saveBuild = async () => {
    if (!formData || !editingBuild) return;
    
    try {
      setSaving(true);
      setErrorMessage(null);
      
      // Exclure le champ "nom" redondant des données à sauvegarder
      const { nom, ...buildDataWithoutNom } = formData;
      
      // Passer l'ancien nom si le build est renommé
      const oldName = (originalBuildName && originalBuildName !== editingBuild) ? originalBuildName : undefined;
      
      await onSave(editingBuild, buildDataWithoutNom as BuildFormData, oldName);
      
      // Si la sauvegarde réussit, on peut réinitialiser
      setEditingBuild(null);
      setOriginalBuildName(null);
      setFormData(null);
      
    } catch (error) {
      // En cas d'erreur, on garde le formulaire et on affiche l'erreur
      const errorMsg = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
      setErrorMessage(errorMsg);
      console.error('❌ Erreur sauvegarde build:', error);
    } finally {
      setSaving(false);
    }
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingBuild(null);
    setOriginalBuildName(null);
    setFormData(null);
    setNewBuildName('');
    setErrorMessage(null);
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
                            onClick={() => onDelete(buildName)}
                          >
                            <Trash2 className="h-3 w-3" />
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
            
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList>
                <TabsTrigger value="general">Général</TabsTrigger>
                <TabsTrigger value="stats">Statistiques</TabsTrigger>
                <TabsTrigger value="artefacts">Artefacts</TabsTrigger>
                <TabsTrigger value="noyaux">Noyaux</TabsTrigger>
                <TabsTrigger value="sets">Sets Bonus</TabsTrigger>
              </TabsList>

              {/* Onglet Général */}
              <TabsContent value="general" className="space-y-4">
                <div>
                  <Label htmlFor="buildName">Nom du build</Label>
                  <Input
                    id="buildName"
                    value={editingBuild || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingBuild(e.target.value)}
                    placeholder="Ex: Général, POD, PvP..."
                  />
                </div>
              </TabsContent>

              {/* Onglet Statistiques */}
              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {STATS_PRINCIPALES.map(stat => (
                    <div key={stat}>
                      <Label>{stat}</Label>
                      <Input
                        value={formData.stats[stat] || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({
                          ...formData,
                          stats: {...formData.stats, [stat]: e.target.value}
                        })}
                        placeholder="Valeur"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Onglet Artefacts */}
              <TabsContent value="artefacts" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SLOTS_ARTEFACTS.map(slot => {
                    const artefactsRecord = formData.artefacts as Record<string, { id: number; statPrincipale: string } | undefined>;
                    return (
                    <Card key={slot} className="p-4">
                      <h4 className="font-medium mb-2 capitalize">{slot}</h4>
                      <div className="space-y-2">
                        <div>
                          <Label>Artefact</Label>
                          <Select
                            value={artefactsRecord[slot]?.id?.toString() || ''}
                            onValueChange={(value) => {
                              const artefactId = parseInt(value);
                              const selectedArtefact = referenceData?.artefacts.find(a => a.id === artefactId);
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
                              selectedItem={
                                artefactsRecord[slot]?.id 
                                  ? referenceData?.artefacts.find(a => a.id === artefactsRecord[slot]!.id)
                                  : undefined
                              }
                              placeholder={`Choisir un ${slot}`}
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
                        </div>
                        <div>
                          <Label>Stat Principale</Label>
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
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir une stat" />
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
              <TabsContent value="noyaux" className="space-y-4">
                <div className="space-y-4">
                  {[1, 2, 3].map(slotNumber => (
                    <Card key={slotNumber} className="p-4">
                      <h4 className="font-medium mb-3">Slot {slotNumber}</h4>
                      <div className="space-y-2">
                        {(formData?.noyaux[slotNumber.toString()] || []).map((noyau, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <div className="flex-1">
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
                                  selectedItem={
                                    noyau.id 
                                      ? referenceData?.noyaux.find(n => n.id === noyau.id)
                                      : undefined
                                  }
                                  placeholder="Choisir un noyau"
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
                            </div>
                            <div className="flex-1">
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
                                <SelectTrigger>
                                  <SelectValue placeholder="Stat Principale" />
                                </SelectTrigger>
                                <SelectContent>
                                  {(NOYAUX_STATS_PAR_SLOT[slotNumber] || []).map(stat => (
                                    <SelectItem key={stat} value={stat}>{stat}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const newNoyaux = { ...formData?.noyaux };
                                newNoyaux[slotNumber.toString()].splice(index, 1);
                                setFormData({ ...formData!, noyaux: newNoyaux });
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
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
                          <Plus className="h-3 w-3 mr-1" />
                          Ajouter Noyau
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Onglet Sets Bonus */}
              <TabsContent value="sets" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Sets Bonus</Label>
                    <div className="space-y-2 mt-2">
                      {(formData?.sets_bonus || []).map((set, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <div className="flex-1">
                            <Select
                              value={set.id?.toString() || ''}
                              onValueChange={(value: string) => {
                                const setId = parseInt(value);
                                const newSets = [...(formData?.sets_bonus || [])];
                                newSets[index] = { id: setId };
                                setFormData({ ...formData!, sets_bonus: newSets });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Choisir un set bonus" />
                              </SelectTrigger>
                              <SelectContent>
                                {referenceData?.setsBonus.map(setRef => (
                                  <SelectItem key={setRef.id} value={setRef.id.toString()}>
                                    {setRef.nom} (#{setRef.id})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {set.id && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {getSetBonusName(set.id)}
                              </p>
                            )}
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
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newSets = [...(formData?.sets_bonus || []), { id: 0 }];
                          setFormData({ ...formData!, sets_bonus: newSets });
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Ajouter Set
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}