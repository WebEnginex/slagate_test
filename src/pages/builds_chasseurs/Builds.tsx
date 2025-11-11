import Layout from "@/components/Layout";
import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import BuildChasseurCard from "./BuildsChasseursCard";
import LastModified from "@/components/LastModified";
import { lastModifiedDates } from "@/config/last-modification-date/lastModifiedDates";
import { Separator } from "@/components/ui/separator";
import { FiRefreshCw } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import LazyImage from '@/lib/lazy';
import { useSupabaseFetch } from '@/lib';
import { AlertTriangle } from "lucide-react";

// Types pour les données de builds Supabase
interface BuildArtefact {
  id: number;
  rank?: string;
  level?: number;
  type?: string;
  element?: number;
  statPrincipale?: string;
  statsSecondaires?: string[];
}

interface BuildNoyau {
  id: number;
  level?: number;
  statPrincipale?: string;
  statSecondaire?: string;
}

interface BuildSetBonus {
  id: number;
  setId?: number;
  level?: number;
}

interface BuildFromSupabase {
  artefacts: Record<string, BuildArtefact | BuildArtefact[]>; // Permet les tableaux pour les bottes avec stats alternatives
  noyaux: Record<string, BuildNoyau[] | BuildNoyau>;
  sets_bonus: BuildSetBonus[];
  ombre?: number;
  stats?: Record<string, string>;
}

interface BuildsDataFromSupabase {
  builds: Record<string, BuildFromSupabase>;
}

// Type pour le format attendu par BuildsChasseursCard
interface LegacyBuild {
  id: number;
  nom: string;
  stats: Record<string, string>;
  artefacts: {
    [slot: string]: {
      id: number;
      statPrincipale: string;
      statsSecondaires: string[];
    } | Array<{
      id: number;
      statPrincipale: string;
      statsSecondaires: string[];
    }>;
  };
  noyaux: {
    [slot: number]: {
      id: number;
      statPrincipale: string;
      statSecondaire?: string;
    }[];
  };
  sets_bonus: { id: number }[];
}

// Fonction pour transformer les données Supabase vers le format legacy
function transformSupabaseBuildToLegacy(supabaseBuild: BuildFromSupabase, buildId: number, buildName: string): LegacyBuild {
  // Transformer les artefacts en préservant les vraies données
  const transformedArtefacts: { 
    [slot: string]: { id: number; statPrincipale: string; statsSecondaires: string[]; } | 
    Array<{ id: number; statPrincipale: string; statsSecondaires: string[]; }>
  } = {};
  
  Object.entries(supabaseBuild.artefacts || {}).forEach(([slot, artData]) => {
    // Gérer les bottes qui peuvent être un tableau (variantes)
    if (slot === 'bottes' && Array.isArray(artData)) {
      transformedArtefacts[slot] = artData.map(art => ({
        id: art.id,
        statPrincipale: art.statPrincipale || "-",
        statsSecondaires: art.statsSecondaires || ["-"],
      }));
    } else if (Array.isArray(artData) && artData.length > 0) {
      // Si c'est un tableau mais pas pour les bottes, prendre le premier élément
      const art = artData[0];
      transformedArtefacts[slot] = {
        id: art.id,
        statPrincipale: art.statPrincipale || "-",
        statsSecondaires: art.statsSecondaires || ["-"],
      };
    } else if (!Array.isArray(artData)) {
      // Format objet simple
      transformedArtefacts[slot] = {
        id: artData.id,
        statPrincipale: artData.statPrincipale || "-",
        statsSecondaires: artData.statsSecondaires || ["-"],
      };
    }
  });

  // Transformer les noyaux en préservant les vraies données
  const transformedNoyaux: { [slot: number]: { id: number; statPrincipale: string; statSecondaire?: string; }[] } = {};
  Object.entries(supabaseBuild.noyaux || {}).forEach(([slot, noyauList]) => {
    const slotNumber = parseInt(slot, 10);
    // Vérifier si noyauList est un tableau, sinon le convertir
    const noyauxArray = Array.isArray(noyauList) ? noyauList : [noyauList];
    transformedNoyaux[slotNumber] = noyauxArray.map(noyau => ({
      id: noyau.id,
      statPrincipale: noyau.statPrincipale || "-", // Préserver la vraie statPrincipale
      statSecondaire: noyau.statSecondaire || undefined, // Préserver la vraie statSecondaire
    }));
  });

  return {
    id: buildId,
    nom: buildName, // Utiliser le nom de la clé, pas le champ "nom" redondant
    stats: supabaseBuild.stats || {}, // Préserver les vraies stats
    artefacts: transformedArtefacts,
    noyaux: transformedNoyaux,
    sets_bonus: supabaseBuild.sets_bonus || [],
  };
}

