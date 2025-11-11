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
import { ChasseurTierRow } from "./ChasseurTierRow";
import { ChasseursTierListService, ChasseurForTierList } from "@/admin/services/chasseurs-tier-list-service";
import { GlobalChasseursTierListService } from "@/admin/services/global-chasseurs-tier-list-service";
import { ChasseurCard } from "./ChasseurCard";
import { ChasseurPool } from "./ChasseurPool";

export type TierRank = "SSS" | "SS" | "S" | "A" | "B" | "C" | "D" | "E";

export interface TierData {
  rank: TierRank;
  chasseurs: ChasseurForTierList[];
  color: string;
  label: string;
}

const TIER_COLORS: Record<TierRank, string> = {
  SSS: "bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400",
  SS: "bg-gradient-to-r from-orange-500 to-orange-400",
  S: "bg-gradient-to-r from-red-500 to-red-400",
  A: "bg-gradient-to-r from-purple-500 to-purple-400",
  B: "bg-gradient-to-r from-blue-500 to-blue-400",
  C: "bg-gradient-to-r from-green-500 to-green-400",
  D: "bg-gradient-to-r from-gray-500 to-gray-400",
  E: "bg-gradient-to-r from-gray-600 to-gray-500",
};

export const GlobalChasseursTierList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allChasseurs, setAllChasseurs] = useState<ChasseurForTierList[]>([]);
  const [activeChasseur, setActiveChasseur] = useState<ChasseurForTierList | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Configuration des tiers
  const [tiers, setTiers] = useState<TierData[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Charger les données depuis Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (process.env.NODE_ENV === 'development') {
          console.log("[GlobalTierList] Chargement des chasseurs...");
        }

        // Charger tous les chasseurs
        const chasseurs = await ChasseursTierListService.getAllChasseurs();
        
        if (process.env.NODE_ENV === 'development') {
          console.log("[GlobalTierList] Chasseurs chargés:", chasseurs.length);
        }
        
        // Trier les chasseurs par rareté
        const chasseursTries = chasseurs.sort((a, b) => {
          const rarityOrder = { 'SSR': 1, 'SR': 2, 'R': 3 };
          const rarityA = rarityOrder[a.rarete as keyof typeof rarityOrder] || 99;
          const rarityB = rarityOrder[b.rarete as keyof typeof rarityOrder] || 99;
          
          if (rarityA !== rarityB) {
            return rarityA - rarityB;
          }
          
          return a.nom.localeCompare(b.nom);
        });
        
        setAllChasseurs(chasseursTries);

        // Charger la tier list globale
        const tierListData = await GlobalChasseursTierListService.getTierList();
        
        if (process.env.NODE_ENV === 'development') {
          console.log("[GlobalTierList] Tier list chargée:", tierListData.length, "entrées");
        }

        // Initialiser les tiers
        const tierRanks: TierRank[] = ["SSS", "SS", "S", "A", "B", "C", "D", "E"];
        const initialTiers: TierData[] = tierRanks.map(rank => ({
          rank,
          chasseurs: [],
          color: TIER_COLORS[rank],
          label: rank
        }));

        // Remplir les tiers avec les chasseurs
        tierListData.forEach(entry => {
          const tier = initialTiers.find(t => t.rank === entry.tier);
          const chasseur = chasseursTries.find(c => c.id === entry.chasseur_id);
          
          if (tier && chasseur) {
            tier.chasseurs.push(chasseur);
          }
        });

        // Trier les chasseurs dans chaque tier par position
        initialTiers.forEach(tier => {
          tier.chasseurs.sort((a, b) => {
            const posA = tierListData.find(e => e.chasseur_id === a.id)?.position || 0;
            const posB = tierListData.find(e => e.chasseur_id === b.id)?.position || 0;
            return posA - posB;
          });
        });

        setTiers(initialTiers);
        setLoading(false);

      } catch (err) {
        console.error("[GlobalTierList] Erreur lors du chargement:", err);
        setError("Erreur lors du chargement des données");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Extraire l'ID réel du chasseur depuis le dragId
    let chasseurId: number;
    const dragId = active.id as string;

    if (typeof dragId === 'string' && (dragId.includes('tier-') || dragId.includes('pool-'))) {
      // Format: "tier-S-123" ou "pool-123" -> extraire "123"
      const parts = dragId.split('-');
      chasseurId = parseInt(parts[parts.length - 1]);
    } else {
      chasseurId = typeof dragId === 'number' ? dragId : parseInt(dragId);
    }

    const chasseur = findChasseurById(chasseurId);
    setActiveChasseur(chasseur);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveChasseur(null);

    if (!over) return;

    // Extraire l'ID réel du chasseur depuis le dragId
    let activeId: number;
    const dragId = active.id as string;

    if (typeof dragId === 'string' && (dragId.includes('tier-') || dragId.includes('pool-'))) {
      // Format: "tier-S-123" ou "pool-123" -> extraire "123"
      const parts = dragId.split('-');
      activeId = parseInt(parts[parts.length - 1]);
    } else {
      activeId = typeof dragId === 'number' ? dragId : parseInt(dragId);
    }

    const overId = over.id as string;

    if (process.env.NODE_ENV === 'development') {
      console.log("[GlobalTierList] Drag & Drop - Active ID:", activeId, "Over ID:", overId);
    }

    // Gérer le retour au pool
    if (overId === "pool") {
      if (process.env.NODE_ENV === 'development') {
        console.log("[GlobalTierList] Retrait vers pool");
      }

      setTiers(prevTiers =>
        prevTiers.map(tier => ({
          ...tier,
          chasseurs: tier.chasseurs.filter(c => c.id !== activeId)
        }))
      );
      return;
    }

    // Déterminer le tier cible
    let targetTier: TierRank | null = null;

    if (overId.startsWith("tier-") && !overId.includes("-", overId.indexOf("-") + 1)) {
      // Zone de drop tier (tier-S) vs élément draggable (tier-S-123)
      targetTier = overId.replace("tier-", "") as TierRank;
    } else if (overId.startsWith("tier-")) {
      // Déposé sur un chasseur dans un tier (tier-S-123)
      const parts = overId.split('-');
      if (parts.length >= 2) {
        targetTier = parts[1] as TierRank;
      }
    }

    if (!targetTier) {
      if (process.env.NODE_ENV === 'development') {
        console.log("[GlobalTierList] Tier cible non trouvé");
      }
      return;
    }

    const activeChasseur = findChasseurById(activeId);
    if (!activeChasseur) {
      if (process.env.NODE_ENV === 'development') {
        console.log("[GlobalTierList] Chasseur actif non trouvé");
      }
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log("[GlobalTierList] Déplacement vers tier:", targetTier);
    }

    setTiers(prevTiers => {
      const newTiers = prevTiers.map(tier => ({
        ...tier,
        chasseurs: [...tier.chasseurs]
      }));

      // Retirer le chasseur de tous les tiers
      newTiers.forEach(tier => {
        tier.chasseurs = tier.chasseurs.filter(c => c.id !== activeId);
      });

      // Ajouter le chasseur au tier cible
      const targetTierData = newTiers.find(t => t.rank === targetTier);
      if (targetTierData) {
        if (overId.startsWith("tier-") && !overId.includes("-", overId.indexOf("-") + 1)) {
          // Déposé sur la zone de drop du tier
          targetTierData.chasseurs.push(activeChasseur);
        } else {
          // Déposé sur un chasseur spécifique
          const overChasseurId = parseInt(overId.split('-')[overId.split('-').length - 1]);
          const overIndex = targetTierData.chasseurs.findIndex(c => c.id === overChasseurId);
          if (overIndex !== -1) {
            targetTierData.chasseurs.splice(overIndex, 0, activeChasseur);
          } else {
            targetTierData.chasseurs.push(activeChasseur);
          }
        }
      }

      return newTiers;
    });
  };

  const findChasseurById = (id: number): ChasseurForTierList | null => {
    return allChasseurs.find(c => c.id === id) || null;
  };

  const findTierByChasseurId = (chasseurId: number): TierRank | null => {
    for (const tier of tiers) {
      if (tier.chasseurs.some(c => c.id === chasseurId)) {
        return tier.rank;
      }
    }
    return null;
  };

  const getAvailableChasseurs = (): ChasseurForTierList[] => {
    const usedIds = new Set(tiers.flatMap(tier => tier.chasseurs.map(c => c.id)));
    return allChasseurs.filter(c => !usedIds.has(c.id));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSaveSuccess(false);

      if (process.env.NODE_ENV === 'development') {
        console.log("[GlobalTierList] Sauvegarde de la tier list...");
      }

      // Sauvegarder chaque tier
      for (const tier of tiers) {
        const chasseurIds = tier.chasseurs.map(c => c.id);
        await GlobalChasseursTierListService.reorderChasseurs(tier.rank, chasseurIds);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log("[GlobalTierList] Tier list sauvegardée avec succès");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (err) {
      console.error("[GlobalTierList] Erreur lors de la sauvegarde:", err);
      setError("Erreur lors de la sauvegarde de la tier list");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des chasseurs...</span>
      </div>
    );
  }

  if (error && tiers.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const availableChasseurs = getAvailableChasseurs();

  return (
    <div className="space-y-6">
      {/* Header avec bouton de sauvegarde */}
      <Card className="bg-sidebar border-sidebar-border rounded-xl shadow-md">
        <CardHeader className="bg-sidebar-accent py-3 sm:py-4 px-3 sm:px-5 border-b border-sidebar-border">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">🌍 Tier List Globale</span>
              <span className="text-xs sm:text-sm text-gray-400">
                ({tiers.reduce((sum, tier) => sum + tier.chasseurs.length, 0)} chasseurs classés)
              </span>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-solo-purple hover:bg-solo-purple/80 px-4 py-2 rounded-lg shadow-md text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        {(error || saveSuccess) && (
          <CardContent className="p-3 sm:p-4">
            {error && (
              <Alert variant="destructive" className="mb-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {saveSuccess && (
              <Alert className="bg-green-500/20 border-green-500/40 mb-2">
                <AlertDescription className="text-green-200">
                  ✅ Tier list sauvegardée avec succès !
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        )}
      </Card>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Pool de chasseurs disponibles */}
        <SortableContext
          items={availableChasseurs.map(c => `pool-${c.id}`)}
          strategy={verticalListSortingStrategy}
        >
          <ChasseurPool chasseurs={availableChasseurs} category="Globaux" />
        </SortableContext>

        {/* Tiers */}
        <div className="space-y-4">
          {tiers.map((tier) => (
            <SortableContext
              key={tier.rank}
              items={tier.chasseurs.map(c => `tier-${tier.rank}-${c.id}`)}
              strategy={horizontalListSortingStrategy}
            >
              <ChasseurTierRow tier={tier} />
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeChasseur ? <ChasseurCard chasseur={activeChasseur} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

