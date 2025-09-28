import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Sword, Plus, Loader2 } from "lucide-react";
import { useSupabaseFetch } from "@/lib";
import LazyImage from "@/lib/lazy";
import { PublicTeamsChasseursService, PublicElementTeam, PublicTeamPosition } from "@/services/public-teams-chasseurs-service";

// Types pour les éléments
type ElementType = "feu" | "vent" | "lumiere" | "eau" | "tenebres";

// Configuration des éléments avec couleurs et icônes
const ELEMENT_CONFIG = {
  feu: {
    label: "Feu",
    color: "bg-red-500/20 border-red-500/40",
    activeColor: "data-[state=active]:bg-red-600",
    icon: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Feu_element.webp"
  },
  vent: {
    label: "Vent", 
    color: "bg-green-500/20 border-green-500/40",
    activeColor: "data-[state=active]:bg-green-600",
    icon: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Vent_element.webp"
  },
  lumiere: {
    label: "Lumière",
    color: "bg-yellow-500/20 border-yellow-500/40", 
    activeColor: "data-[state=active]:bg-yellow-600",
    icon: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Lumiere_element.webp"
  },
  eau: {
    label: "Eau",
    color: "bg-blue-500/20 border-blue-500/40",
    activeColor: "data-[state=active]:bg-blue-600", 
    icon: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Eau_element.webp"
  },
  tenebres: {
    label: "Ténèbres",
    color: "bg-purple-500/20 border-purple-500/40",
    activeColor: "data-[state=active]:bg-purple-600",
    icon: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements/Tenebre_element.webp"
  }
};

const ROLE_CONFIG = {
  breaker: { label: "Breaker", icon: Shield },
  support: { label: "Support", icon: Plus },
  dps: { label: "DPS", icon: Sword }
};

export default function TeamsChasseursPublic() {
  const [activeElement, setActiveElement] = useState<ElementType>("feu");

  // Récupérer les données de la team pour l'élément actif
  const { data: elementTeam, loading, error } = useSupabaseFetch(
    `teams-chasseurs-${activeElement}`,
    () => PublicTeamsChasseursService.getElementTeam(activeElement)
  );

  const renderChasseurCard = (position: PublicTeamPosition, index: number) => {
    if (!position.chasseur) {
      return (
        <div
          key={`empty-${index}`}
          className="bg-sidebar border border-sidebar-border rounded-lg p-3 text-center text-sidebar-foreground/60"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-sidebar-accent rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">{position.position}</span>
            </div>
            <span className="text-xs">Position libre</span>
          </div>
        </div>
      );
    }

    return (
      <div
        key={position.id}
        className="bg-sidebar border border-sidebar-border rounded-lg p-3 hover:bg-sidebar-accent transition-colors"
      >
        <div className="flex flex-col items-center gap-2">
          {/* Position badge */}
          <div className="absolute top-1 left-1 bg-solo-purple text-white text-xs px-2 py-1 rounded-full font-bold">
            {position.position}
          </div>
          
          {/* Image du chasseur */}
          <div className="relative">
            <LazyImage
              src={position.chasseur.imageUrl || "/placeholder.svg"}
              alt={position.chasseur.nom}
              className="w-16 h-16 rounded-lg object-cover"
            />
          </div>

          {/* Nom du chasseur */}
          <div className="text-center">
            <div className="text-sm font-semibold text-white">
              {position.chasseur.nom}
            </div>
            {position.chasseur.rarete && (
              <div className="text-xs text-sidebar-foreground/70">
                {position.chasseur.rarete}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRoleSection = (role: keyof typeof ROLE_CONFIG) => {
    if (!elementTeam) return null;

    const positions = elementTeam[`${role}_positions` as keyof PublicElementTeam] as PublicTeamPosition[];
    const RoleIcon = ROLE_CONFIG[role].icon;

    return (
      <Card key={role} className="bg-sidebar border-sidebar-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <RoleIcon className="h-5 w-5 text-solo-purple" />
            {ROLE_CONFIG[role].label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {positions.length === 0 ? (
            <div className="text-center py-8 text-sidebar-foreground/60">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Aucun chasseur assigné</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {positions.map((position, index) => (
                <div key={position.id || index} className="text-center">
                  <div className="text-xs text-sidebar-muted-foreground mb-1 font-medium">
                    {index === 0 ? 'Optimal' : `Alt. ${index}`}
                  </div>
                  {renderChasseurCard(position, index)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Teams Chasseurs</h2>
        <p className="text-sidebar-foreground/70">
          Découvrez les meilleures compositions d'équipes par élément et rôle
        </p>
      </div>

      <Tabs 
        value={activeElement} 
        onValueChange={(value) => setActiveElement(value as ElementType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-5 bg-sidebar-accent">
          {Object.entries(ELEMENT_CONFIG).map(([key, config]) => (
            <TabsTrigger 
              key={key}
              value={key}
              className={`flex items-center gap-2 text-sidebar-foreground/80 data-[state=active]:text-white ${config.activeColor} ${config.color}`}
            >
              <img 
                src={config.icon} 
                alt={config.label}
                className="w-5 h-5 object-contain"
              />
              <span className="hidden md:inline">{config.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(ELEMENT_CONFIG).map((element) => (
          <TabsContent key={element} value={element} className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-solo-purple" />
                <span className="ml-2 text-sidebar-foreground/70">
                  Chargement des teams {ELEMENT_CONFIG[element as ElementType].label}...
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-400">
                <p>Erreur lors du chargement des teams</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {Object.keys(ROLE_CONFIG).map((role) => 
                  renderRoleSection(role as keyof typeof ROLE_CONFIG)
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}