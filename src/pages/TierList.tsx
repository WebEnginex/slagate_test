import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { weaponTiers } from "@/config/tier-list/armes";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import LastModified from "@/components/LastModified";
import { lastModifiedDates } from "@/config/last-modification-date/lastModifiedDates";
import SEO from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { useSupabaseFetch } from "@/lib";
import LazyImage from "@/lib/lazy";
import { TierListService, ArmeForTierList } from "@/admin/services/tier-list-service";
import TeamsChasseursPublic from "@/components/TeamsChasseursPublic";
import type { PublicArmeForTierList } from "@/services/public-armes-tier-list-service";

// Couleurs des tiers utilisées dans le dashboard
const TIER_COLORS = {
  "SSS": "bg-gradient-to-r from-yellow-400 to-yellow-600",
  "SS": "bg-gradient-to-r from-yellow-500 to-orange-500", 
  "S": "bg-gradient-to-r from-red-500 to-red-600",
  "A": "bg-gradient-to-r from-green-500 to-green-600",
  "B": "bg-gradient-to-r from-blue-500 to-blue-600",
  "C": "bg-gradient-to-r from-purple-500 to-purple-600",
  "D": "bg-gradient-to-r from-gray-500 to-gray-600",
  "E": "bg-gradient-to-r from-gray-600 to-gray-700"
};

// Mapping des éléments vers les vraies images du storage Supabase
const getElementImageUrl = (element: string | null): string | null => {
  if (!element) return null;
  
  // Mapping exact des éléments de votre base de données (avec majuscules et accents)
  const elementMap: Record<string, string> = {
    "Feu": "Feu_element.webp",
    "Eau": "Eau_element.webp", 
    "Vent": "Vent_element.webp",
    "Lumière": "Lumiere_element.webp",
    "Ténèbres": "Tenebre_element.webp"
  };
  
  const filename = elementMap[element.trim()];
  return filename 
    ? `https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/${filename}`
    : null;
};

// Types Supabase
type Chasseur = Database["public"]["Tables"]["chasseurs"]["Row"];
type Arme = Database["public"]["Tables"]["jinwoo_armes"]["Row"];
type Jinwoo = Database["public"]["Tables"]["jinwoo"]["Row"];

// Constante pour identifier cette page dans le système de logs
const PAGE_ID = "TierList";

const tabs = [
  "Chasseurs",
  "Armes",
  "Teams Chasseurs",
];

