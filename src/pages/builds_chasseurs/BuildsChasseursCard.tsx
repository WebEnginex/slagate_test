import * as React from "react";
import type { Database } from "@/integrations/supabase/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  GemIcon,
  Layers,
  Dna,
  BarChart2,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import LazyImage from "@/lib/lazy";

type Chasseur = Database["public"]["Tables"]["chasseurs"]["Row"];
type Artefact = Database["public"]["Tables"]["artefacts"]["Row"];
type Noyau = Database["public"]["Tables"]["noyaux"]["Row"];
type Ombre = Database["public"]["Tables"]["ombres"]["Row"];
type SetBonus = Database["public"]["Tables"]["sets_bonus"]["Row"];

type Build = {
  id: number;
  nom: string;
  stats: Record<string, string>;
  artefacts: {
    [slot: string]: {
      id: number;
      statPrincipale: string;
      statsSecondaires: string[];
    };
  };
  noyaux: {
    [slot: number]: {
      id: number;
      statPrincipale: string;
      statSecondaire?: string;
    }[]; // Assurez-vous que c'est un tableau
  };
  sets_bonus: { id: number }[];
};

type Props = {
  chasseur: Chasseur;
  builds: Build[];
  artefacts: { id: number; nom: string; image: string; categorie: string; created_at?: string }[];
  noyaux: { id: number; nom: string; image: string; description: string; created_at?: string }[];
  ombres: { id: number; nom: string; image: string; description: string; created_at?: string }[];
  setsBonus: SetBonus[];
  elementId?: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
};

function formatTextWithBrackets(text: string) {
  const regex = /(\[[^\]]+\])|(\d+(?:[.,]\d+)? ?%?)|(\bseconde(?:s)?\b)|(\bPV\b|\bpv\b)|(\bPM\b|\bpm\b)/gi;

  return text.split(regex).map((part, index) => {
    if (!part) return null;

    // Texte entre crochets
    if (part.startsWith("[") && part.endsWith("]")) {
      const content = part.slice(1, -1); // Retirer les crochets
      if (content === "Bris") {
        return (
          <span key={index} className="text-orange-500">
            {part}
          </span>
        );
      } else {
        return (
          <span key={index} className="text-teal-500">
            {part}
          </span>
        );
      }
    }

    // Chiffres ou pourcentages (inclut les chiffres à virgules)
    if (/^\d+(?:[.,]\d+)? ?%?$/.test(part)) {
      return (
        <span key={index} className="text-yellow-500">
          {part}
        </span>
      );
    }

    // Mots "seconde" ou "secondes"
    if (/^seconde(?:s)?$/.test(part)) {
      return (
        <span key={index} className="text-yellow-500">
          {part}
        </span>
      );
    }

    // "PV" ou "pv" en rouge
    if (/^PV$|^pv$/.test(part)) {
      return (
        <span key={index} className="text-red-500">
          {part}
        </span>
      );
    }

    // "PM" ou "pm" en bleu
    if (/^PM$|^pm$/.test(part)) {
      return (
        <span key={index} className="text-blue-500">
          {part}
        </span>
      );
    }

    // Texte normal
    return part;
  });
}