export default function BuildsPage() {
  // =========================
  // Utilisation conforme au guide d'implémentation
  // =========================
  
  // Constante pour identifier cette page dans le système de logs
  const PAGE_ID = "Builds";

  type Chasseur = Omit<Database["public"]["Tables"]["chasseurs"]["Row"], "created_at"> & {
    created_at?: string;
  };
  type Artefact = Omit<Database["public"]["Tables"]["artefacts"]["Row"], "created_at"> & {
    created_at?: string;
  };
  type Noyau = Omit<Database["public"]["Tables"]["noyaux"]["Row"], "created_at"> & {
    created_at?: string;
  };
  type Ombre = Omit<Database["public"]["Tables"]["ombres"]["Row"], "created_at"> & {
    created_at?: string;
  };
  type SetBonus = Omit<Database["public"]["Tables"]["sets_bonus"]["Row"], "created_at"> & {
    created_at?: string;
  };
  type BuildsData = Database["public"]["Tables"]["builds"]["Row"];

  // États pour les données de base
  const [chasseurs, setChasseurs] = useState<Chasseur[]>([]);
  const [builds, setBuilds] = useState<BuildsData[]>([]);
  const [artefacts, setArtefacts] = useState<Artefact[]>([]);
  const [noyaux, setNoyaux] = useState<Noyau[]>([]);
  const [ombres, setOmbres] = useState<Ombre[]>([]);
  const [setsBonus, setSetsBonus] = useState<SetBonus[]>([]);
  
  // État pour suivre quels onglets de chasseurs sont ouverts
  const [openChasseurs, setOpenChasseurs] = useState<Set<number>>(new Set());
  // État pour suivre quels chasseurs ont déjà eu leurs données chargées
  const [loadedChasseurs, setLoadedChasseurs] = useState<Set<number>>(new Set());

  const [search, setSearch] = useState("");
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  const elementIcons = useMemo(() => [
    {
      id: "jinwoo",
      image:
        "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/hunter-portrait//SungJinWoo_Jeju_Portrait.png",
    },
    {
      id: "feu",
      image:
        "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Feu_element.webp",
    },
    {
      id: "eau",
      image:
        "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Eau_element.webp",
    },
    {
      id: "vent",
      image:
        "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Vent_element.webp",
    },
    {
      id: "lumiere",
      image:
        "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Lumiere_element.webp",
    },
    {
      id: "tenebres",
      image:
        "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Tenebre_element.webp",
    },
  ], []);

  const location = useLocation();
  
  // Fonction pour normaliser les URLs (éliminer différences mineures qui pointent vers la même ressource)
  const normalizeUrl = (url: string): string => {
    try {
      // Supprimer les paramètres potentiels de query string
      return url.split('?')[0];
    } catch (e) {
      return url;
    }
  };
  
  // Utiliser useSupabaseFetch pour charger les chasseurs de base
  const { data: chasseursData } = useSupabaseFetch('supabase:chasseurs', async () => {
    const { data } = await supabase
      .from("chasseurs")
      .select("id, nom, image, image_body, element, rarete, last_modified");
    return data;
  });

  // Utiliser useSupabaseFetch pour charger les builds depuis Supabase
  const { data: buildsData } = useSupabaseFetch('supabase:builds', async () => {
    const { data } = await supabase
      .from("builds")
      .select("*");
    return data;
  });

  // Fonction pour charger les données spécifiques à un chasseur avec useSupabaseFetch conditionnel
  const loadChasseurData = useCallback(async (chasseurId: number) => {
    if (loadedChasseurs.has(chasseurId)) {
      console.log(`🔄 Données déjà chargées pour le chasseur #${chasseurId}`);
      return;
    }
    
    console.log(`🔍 Chargement des données pour le chasseur #${chasseurId}...`);
    
    // Si pas de cache, charger depuis Supabase
    try {
      // Obtenir les builds associés à ce chasseur depuis la table builds
      const chasseurBuild = builds.find(b => b.chasseur_id === chasseurId);
      if (!chasseurBuild) {
        console.log(`❌ Pas de build trouvé pour le chasseur #${chasseurId}`);
        return;
      }
      
      // Extraire les builds du JSON builds_data
      const buildsData = chasseurBuild.builds_data as unknown as BuildsDataFromSupabase;
      const chasseurBuilds = Object.values(buildsData.builds || {});
      
      // Récupérer les IDs des artefacts, noyaux, ombres et sets utilisés dans les builds
      const artefactIds = new Set<number>();
      const noyauIds = new Set<number>();
      const ombreIds = new Set<number>();
      const setBonusIds = new Set<number>();
      
      chasseurBuilds.forEach((build: BuildFromSupabase) => {
        // Collecter les IDs des artefacts
        Object.values(build.artefacts || {}).forEach((art: BuildArtefact | BuildArtefact[]) => {
          // Gérer le cas où art est un tableau (bottes avec stats alternatives)
          if (Array.isArray(art)) {
            art.forEach(a => {
              if (a && a.id) artefactIds.add(a.id);
            });
          } else if (art && art.id) {
            artefactIds.add(art.id);
          }
        });
        
        // Collecter les IDs des noyaux
        Object.values(build.noyaux || {}).forEach((noyauList: BuildNoyau[] | BuildNoyau) => {
          // Vérifier si noyauList est un tableau, sinon le convertir
          const noyauxArray = Array.isArray(noyauList) ? noyauList : [noyauList];
          noyauxArray.forEach((noyau: BuildNoyau) => {
            if (noyau && noyau.id) noyauIds.add(noyau.id);
          });
        });
        
        // Collecter les IDs des ombres s'ils existent
        if (build.ombre) ombreIds.add(build.ombre);
        
        // Collecter les IDs des sets bonus
        if (Array.isArray(build.sets_bonus)) {
          build.sets_bonus.forEach((set: BuildSetBonus) => {
            if (set && set.id) setBonusIds.add(set.id);
          });
        }
      });
      
      // Préparer les conteneurs pour les données récupérées
      const fetchedData = {
        artefacts: [] as Artefact[],
        noyaux: [] as Noyau[],
        ombres: [] as Ombre[],
        setsBonus: [] as SetBonus[]
      };
      
      // Récupérer les artefacts si nécessaire
      if (artefactIds.size > 0) {
        const { data: artefactData } = await supabase
          .from("artefacts")
          .select("id, nom, image, categorie, last_modified")
          .in("id", Array.from(artefactIds));
        
        if (artefactData && artefactData.length > 0) {
          // Les images des artefacts seront gérées par LazyImage, pas besoin de fetchAndCacheImage
          fetchedData.artefacts = artefactData;
          setArtefacts(prev => {
            const newArtefacts = [...prev];
            artefactData.forEach(artefact => {
              const index = newArtefacts.findIndex(a => a.id === artefact.id);
              if (index >= 0) {
                newArtefacts[index] = artefact;
              } else {
                newArtefacts.push(artefact);
              }
            });
            return newArtefacts;
          });
        }
      }
      
      // Récupérer les noyaux si nécessaire
      if (noyauIds.size > 0) {
        const { data: noyauData } = await supabase
          .from("noyaux")
          .select("id, nom, image, description, slot, last_modified")
          .in("id", Array.from(noyauIds));
        
        if (noyauData && noyauData.length > 0) {
          // Les images des noyaux seront gérées par LazyImage, pas besoin de fetchAndCacheImage
          fetchedData.noyaux = noyauData;
          setNoyaux(prev => {
            const newNoyaux = [...prev];
            noyauData.forEach(noyau => {
              const index = newNoyaux.findIndex(n => n.id === noyau.id);
              if (index >= 0) {
                newNoyaux[index] = noyau;
              } else {
                newNoyaux.push(noyau);
              }
            });
            return newNoyaux;
          });
        }
      }
      
      // Récupérer les ombres si nécessaire  
      if (ombreIds.size > 0) {
        const { data: ombreData } = await supabase
          .from("ombres")
          .select("id, nom, image, description, last_modified")
          .in("id", Array.from(ombreIds));
        
        if (ombreData && ombreData.length > 0) {
          // Les images des ombres seront gérées par LazyImage, pas besoin de fetchAndCacheImage
          fetchedData.ombres = ombreData;
          setOmbres(prev => {
            const newOmbres = [...prev];
            ombreData.forEach(ombre => {
              const index = newOmbres.findIndex(o => o.id === ombre.id);
              if (index >= 0) {
                newOmbres[index] = ombre;
              } else {
                newOmbres.push(ombre);
              }
            });
            return newOmbres;
          });
        }
      }
      
      // Récupérer les sets bonus si nécessaire
      if (setBonusIds.size > 0) {
        const { data: setBonusData } = await supabase
          .from("sets_bonus")
          .select("id, nom, description, last_modified")
          .in("id", Array.from(setBonusIds));
        
        if (setBonusData && setBonusData.length > 0) {
          fetchedData.setsBonus = setBonusData;
          setSetsBonus(prev => {
            const newSets = [...prev];
            setBonusData.forEach(setBonus => {
              const index = newSets.findIndex(s => s.id === setBonus.id);
              if (index >= 0) {
                newSets[index] = setBonus;
              } else {
                newSets.push(setBonus);
              }
            });
            return newSets;
          });
        }
      }
      
      // Marquer ce chasseur comme chargé
      setLoadedChasseurs(prev => new Set(prev).add(chasseurId));
      console.log(`✅ Données du chasseur #${chasseurId} chargées depuis Supabase avec les images`);
      
    } catch (error) {
      console.error(`❌ Erreur lors du chargement des données pour le chasseur #${chasseurId}:`, error);
    }
  }, [loadedChasseurs, builds]);
  
  // Fonction pour gérer l'ouverture/fermeture d'un onglet de chasseur
  const handleChasseurToggle = (chasseurId: number, isOpen: boolean) => {
    setOpenChasseurs(prev => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(chasseurId);
        // Déclencher le chargement des données
        loadChasseurData(chasseurId);
      } else {
        newSet.delete(chasseurId);
      }
      return newSet;
    });
  };

  // Log de développement pour valider l'implémentation
  if (process.env.NODE_ENV === 'development') {
    console.log(`🏗️ ${PAGE_ID}: Page initialisée`);
    console.log(`🏗️ ${PAGE_ID}: Toutes les images gérées par LazyImage + IndexedDB (conforme au guide)`);
    console.log(`🏗️ ${PAGE_ID}: Images d'éléments, portraits et artefacts utilisent le cache automatique`);
    if (chasseursData) {
      console.log(`🏗️ ${PAGE_ID}: ${chasseursData.length} chasseurs chargés via SWR`);
    }
    if (buildsData) {
      console.log(`🏗️ ${PAGE_ID}: ${buildsData.length} builds chargés via SWR`);
      console.log(`🏗️ ${PAGE_ID}: Builds data:`, buildsData);
    }
    console.log(`🏗️ ${PAGE_ID}: Chasseurs state:`, chasseurs.length);
    console.log(`🏗️ ${PAGE_ID}: Builds state:`, builds.length);
  }

  // Synchroniser les données SWR avec l'état local (pour compatibilité avec le code existant)
  useEffect(() => {
    if (chasseursData) {
      // Ajoute le champ 'element_chasseur' pour correspondre au type Chasseur
      setChasseurs(
        chasseursData.map((c) => ({
          ...c,
          element_chasseur: c.element,
        }))
      );
    }
  }, [chasseursData]);

  useEffect(() => {
    if (buildsData) {
      setBuilds(buildsData);
    }
  }, [buildsData]);

  // Gestion du scroll vers l'ancre après chargement des chasseurs
  useEffect(() => {
    if (location.hash && chasseurs.length > 0) {
      setTimeout(() => {
        const id = location.hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          const yOffset = -40;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
          el.classList.add("animate-pulse-once");
          setTimeout(() => el.classList.remove("animate-pulse-once"), 900);
          
          // Si un chasseur est ciblé directement par l'ancre, charger ses données
          const chasseurMatch = id.match(/chasseur-(\d+)/);
          if (chasseurMatch) {
            const chasseurId = parseInt(chasseurMatch[1]);
            if (!isNaN(chasseurId)) {
              loadChasseurData(chasseurId);
              setOpenChasseurs(prev => new Set(prev).add(chasseurId));
            }
          }
        }
      }, 200);
    }
  }, [location, chasseurs, loadChasseurData]);

  // Indexer les chasseurs pour un accès plus rapide
  const chasseurIndex = useMemo(() => {
    const index = new Map<number, Chasseur>();
    chasseurs.forEach((c) => index.set(c.id, c));
    return index;
  }, [chasseurs]);

  // Utiliser l'index pour filtrer les builds
  const filteredBuilds = builds.filter((entry) => {
    const chasseur = chasseurIndex.get(entry.chasseur_id);
    if (!chasseur) return false;

    const matchSearch = chasseur.nom
      .toLowerCase()
      .includes(search.toLowerCase());

    // Gestion spéciale pour Sung Jinwoo (pas d'élément)
    const matchElement = !selectedElement ||
      (selectedElement === "jinwoo"
        ? chasseur.nom.toLowerCase().includes("sung jinwoo")
        : entry.element === selectedElement);

    return matchSearch && matchElement;
  });

  // Trier les builds : Sung Jinwoo en premier, puis par ID décroissant
  const sortedBuilds = [...filteredBuilds].sort((a, b) => {
    const chasseurA = chasseurIndex.get(a.chasseur_id);
    const chasseurB = chasseurIndex.get(b.chasseur_id);

    if (!chasseurA || !chasseurB) return 0;

    const isJinwooA = chasseurA.nom.toLowerCase() === 'sung jinwoo';
    const isJinwooB = chasseurB.nom.toLowerCase() === 'sung jinwoo';

    // Si A est Jinwoo et B n'est pas Jinwoo, A vient en premier
    if (isJinwooA && !isJinwooB) return -1;
    // Si B est Jinwoo et A n'est pas Jinwoo, B vient en premier
    if (!isJinwooA && isJinwooB) return 1;
    // Sinon, tri par ID décroissant
    return b.chasseur_id - a.chasseur_id;
  });

  // Debug pour voir les données
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 Debug filtrage:`, {
      buildsTotal: builds.length,
      chasseursTotal: chasseurs.length,
      filteredBuilds: sortedBuilds.length,
      search,
      selectedElement,
      chasseurIndexSize: chasseurIndex.size
    });
    if (builds.length > 0) {
      console.log(`🔍 Premier build:`, builds[0]);
    }
  }

  return (
    <Layout>
      <SEO
        title="Builds des Chasseurs - Solo Leveling: ARISE"
        description="Découvrez les meilleurs builds pour vos chasseurs dans Solo Leveling: ARISE. Optimisez vos équipes avec des artefacts, noyaux et bonus de sets adaptés."
        keywords="Solo Leveling, builds chasseurs, artefacts, noyaux, sets bonus, ARISE"
      />

      <div className="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
          <div className="space-y-4 sm:space-y-6">
            {/* Introduction */}
            <div className="bg-sidebar-accent p-4 sm:p-6 lg:p-8 rounded-lg shadow-md space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-violet-400 text-center lg:text-left">
                Builds de Chasseurs pour Solo Leveling: ARISE
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 text-center lg:text-left leading-relaxed">
                Découvrez les meilleures configurations pour vos chasseurs dans
                Solo Leveling: ARISE. Ce guide inclut des statistiques,
                artefacts, noyaux et bonus de sets pour optimiser vos équipes.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 text-center lg:text-left leading-relaxed">
                Utilisez les outils de recherche et de filtres pour trouver
                rapidement un chasseur spécifique ou explorer les meilleures
                configurations adaptées à chaque chasseur.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 text-center lg:text-left leading-relaxed">
                Que vous soyez débutant à la recherche d'une configuration de
                départ ou expert cherchant à affiner vos équipes, cette section
                est conçue pour vous aider à maximiser vos performances.
              </p>
              {/* Dernières modifications */}
              <div className="text-center lg:text-left">
                <p className="text-xs sm:text-sm text-gray-400 italic">
                  <span className="text-white font-medium">
                    <LastModified date={lastModifiedDates.builds} />
                  </span>
                </p>
              </div>
            </div>

            {/* Section builds en cours d'ajout */}
            <div className="bg-yellow-900/80 border border-yellow-700 rounded-xl p-4 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-200 font-semibold">Les builds sont en cours d'ajout. Il est normal que tous les builds ne soient pas encore présents !</span>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
              {/* Barre de recherche avec bouton reset */}
              <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-3">
                <input
                  type="text"
                  placeholder="Rechercher un chasseur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-64 lg:w-80 px-3 sm:px-4 py-2 sm:py-2.5 bg-sidebar-accent border border-sidebar-border rounded-md text-sm sm:text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-solo-purple transition-all duration-200"
                />
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedElement(null);
                  }}
                  className="w-full sm:w-auto px-4 sm:px-3 py-2 sm:py-2.5 text-sm sm:text-base bg-solo-purple text-white rounded-md shadow-md border border-solo-purple hover:bg-solo-purple-dark transition-colors duration-300"
                >
                  Réinitialiser
                </button>
              </div>

              {/* Filtres d'éléments */}
              <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 lg:gap-4">
                {elementIcons.map((el) => (
                  <div
                    key={el.id}
                    onClick={() =>
                      setSelectedElement((prev) =>
                        prev === el.id ? null : el.id
                      )
                    }
                    className="relative w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <LazyImage
                      src={el.image}
                      alt={el.id}
                      fallbackClassName="w-full h-full object-contain bg-transparent"
                      showSpinner={true}
                    />
                    {selectedElement === el.id && (
                      <div className="absolute bottom-[-4px] sm:bottom-[-6px] left-1/4 w-1/2 h-[2px] bg-solo-purple rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cartes des builds */}
            <div className="mt-6">
              {sortedBuilds.map((entry) => {
                const chasseur = chasseurs.find(
                  (c) => c.id === entry.chasseur_id
                );
                if (!chasseur) return null;

                // Extraire les builds du JSON builds_data
                const buildsData = entry.builds_data as unknown as BuildsDataFromSupabase;
                const chasseurBuildsRaw = Object.entries(buildsData.builds || {});
                
                // Transformer les builds vers le format legacy
                const chasseurBuilds = chasseurBuildsRaw.map(([buildKey, buildData], index) => 
                  transformSupabaseBuildToLegacy(buildData, index + 1, buildKey)
                );

                // Ne pas afficher les chasseurs sans builds
                if (!chasseurBuilds || chasseurBuilds.length === 0) {
                  return null;
                }

                return (
                  <BuildChasseurCard
                    key={entry.chasseur_id}
                    chasseur={chasseur}
                    builds={chasseurBuilds}
                    artefacts={artefacts}
                    noyaux={noyaux}
                    ombres={ombres}
                    setsBonus={setsBonus}
                    elementId={entry.element}
                    isOpen={openChasseurs.has(entry.chasseur_id)}
                    onToggle={(isOpen) => handleChasseurToggle(entry.chasseur_id, isOpen)}
                  />
                );
              })}

              {/* Afficher un message si aucun résultat n'est trouvé */}
              {sortedBuilds.length === 0 && (
                <div className="bg-sidebar p-8 rounded-lg border border-sidebar-border text-center">
                  <p className="text-lg text-gray-300">
                    Aucun chasseur ne correspond à votre recherche.
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setSelectedElement(null);
                    }}
                    className="mt-4 px-4 py-2 bg-solo-purple text-white rounded-md hover:bg-solo-purple-dark transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}