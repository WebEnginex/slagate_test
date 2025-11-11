import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Loader2, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { BuildsSupabaseService } from '../services/buildsSupabaseService';

// Options d'éléments avec icônes (même système que BuildsAdminPage)
const ELEMENT_OPTIONS = [
  { id: "tous", label: "Tous", image: null },
  { id: "jinwoo", label: "Jinwoo", image: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/hunter-portrait//SungJinWoo_Jeju_Portrait.png" },
  { id: "feu", label: "Feu", image: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Feu_element.webp" },
  { id: "eau", label: "Eau", image: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Eau_element.webp" },
  { id: "vent", label: "Vent", image: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Vent_element.webp" },
  { id: "lumiere", label: "Lumière", image: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Lumiere_element.webp" },
  { id: "tenebres", label: "Ténèbres", image: "https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/elements//Tenebre_element.webp" },
];

interface ArtefactData {
  id: number;
  image?: string;
}

interface NoyauData {
  id: number;
  image?: string;
}

interface BuildOption {
  chasseurId: number;
  chasseurNom: string;
  element: string;
  buildName: string;
  buildData: Record<string, unknown>;
  chasseurImage?: string;
}

interface BuildCopySelectorProps {
  currentChasseurId: number;
  onBuildSelected: (buildData: Record<string, unknown>, buildName: string) => void;
  disabled?: boolean;
}

export function BuildCopySelector({ currentChasseurId, onBuildSelected, disabled }: BuildCopySelectorProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [builds, setBuilds] = useState<BuildOption[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [elementFilter, setElementFilter] = useState<string>('tous');
  const [artefactsMap, setArtefactsMap] = useState<Map<number, ArtefactData>>(new Map());
  const [noyauxMap, setNoyauxMap] = useState<Map<number, NoyauData>>(new Map());
  const [loadedChasseurs, setLoadedChasseurs] = useState<Set<number>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const buildsService = new BuildsSupabaseService();

  // Charger tous les builds disponibles
  useEffect(() => {
    if (open) {
      loadAllBuilds();
    }
  }, [open]);

  // Charger les images (chasseurs, artefacts, noyaux) une seule fois
  const loadImages = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zmjcebypuyjhwqzfmjib.supabase.co';
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Charger les images des artefacts
      const { data: artefactsData } = await supabase
        .from('artefacts')
        .select('id, image');

      // Charger les images des noyaux
      const { data: noyauxData } = await supabase
        .from('noyaux')
        .select('id, image');

      // Créer les maps pour accès rapide
      const artefactsDataMap = new Map(
        (artefactsData || []).map(a => [a.id, { id: a.id, image: a.image }])
      );
      setArtefactsMap(artefactsDataMap);

      const noyauxDataMap = new Map(
        (noyauxData || []).map(n => [n.id, { id: n.id, image: n.image }])
      );
      setNoyauxMap(noyauxDataMap);
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
    }
  };

  // Charger les builds d'un chasseur spécifique (lazy loading)
  const loadChasseurBuilds = async (chasseurId: number) => {
    if (loadedChasseurs.has(chasseurId)) return; // Déjà chargé

    try {
      const chasseur = await buildsService.getChasseur(chasseurId);

      // Récupérer l'image du chasseur
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zmjcebypuyjhwqzfmjib.supabase.co';
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: chasseurData } = await supabase
        .from('chasseurs')
        .select('id, image')
        .eq('id', chasseurId)
        .single();

      const buildsData = chasseur.builds_data as { builds?: Record<string, Record<string, unknown>> };
      const chasseurBuilds = buildsData?.builds || {};

      const newBuilds: BuildOption[] = [];
      Object.entries(chasseurBuilds).forEach(([buildName, buildData]) => {
        newBuilds.push({
          chasseurId: chasseur.chasseur_id,
          chasseurNom: chasseur.chasseur_nom,
          element: chasseur.element,
          buildName,
          buildData: buildData as Record<string, unknown>,
          chasseurImage: chasseurData?.image,
        });
      });

      setBuilds(prev => [...prev, ...newBuilds]);
      setLoadedChasseurs(prev => new Set([...prev, chasseurId]));
    } catch (error) {
      console.error(`Erreur lors du chargement des builds du chasseur ${chasseurId}:`, error);
    }
  };

  // Charger la liste initiale des chasseurs (sans les builds)
  const loadAllBuilds = async () => {
    try {
      setLoading(true);

      // Charger les images (artefacts, noyaux)
      await loadImages();

      // Charger tous les chasseurs avec leurs builds
      const chasseurs = await buildsService.getAllChasseurs();

      // Récupérer les images des chasseurs
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zmjcebypuyjhwqzfmjib.supabase.co';
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: chasseursData } = await supabase
        .from('chasseurs')
        .select('id, image');

      const chasseurImagesMap = new Map(
        (chasseursData || []).map(c => [c.id, c.image])
      );

      const allBuilds: BuildOption[] = [];

      for (const chasseur of chasseurs) {
        const buildsData = chasseur.builds_data as { builds?: Record<string, Record<string, unknown>> };
        const chasseurBuilds = buildsData?.builds || {};

        Object.entries(chasseurBuilds).forEach(([buildName, buildData]) => {
          allBuilds.push({
            chasseurId: chasseur.chasseur_id,
            chasseurNom: chasseur.chasseur_nom,
            element: chasseur.element,
            buildName,
            buildData: buildData as Record<string, unknown>,
            chasseurImage: chasseurImagesMap.get(chasseur.chasseur_id),
          });
        });
      }

      setBuilds(allBuilds);
    } catch (error) {
      console.error('Erreur lors du chargement des builds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBuild = (build: BuildOption) => {
    onBuildSelected(build.buildData, `${build.buildName} (Copie)`);
    setOpen(false);
    setSearchQuery('');
  };

  // Filtrer les builds selon la recherche et l'élément
  const filteredBuilds = builds.filter(build => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      build.chasseurNom.toLowerCase().includes(searchLower) ||
      build.buildName.toLowerCase().includes(searchLower) ||
      build.element.toLowerCase().includes(searchLower)
    );

    // Filtrage par élément
    let matchesElement = true;
    if (elementFilter === "jinwoo") {
      matchesElement = build.chasseurNom.toLowerCase() === "sung jinwoo";
    } else if (elementFilter !== "tous") {
      matchesElement = build.element.toLowerCase() === elementFilter;
    }

    return matchesSearch && matchesElement;
  });

  // Grouper les builds par chasseur
  const buildsByChasseur = filteredBuilds.reduce((acc, build) => {
    const key = `${build.chasseurId}-${build.chasseurNom}`;
    if (!acc[key]) {
      acc[key] = {
        chasseurNom: build.chasseurNom,
        element: build.element,
        builds: [],
      };
    }
    acc[key].builds.push(build);
    return acc;
  }, {} as Record<string, { chasseurNom: string; element: string; builds: BuildOption[] }>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          Copier depuis un autre build
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Copier un build existant</DialogTitle>
          <DialogDescription>
            Sélectionnez un build à copier pour pré-remplir le formulaire. Vous pourrez ensuite modifier les valeurs avant de sauvegarder.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Command className="rounded-lg border shadow-md">
            {/* Filtres par élément */}
            <div className="border-b px-3 py-3">
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {ELEMENT_OPTIONS.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setElementFilter(option.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 whitespace-nowrap ${
                        elementFilter === option.id
                          ? 'bg-solo-purple border-solo-purple text-white shadow-lg'
                          : 'bg-background border-border hover:bg-accent'
                      }`}
                    >
                      {option.image && (
                        <img
                          src={option.image}
                          alt={option.label}
                          className="w-4 h-4 object-contain"
                        />
                      )}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Barre de recherche */}
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                placeholder="Rechercher un chasseur ou un build..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <CommandList>
              <ScrollArea className="h-[600px]">
                {Object.keys(buildsByChasseur).length === 0 ? (
                  <CommandEmpty>Aucun build trouvé.</CommandEmpty>
                ) : (
                  Object.entries(buildsByChasseur).map(([key, group]) => {
                    // Récupérer l'image du premier build du groupe (tous ont la même image de chasseur)
                    const chasseurImage = group.builds[0]?.chasseurImage;
                    const elementIcon = getElementIcon(group.element, group.chasseurNom);

                    return (
                      <CommandGroup
                        key={key}
                        heading={
                          <div className="flex items-center gap-3 py-2">
                            {/* Image du chasseur dans le heading */}
                            {chasseurImage && (
                              <img
                                src={chasseurImage}
                                alt={group.chasseurNom}
                                className="w-10 h-10 rounded-full object-cover border-2 border-border"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                            <div className="flex items-center gap-2 flex-1">
                              <span className="font-bold text-lg">{group.chasseurNom}</span>
                              {/* Icône d'élément ou badge texte en fallback */}
                              {elementIcon ? (
                                <img
                                  src={elementIcon}
                                  alt={group.element}
                                  className="w-6 h-6 object-contain"
                                  title={group.element}
                                />
                              ) : (
                                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getElementBadgeColor(group.element)}`}>
                                  {group.element}
                                </span>
                              )}
                            </div>
                          </div>
                        }
                      >
                        <div className="flex flex-col gap-3 px-2 py-2">
                          {group.builds.map((build, index) => {
                            const definedStats = getDefinedStats(build.buildData);
                            const artefactIds = getEquippedArtefacts(build.buildData);
                            const noyauIds = getEquippedNoyaux(build.buildData);
                            const borderColor = getElementBorderColor(group.element);

                            return (
                              <div
                                key={`${key}-${index}`}
                                onClick={() => handleSelectBuild(build)}
                                className={`
                                  relative cursor-pointer rounded-lg border-2 border-l-4 ${borderColor}
                                  bg-card/50 hover:bg-card/80
                                  transition-all duration-200
                                  hover:shadow-lg hover:scale-[1.02] hover:border-primary/50
                                  p-4 group/item overflow-hidden
                                `}
                              >
                                {/* Indicateur de copie au hover */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                                  <div className="bg-primary/10 border border-primary/30 rounded-md p-1.5">
                                    <Copy className="h-4 w-4 text-primary" />
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2.5 w-full">
                                  {/* En-tête du build */}
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-1 h-6 rounded-full ${borderColor.replace('border-l-', 'bg-')}`}></div>
                                      <span className="font-bold text-base group-hover/item:text-primary transition-colors">
                                        {build.buildName}
                                      </span>
                                    </div>
                                    {build.chasseurId === currentChasseurId && (
                                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-md border border-blue-500/30 font-medium shadow-sm">
                                        Même chasseur
                                      </span>
                                    )}
                                  </div>

                                  {/* Stats définies */}
                                  {definedStats.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {definedStats.slice(0, 6).map((stat, idx) => (
                                        <span
                                          key={idx}
                                          className="text-xs bg-muted/70 hover:bg-muted px-2.5 py-1.5 rounded-md border border-border/50 shadow-sm transition-colors"
                                        >
                                          <span className="font-semibold text-foreground/90">{stat.label}:</span>{' '}
                                          <span className="text-foreground font-medium">{stat.value}</span>
                                        </span>
                                      ))}
                                      {definedStats.length > 6 && (
                                        <span className="text-xs text-muted-foreground px-2.5 py-1.5 font-medium">
                                          +{definedStats.length - 6} stats
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {/* Artefacts et Noyaux équipés */}
                                  {(artefactIds.length > 0 || noyauIds.length > 0) && (
                                    <div className="flex flex-col gap-2 bg-muted/30 rounded-md p-2.5 border border-border/30">
                                      {/* Artefacts */}
                                      {artefactIds.length > 0 && (
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[70px]">
                                            Artefacts:
                                          </span>
                                          <div className="flex gap-1.5 flex-wrap">
                                            {artefactIds.map((artefactId, idx) => {
                                              const artefact = artefactsMap.get(artefactId);
                                              return artefact?.image ? (
                                                <div
                                                  key={idx}
                                                  className="relative group/img"
                                                >
                                                  <img
                                                    src={artefact.image}
                                                    alt={`Artefact ${artefactId}`}
                                                    className="w-8 h-8 rounded-md border-2 border-border/50 object-cover transition-all hover:border-primary/50 hover:scale-110 shadow-sm"
                                                    onError={(e) => {
                                                      (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                  />
                                                </div>
                                              ) : null;
                                            })}
                                          </div>
                                        </div>
                                      )}

                                      {/* Noyaux */}
                                      {noyauIds.length > 0 && (
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[70px]">
                                            Noyaux:
                                          </span>
                                          <div className="flex gap-1.5 flex-wrap">
                                            {noyauIds.map((noyauId, idx) => {
                                              const noyau = noyauxMap.get(noyauId);
                                              return noyau?.image ? (
                                                <div
                                                  key={idx}
                                                  className="relative group/img"
                                                >
                                                  <img
                                                    src={noyau.image}
                                                    alt={`Noyau ${noyauId}`}
                                                    className="w-8 h-8 rounded-md border-2 border-border/50 object-cover transition-all hover:border-primary/50 hover:scale-110 shadow-sm"
                                                    onError={(e) => {
                                                      (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                  />
                                                </div>
                                              ) : null;
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Message si aucune donnée */}
                                  {definedStats.length === 0 && artefactIds.length === 0 && noyauIds.length === 0 && (
                                    <div className="flex items-center justify-center py-4 bg-muted/20 rounded-md border border-dashed border-border/50">
                                      <span className="text-xs text-muted-foreground italic">
                                        Aucune donnée disponible
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CommandGroup>
                    );
                  })
                )}
              </ScrollArea>
            </CommandList>
          </Command>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Helper pour obtenir l'icône d'élément
function getElementIcon(element: string, chasseurNom: string): string | null {
  const elementLower = element.toLowerCase();

  // Cas spécial pour Sung Jinwoo
  if (chasseurNom.toLowerCase().includes("jinwoo")) {
    return ELEMENT_OPTIONS.find(el => el.id === "jinwoo")?.image || null;
  }

  // Recherche de l'icône d'élément
  const elementOption = ELEMENT_OPTIONS.find(el =>
    el.id === elementLower ||
    elementLower.includes(el.id) ||
    (el.id === "tenebres" && (elementLower.includes("ombre") || elementLower.includes("ténèbre")))
  );

  return elementOption?.image || null;
}

// Helper pour obtenir la couleur de bordure gauche selon l'élément
function getElementBorderColor(element: string): string {
  const elementLower = element.toLowerCase();

  if (elementLower.includes('feu')) return 'border-l-red-500 hover:shadow-red-500/20';
  if (elementLower.includes('eau')) return 'border-l-blue-500 hover:shadow-blue-500/20';
  if (elementLower.includes('glace')) return 'border-l-cyan-500 hover:shadow-cyan-500/20';
  if (elementLower.includes('électricité') || elementLower.includes('electric')) return 'border-l-yellow-500 hover:shadow-yellow-500/20';
  if (elementLower.includes('vent')) return 'border-l-green-500 hover:shadow-green-500/20';
  if (elementLower.includes('terre')) return 'border-l-amber-600 hover:shadow-amber-600/20';
  if (elementLower.includes('lumière') || elementLower.includes('lumiere')) return 'border-l-yellow-300 hover:shadow-yellow-300/20';
  if (elementLower.includes('ombre') || elementLower.includes('ténèbre') || elementLower.includes('tenebre')) return 'border-l-purple-500 hover:shadow-purple-500/20';

  return 'border-l-gray-500 hover:shadow-gray-500/20';
}

// Helper pour obtenir la couleur de badge selon l'élément (fallback si pas d'icône)
function getElementBadgeColor(element: string): string {
  const elementLower = element.toLowerCase();

  if (elementLower.includes('feu')) return 'bg-red-500/20 text-red-400 border-red-500/30';
  if (elementLower.includes('eau')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  if (elementLower.includes('glace')) return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
  if (elementLower.includes('électricité') || elementLower.includes('electric')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  if (elementLower.includes('vent')) return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (elementLower.includes('terre')) return 'bg-amber-700/20 text-amber-400 border-amber-700/30';
  if (elementLower.includes('lumière') || elementLower.includes('lumiere')) return 'bg-yellow-200/20 text-yellow-200 border-yellow-200/30';
  if (elementLower.includes('ombre') || elementLower.includes('ténèbre') || elementLower.includes('tenebre')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';

  return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
}

// Helper pour obtenir les stats définies (non vides et différentes de "-")
function getDefinedStats(buildData: Record<string, unknown>): Array<{ label: string; value: string }> {
  const stats = buildData.stats as Record<string, string> | undefined;
  if (!stats) return [];

  return Object.entries(stats)
    .filter(([_, value]) => value && value !== '-' && value.trim() !== '')
    .map(([label, value]) => ({ label, value }));
}

// Helper pour obtenir les artefacts équipés
function getEquippedArtefacts(buildData: Record<string, unknown>): number[] {
  const artefacts = buildData.artefacts as Record<string, { id: number } | Array<{ id: number }>> | undefined;
  if (!artefacts) return [];

  const artefactIds: number[] = [];
  const slots = ['casque', 'armure', 'gants', 'bottes', 'collier', 'bracelet', 'bague', 'boucles'];

  slots.forEach(slot => {
    const artefact = artefacts[slot];
    if (artefact) {
      if (Array.isArray(artefact)) {
        // Pour les bottes qui peuvent avoir plusieurs variantes, prendre uniquement la première
        if (artefact.length > 0 && artefact[0]?.id) {
          artefactIds.push(artefact[0].id);
        }
      } else if (artefact.id) {
        artefactIds.push(artefact.id);
      }
    }
  });

  return artefactIds;
}

// Helper pour obtenir les noyaux équipés (premier noyau de chaque slot)
function getEquippedNoyaux(buildData: Record<string, unknown>): number[] {
  const noyaux = buildData.noyaux as Record<string, Array<{ id: number }>> | undefined;
  if (!noyaux) return [];

  const noyauIds: number[] = [];
  const slots = ['1', '2', '3'];

  slots.forEach(slot => {
    const noyauArray = noyaux[slot];
    if (Array.isArray(noyauArray) && noyauArray.length > 0 && noyauArray[0]?.id) {
      noyauIds.push(noyauArray[0].id);
    }
  });

  return noyauIds;
}

