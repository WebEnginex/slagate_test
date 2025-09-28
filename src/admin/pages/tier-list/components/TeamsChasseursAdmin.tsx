import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Users, 
  Plus, 
  Trash2, 
  GripVertical, 
  Save,
  Loader2,
  AlertTriangle 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { TeamsChasseursService } from "@/admin/services/teams-chasseurs-service";
import {
  ElementType,
  RoleType,
  ElementTeam,
  TeamPosition,
  ELEMENTS,
  ROLES,
  ELEMENT_LABELS,
  ROLE_LABELS,
  ELEMENT_COLORS,
  ELEMENT_ACTIVE_COLORS,
  ELEMENT_ICONS,
  ROLE_ICONS
} from "@/admin/types/teams-chasseurs";

interface ChasseurOption {
  id: number;
  nom: string;
  rarete: string | null;
  element_chasseur: string | null;
  image: string | null;
}

const TeamsChasseursAdmin: React.FC = () => {
  const [activeElement, setActiveElement] = useState<ElementType>("feu");
  const [elementTeam, setElementTeam] = useState<ElementTeam | null>(null);
  const [localChanges, setLocalChanges] = useState<Record<ElementType, ElementTeam | null>>({
    feu: null,
    vent: null,
    lumiere: null,
    eau: null,
    tenebres: null
  });
  const [deletedPositions, setDeletedPositions] = useState<string[]>([]);
  const [availableChasseurs, setAvailableChasseurs] = useState<ChasseurOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fonction pour obtenir l'icône d'élément (URL de l'image)
  const getElementIcon = (element: string | null): string => {
    if (!element) return "";
    
    // Mapping des noms d'éléments vers les clés ElementType
    const elementMapping: Record<string, ElementType> = {
      "Feu": "feu",
      "Vent": "vent", 
      "Lumière": "lumiere",
      "Eau": "eau",
      "Ténèbres": "tenebres"
    };
    
    const elementKey = elementMapping[element];
    return elementKey ? ELEMENT_ICONS[elementKey] : "";
  };

  // Fonction pour filtrer les chasseurs par élément
  const getFilteredChasseurs = (): ChasseurOption[] => {
    console.log("Élément actif:", activeElement);
    console.log("Tous les chasseurs disponibles:", availableChasseurs.map(c => ({ nom: c.nom, element_chasseur: c.element_chasseur })));
    
    const elementMapping: Record<ElementType, string> = {
      feu: "Feu",
      vent: "Vent", 
      lumiere: "Lumière",
      eau: "Eau",
      tenebres: "Ténèbres"
    };
    
    const expectedElementName = elementMapping[activeElement];
    const filtered = availableChasseurs.filter(chasseur => 
      chasseur.element_chasseur === expectedElementName
    );
    
    console.log(`Chasseurs filtrés pour ${expectedElementName}:`, filtered.map(c => c.nom));
    return filtered;
  };

  // Charger les chasseurs disponibles au montage du composant
  useEffect(() => {
    loadAvailableChasseurs();
  }, []);

  // Charger la team de l'élément actif
  useEffect(() => {
    loadElementTeam(activeElement);
  }, [activeElement]);

  const loadAvailableChasseurs = async () => {
    try {
      const chasseurs = await TeamsChasseursService.getAvailableChasseurs();
      console.log("Chasseurs chargés:", chasseurs);
      setAvailableChasseurs(chasseurs);
    } catch (error) {
      console.error("Erreur lors du chargement des chasseurs:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la liste des chasseurs",
        variant: "destructive"
      });
    }
  };

  const loadElementTeam = async (element: ElementType) => {
    setLoading(true);
    try {
      // Charger depuis la base de données
      const team = await TeamsChasseursService.getElementTeam(element);
      setElementTeam(team);
      
      // Initialiser les changements locaux si pas encore fait
      setLocalChanges(prev => ({
        ...prev,
        [element]: team
      }));
    } catch (error) {
      console.error("Erreur lors du chargement de la team:", error);
      toast({
        title: "Erreur",
        description: `Impossible de charger la team ${ELEMENT_LABELS[element]}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Récupérer la team actuelle (locale ou originale)
  const getCurrentTeam = (): ElementTeam | null => {
    return localChanges[activeElement] || elementTeam;
  };

  const handleAddPosition = (role: RoleType) => {
    const currentTeam = getCurrentTeam();
    if (!currentTeam) return;
    
    const currentPositions = currentTeam[`${role}_positions` as keyof ElementTeam] as TeamPosition[];
    const nextPosition = currentPositions.length + 1;

    // Créer une nouvelle position vide
    const newPosition: TeamPosition = {
      id: `temp-${Date.now()}`, // ID temporaire
      chasseur_id: 0, // Pas encore de chasseur sélectionné
      position: nextPosition,
      role,
      element: activeElement,
      chasseur: undefined
    };

    const roleKey = `${role}_positions` as keyof ElementTeam;
    const updatedTeam = {
      ...currentTeam,
      [roleKey]: [...currentPositions, newPosition]
    };
    
    // Sauvegarder les changements locaux
    setLocalChanges(prev => ({
      ...prev,
      [activeElement]: updatedTeam
    }));
    
    setHasUnsavedChanges(true);
  };

  const handleChasseurSelection = async (
    role: RoleType, 
    position: number, 
    chasseurId: string
  ) => {
    if (!chasseurId || chasseurId === "0") return;
    
    const chasseurIdNum = parseInt(chasseurId);
    const currentTeam = getCurrentTeam();
    if (!currentTeam) return;
    
    // Trouver le chasseur sélectionné
    const selectedChasseur = availableChasseurs.find(c => c.id === chasseurIdNum);
    if (!selectedChasseur) return;

    // Mettre à jour localement
    const roleKey = `${role}_positions` as keyof ElementTeam;
    const currentPositions = currentTeam[roleKey] as TeamPosition[];
    
    // Trouver la position à modifier ou en créer une nouvelle
    const updatedPositions = [...currentPositions];
    const existingIndex = updatedPositions.findIndex(p => p.position === position);
    
    const newPosition: TeamPosition = {
      id: existingIndex >= 0 ? updatedPositions[existingIndex].id : `temp-${Date.now()}`,
      chasseur_id: chasseurIdNum,
      position,
      role,
      element: activeElement,
      chasseur: {
        id: selectedChasseur.id,
        nom: selectedChasseur.nom,
        rarete: selectedChasseur.rarete,
        element: selectedChasseur.element_chasseur,
        imageUrl: selectedChasseur.image
      }
    };
    
    if (existingIndex >= 0) {
      updatedPositions[existingIndex] = newPosition;
    } else {
      updatedPositions.push(newPosition);
    }
    
    // Trier par position
    updatedPositions.sort((a, b) => a.position - b.position);
    
    const updatedTeam = {
      ...currentTeam,
      [roleKey]: updatedPositions
    };
    
    // Sauvegarder les changements locaux
    setLocalChanges(prev => ({
      ...prev,
      [activeElement]: updatedTeam
    }));
    
    setHasUnsavedChanges(true);
      
    toast({
      title: "Modification enregistrée",
      description: "N'oubliez pas de sauvegarder vos changements",
      variant: "default"
    });
  };

  const handleSaveAllChanges = async () => {
    setSaving(true);
    try {
      console.log("🔄 Début de la sauvegarde...");
      console.log("Changements locaux:", localChanges);
      console.log("Positions à supprimer:", deletedPositions);
      
      // 1. D'abord, supprimer les positions marquées pour suppression
      if (deletedPositions.length > 0) {
        console.log(`🗑️ Suppression de ${deletedPositions.length} positions...`);
        for (const positionId of deletedPositions) {
          try {
            await TeamsChasseursService.deleteTeamPosition(positionId);
            console.log(`    ✅ Position ${positionId} supprimée avec succès`);
          } catch (deleteError) {
            console.error(`    ❌ Erreur suppression position ${positionId}:`, deleteError);
            throw deleteError;
          }
        }
      }
      
      // 2. Ensuite, sauvegarder tous les changements locaux pour tous les éléments
      const elementsWithChanges = Object.entries(localChanges).filter(([_, team]) => team !== null);
      console.log("Éléments avec changements:", elementsWithChanges.map(([element, _]) => element));
      
      for (const [element, team] of elementsWithChanges) {
        if (team) {
          console.log(`💾 Sauvegarde de l'élément ${element}...`);
          
          // Sauvegarder chaque position pour cet élément
          const allRoles: RoleType[] = ['breaker', 'support', 'dps'];
          
          for (const role of allRoles) {
            const positions = team[`${role}_positions` as keyof ElementTeam] as TeamPosition[];
            console.log(`  📝 Rôle ${role}: ${positions.length} positions`);
            
            for (const position of positions) {
              if (position.chasseur_id > 0) { // Ignorer les positions vides
                console.log(`    ⭐ Sauvegarde position:`, {
                  chasseur_id: position.chasseur_id,
                  element: element,
                  role: position.role,
                  position: position.position
                });
                
                try {
                  await TeamsChasseursService.upsertTeamPosition({
                    chasseur_id: position.chasseur_id,
                    element: element as ElementType,
                    role: position.role,
                    position: position.position
                  });
                  console.log(`    ✅ Position sauvegardée avec succès`);
                } catch (positionError) {
                  console.error(`    ❌ Erreur sauvegarde position:`, positionError);
                  throw positionError;
                }
              }
            }
          }
        }
      }
      
      // Recharger la team actuelle depuis la base de données
      await loadElementTeam(activeElement);
      setHasUnsavedChanges(false);
      
      // Réinitialiser les changements locaux et les suppressions
      setLocalChanges({
        feu: null,
        vent: null,
        lumiere: null,
        eau: null,
        tenebres: null
      });
      setDeletedPositions([]);
      
      toast({
        title: "Succès",
        description: "Toutes les modifications ont été sauvegardées"
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePosition = (positionId: string, role: RoleType) => {
    const currentTeam = getCurrentTeam();
    if (!currentTeam) return;

    const roleKey = `${role}_positions` as keyof ElementTeam;
    const currentPositions = currentTeam[roleKey] as TeamPosition[];
    const updatedPositions = currentPositions.filter(p => p.id !== positionId);
    
    // Ajouter l'ID à la liste des suppressions si ce n'est pas déjà fait
    setDeletedPositions(prev => {
      if (!prev.includes(positionId)) {
        return [...prev, positionId];
      }
      return prev;
    });
    
    const updatedTeam = {
      ...currentTeam,
      [roleKey]: updatedPositions
    };
    
    // Sauvegarder les changements locaux
    setLocalChanges(prev => ({
      ...prev,
      [activeElement]: updatedTeam
    }));
    
    setHasUnsavedChanges(true);
    
    toast({
      title: "Position supprimée",
      description: "N'oubliez pas de sauvegarder vos changements",
      variant: "default"
    });
  };

  const renderRoleSection = (role: RoleType) => {
    const currentTeam = getCurrentTeam();
    if (!currentTeam) return null;

    const positions = currentTeam[`${role}_positions` as keyof ElementTeam] as TeamPosition[];
    
    return (
      <Card key={role} className="bg-sidebar border-sidebar-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">{ROLE_ICONS[role]}</span>
              <span>{ROLE_LABELS[role]}</span>
            </div>
            <Button
              onClick={() => handleAddPosition(role)}
              size="sm"
              variant="outline"
              className="border-solo-purple text-solo-purple hover:bg-solo-purple hover:text-white"
              disabled={saving}
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {positions.length === 0 ? (
            <div className="text-center py-8 text-sidebar-foreground/60">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucun chasseur assigné</p>
              <p className="text-sm">Cliquez sur "Ajouter" pour commencer</p>
            </div>
          ) : (
            positions
              .sort((a, b) => a.position - b.position)
              .map((pos, index) => (
                <div
                  key={pos.id}
                  className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-lg border border-sidebar-border"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-sidebar-foreground/40" />
                    <span className="text-sm font-medium text-white">
                      {index === 0 ? "Optimal" : `Alt. ${index}`}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <Select
                      value={pos.chasseur_id?.toString() || "0"}
                      onValueChange={(value) => handleChasseurSelection(role, pos.position, value)}
                      disabled={saving}
                    >
                      <SelectTrigger className="w-full bg-sidebar border-sidebar-border text-white">
                        <SelectValue placeholder="Sélectionner un chasseur..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Aucun chasseur sélectionné</SelectItem>
                        {getFilteredChasseurs().length === 0 ? (
                          <div className="px-2 py-1 text-sm text-muted-foreground">
                            Aucun chasseur {ELEMENT_LABELS[activeElement]} disponible
                          </div>
                        ) : (
                          getFilteredChasseurs().map((chasseur) => (
                            <SelectItem key={chasseur.id} value={chasseur.id.toString()}>
                              <div className="flex items-center gap-2">
                                {chasseur.image && (
                                  <img 
                                    src={chasseur.image} 
                                    alt={chasseur.nom}
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                )}
                                <span>{chasseur.nom}</span>
                                {getElementIcon(chasseur.element_chasseur) && (
                                  <img
                                    src={getElementIcon(chasseur.element_chasseur)}
                                    alt={chasseur.element_chasseur || ""}
                                    className="w-4 h-4 object-contain"
                                  />
                                )}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => handleRemovePosition(pos.id, role)}
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    disabled={saving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Teams Chasseurs</h2>
          <p className="text-sidebar-foreground/70 mt-1">
            Organisez les chasseurs par élément et par rôle avec leurs alternatives
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Modifications non sauvegardées</span>
            </div>
          )}
          <Button
            onClick={handleSaveAllChanges}
            disabled={saving || !hasUnsavedChanges}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeElement} onValueChange={(value) => setActiveElement(value as ElementType)}>
        <TabsList className="grid w-full grid-cols-5 bg-sidebar-accent">
          {ELEMENTS.map((element) => (
            <TabsTrigger 
              key={element}
              value={element}
              className={`flex items-center gap-2 text-sidebar-foreground/80 data-[state=active]:text-white ${ELEMENT_ACTIVE_COLORS[element]} ${ELEMENT_COLORS[element]}`}
            >
              <img 
                src={ELEMENT_ICONS[element]} 
                alt={ELEMENT_LABELS[element]}
                className="w-5 h-5 object-contain"
              />
              {ELEMENT_LABELS[element]}
            </TabsTrigger>
          ))}
        </TabsList>

        {ELEMENTS.map((element) => (
          <TabsContent key={element} value={element} className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-solo-purple" />
                <span className="ml-2 text-sidebar-foreground/70">
                  Chargement de la team {ELEMENT_LABELS[element]}...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {ROLES.map((role) => renderRoleSection(role))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {saving && (
        <div className="fixed bottom-4 right-4 bg-solo-purple text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Sauvegarde en cours...</span>
        </div>
      )}
    </div>
  );
};

export default TeamsChasseursAdmin;