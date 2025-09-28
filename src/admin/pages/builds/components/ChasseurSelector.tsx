import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Search, Trash2, User } from 'lucide-react';
import LazyImage from '@/lib/lazy';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ChasseurBuild, EditorReferenceData, Element, ELEMENTS } from '../../../types';

interface Props {
  chasseurs: EditorReferenceData['chasseurs'];
  builds: ChasseurBuild[];
  selectedChasseurId: number | null;
  onSelectChasseur: (id: number) => void;
  onAddBuild: (chasseurId: number, element: Element) => void;
  onRemoveBuild: (chasseurId: number) => void;
}

function ChasseurSelector({
  chasseurs,
  builds,
  selectedChasseurId,
  onSelectChasseur,
  onAddBuild,
  onRemoveBuild
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElement, setSelectedElement] = useState<string>('all');
  const [newBuildChasseurId, setNewBuildChasseurId] = useState<number | null>(null);
  const [newBuildElement, setNewBuildElement] = useState<Element>('feu');

  // Fonctions utilitaires (déclarées avant utilisation)
  // Fonction pour extraire le nom de l'élément depuis une URL Supabase
  const extractElementName = (elementUrl: string): string => {
    if (!elementUrl) return 'unknown';
    
    // Si c'est déjà un nom simple, le retourner tel quel
    if (!elementUrl.includes('supabase') && !elementUrl.includes('http')) {
      return elementUrl.toLowerCase();
    }
    
    // Extraire le nom du fichier depuis l'URL
    const fileName = elementUrl.split('/').pop() || '';
    const elementName = fileName.replace('_element.webp', '').replace('.webp', '');
    
    // Mapper les noms de fichiers vers des noms d'éléments
    const elementMapping: { [key: string]: string } = {
      'eau_element': 'eau',
      'feu_element': 'feu', 
      'vent_element': 'vent',
      'lumiere_element': 'lumiere',
      'tenebres_element': 'tenebres',
      'Tenebres_element': 'tenebres', // Ajouter la variante avec majuscule
      'ténèbres_element': 'tenebres', // Ajouter la variante avec accent
      'Ténèbres_element': 'tenebres', // Ajouter les deux
      'jinwoo_element': 'jinwoo'
    };
    
    // Essayer d'abord le mapping exact
    if (elementMapping[elementName]) {
      return elementMapping[elementName];
    }
    
    // Si pas trouvé, essayer de nettoyer le nom et chercher une correspondance
    const cleanElementName = elementName.toLowerCase()
      .normalize('NFD') // Normaliser les accents
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z]/g, ''); // Garder seulement les lettres
    
    // Chercher une correspondance partielle
    const partialMatch = Object.entries(elementMapping).find(([key, value]) => 
      key.toLowerCase().includes(cleanElementName) || cleanElementName.includes(value)
    );
    
    return partialMatch ? partialMatch[1] : elementName.toLowerCase();
  };

  const getElementDisplayName = (element: string): string => {
    // Gestion spéciale pour Jin-Woo - si l'élément contient "jinwoo" directement
    if (element === 'jinwoo' || element.toLowerCase().includes('jinwoo')) {
      return 'Jin-Woo';
    }
    
    const elementName = extractElementName(element);
    const displayNames = {
      feu: 'Feu',
      eau: 'Eau',
      vent: 'Vent',
      lumiere: 'Lumière',
      tenebres: 'Ténèbres',
      jinwoo: 'Jin-Woo'
    };
    
    // Si l'élément est reconnu, utiliser le nom d'affichage
    if (displayNames[elementName as keyof typeof displayNames]) {
      return displayNames[elementName as keyof typeof displayNames];
    }
    
    // Pour Jin-Woo spécifiquement, même si extractElementName échoue
    if (elementName === 'unknown' && element === 'jinwoo') {
      return 'Jin-Woo';
    }
    
    return elementName;
  };

  // Fonction pour obtenir l'URL de l'image d'élément à partir des données réelles des chasseurs
  const getElementImageUrl = (elementName: string): string => {
    // Chercher un chasseur qui a cet élément pour récupérer la vraie image
    const chasseurWithElement = chasseurs.find(chasseur => {
      const chasseurElementName = extractElementName(chasseur.element);
      return chasseurElementName === elementName;
    });
    
    // Si on trouve un chasseur avec cet élément, utiliser son image d'élément
    if (chasseurWithElement && chasseurWithElement.element) {
      return chasseurWithElement.element;
    }
    
    // Fallback vers les URLs génériques si pas trouvé
    const baseUrl = 'https://lodkwexwymmybbuhbdz.supabase.co/storage/v1/object/public/elements';
    const elementUrls = {
      feu: `${baseUrl}/Feu_element.webp`,
      eau: `${baseUrl}/Eau_element.webp`,
      vent: `${baseUrl}/Vent_element.webp`,
      lumiere: `${baseUrl}/Lumiere_element.webp`,
      tenebres: `${baseUrl}/Tenebres_element.webp`,
      jinwoo: `${baseUrl}/Eau_element.webp` // Utiliser Eau par défaut pour Jin-Woo
    };
    return elementUrls[elementName as keyof typeof elementUrls] || `${baseUrl}/Feu_element.webp`;
  };

  // Fonction pour obtenir l'image de Sung Jin-Woo
  const getJinwooImageUrl = (): string => {
    // Chercher Sung Jin-Woo dans les chasseurs pour obtenir son image
    const jinwoo = chasseurs.find(c => c.id === 40);
    return jinwoo?.image || "/placeholder.svg";
  };

  // Fonction pour obtenir l'image d'élément à afficher dans le badge
  const getBadgeElementImage = (chasseur: EditorReferenceData['chasseurs'][0]): string => {
    // Pour Jin-Woo, utiliser son portrait
    if (chasseur.id === 40) {
      return chasseur.image || "/placeholder.svg";
    }
    
    // Pour les autres, utiliser l'image d'élément depuis Supabase
    return chasseur.element || "/placeholder.svg";
  };

  const getElementColor = (element: string) => {
    // Retirer les fonds de couleur, utiliser un style neutre
    return 'bg-transparent border-muted-foreground/20 text-foreground';
  };

  // Filtrage des chasseurs
  const filteredChasseurs = chasseurs.filter(chasseur => {
    const matchesSearch = chasseur.nom.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Gestion spéciale pour Jin-Woo (ID 40)
    if (selectedElement === 'jinwoo') {
      return matchesSearch && chasseur.id === 40;
    }
    
    // Pour les autres éléments, utiliser extractElementName pour une comparaison correcte
    const chasseurElementName = extractElementName(chasseur.element);
    const matchesElement = selectedElement === 'all' || chasseurElementName === selectedElement;
    
    return matchesSearch && matchesElement;
  });

  // Obtenir les chasseurs avec builds et sans builds
  const chasseursWithBuilds = builds.map(b => b.chasseurId);
  const chasseursWithBuildsData = chasseurs.filter(c => chasseursWithBuilds.includes(c.id));
  const chasseursWithoutBuilds = chasseurs.filter(c => !chasseursWithBuilds.includes(c.id));

  const getBuildCount = (chasseurId: number) => {
    const chasseurBuild = builds.find(b => b.chasseurId === chasseurId);
    return chasseurBuild ? chasseurBuild.builds.length : 0;
  };

  const handleAddBuild = () => {
    if (newBuildChasseurId) {
      onAddBuild(newBuildChasseurId, newBuildElement);
      setNewBuildChasseurId(null);
    }
  };



  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5" />
          Chasseurs
        </CardTitle>
        
        {/* Filtres */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un chasseur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filtres par image cliquable */}
          <div>
            <label className="text-sm font-medium mb-2 block">Filtrer par élément</label>
            <div className="flex flex-wrap gap-2">
              {/* Bouton "Tous" */}
              <Button
                variant={selectedElement === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedElement('all')}
                className="h-8 px-2 text-xs"
              >
                Tous
              </Button>
              
              {/* Boutons des éléments */}
              {['feu', 'eau', 'vent', 'lumiere', 'tenebres'].map((element) => (
                <Button
                  key={element}
                  variant={selectedElement === element ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedElement(element)}
                  className="h-8 w-8 p-0"
                  title={getElementDisplayName(element)}
                >
                  <LazyImage
                    src={getElementImageUrl(element)}
                    alt={getElementDisplayName(element)}
                    className="w-5 h-5 object-contain bg-transparent"
                  />
                </Button>
              ))}
              
              {/* Bouton Jin-Woo */}
              <Button
                variant={selectedElement === 'jinwoo' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedElement('jinwoo')}
                className="h-8 w-8 p-0"
                title="Sung Jin-Woo"
              >
                <LazyImage
                  src={getJinwooImageUrl()}
                  alt="Sung Jin-Woo"
                  className="w-5 h-5 object-cover rounded-sm bg-transparent"
                />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Liste déroulante pour sélectionner un chasseur */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sélectionner un chasseur</label>
            <Select
              value={selectedChasseurId?.toString() || ''}
              onValueChange={(value) => {
                const chasseurId = value ? parseInt(value) : null;
                if (chasseurId) {
                  onSelectChasseur(chasseurId);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un chasseur..." />
              </SelectTrigger>
              <SelectContent>
                {/* Chasseurs avec builds */}
                {chasseursWithBuildsData.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50">
                      Chasseurs configurés
                    </div>
                    {chasseursWithBuildsData
                      .filter(chasseur => {
                        const matchesSearch = chasseur.nom.toLowerCase().includes(searchTerm.toLowerCase());
                        
                        // Gestion spéciale pour Jin-Woo (ID 40)
                        if (selectedElement === 'jinwoo') {
                          return matchesSearch && chasseur.id === 40;
                        }
                        
                        const chasseurElementName = extractElementName(chasseur.element);
                        const matchesElement = selectedElement === 'all' || chasseurElementName === selectedElement;
                        return matchesSearch && matchesElement;
                      })
                      .map((chasseur) => (
                        <SelectItem key={chasseur.id} value={chasseur.id.toString()}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <LazyImage
                                src={chasseur.image || "/placeholder.svg"}
                                alt={chasseur.nom}
                                className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                              />
                              <span>{chasseur.nom}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-xs ${getElementColor(chasseur.element)} flex items-center gap-1`}>
                                <LazyImage
                                  src={getBadgeElementImage(chasseur)}
                                  alt={getElementDisplayName(chasseur.element)}
                                  className={`w-3 h-3 object-contain flex-shrink-0 bg-transparent ${chasseur.id === 40 ? 'rounded-full' : ''}`}
                                />
                                {getElementDisplayName(chasseur.element)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {getBuildCount(chasseur.id)} build(s)
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                  </>
                )}
                
                {/* Chasseurs sans builds */}
                {chasseursWithoutBuilds.length > 0 && (
                  <>
                    {chasseursWithBuildsData.length > 0 && <Separator />}
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50">
                      Chasseurs disponibles
                    </div>
                    {chasseursWithoutBuilds
                      .filter(chasseur => {
                        const matchesSearch = chasseur.nom.toLowerCase().includes(searchTerm.toLowerCase());
                        
                        // Gestion spéciale pour Jin-Woo (ID 40)
                        if (selectedElement === 'jinwoo') {
                          return matchesSearch && chasseur.id === 40;
                        }
                        
                        const chasseurElementName = extractElementName(chasseur.element);
                        const matchesElement = selectedElement === 'all' || chasseurElementName === selectedElement;
                        return matchesSearch && matchesElement;
                      })
                      .map((chasseur) => (
                        <SelectItem key={chasseur.id} value={chasseur.id.toString()}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <LazyImage
                                src={chasseur.image || "/placeholder.svg"}
                                alt={chasseur.nom}
                                className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                              />
                              <span className="text-muted-foreground">{chasseur.nom}</span>
                            </div>
                            <Badge variant="outline" className={`text-xs ${getElementColor(chasseur.element)} flex items-center gap-1`}>
                              <LazyImage
                                src={getBadgeElementImage(chasseur)}
                                alt={getElementDisplayName(chasseur.element)}
                                className={`w-3 h-3 object-contain flex-shrink-0 bg-transparent ${chasseur.id === 40 ? 'rounded-full' : ''}`}
                              />
                              {getElementDisplayName(chasseur.element)}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Actions pour le chasseur sélectionné */}
          {selectedChasseurId && (
            <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">
                  {chasseurs.find(c => c.id === selectedChasseurId)?.nom}
                </h4>
                <div className="flex gap-2">
                  {chasseursWithBuilds.includes(selectedChasseurId) && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onRemoveBuild(selectedChasseurId)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Supprimer
                    </Button>
                  )}
                </div>
              </div>
              
              {chasseursWithBuilds.includes(selectedChasseurId) ? (
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getBuildCount(selectedChasseurId)} build(s) configuré(s)
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Ce chasseur n'a pas encore de build configuré.</p>
                  <div className="flex gap-2">
                    <Select value={newBuildElement} onValueChange={(value) => setNewBuildElement(value as Element)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Élément du build" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feu">
                          <div className="flex items-center gap-2">
                            <LazyImage
                              src={getElementImageUrl('feu')}
                              alt="Feu"
                              className="w-4 h-4 object-contain bg-transparent"
                            />
                            Feu
                          </div>
                        </SelectItem>
                        <SelectItem value="eau">
                          <div className="flex items-center gap-2">
                            <LazyImage
                              src={getElementImageUrl('eau')}
                              alt="Eau"
                              className="w-4 h-4 object-contain bg-transparent"
                            />
                            Eau
                          </div>
                        </SelectItem>
                        <SelectItem value="vent">
                          <div className="flex items-center gap-2">
                            <LazyImage
                              src={getElementImageUrl('vent')}
                              alt="Vent"
                              className="w-4 h-4 object-contain bg-transparent"
                            />
                            Vent
                          </div>
                        </SelectItem>
                        <SelectItem value="lumiere">
                          <div className="flex items-center gap-2">
                            <LazyImage
                              src={getElementImageUrl('lumiere')}
                              alt="Lumière"
                              className="w-4 h-4 object-contain bg-transparent"
                            />
                            Lumière
                          </div>
                        </SelectItem>
                        <SelectItem value="tenebres">
                          <div className="flex items-center gap-2">
                            <LazyImage
                              src={getElementImageUrl('tenebres')}
                              alt="Ténèbres"
                              className="w-4 h-4 object-contain bg-transparent"
                            />
                            Ténèbres
                          </div>
                        </SelectItem>
                        <SelectItem value="jinwoo">
                          <div className="flex items-center gap-2">
                            <LazyImage
                              src={getElementImageUrl('jinwoo')}
                              alt="Jin-Woo"
                              className="w-4 h-4 object-contain bg-transparent"
                            />
                            Jin-Woo
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      onClick={() => {
                        onAddBuild(selectedChasseurId, newBuildElement);
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Créer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Statistiques rapides */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold">{chasseursWithBuildsData.length}</div>
              <div className="text-xs text-muted-foreground">Configurés</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-bold">{chasseursWithoutBuilds.length}</div>
              <div className="text-xs text-muted-foreground">Disponibles</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ChasseurSelector;
export { ChasseurSelector };