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
import LazyImage from '@/lib/lazy';
import type { NoyauFormData, EditorReferenceData } from '../../../types';

interface Props {
  noyaux: Record<number, NoyauFormData[]>;
  availableNoyaux: EditorReferenceData['noyaux'];
  onChange: (noyaux: Record<number, NoyauFormData[]>) => void;
}

function NoyauEditor({ noyaux, availableNoyaux, onChange }: Props) {
  const SLOTS = [1, 2, 3] as const;

  const updateSlotNoyaux = (slot: number, slotNoyaux: NoyauFormData[]) => {
    onChange({
      ...noyaux,
      [slot]: slotNoyaux
    });
  };

  const addNoyau = (slot: number) => {
    const currentNoyaux = noyaux[slot] || [];
    const newNoyau: NoyauFormData = {
      id: 0,
      statPrincipale: ''
    };
    
    updateSlotNoyaux(slot, [...currentNoyaux, newNoyau]);
  };

  const updateNoyau = (slot: number, index: number, noyau: NoyauFormData) => {
    const currentNoyaux = [...(noyaux[slot] || [])];
    currentNoyaux[index] = noyau;
    updateSlotNoyaux(slot, currentNoyaux);
  };

  const removeNoyau = (slot: number, index: number) => {
    const currentNoyaux = [...(noyaux[slot] || [])];
    currentNoyaux.splice(index, 1);
    updateSlotNoyaux(slot, currentNoyaux);
  };

  const removeAllNoyaux = (slot: number) => {
    const newNoyaux = { ...noyaux };
    delete newNoyaux[slot];
    onChange(newNoyaux);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SLOTS.map((slot) => {
          const slotNoyaux = noyaux[slot] || [];
          
          return (
            <Card key={slot} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Slot {slot}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addNoyau(slot)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    {slotNoyaux.length > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeAllNoyaux(slot)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="w-fit">
                  {slotNoyaux.length} noyau(x)
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {slotNoyaux.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">Aucun noyau configuré</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addNoyau(slot)}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un noyau
                    </Button>
                  </div>
                ) : (
                  slotNoyaux.map((noyau, index) => (
                    <Card key={index} className="border-muted">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Noyau {index + 1}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeNoyau(slot, index)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Sélection du noyau */}
                        <div>
                          <Label htmlFor={`noyau-${slot}-${index}`}>Noyau</Label>
                          <Select
                            value={noyau.id.toString()}
                            onValueChange={(value) => {
                              if (value) {
                                updateNoyau(slot, index, {
                                  ...noyau,
                                  id: parseInt(value)
                                });
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un noyau..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableNoyaux.map((noyauOption) => (
                                <SelectItem key={noyauOption.id} value={noyauOption.id.toString()}>
                                  <div className="flex items-center gap-2">
                                    {noyauOption.image ? (
                                      <LazyImage
                                        src={noyauOption.image}
                                        alt={noyauOption.nom}
                                        className="w-5 h-5 object-contain flex-shrink-0 bg-transparent"
                                      />
                                    ) : (
                                      <div className="w-5 h-5 bg-muted rounded flex items-center justify-center text-xs">
                                        N
                                      </div>
                                    )}
                                    <span>{noyauOption.nom}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Stat principale */}
                        <div>
                          <Label htmlFor={`stat-${slot}-${index}`}>Stat principale</Label>
                          <Select
                            value={noyau.statPrincipale}
                            onValueChange={(value) => {
                              updateNoyau(slot, index, {
                                ...noyau,
                                statPrincipale: value
                              });
                            }}
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
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Résumé */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Résumé des noyaux</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {SLOTS.map((slot) => {
              const slotNoyaux = noyaux[slot] || [];
              const totalNoyaux = slotNoyaux.length;
              
              return (
                <div key={slot} className="text-center">
                  <div className="text-sm font-medium">Slot {slot}</div>
                  <Badge variant={totalNoyaux > 0 ? "default" : "outline"}>
                    {totalNoyaux} noyau(x)
                  </Badge>
                  {slotNoyaux.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {slotNoyaux.map((noyau, index) => {
                        const noyauData = availableNoyaux.find(n => n.id === noyau.id);
                        return (
                          <div key={index} className="text-xs text-muted-foreground">
                            {noyauData ? noyauData.nom : `ID: ${noyau.id}`}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NoyauEditor;
export { NoyauEditor };