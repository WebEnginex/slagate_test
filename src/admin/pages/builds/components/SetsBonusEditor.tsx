import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Layers } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EditorReferenceData } from '../../../types';

interface Props {
  setsBonus: Array<{ id: number }>;
  availableSets: EditorReferenceData['setsBonus'];
  onChange: (setsBonus: Array<{ id: number }>) => void;
}

function SetsBonusEditor({ setsBonus, availableSets, onChange }: Props) {
  
  const addSetBonus = () => {
    onChange([...setsBonus, { id: 0 }]);
  };

  const updateSetBonus = (index: number, id: number) => {
    const newSetsBonus = [...setsBonus];
    newSetsBonus[index] = { id };
    onChange(newSetsBonus);
  };

  const removeSetBonus = (index: number) => {
    const newSetsBonus = setsBonus.filter((_, i) => i !== index);
    onChange(newSetsBonus);
  };

  const clearAllSets = () => {
    onChange([]);
  };

  // Obtenir les sets déjà sélectionnés pour éviter les doublons
  const selectedSetIds = setsBonus.map(set => set.id).filter(id => id !== 0);
  const availableSetsFiltered = availableSets.filter(set => !selectedSetIds.includes(set.id));

  return (
    <div className="space-y-6">
      {/* En-tête et actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Sets Bonus ({setsBonus.length})
            </CardTitle>
            
            <div className="flex gap-2">
              <Button size="sm" onClick={addSetBonus} disabled={selectedSetIds.length >= availableSets.length}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
              {setsBonus.length > 0 && (
                <Button size="sm" variant="outline" onClick={clearAllSets}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Effacer tout
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        {setsBonus.length > 0 && (
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configurez jusqu'à {availableSets.length} sets bonus pour optimiser les performances du chasseur.
            </p>
          </CardContent>
        )}
      </Card>

      {/* Liste des sets bonus */}
      <div className="space-y-4">
        {setsBonus.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Layers className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-4">Aucun set bonus configuré</p>
                <Button onClick={addSetBonus}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter le premier set
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {setsBonus.map((setBonus, index) => {
              const setData = availableSets.find(set => set.id === setBonus.id);
              
              return (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`set-${index}`}>Set Bonus {index + 1}</Label>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeSetBonus(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <Select
                          value={setBonus.id.toString()}
                          onValueChange={(value) => updateSetBonus(index, parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un set bonus..." />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Set actuellement sélectionné */}
                            {setData && (
                              <SelectItem value={setData.id.toString()}>
                                {setData.nom}
                              </SelectItem>
                            )}
                            
                            {/* Sets disponibles */}
                            {availableSetsFiltered.map((set) => (
                              <SelectItem key={set.id} value={set.id.toString()}>
                                {set.nom}
                              </SelectItem>
                            ))}
                            
                            {/* Option vide */}
                            <SelectItem value="0">
                              <span className="text-muted-foreground italic">Aucun set</span>
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {setData && (
                          <Badge variant="outline" className="w-fit text-xs">
                            ID: {setData.id}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Résumé des sets actifs */}
      {setsBonus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sets Bonus Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {setsBonus.map((setBonus, index) => {
                const setData = availableSets.find(set => set.id === setBonus.id);
                
                return (
                  <Badge 
                    key={index}
                    variant={setData ? "default" : "outline"}
                    className="flex items-center gap-2"
                  >
                    <span>{setData ? setData.nom : 'Non configuré'}</span>
                    <button
                      onClick={() => removeSetBonus(index)}
                      className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>

            {setsBonus.some(set => set.id === 0) && (
              <p className="text-sm text-yellow-600 mt-2">
                ⚠️ Certains sets bonus ne sont pas configurés
              </p>
            )}

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold">{setsBonus.length}</div>
                <div className="text-xs text-muted-foreground">Sets configurés</div>
              </div>
              <div>
                <div className="text-lg font-bold">
                  {setsBonus.filter(set => set.id !== 0).length}
                </div>
                <div className="text-xs text-muted-foreground">Sets actifs</div>
              </div>
              <div>
                <div className="text-lg font-bold">
                  {availableSets.length - selectedSetIds.length}
                </div>
                <div className="text-xs text-muted-foreground">Sets disponibles</div>
              </div>
              <div>
                <div className="text-lg font-bold">{availableSets.length}</div>
                <div className="text-xs text-muted-foreground">Sets totaux</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SetsBonusEditor;
export { SetsBonusEditor };