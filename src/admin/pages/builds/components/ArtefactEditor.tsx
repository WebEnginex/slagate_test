import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import LazyImage from '@/lib/lazy';
import type { ArtefactFormData, EditorReferenceData, ARTEFACT_SLOTS } from '../../../types';

interface Props {
  artefacts: Record<string, ArtefactFormData>;
  availableArtefacts: EditorReferenceData['artefacts'];
  onChange: (artefacts: Record<string, ArtefactFormData>) => void;
}

const SLOTS = ['casque', 'armure', 'gants', 'bottes', 'collier', 'bracelet', 'bague', 'boucles'] as const;

function ArtefactEditor({ artefacts, availableArtefacts, onChange }: Props) {
  
  const updateArtefact = (slot: string, artefact: ArtefactFormData) => {
    onChange({
      ...artefacts,
      [slot]: artefact
    });
  };

  const removeArtefact = (slot: string) => {
    const newArtefacts = { ...artefacts };
    delete newArtefacts[slot];
    onChange(newArtefacts);
  };



  const getArtefactsByCategory = (category: string) => {
    return availableArtefacts.filter(a => a.categorie === category);
  };

  const getCategoryForSlot = (slot: string): string => {
    const categoryMap: Record<string, string> = {
      casque: 'Casque',
      armure: 'Armure',
      gants: 'Gants',
      bottes: 'Bottes',
      collier: 'Collier',
      bracelet: 'Bracelet',
      bague: 'Bague',
      boucles: 'Boucles d\'oreilles'
    };
    return categoryMap[slot] || slot;
  };

  const STATS_OPTIONS = [
    'Attaque supplémentaire',
    'Défense supplémentaire',
    'PV supplémentaire',
    'PM',
    'Taux de coup critique',
    'Dégâts de coup critique',
    'Hausse des dégâts',
    'Pénétration de défense',
    'Réduction des dégâts',
    'Précision',
    'Hausse des soins donnés',
    'Hausse des soins reçus',
    'Hausse du taux de récupération des PM',
    'Baisse du coût de PM'
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SLOTS.map((slot) => {
          const artefact = artefacts[slot];
          const categoryArtefacts = getArtefactsByCategory(getCategoryForSlot(slot));
          
          return (
            <Card key={slot} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base capitalize">{slot}</CardTitle>
                  {artefact && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeArtefact(slot)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Sélection de l'artefact */}
                <div>
                  <Label htmlFor={`artefact-${slot}`}>Artefact</Label>
                  <Select
                    value={artefact?.id.toString() || ''}
                    onValueChange={(value) => {
                      if (value) {
                        const selectedArtefact = availableArtefacts.find(a => a.id === parseInt(value));
                        if (selectedArtefact) {
                          updateArtefact(slot, {
                            id: selectedArtefact.id,
                            statPrincipale: artefact?.statPrincipale || '',
                            statsSecondaires: [] // Toujours inclure pour compatibilité avec le format de sauvegarde
                          });
                        }
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Sélectionner un ${slot}...`} />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryArtefacts.map((art) => (
                        <SelectItem key={art.id} value={art.id.toString()}>
                          <div className="flex items-center gap-2">
                            {art.image ? (
                              <LazyImage
                                src={art.image}
                                alt={art.nom}
                                className="w-5 h-5 object-contain flex-shrink-0 bg-transparent"
                              />
                            ) : (
                              <div className="w-5 h-5 bg-muted rounded flex items-center justify-center text-xs">
                                {art.categorie.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span>{art.nom}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {artefact && (
                  <>
                    {/* Stat principale */}
                    <div>
                      <Label htmlFor={`stat-principale-${slot}`}>Stat principale</Label>
                      <Select
                        value={artefact.statPrincipale}
                        onValueChange={(value) => updateArtefact(slot, { ...artefact, statPrincipale: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une stat..." />
                        </SelectTrigger>
                        <SelectContent>
                          {STATS_OPTIONS.map((stat) => (
                            <SelectItem key={stat} value={stat}>
                              {stat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>


                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Résumé */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Résumé des artefacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SLOTS.map((slot) => {
              const artefact = artefacts[slot];
              const artefactData = artefact ? availableArtefacts.find(a => a.id === artefact.id) : null;
              
              return (
                <div key={slot} className="text-center">
                  <div className="text-xs font-medium capitalize">{slot}</div>
                  <Badge variant={artefact ? "default" : "outline"} className="text-xs">
                    {artefactData ? artefactData.nom : 'Vide'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ArtefactEditor;
export { ArtefactEditor };