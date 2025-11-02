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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ChasseurTierRow } from "./ChasseurTierRow";
import { ChasseursTierListService, ChasseurForTierList } from "@/admin/services/chasseurs-tier-list-service";
import { ChasseurCard } from "./ChasseurCard";
import { ChasseurPool } from "./ChasseurPool";
// Import temporaires désactivés en attendant la correction des types
// import { ChasseurPool } from "./ChasseurPool.tsx";
// import { ChasseurCard } from "./ChasseurCard.tsx";

export type TierRank = "SSS" | "SS" | "S" | "A" | "B" | "C" | "D" | "E";
export type ChasseurCategory = "breakers" | "dps" | "supports" | "collab";

export interface TierData {
  rank: TierRank;
  chasseurs: ChasseurForTierList[];
  color: string;
  label: string;
}

interface CategoryData {
  category: ChasseurCategory;
  label: string;
  description: string;
  tiers: TierData[];
}

export const ChasseursTierList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allChasseurs, setAllChasseurs] = useState<ChasseurForTierList[]>([]);
  const [activeChasseur, setActiveChasseur] = useState<ChasseurForTierList | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ChasseurCategory>("breakers");

  // Configuration des catégories avec leurs tier lists
  const [categories, setCategories] = useState<CategoryData[]>([]);

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
          console.log("Chargement des chasseurs...");
        }
        // Charger tous les chasseurs
        const chasseurs = await ChasseursTierListService.getAllChasseurs();
        if (process.env.NODE_ENV === 'development') {
          console.log("Chasseurs chargés:", chasseurs.length);
        }
        
        // Trier les chasseurs par rareté (SSR > SR > R > autres)
        const chasseursTries = chasseurs.sort((a, b) => {
          const rarityOrder = { 'SSR': 1, 'SR': 2, 'R': 3 };
          const rarityA = rarityOrder[a.rarete as keyof typeof rarityOrder] || 99;
          const rarityB = rarityOrder[b.rarete as keyof typeof rarityOrder] || 99;
          
          if (rarityA !== rarityB) {
            return rarityA - rarityB;
          }
          
          // Si même rareté, trier par nom
          return a.nom.localeCompare(b.nom);
        });
        
        setAllChasseurs(chasseursTries);

        // Charger les tier lists pour chaque catégorie
        const initialCategories = [
          {
            category: "breakers" as ChasseurCategory,
            label: "Breakers",
            description: "Chasseurs spécialisés dans la destruction des gardes ennemies",
            tiers: [
              { rank: "SSS" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-yellow-400 to-yellow-600", label: "SSS" },
              { rank: "SS" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-yellow-500 to-orange-500", label: "SS" },
              { rank: "S" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-red-500 to-red-600", label: "S" },
              { rank: "A" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-green-500 to-green-600", label: "A" },
              { rank: "B" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-blue-500 to-blue-600", label: "B" },
              { rank: "C" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-purple-500 to-purple-600", label: "C" },
              { rank: "D" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-gray-500 to-gray-600", label: "D" },
              { rank: "E" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-gray-600 to-gray-700", label: "E" }
            ]
          },
          {
            category: "dps" as ChasseurCategory,
            label: "DPS",
            description: "Chasseurs orientés dégâts pour maximiser les dommages infligés",
            tiers: [
              { rank: "SSS" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-yellow-400 to-yellow-600", label: "SSS" },
              { rank: "SS" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-yellow-500 to-orange-500", label: "SS" },
              { rank: "S" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-red-500 to-red-600", label: "S" },
              { rank: "A" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-green-500 to-green-600", label: "A" },
              { rank: "B" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-blue-500 to-blue-600", label: "B" },
              { rank: "C" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-purple-500 to-purple-600", label: "C" },
              { rank: "D" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-gray-500 to-gray-600", label: "D" },
              { rank: "E" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-gray-600 to-gray-700", label: "E" }
            ]
          },
          {
            category: "supports" as ChasseurCategory,
            label: "Supports",
            description: "Chasseurs de soutien pour buff l'équipe et débuff les ennemis",
            tiers: [
              { rank: "SSS" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-yellow-400 to-yellow-600", label: "SSS" },
              { rank: "SS" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-yellow-500 to-orange-500", label: "SS" },
              { rank: "S" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-red-500 to-red-600", label: "S" },
              { rank: "A" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-green-500 to-green-600", label: "A" },
              { rank: "B" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-blue-500 to-blue-600", label: "B" },
              { rank: "C" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-purple-500 to-purple-600", label: "C" },
              { rank: "D" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-gray-500 to-gray-600", label: "D" },
              { rank: "E" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-gray-600 to-gray-700", label: "E" }
            ]
          },
          {
            category: "collab" as ChasseurCategory,
            label: "Collaborations",
            description: "Chasseurs issus d'événements de collaboration spéciaux",
            tiers: [
              { rank: "SSS" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-yellow-400 to-yellow-600", label: "SSS" },
              { rank: "SS" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-yellow-500 to-orange-500", label: "SS" },
              { rank: "S" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-red-500 to-red-600", label: "S" },
              { rank: "A" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-green-500 to-green-600", label: "A" },
              { rank: "B" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-blue-500 to-blue-600", label: "B" },
              { rank: "C" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-purple-500 to-purple-600", label: "C" },
              { rank: "D" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-gray-500 to-gray-600", label: "D" },
              { rank: "E" as TierRank, chasseurs: [], color: "bg-gradient-to-r from-gray-600 to-gray-700", label: "E" }
            ]
          }
        ];

        // Charger les tier lists pour chaque catégorie en une seule fois
        const categoriesWithData = await Promise.all(
          initialCategories.map(async (category) => {
            const tierListData = await ChasseursTierListService.getTierListByCategory(category.category);
            if (process.env.NODE_ENV === 'development') {
              console.log(`Tier list data pour ${category.category}:`, tierListData);
            }
            
            // Organiser les chasseurs par tier
            const updatedTiers = category.tiers.map(tier => ({
              ...tier,
              chasseurs: tierListData
                .filter(item => item.tier === tier.rank)
                .sort((a, b) => a.position - b.position)
                .map(item => chasseurs.find(c => c.id === item.chasseur_id))
                .filter(Boolean) as ChasseurForTierList[]
            }));

            return {
              ...category,
              tiers: updatedTiers
            };
          })
        );

        // Mettre à jour une seule fois avec toutes les données
        setCategories(categoriesWithData);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Suppression de la dépendance circulaire

  // Obtenir les chasseurs non classés (pas assignés à aucune catégorie)
  const getUnrankedChasseurs = () => {
    // Collecter tous les chasseurs assignés dans toutes les catégories
    const allRankedChasseurIds = new Set<number>();
    
    categories.forEach(category => {
      category.tiers.forEach(tier => {
        tier.chasseurs.forEach(chasseur => {
          allRankedChasseurIds.add(chasseur.id);
          if (process.env.NODE_ENV === 'development') {
            console.log(`Chasseur ${chasseur.nom} (ID: ${chasseur.id}) assigné à ${category.category} tier ${tier.rank}`);
          }
        });
      });
    });

    const unranked = allChasseurs.filter(chasseur => !allRankedChasseurIds.has(chasseur.id));
    if (process.env.NODE_ENV === 'development') {
      console.log(`Chasseurs non classés pour ${activeCategory}:`, unranked.length, 'sur', allChasseurs.length);
    }
    
    return unranked;
  };

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

  const handleDragEnd = async (event: DragEndEvent) => {
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

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log("Drag & Drop - Active ID:", activeId, "Over ID:", overId);
      }
      
      // Distinguer les zones de drop des éléments draggables
      if (overId === "pool") {
        if (process.env.NODE_ENV === 'development') {
          console.log("Retrait vers pool");
        }
        await removeChasseurFromTier(activeId);
      } else if (overId.startsWith("tier-") && !overId.includes("-", overId.indexOf("-") + 1)) {
        // Zone de drop tier (tier-S) vs élément draggable (tier-S-123)
        const targetRank = overId.replace("tier-", "") as TierRank;
        if (process.env.NODE_ENV === 'development') {
          console.log("Déplacement vers tier:", targetRank);
        }
        await moveChasseurToTier(activeId, targetRank);
      } else if (overId.startsWith("tier-") || overId.startsWith("pool-")) {
        // Réorganisation : déposé sur un autre chasseur
        if (process.env.NODE_ENV === 'development') {
          console.log("Réorganisation dans tier");
        }
        const targetChasseurId = parseInt(overId.split('-').pop() || '0');
        await reorderChasseursInTier(activeId, targetChasseurId);
      }
    } catch (err) {
      console.error("Erreur lors du déplacement:", err);
      setError("Erreur lors de la mise à jour");
    }
  };

  const moveChasseurToTier = async (chasseurId: number, targetRank: TierRank) => {
    const chasseur = findChasseurById(chasseurId);
    if (!chasseur) return;

    setCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.category === activeCategory) {
          // Catégorie active : ajouter au tier de destination et retirer des autres tiers
          const updatedTiers = category.tiers.map(tier => {
            if (tier.rank === targetRank) {
              // Ajouter au nouveau tier (s'il n'y est pas déjà)
              const isAlreadyInTier = tier.chasseurs.some(c => c.id === chasseurId);
              return {
                ...tier,
                chasseurs: isAlreadyInTier ? tier.chasseurs : [chasseur, ...tier.chasseurs]
              };
            } else {
              // Retirer des autres tiers de cette catégorie
              return {
                ...tier,
                chasseurs: tier.chasseurs.filter(c => c.id !== chasseurId)
              };
            }
          });
          return { ...category, tiers: updatedTiers };
        } else {
          // Autres catégories : retirer le chasseur de tous les tiers
          const updatedTiers = category.tiers.map(tier => ({
            ...tier,
            chasseurs: tier.chasseurs.filter(c => c.id !== chasseurId)
          }));
          return { ...category, tiers: updatedTiers };
        }
      })
    );

    // Supprimer de toutes les autres catégories en base
    const allCategories: ChasseurCategory[] = ["breakers", "dps", "supports", "collab"];
    const otherCategories = allCategories.filter(cat => cat !== activeCategory);
    
    // Supprimer des autres catégories
    for (const category of otherCategories) {
      await ChasseursTierListService.removeChasseurFromTier(chasseurId, category);
    }

    // Sauvegarder dans la nouvelle catégorie
    await ChasseursTierListService.updateChasseurTier(chasseurId, activeCategory, targetRank, 0);
  };

  const removeChasseurFromTier = async (chasseurId: number) => {
    setCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.category !== activeCategory) return category;

        const updatedTiers = category.tiers.map(tier => ({
          ...tier,
          chasseurs: tier.chasseurs.filter(c => c.id !== chasseurId)
        }));

        return { ...category, tiers: updatedTiers };
      })
    );

    // Supprimer seulement de la catégorie active en base
    await ChasseursTierListService.removeChasseurFromTier(chasseurId, activeCategory);
  };

  const reorderChasseursInTier = async (activeId: number, targetId: number) => {
    const currentCategory = categories.find(cat => cat.category === activeCategory);
    if (!currentCategory) return;

    for (const tier of currentCategory.tiers) {
      const activeIndex = tier.chasseurs.findIndex(c => c.id === activeId);
      const targetIndex = tier.chasseurs.findIndex(c => c.id === targetId);

      if (activeIndex !== -1 && targetIndex !== -1) {
        const newChasseurs = arrayMove(tier.chasseurs, activeIndex, targetIndex);
        
        setCategories(prevCategories => 
          prevCategories.map(category => ({
            ...category,
            tiers: category.tiers.map(t => 
              t.rank === tier.rank 
                ? { ...t, chasseurs: newChasseurs }
                : t
            )
          }))
        );

        // Sauvegarder les nouvelles positions
        await ChasseursTierListService.reorderChasseurs(
          activeCategory,
          tier.rank,
          newChasseurs.map(c => c.id)
        );
        break;
      }
    }
  };

  const findChasseurById = (id: number): ChasseurForTierList | null => {
    // Chercher dans tous les chasseurs
    return allChasseurs.find(c => c.id === id) || null;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const currentCategory = categories.find(cat => cat.category === activeCategory);
      if (!currentCategory) {
        throw new Error("Catégorie non trouvée");
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`Sauvegarde de la tier list pour la catégorie: ${activeCategory}`);
      }
      
      // Préparer les données à sauvegarder pour la catégorie active
      // Note: Les chasseurs sont déjà supprimés des autres catégories lors des déplacements
      const savePromises = [];
      
      for (const tier of currentCategory.tiers) {
        for (let index = 0; index < tier.chasseurs.length; index++) {
          const chasseur = tier.chasseurs[index];
          savePromises.push(
            ChasseursTierListService.updateChasseurTier(
              chasseur.id,
              activeCategory,
              tier.rank,
              index
            )
          );
        }
      }

      // Exécuter toutes les sauvegardes en parallèle
      await Promise.all(savePromises);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Tier list sauvegardée avec succès pour ${activeCategory}`);
      }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      setError("Erreur lors de la sauvegarde de la tier list");
    } finally {
      setSaving(false);
    }
  };

  const clearAllData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les tier lists ? Cette action est irréversible.")) {
      const categories: ChasseurCategory[] = ["breakers", "dps", "supports", "collab"];
      categories.forEach(cat => {
        localStorage.removeItem(`tier_list_chasseurs_${cat}`);
      });
      
      // Recharger la page pour refaire le chargement des données
      window.location.reload();
    }
  };  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des chasseurs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const currentCategory = categories.find(cat => cat.category === activeCategory);
  const unrankedChasseurs = getUnrankedChasseurs();

  return (
    <div className="space-y-6">
      {/* Onglets des catégories */}
      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as ChasseurCategory)}>
        <TabsList className="grid w-full grid-cols-4 bg-sidebar-accent border-sidebar-border">
          {categories.map(category => (
            <TabsTrigger 
              key={category.category} 
              value={category.category}
              className="data-[state=active]:bg-solo-purple data-[state=active]:text-white"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.category} value={category.category} className="space-y-6">
            {/* Bouton de sauvegarde - Style page publique */}
            <Card className="bg-sidebar border-sidebar-border rounded-xl shadow-md">
              <CardHeader className="bg-sidebar-accent py-3 sm:py-4 px-3 sm:px-5 border-b border-sidebar-border">
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <Save className="h-5 w-5" />
                    <span className="text-xl sm:text-2xl font-bold">Sauvegarder - {category.label}</span>
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700"
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
                </CardTitle>
              </CardHeader>
              {saveSuccess && (
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="p-3 bg-green-900/30 border border-green-500/40 rounded-lg text-green-400 text-sm">
                    ✓ Tier list sauvegardée avec succès pour {category.label} !
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Debug - Bouton de reset (visible uniquement en développement) */}
            {process.env.NODE_ENV === 'development' && (
              <Card className="bg-sidebar border-sidebar-border rounded-xl shadow-md">
                <CardHeader className="bg-red-900/20 py-3 sm:py-4 px-3 sm:px-5 border-b border-red-500/40">
                  <CardTitle className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-red-400">⚠️ Debug - Réinitialiser</span>
                    </div>
                    <Button
                      onClick={clearAllData}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md text-white"
                    >
                      Réinitialiser toutes les tier lists
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <p className="text-sm text-gray-400">
                    Si vous voyez des chasseurs dupliqués entre les catégories, utilisez ce bouton pour nettoyer les données corrompues.
                  </p>
                </CardContent>
              </Card>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              {/* Pool des chasseurs disponibles - en haut pour faciliter le drag & drop */}
              <SortableContext
                items={unrankedChasseurs.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <ChasseurPool
                  chasseurs={unrankedChasseurs}
                  category={category.label}
                />
              </SortableContext>

              {/* Tier List */}
              <div className="space-y-4">
                {category.tiers.map(tier => (
                  <SortableContext
                    key={tier.rank}
                    items={tier.chasseurs.map(c => c.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <ChasseurTierRow
                      tier={tier}
                    />
                  </SortableContext>
                ))}
              </div>

              {/* Overlay pour le drag & drop */}
              <DragOverlay>
                {activeChasseur ? (
                  <ChasseurCard chasseur={activeChasseur} />
                ) : null}
              </DragOverlay>
            </DndContext>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};