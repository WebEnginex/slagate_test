import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { TierListService, ArmeForTierList } from "@/admin/services/tier-list-service";
import { TierRow } from "./TierRow.tsx";
import { WeaponPool } from "./WeaponPool.tsx";
import { WeaponCard } from "./WeaponCard.tsx";

export type TierRank = "SSS" | "SS" | "S" | "A" | "B" | "C" | "D" | "E";

export interface TierData {
  rank: TierRank;
  weapons: ArmeForTierList[];
  color: string;
  label: string;
}

export const WeaponsTierList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allWeapons, setAllWeapons] = useState<ArmeForTierList[]>([]);
  const [activeWeapon, setActiveWeapon] = useState<ArmeForTierList | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [tiers, setTiers] = useState<TierData[]>([
    { rank: "SSS", weapons: [], color: "bg-gradient-to-r from-yellow-400 to-yellow-600", label: "SSS - Légendaire" },
    { rank: "SS", weapons: [], color: "bg-gradient-to-r from-yellow-500 to-orange-500", label: "SS - Mythique" },
    { rank: "S", weapons: [], color: "bg-gradient-to-r from-red-500 to-red-600", label: "S - Épique" },
    { rank: "A", weapons: [], color: "bg-gradient-to-r from-green-500 to-green-600", label: "A - Rare" },
    { rank: "B", weapons: [], color: "bg-gradient-to-r from-blue-500 to-blue-600", label: "B - Inhabituel" },
    { rank: "C", weapons: [], color: "bg-gradient-to-r from-purple-500 to-purple-600", label: "C - Commun" },
    { rank: "D", weapons: [], color: "bg-gradient-to-r from-gray-500 to-gray-600", label: "D - Basique" },
  ]);

  // Capteurs pour le drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Charger les armes au montage du composant
  useEffect(() => {
    loadWeapons();
  }, []);

  const loadWeapons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger toutes les armes
      const weapons = await TierListService.getAllWeapons();
      setAllWeapons(weapons);

      // Vérifier s'il existe une tier list sauvegardée
      const hasSaved = await TierListService.hasSavedTierList();
      if (hasSaved) {
        // Charger la tier list sauvegardée
        const savedTierList = await TierListService.getSavedTierList();
        
        // Mettre à jour les tiers avec les données sauvegardées
        setTiers(prev => prev.map(tier => ({
          ...tier,
          weapons: savedTierList[tier.rank] || []
        })));
      }
    } catch (err) {
      setError("Erreur lors du chargement des armes");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculer les armes disponibles (non assignées à des tiers)
  const getAvailableWeapons = (): ArmeForTierList[] => {
    const usedWeaponIds = new Set<number>();
    
    // Collecter tous les IDs des armes déjà dans les tiers
    tiers.forEach(tier => {
      tier.weapons.forEach(weapon => {
        usedWeaponIds.add(weapon.id);
      });
    });
    
    // Retourner les armes non utilisées
    return allWeapons.filter(weapon => !usedWeaponIds.has(weapon.id));
  };

  const availableWeapons = getAvailableWeapons();

  // Fonction de sauvegarde de la tier list
  const saveTierList = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      // Préparer les données pour la sauvegarde
      const tierData: { [tier: string]: number[] } = {};
      tiers.forEach(tier => {
        tierData[tier.rank] = tier.weapons.map(weapon => weapon.id);
      });

      // Sauvegarder en base de données
      await TierListService.saveTierList(tierData);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      console.log('Tier list sauvegardée avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde de la tier list');
    } finally {
      setSaving(false);
    }
  };

  // Gestion du début du drag
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    // Chercher l'arme dans les tiers
    let foundWeapon: ArmeForTierList | null = null;
    
    for (const tier of tiers) {
      foundWeapon = tier.weapons.find(w => `tier-${tier.rank}-${w.id}` === active.id) || null;
      if (foundWeapon) break;
    }
    
    // Si pas trouvé dans les tiers, chercher dans le pool disponible
    if (!foundWeapon) {
      foundWeapon = availableWeapons.find(w => `pool-${w.id}` === active.id) || null;
    }
    
    setActiveWeapon(foundWeapon);
  };

  // Gestion de la fin du drag
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveWeapon(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    console.log('Drag End - Active:', activeId, 'Over:', overId);

    // Parsing des IDs
    const activeIdParts = activeId.split('-');
    const activePrefix = activeIdParts[0]; // 'tier' ou 'pool'
    const activeTierRank = activePrefix === 'tier' ? activeIdParts[1] : null;
    const activeWeaponId = parseInt(activeIdParts[activeIdParts.length - 1]);

    const overIdParts = overId.split('-');
    const overPrefix = overIdParts[0];
    const overTierRank = overPrefix === 'tier' ? overIdParts[1] as TierRank : null;

    // Cas 1: Réordonnancement dans le même tier
    if (activePrefix === 'tier' && overPrefix === 'tier' && activeTierRank === overTierRank && activeId !== overId) {
      const overWeaponId = parseInt(overIdParts[overIdParts.length - 1]);
      reorderWeaponInTier(activeWeaponId, overWeaponId, activeTierRank as TierRank);
    }
    // Cas 2: Déplacement vers un autre tier
    else if (overPrefix === 'tier' && overTierRank && activeTierRank !== overTierRank) {
      moveWeaponToTier(activeWeaponId, activeTierRank as TierRank | null, overTierRank);
    }
    // Cas 3: Déplacement vers le pool
    else if (overId === 'weapon-pool' && activePrefix === 'tier' && activeTierRank) {
      moveWeaponToPool(activeWeaponId, activeTierRank as TierRank);
    }
    // Cas 4: Déplacement du pool vers un tier (drop sur la zone du tier)
    else if (activePrefix === 'pool' && overTierRank) {
      moveWeaponToTier(activeWeaponId, null, overTierRank);
    }

    setActiveWeapon(null);
  };

  // Déplacer une arme vers un tier
  const moveWeaponToTier = (weaponId: number, fromTier: TierRank | null, toTier: TierRank) => {
    let weaponToMove: ArmeForTierList | null = null;

    // Retirer l'arme de sa position actuelle
    if (fromTier) {
      // Depuis un autre tier
      setTiers(prev => prev.map(tier => {
        if (tier.rank === fromTier) {
          const weapon = tier.weapons.find(w => w.id === weaponId);
          if (weapon) weaponToMove = weapon;
          return {
            ...tier,
            weapons: tier.weapons.filter(w => w.id !== weaponId)
          };
        }
        return tier;
      }));
    } else {
      // Depuis le pool disponible
      const weapon = availableWeapons.find(w => w.id === weaponId);
      if (weapon) {
        weaponToMove = weapon;
        // Pas besoin de modifier availableWeapons, il se recalcule automatiquement
      }
    }

    // Ajouter l'arme au tier de destination
    if (weaponToMove) {
      setTiers(prev => prev.map(tier => {
        if (tier.rank === toTier) {
          return {
            ...tier,
            weapons: [...tier.weapons, weaponToMove!]
          };
        }
        return tier;
      }));
    }
  };

  // Déplacer une arme vers le pool
  const moveWeaponToPool = (weaponId: number, fromTier: TierRank) => {
    let weaponToMove: ArmeForTierList | null = null;

    // Retirer l'arme du tier
    setTiers(prev => prev.map(tier => {
      if (tier.rank === fromTier) {
        const weapon = tier.weapons.find(w => w.id === weaponId);
        if (weapon) weaponToMove = weapon;
        return {
          ...tier,
          weapons: tier.weapons.filter(w => w.id !== weaponId)
        };
      }
      return tier;
    }));

    // L'arme sera automatiquement disponible dans le pool
    // grâce à la fonction getAvailableWeapons()
  };

  // Réordonner les armes dans un même tier
  const reorderWeaponInTier = (activeWeaponId: number, overWeaponId: number, tierRank: TierRank) => {
    setTiers(prev => prev.map(tier => {
      if (tier.rank === tierRank) {
        const weapons = [...tier.weapons];
        const activeIndex = weapons.findIndex(w => w.id === activeWeaponId);
        const overIndex = weapons.findIndex(w => w.id === overWeaponId);

        if (activeIndex !== -1 && overIndex !== -1) {
          // Utiliser arrayMove pour réorganiser
          const reorderedWeapons = arrayMove(weapons, activeIndex, overIndex);
          return {
            ...tier,
            weapons: reorderedWeapons
          };
        }
      }
      return tier;
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Chargement des armes...
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {/* En-tête avec bouton de sauvegarde - Style minimaliste */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Tier List des Armes</h2>
            <p className="text-sidebar-foreground/70 mt-1">
              Organisez les armes par niveau de performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <div className="flex items-center gap-2 text-green-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Sauvegardé !</span>
              </div>
            )}
            <Button
              onClick={saveTierList}
              disabled={saving}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                  <span className="hidden sm:inline">Sauvegarde...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sauvegarder</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Pool d'armes disponibles en haut */}
        <WeaponPool weapons={availableWeapons} />



        {/* Tiers - Espacement comme la page publique */}
        <div className="space-y-8">
          {tiers.map((tier) => (
            <TierRow key={tier.rank} tier={tier} />
          ))}
        </div>

        {/* Overlay pendant le drag */}
        <DragOverlay>
          {activeWeapon ? (
            <WeaponCard weapon={activeWeapon} isDragging={true} />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};