export default function BuildChasseurCard({
  chasseur,
  builds,
  artefacts,
  noyaux,
  ombres,
  setsBonus,
  elementId,
  isOpen,
  onToggle,
}: Props) {
  // =========================
  // Utilisation conforme au guide d'implémentation
  // =========================
  
  // Constante pour identifier ce composant dans le système de logs
  const COMPONENT_ID = "BuildsChasseursCard";

  // Utiliser directement la prop isOpen pour l'état d'expansion
  const [selectedBuildIndex, setSelectedBuildIndex] = React.useState(0);
  const [openSections, setOpenSections] = React.useState<string[]>(isOpen ? ["artefacts"] : []); // artefacts ouvert par défaut si déjà ouvert
  const [activeNoyauIndices, setActiveNoyauIndices] = React.useState<Record<number, number>>({});
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [renderKey, setRenderKey] = React.useState(0); // Clé pour forcer le re-rendu des images

  const build = builds[selectedBuildIndex];

  // Surveiller le changement d'état d'ouverture pour déclencher le chargement
  React.useEffect(() => {
    if (isOpen && (artefacts.length === 0 || noyaux.length === 0 || setsBonus.length === 0)) {
      setIsDataLoading(true);
      // Les données seront chargées par le parent, on attend juste qu'elles arrivent
      const checkDataLoaded = () => {
        if (artefacts.length > 0 || noyaux.length > 0 || setsBonus.length > 0) {
          setIsDataLoading(false);
          setRenderKey(prev => prev + 1); // Forcer le re-rendu des images
        } else {
          // Réessayer dans 100ms
          setTimeout(checkDataLoaded, 100);
        }
      };
      checkDataLoaded();
    }
  }, [isOpen, artefacts.length, noyaux.length, setsBonus.length]);

  // Forcer le re-rendu quand les données changent
  React.useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [artefacts, noyaux, setsBonus]);

  // Log de développement pour valider l'implémentation
  if (process.env.NODE_ENV === 'development' && isOpen) {
    console.log(`🏗️ ${COMPONENT_ID}: Chasseur ${chasseur.nom} (ID: ${chasseur.id}) ouvert`);
    console.log(`🏗️ ${COMPONENT_ID}: Toutes les images gérées par LazyImage + IndexedDB (conforme au guide)`);
    console.log(`🏗️ ${COMPONENT_ID}: Build sélectionné: ${build?.nom || 'N/A'}`);
  }

  const getById = <T extends { id: number }>(list: T[], id: number) =>
    list.find((item) => item.id === id);

  const toggleSection = (key: string) => {
    setOpenSections((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const isSectionOpen = (key: string) => openSections.includes(key);

  // Fonction pour gérer l'alternance des noyaux
  const handleNoyauAlternative = React.useCallback((slot: number, noyauxList: { id: number; statPrincipale: string; statSecondaire?: string }[]) => {
    setActiveNoyauIndices((prev) => {
      const newIndex = ((prev[slot] || 0) + 1) % noyauxList.length;
      const newIndices = {
        ...prev,
        [slot]: newIndex,
      };
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 ${COMPONENT_ID}: Slot ${slot} - Alternative ${newIndex + 1}/${noyauxList.length}`);
      }
      
      return newIndices;
    });
  }, [COMPONENT_ID]);

  // Gestion de l'ouverture/fermeture synchronisée avec le parent
  const toggleOpen = React.useCallback(() => {
    const newIsOpen = !isOpen;
    onToggle(newIsOpen); // Notifier le parent du changement
  }, [isOpen, onToggle]);

  // Vérification de sécurité pour build
  if (!builds || builds.length === 0 || !build) {
    return (
      <Card className="bg-sidebar border-sidebar-border mb-4">
        <CardContent className="p-4">
          <p className="text-gray-400 text-center">Aucun build disponible pour ce chasseur</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      id={`chasseur-${chasseur.id}`} // Ajoute cet id pour l'ancre
      className="mb-10 bg-sidebar border-sidebar-border overflow-hidden"
    >
      <CardHeader
        className="p-3 sm:p-4 lg:p-5 flex flex-row items-center justify-between bg-sidebar cursor-pointer transition-colors hover:bg-sidebar/90"
        onClick={toggleOpen}
      >
        <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2 sm:gap-3 lg:gap-4 text-white min-w-0">
          <Avatar className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 flex-shrink-0">
            <LazyImage
              src={chasseur.image}
              alt={chasseur.nom}
              fallbackClassName="w-full h-full object-cover "
              showSpinner={true}
            />
          </Avatar>
          <span className="truncate">{chasseur.nom}</span>
        </CardTitle>

        {isOpen ? (
          <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0" />
        )}
      </CardHeader>

      {isOpen && (
        <CardContent className="p-3 sm:p-4 lg:p-6 pt-4 sm:pt-6 bg-sidebar-accent space-y-4 sm:space-y-6">
          {/* Sélecteur de build */}
          <div className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto pb-2">
            {builds.map((b, i) => {
              // Utiliser l'artefact "casque" pour l'image du build, sinon fallback sur le premier artefact
              const casqueArtefact = b.artefacts.casque || Object.values(b.artefacts)[0];
              const art = getById(artefacts, casqueArtefact?.id);
              
              // Si l'artefact n'est pas trouvé et qu'il n'y a aucun artefact chargé, 
              // c'est probablement que les données sont en cours de chargement
              const isLoading = !art && (artefacts.length === 0 || isDataLoading);
              
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBuildIndex(i)}
                  className="flex flex-col items-center min-w-[64px] sm:min-w-[80px] lg:min-w-[88px] cursor-pointer group"
                >
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg border-2 transition-all duration-200 group-hover:scale-105 ${
                      selectedBuildIndex === i
                        ? "border-solo-purple shadow shadow-solo-purple/30"
                        : "border-transparent"
                    }`}
                  >
                    {isLoading ? (
                      // État de chargement
                      <div className="w-full h-full bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-solo-purple border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      // Image de l'artefact
                      <LazyImage
                        key={`build-${b.id}-${renderKey}`}
                        src={art?.image || ""}
                        alt={b.nom}
                        className="w-full h-full object-contain rounded-lg"
                        fallbackClassName="w-full h-full rounded-lg"
                        showSpinner={true}
                      />
                    )}
                  </div>
                  <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs lg:text-sm text-white text-center truncate w-full">
                    {b.nom}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Statistiques */}
          <SectionCollapsible
            label="Statistiques à viser"
            icon={<BarChart2 className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-solo-purple" />}
            isOpen={isSectionOpen("stats")}
            onToggle={() => toggleSection("stats")}
          >
            {/* Texte informatif */}
            <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Voici les statistiques recommandées pour optimiser les
              performances de ce chasseur. Adaptez-les en fonction de votre
              style de jeu et des besoins de votre équipe.
            </p>

            {/* Grille des statistiques */}
            {build && build.stats ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                {Object.entries(build.stats)
                  .filter(([_, val]) => val && val.trim() !== '') // Filtrer les stats vides
                  .map(([label, val]) => (
                  <div
                    key={label}
                    className="bg-sidebar p-2 sm:p-3 rounded border border-sidebar-border"
                  >
                    <div className="text-[10px] sm:text-xs lg:text-sm text-solo-light-purple mb-1">
                      {label}
                    </div>
                    <div className="font-medium text-xs sm:text-sm lg:text-base text-white break-words">
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm">Aucune statistique disponible pour ce build</p>
              </div>
            )}
          </SectionCollapsible>

          {/* Artefacts */}
          <SectionCollapsible
            label="Artefacts"
            icon={<GemIcon className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-solo-purple" />}
            isOpen={isSectionOpen("artefacts")}
            onToggle={() => toggleSection("artefacts")}
          >
            {/* Texte informatif */}
            <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Les artefacts jouent un rôle clé dans l'optimisation des
              performances de votre chasseur. Choisissez-les en fonction des
              statistiques principales et secondaires qui complètent votre
              build.
            </p>

            {/* Grille des artefacts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
              {/* Ordre fixe : casque, armure, gants, bottes, collier, bracelet, bague, boucles */}
              {['casque', 'armure', 'gants', 'bottes', 'collier', 'bracelet', 'bague', 'boucles'].map((slot) => {
                const conf = build.artefacts[slot];
                if (!conf) return null;
                
                const artefact = getById(artefacts, conf.id);
                
                // Si l'artefact n'est pas trouvé et qu'il n'y a aucun artefact chargé, 
                // c'est probablement que les données sont en cours de chargement
                const isLoading = !artefact && (artefacts.length === 0 || isDataLoading);
                
                // Affichage du nom du slot avec "Boucles d'oreilles" pour "boucles"
                const displaySlotName = slot === 'boucles' 
                  ? "Boucles d'oreilles" 
                  : slot.charAt(0).toUpperCase() + slot.slice(1);
                
                return (
                  <div
                    key={slot}
                    className="bg-sidebar p-2 sm:p-3 rounded-lg border border-sidebar-border"
                  >
                    <div className="flex flex-col items-center">
                      <p className="mb-1 text-[10px] sm:text-2xs font-semibold text-solo-light-purple">
                        {displaySlotName}
                      </p>
                      
                      {isLoading ? (
                        // État de chargement
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-gray-800 rounded animate-pulse flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-solo-purple border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        // Image de l'artefact
                        <LazyImage
                          key={`artefact-${slot}-${conf.id}-${renderKey}`}
                          src={artefact?.image || ""}
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto object-contain"
                          alt={artefact?.nom || "Artefact"}
                          fallbackClassName="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto bg-transparent"
                          showSpinner={true}
                        />
                      )}
                      
                      <p className="mt-1 text-[10px] sm:text-2xs font-medium text-center text-white truncate w-full">
                        {isLoading ? "Chargement..." : (artefact?.nom || `ID: ${conf.id} (introuvable)`)}
                      </p>
                      <div className="w-full mt-1">
                        <div className="text-[10px] sm:text-2xs bg-solo-purple/20 text-white px-1 py-0.5 rounded font-medium text-center truncate">
                          {conf.statPrincipale}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCollapsible>

          {/* Sets Bonus */}
          <SectionCollapsible
            label="Bonus de Sets"
            icon={<Layers className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-solo-purple" />}
            isOpen={isSectionOpen("sets")}
            onToggle={() => toggleSection("sets")}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-sm">
              {build.sets_bonus.map((sb, i) => {
                const bonus = getById(setsBonus, sb.id);
                if (!bonus) return null;
                return (
                  <div
                    key={i}
                    className="bg-sidebar p-2 sm:p-3 rounded-lg border border-sidebar-border"
                  >
                    <p className="font-semibold text-xs sm:text-sm text-solo-purple">
                      {bonus.nom}
                    </p>
                    <div className="text-2xs sm:text-xs text-gray-300 mt-1 sm:mt-2">
                      {formatTextWithBrackets(bonus.description || "")}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCollapsible>

          {/* Noyaux */}
          <SectionCollapsible
            label="Noyaux"
            icon={<Dna className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-solo-purple" />}
            isOpen={isSectionOpen("noyaux")}
            onToggle={() => toggleSection("noyaux")}
          >
            <div className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
              Les noyaux sont essentiels pour renforcer les capacités de votre
              chasseur. Sélectionnez-les en fonction des statistiques principales
              et des bonus secondaires qui complètent votre stratégie.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Object.entries(build.noyaux)
                .filter(([_, noyauxList]) => Array.isArray(noyauxList) && noyauxList.length > 0) // Filtrer les slots vides
                .slice(0, 3) // Limiter aux 3 premiers slots
                .map(([slot, noyauxList]) => {
                  const slotNumber = parseInt(slot, 10);
                  const activeIndex = activeNoyauIndices[slotNumber] || 0;
                  const noyau = noyauxList[activeIndex];
                  
                  // Protection supplémentaire : si noyau est undefined, skip
                  if (!noyau) return null;
                  
                  const noyauData = noyaux.find((n) => n.id === noyau.id);

                  // Log de développement pour déboguer les alternatives
                  if (process.env.NODE_ENV === 'development' && noyauxList.length > 1) {
                    console.log(`🔍 ${COMPONENT_ID}: Slot ${slotNumber}, Index ${activeIndex}, Noyau ID ${noyau.id}, Image: ${noyauData?.image}`);
                  }

                  // Si le noyau n'est pas trouvé et qu'il n'y a aucun noyau chargé, 
                  // c'est probablement que les données sont en cours de chargement
                  const isLoading = !noyauData && (noyaux.length === 0 || isDataLoading);

                  return (
                    <div
                      key={slot}
                      className="bg-sidebar p-2 sm:p-4 rounded-lg border border-sidebar-border"
                    >
                      <div className="flex flex-col items-center mb-2">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center mb-1">
                          {isLoading ? (
                            // État de chargement
                            <div className="w-full h-full bg-gray-800 rounded animate-pulse flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-solo-purple border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          ) : (
                            // Image du noyau
                            <LazyImage
                              key={`noyau-${slotNumber}-${activeIndex}-${renderKey}`}
                              src={noyauData?.image || ""}
                              className="w-full h-full object-contain rounded"
                              alt={noyauData?.nom || "Noyau"}
                              fallbackClassName="w-full h-full object-contain rounded bg-transparent"
                              showSpinner={true}
                            />
                          )}
                        </div>
                        <p className="text-[10px] sm:text-xs font-semibold text-white text-center truncate w-full">
                          {isLoading ? "Chargement..." : (noyauData?.nom || `ID: ${noyau.id} (introuvable)`)}
                        </p>
                      </div>
                      <div className="bg-solo-purple/20 text-white text-[10px] sm:text-2xs px-2 py-0.5 sm:py-1 rounded-md text-center font-medium truncate">
                        {noyau.statPrincipale}
                      </div>
                      <div className="text-[10px] sm:text-2xs text-gray-300 mt-1 text-center space-y-1">
                        {isLoading ? "..." : (noyauData?.description
                          ?.replace(/<br\s*\/?>/gi, "\n")
                          ?.split("\n")
                          .map((line, idx) => (
                            <p key={idx}>{formatTextWithBrackets(line)}</p>
                          )) || "")}
                      </div>
                      {noyauxList.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNoyauAlternative(slotNumber, noyauxList);
                          }}
                          className="mt-1 bg-solo-purple/90 hover:bg-solo-purple text-white text-[10px] sm:text-2xs px-2 py-0.5 rounded text-center mx-auto block"
                        >
                          {(activeNoyauIndices[slotNumber] || 0) === 0 ? "Alternative" : "Meilleur"}
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </SectionCollapsible>
        </CardContent>
      )}
    </Card>
  );
}

// Section réutilisable avec état externe
function SectionCollapsible({
  label,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-sidebar/50 rounded-lg overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full p-3 sm:p-4 font-medium flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base text-white border-b border-sidebar-border transition-colors hover:bg-sidebar/50">
          {icon}
          <span className="flex-1 text-left">{label}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          ) : (
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-3 sm:p-4">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
