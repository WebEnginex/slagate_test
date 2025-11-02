import React, { useState, useEffect } from "react";
import { ChasseurCard } from "./ChasseurCard";
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Trash2, GripVertical, Save, Loader2, AlertTriangle } from "lucide-react";
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
  ELEMENT_ICONS
} from "@/admin/types/teams-chasseurs";

interface ChasseurOption {
  id: number;
  nom: string;
  rarete: string | null;
  element_chasseur: string | null;
  image: string | null;
}

const TeamsChasseursAdmin: React.FC = () => {
  // Fonction de sauvegarde
  const handleSaveAllChanges = async () => {
    setSaving(true);
    try {
      const currentTeam = getCurrentTeam();
      if (!currentTeam) return;
      for (const role of ROLES) {
        const positions = currentTeam[`${role}_positions`] as TeamPosition[];
        // Validation: check for duplicate chasseur_id in same element/role
        const ids = positions.map(p => p.chasseur_id).filter(id => id && id !== 0);
        const hasDuplicates = ids.length !== new Set(ids).size;
        if (hasDuplicates) {
          toast({ title: "Erreur", description: "Un chasseur ne peut pas être assigné plusieurs fois dans le même rôle.", variant: "destructive" });
          setSaving(false);
          return;
        }
        // 1. Reorder positions in DB
        await TeamsChasseursService.reorderPositions(
          activeElement,
          role,
          positions
            .filter(p => !p.id.startsWith('temp-'))
            .map(p => ({
              id: p.id,
              chasseur_id: p.chasseur_id,
              element: activeElement,
              role,
              position: p.position
            }))
        );
        // 2. Upsert each position (add/update chasseur assignment)
        for (const pos of positions) {
          await TeamsChasseursService.upsertTeamPosition({
            chasseur_id: pos.chasseur_id,
            element: activeElement,
            role,
            position: pos.position
          });
        }
      }
      // 3. Delete removed positions
      for (const posId of deletedPositions) {
        if (!posId.startsWith('temp-')) {
          await TeamsChasseursService.deleteTeamPosition(posId);
        }
      }
      setDeletedPositions([]);
      setHasUnsavedChanges(false);
      toast({ title: "Succès", description: "Modifications sauvegardées", variant: "default" });
      // Reload from DB to sync with backend
      await loadElementTeam(activeElement);
    } catch (error) {
      const message = (error instanceof Error && error.message) ? error.message : "Erreur lors de la sauvegarde";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
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

  // Utilitaires
  const getElementIcon = (element: string | null): string => {
    if (!element) return "";
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

  const getFilteredChasseurs = (): ChasseurOption[] => {
    const elementMapping: Record<ElementType, string> = {
      feu: "Feu",
      vent: "Vent",
      lumiere: "Lumière",
      eau: "Eau",
      tenebres: "Ténèbres"
    };
    const expectedElementName = elementMapping[activeElement];
    return availableChasseurs.filter(chasseur => chasseur.element_chasseur === expectedElementName);
  };

  useEffect(() => { loadAvailableChasseurs(); }, []);
  useEffect(() => { loadElementTeam(activeElement); }, [activeElement]);

  const loadAvailableChasseurs = async () => {
    try {
      const chasseurs = await TeamsChasseursService.getAvailableChasseurs();
      setAvailableChasseurs(chasseurs);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger la liste des chasseurs", variant: "destructive" });
    }
  };

  const loadElementTeam = async (element: ElementType) => {
    setLoading(true);
    try {
      const team = await TeamsChasseursService.getElementTeam(element);
      setElementTeam(team);
      setLocalChanges(prev => ({ ...prev, [element]: team }));
    } catch (error) {
      toast({ title: "Erreur", description: `Impossible de charger la team ${ELEMENT_LABELS[element]}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTeam = (): ElementTeam | null => {
    return localChanges[activeElement] || elementTeam;
  };

  const handleAddPosition = (role: RoleType) => {
    const currentTeam = getCurrentTeam();
    if (!currentTeam) return;
    const currentPositions = currentTeam[`${role}_positions` as keyof ElementTeam] as TeamPosition[];
    const usedPositions = currentPositions.map(p => p.position);
    let nextPosition = 1;
    while (usedPositions.includes(nextPosition)) { nextPosition++; }
    const newPosition: TeamPosition = {
      id: `temp-${Date.now()}`,
      chasseur_id: 0,
      position: nextPosition,
      role,
      element: activeElement,
      chasseur: undefined
    };
    const roleKey = `${role}_positions` as keyof ElementTeam;
    const updatedTeam = {
      ...currentTeam,
      [roleKey]: [...currentPositions, newPosition].sort((a, b) => a.position - b.position)
    };
    setLocalChanges(prev => ({ ...prev, [activeElement]: updatedTeam }));
    setHasUnsavedChanges(true);
  };

  const handleChasseurSelection = (chasseurId: number, role: RoleType, position: number) => {
    const currentTeam = getCurrentTeam();
    if (!currentTeam) return;
    const roleKey = `${role}_positions` as keyof ElementTeam;
    const currentPositions = currentTeam[roleKey] as TeamPosition[];
    // Always update the chasseur object when selection changes
    const selectedChasseur = chasseurId !== 0
      ? availableChasseurs.find(c => c.id === chasseurId)
      : undefined;
    const updatedPositions = currentPositions.map(pos => {
      if (pos.position === position) {
        return {
          ...pos,
          chasseur_id: chasseurId,
          chasseur: selectedChasseur
            ? {
                id: selectedChasseur.id,
                nom: selectedChasseur.nom,
                rarete: selectedChasseur.rarete,
                element: selectedChasseur.element_chasseur,
                imageUrl: selectedChasseur.image
              }
            : undefined
        };
      } else {
        return pos;
      }
    });
    const updatedTeam = {
      ...currentTeam,
      [roleKey]: updatedPositions
    };
    setLocalChanges(prev => ({ ...prev, [activeElement]: updatedTeam }));
    setHasUnsavedChanges(true);
  };

  const handleRemovePosition = (positionId: string, role: RoleType) => {
    const currentTeam = getCurrentTeam();
    if (!currentTeam) return;
    const roleKey = `${role}_positions` as keyof ElementTeam;
    const currentPositions = currentTeam[roleKey] as TeamPosition[];
    const updatedPositions = currentPositions.filter(p => p.id !== positionId);
    setDeletedPositions(prev => prev.includes(positionId) ? prev : [...prev, positionId]);
    const updatedTeam = {
      ...currentTeam,
      [roleKey]: updatedPositions
    };
    setLocalChanges(prev => ({ ...prev, [activeElement]: updatedTeam }));
    setHasUnsavedChanges(true);
  };

  // Fonction de rendu pour chaque rôle
  const renderRoleSection = (role: RoleType) => {
    const currentTeam = getCurrentTeam();
    const positions = currentTeam ? (currentTeam[`${role}_positions`] as TeamPosition[]) : [];

    // Arrow-based reordering
    const movePosition = (fromIndex: number, toIndex: number) => {
      if (toIndex < 0 || toIndex >= positions.length) return;
      const sorted = [...positions].sort((a, b) => a.position - b.position);
      const updated = [...sorted];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      // Recalculate positions
      const newPositions = updated.map((p, idx) => ({ ...p, position: idx + 1 }));
      const roleKey = `${role}_positions` as keyof ElementTeam;
      const currentTeam = getCurrentTeam();
      if (!currentTeam) return;
      const updatedTeam = { ...currentTeam, [roleKey]: newPositions };
      setLocalChanges(prev => ({ ...prev, [activeElement]: updatedTeam }));
      setHasUnsavedChanges(true);
    };

  return (
      <Card className="bg-sidebar border-sidebar-border">
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-white">{ROLE_LABELS[role]}</span>
          </div>
          <Button
            onClick={() => handleAddPosition(role)}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700"
            disabled={saving}
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Ajouter</span>
          </Button>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <div className="text-center py-8 text-sidebar-foreground/60">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucun chasseur assigné</p>
              <p className="text-sm">Cliquez sur \"Ajouter\" pour commencer</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {[...positions].sort((a, b) => a.position - b.position).map((pos, index) => (
                <div key={pos.id} id={pos.id} className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-lg border border-sidebar-border">
                  {/* Arrow buttons for reordering */}
                  <div className="flex flex-col gap-1 mr-2">
                    <Button size="icon" variant="ghost" className="text-white" disabled={index === 0} onClick={() => movePosition(index, index - 1)}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3L3 8H13L8 3Z" fill="currentColor"/></svg>
                    </Button>
                    <Button size="icon" variant="ghost" className="text-white" disabled={index === positions.length - 1} onClick={() => movePosition(index, index + 1)}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 13L13 8H3L8 13Z" fill="currentColor"/></svg>
                    </Button>
                  </div>
                  <span className="text-sm font-medium text-white" style={{ minWidth: 70 }}>{index === 0 ? "Optimal" : `Alt. ${index}`}</span>
                  <div className="flex-1">
                    <Select
                      value={pos.chasseur_id?.toString() || "0"}
                      onValueChange={(value) => handleChasseurSelection(Number(value), role, pos.position)}
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
                          getFilteredChasseurs().map((chasseur) => {
                            return (
                              <SelectItem key={chasseur.id} value={chasseur.id.toString()}>
                                <div className="flex items-center gap-2">
                                  {chasseur.image && (
                                    <img src={chasseur.image} alt={chasseur.nom} className="w-6 h-6 rounded-full object-cover" />
                                  )}
                                  <span>{chasseur.nom}</span>
                                  {getElementIcon(chasseur.element_chasseur) ? (
                                    <img src={getElementIcon(chasseur.element_chasseur)} alt={chasseur.element_chasseur || ""} className="w-4 h-4 object-contain" />
                                  ) : null}
                                </div>
                              </SelectItem>
                            );
                          })
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ...existing code...
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Teams Chasseurs</h2>
          <p className="text-sidebar-foreground/70 mt-1">Organisez les chasseurs par élément et par rôle avec leurs alternatives</p>
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
            <TabsTrigger key={element} value={element} className={`flex items-center gap-2 text-sidebar-foreground/80 data-[state=active]:text-white ${ELEMENT_ACTIVE_COLORS[element]} ${ELEMENT_COLORS[element]}`}>
              <img src={ELEMENT_ICONS[element]} alt={ELEMENT_LABELS[element]} className="w-5 h-5 object-contain" />
              {ELEMENT_LABELS[element]}
            </TabsTrigger>
          ))}
        </TabsList>
        {ELEMENTS.map((element) => (
          <TabsContent key={element} value={element} className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-solo-purple" />
                <span className="ml-2 text-sidebar-foreground/70">Chargement de la team {ELEMENT_LABELS[element]}...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {ROLES.map((role) => (
                  <React.Fragment key={role}>
                    {renderRoleSection(role)}
                  </React.Fragment>
                ))}
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