export default function TierListPage() {
  const isMobile = useIsMobile();

  return (
    <Layout>
      {/* Ajout du composant SEO */}
      <SEO
        title="Tier List - Solo Leveling: ARISE"
        description="Découvrez les meilleures tier lists pour Solo Leveling: ARISE. Trouvez les meilleurs chasseurs, armes et compositions d'équipes pour dominer le jeu."
        keywords="Solo Leveling, ARISE, tier list, chasseurs, armes, équipes, compositions, SLAGATE"
      />
      <div className="container mx-auto px-4 py-6 text-white">
        <div className="mb-6 space-y-2">
          <div className="bg-sidebar-accent p-6 rounded-lg shadow-md space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-violet-400 text-center md:text-left">
              Bienvenue sur la page Tier List !
            </h1>
            <p className="text-base md:text-lg text-gray-300 text-center md:text-left">
              Ici, vous trouverez les meilleurs chasseurs, les meilleures armes
              pour Sung Jinwoo, et les meilleures compositions d'équipes pour
              dominer tous les contenus du jeu.
            </p>
            <p className="text-base md:text-lg text-gray-300 text-center md:text-left">
              Explorez les différentes catégories pour découvrir les équipes les
              plus performantes, qu'il s'agisse de compositions optimisées pour
              la "Puissance de Destruction" ou pour affronter le redoutable Boss
              de Guilde.
            </p>
            <p className="text-base md:text-lg text-gray-300 text-center md:text-left">
              Que vous cherchiez à optimiser vos équipes ou à découvrir les
              chasseurs les plus puissants, cette section est faite pour vous
              guider.
            </p>
            {/* Dernières modifications */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400 italic">
                <span className="text-white font-medium">
                  <LastModified date={lastModifiedDates.tierList} />
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Tabs navigation avec design amélioré */}
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="bg-sidebar-accent border border-sidebar-border mb-8 w-full sm:w-auto">
            <TabsTrigger
              value="global"
              className="data-[state=active]:bg-solo-purple data-[state=active]:text-white"
            >
              Global
            </TabsTrigger>
            <TabsTrigger
              value="chasseurs"
              className="data-[state=active]:bg-solo-purple data-[state=active]:text-white"
            >
              Chasseurs
            </TabsTrigger>
            <TabsTrigger
              value="armes"
              className="data-[state=active]:bg-solo-purple data-[state=active]:text-white"
            >
              Armes
            </TabsTrigger>
            <TabsTrigger
              value="teams"
              className="data-[state=active]:bg-solo-purple data-[state=active]:text-white"
            >
              Teams Chasseurs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-0">
            <GlobalHuntersTab />
          </TabsContent>

          <TabsContent value="chasseurs" className="mt-0">
            <HuntersTab />
          </TabsContent>

          <TabsContent value="armes" className="mt-0">
            <WeaponsTab />
          </TabsContent>

          <TabsContent value="teams" className="mt-0">
            <TeamsChasseursPublic />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

// Composant pour l'onglet global - Affiche la tier list globale
function GlobalHuntersTab() {
  const { data: globalTierListData, loading } = useSupabaseFetch(
    "global-chasseurs-tier-list",
    async () => {
      const { PublicGlobalChasseursTierListService } = await import("@/services/public-global-chasseurs-tier-list-service");
      return PublicGlobalChasseursTierListService.getGlobalTierList();
    }
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <Users className="h-8 w-8 mx-auto mb-2 animate-pulse" />
          <p>Chargement de la tier list globale...</p>
        </div>
      </div>
    );
  }

  if (!globalTierListData || globalTierListData.length === 0) {
    return (
      <div className="text-center py-8 text-sidebar-foreground/60">
        <p>Aucune tier list globale configurée</p>
      </div>
    );
  }

  // Ordre correct des tiers
  const tierOrder = ["SSS", "SS", "S", "A", "B", "C", "D", "E"];

  // Regrouper par tier
  const chasseursParTier = globalTierListData.reduce((acc: Record<string, typeof globalTierListData>, chasseur) => {
    if (!acc[chasseur.tier]) acc[chasseur.tier] = [];
    acc[chasseur.tier].push(chasseur);
    return acc;
  }, {});

  // Trier les tiers dans l'ordre correct
  const sortedTiers = tierOrder.filter(tier => chasseursParTier[tier]?.length > 0);

  return (
    <div className="space-y-8">
      {sortedTiers.map((tier) => (
        <div key={tier} className="bg-sidebar border-sidebar-border overflow-hidden rounded-xl shadow-md">
          {/* Header du tier - Style dashboard */}
          <div className="bg-sidebar-accent py-3 sm:py-4 px-3 sm:px-5 border-b border-sidebar-border">
            <div className={`${TIER_COLORS[tier] || "bg-gray-500"} text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xl sm:text-2xl inline-block`}>
              {tier}
            </div>
          </div>

          {/* Contenu du tier */}
          <div className="p-3 sm:p-4 md:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {chasseursParTier[tier]
                .sort((a, b) => a.position - b.position)
                .map((chasseur) => (
                  <div key={`${chasseur.id}-${tier}`} className="relative flex flex-col items-center">
                    {/* Élément au-dessus de la carte, sans fond */}
                    {getElementImageUrl(chasseur.element) && (
                      <div className="absolute top-1 left-1 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 z-10 bg-transparent">
                        <img
                          src={getElementImageUrl(chasseur.element)!}
                          alt={chasseur.element || "Element"}
                          className="w-full h-full object-contain filter drop-shadow-sm"
                          style={{ backgroundColor: 'transparent', border: 'none' }}
                        />
                      </div>
                    )}
                    <div className="bg-sidebar-accent p-2 sm:p-3 rounded-lg text-center hover:bg-sidebar-accent/80 transition-colors w-full flex flex-col items-center">
                      <LazyImage
                        src={chasseur.imageUrl || "/placeholder.svg"}
                        alt={chasseur.nom}
                        className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg object-cover mb-2"
                      />
                      <p className="text-xs sm:text-sm font-medium text-white break-words w-full">{chasseur.nom}</p>
                      {chasseur.rarete && (
                        <p className="text-xs text-sidebar-foreground/70">{chasseur.rarete}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Composant pour l'onglet des chasseurs - Affiche les tier lists du dashboard
function HuntersTab() {
  const [activeCategory, setActiveCategory] = useState<"breakers" | "dps" | "supports" | "collab">("breakers");
  
  const { data: tierListData, loading } = useSupabaseFetch(
    "chasseurs-tier-lists",
    async () => {
      const { PublicChasseursTierListService } = await import("@/services/public-chasseurs-tier-list-service");
      return PublicChasseursTierListService.getAllTierLists();
    }
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <Users className="h-8 w-8 mx-auto mb-2 animate-pulse" />
          <p>Chargement des tier lists...</p>
        </div>
      </div>
    );
  }

  if (!tierListData) {
    return (
      <div className="text-center py-8 text-sidebar-foreground/60">
        <p>Aucune tier list configurée</p>
      </div>
    );
  }

  const categories = [
    { key: "breakers" as const, label: "Breakers", icon: "🛡️" },
    { key: "dps" as const, label: "DPS", icon: "⚔️" },
    { key: "supports" as const, label: "Support", icon: "❤️" },
    { key: "collab" as const, label: "Collaboration", icon: "🤝" }
  ];

  // Ordre correct des tiers
  const tierOrder = ["SSS", "SS", "S", "A", "B", "C", "D", "E"];

  const currentChasseursData = tierListData[activeCategory] || [];

  // Regrouper par tier
  const chasseursParTier = currentChasseursData.reduce((acc: Record<string, typeof currentChasseursData>, chasseur) => {
    if (!acc[chasseur.tier]) acc[chasseur.tier] = [];
    acc[chasseur.tier].push(chasseur);
    return acc;
  }, {});

  // Trier les tiers dans l'ordre correct
  const sortedTiers = tierOrder.filter(tier => chasseursParTier[tier]?.length > 0);

  return (
    <div className="space-y-6">
      {/* Onglets de catégories avec style amélioré */}
      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as "breakers" | "dps" | "supports" | "collab")}>
        <TabsList className="bg-sidebar-accent border border-sidebar-border">
          {categories.map((category) => (
            <TabsTrigger
              key={category.key}
              value={category.key}
              className="data-[state=active]:bg-solo-purple data-[state=active]:text-white flex items-center gap-2"
            >
              <span>{category.icon}</span>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Contenu de la catégorie active */}
      {currentChasseursData.length === 0 ? (
        <div className="text-center py-8 text-sidebar-foreground/60">
          <p>Aucun chasseur dans cette catégorie</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedTiers.map((tier) => (
            <div key={tier} className="bg-sidebar border-sidebar-border overflow-hidden rounded-xl shadow-md">
              {/* Header du tier - Style dashboard */}
              <div className="bg-sidebar-accent py-3 sm:py-4 px-3 sm:px-5 border-b border-sidebar-border">
                <div className={`${TIER_COLORS[tier] || "bg-gray-500"} text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xl sm:text-2xl inline-block`}>
                  {tier}
                </div>
              </div>
              
              {/* Contenu du tier */}
              <div className="p-3 sm:p-4 md:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {chasseursParTier[tier]
                    .sort((a, b) => a.position - b.position)
                    .map((chasseur) => (
                      <div key={`${chasseur.id}-${tier}`} className="relative flex flex-col items-center">
                        {/* Élément au-dessus de la carte, sans fond */}
                        {getElementImageUrl(chasseur.element) && (
                          <div className="absolute top-1 left-1 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 z-10 bg-transparent">
                            <img
                              src={getElementImageUrl(chasseur.element)!}
                              alt={chasseur.element || "Element"}
                              className="w-full h-full object-contain filter drop-shadow-sm"
                              style={{ backgroundColor: 'transparent', border: 'none' }}
                            />
                          </div>
                        )}
                        <div className="bg-sidebar-accent p-2 sm:p-3 rounded-lg text-center hover:bg-sidebar-accent/80 transition-colors w-full flex flex-col items-center">
                          <LazyImage
                            src={chasseur.imageUrl || "/placeholder.svg"}
                            alt={chasseur.nom}
                            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg object-cover mb-2"
                          />
                          <p className="text-xs sm:text-sm font-medium text-white break-words w-full">{chasseur.nom}</p>
                          {chasseur.rarete && (
                            <p className="text-xs text-sidebar-foreground/70">{chasseur.rarete}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Composant pour l'onglet des armes - Affiche les tier lists du dashboard
function WeaponsTab() {
  const { data: armesParTier, loading } = useSupabaseFetch(
    "armes-tier-list",
    async () => {
      const { PublicArmesTierListService } = await import("@/services/public-armes-tier-list-service");
      return PublicArmesTierListService.getArmesTierList();
    }
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <Users className="h-8 w-8 mx-auto mb-2 animate-pulse" />
          <p>Chargement des armes...</p>
        </div>
      </div>
    );
  }

  if (!armesParTier || Object.keys(armesParTier).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sidebar-foreground">Aucune tier list d'armes configurée dans le dashboard.</p>
      </div>
    );
  }

  // Ordre correct des tiers
  const tierOrder = ["SSS", "SS", "S", "A", "B", "C", "D", "E"];
  
  // Trier les tiers dans l'ordre correct
  const sortedTiers = tierOrder.filter(tier => armesParTier[tier]?.length > 0);

  return (
    <div className="space-y-8">
      {sortedTiers.map((tier) => (
        <div key={tier} className="bg-sidebar border-sidebar-border overflow-hidden rounded-xl shadow-md">
          {/* Header du tier - Style dashboard */}
          <div className="bg-sidebar-accent py-3 sm:py-4 px-3 sm:px-5 border-b border-sidebar-border">
            <div className={`${TIER_COLORS[tier] || "bg-gray-500"} text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xl sm:text-2xl inline-block`}>
              {tier}
            </div>
          </div>
          
          {/* Contenu du tier */}
          <div className="p-2 sm:p-4 md:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {armesParTier[tier]
                .sort((a, b) => a.position - b.position)
                .map((arme) => (
                  <div key={`${arme.id}-${tier}`} className="relative flex flex-col items-center">
                    {/* Élément au-dessus de la carte, sans fond */}
                    {getElementImageUrl(arme.element) && (
                      <div className="absolute top-1 left-1 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 z-10 bg-transparent">
                        <img
                          src={getElementImageUrl(arme.element)!}
                          alt={arme.element || "Element"}
                          className="w-full h-full object-contain filter drop-shadow-sm"
                          style={{ backgroundColor: 'transparent', border: 'none' }}
                        />
                      </div>
                    )}
                    <div className="bg-sidebar-accent p-2 sm:p-3 rounded-lg text-center hover:bg-sidebar-accent/80 transition-colors w-full flex flex-col items-center">
                      <LazyImage
                        src={arme.image || "/placeholder.svg"}
                        alt={arme.nom}
                        className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg object-cover mb-2"
                      />
                      <p className="text-xs sm:text-sm font-medium text-white break-words w-full">{arme.nom}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}