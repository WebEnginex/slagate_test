import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, BarChart2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  stats: Record<string, string>;
  onChange: (stats: Record<string, string>) => void;
}

const STATS_TEMPLATES = {
  'DPS Standard': {
    "Force": "695 Points",
    "Attaque supplémentaire": "Le plus possible",
    "Taux de coup critique": "50%",
    "Dégâts de coup critique": "200% - 210%",
    "Hausse des dégâts": "30% +",
    "Pénétration de défense": "10% - 20%"
  },
  'Tank/Support': {
    "Vitalité": "695 Points",
    "PV supplémentaire": "Le plus possible",
    "Défense supplémentaire": "Le plus possible",
    "Réduction des dégâts": "30% +",
    "Hausse des soins reçus": "20% +",
    "PM": "Le plus possible"
  },
  'Critique DPS': {
    "Force": "695 Points",
    "Taux de coup critique": "100%",
    "Dégâts de coup critique": "250% +",
    "Attaque supplémentaire": "Le plus possible",
    "Hausse des dégâts": "35% +",
    "Pénétration de défense": "15% - 25%"
  }
};

const STATS_OPTIONS = [
  'Force',
  'Vitalité', 
  'Agilité',
  'Intelligence',
  'Perception',
  'PV supplémentaire',
  'Défense supplémentaire', 
  'PM',
  'Attaque supplémentaire',
  'Précision',
  'Taux de coup critique',
  'Dégâts de coup critique',
  'Hausse des dégâts',
  'Pénétration de défense',
  'Réduction des dégâts',
  'Hausse des soins donnés',
  'Hausse des soins reçus',
  'Hausse du taux de récupération des PM',
  'Baisse du coût de PM'
];

function StatsEditor({ stats, onChange }: Props) {
  
  const addStat = () => {
    const availableStats = STATS_OPTIONS.filter(stat => !(stat in stats));
    if (availableStats.length > 0) {
      onChange({
        ...stats,
        [availableStats[0]]: ''
      });
    }
  };

  const updateStat = (oldKey: string, newKey: string, value: string) => {
    if (oldKey === newKey) {
      onChange({
        ...stats,
        [oldKey]: value
      });
    } else {
      const newStats = { ...stats };
      delete newStats[oldKey];
      newStats[newKey] = value;
      onChange(newStats);
    }
  };

  const removeStat = (key: string) => {
    const newStats = { ...stats };
    delete newStats[key];
    onChange(newStats);
  };

  const applyTemplate = (templateName: keyof typeof STATS_TEMPLATES) => {
    onChange(STATS_TEMPLATES[templateName]);
  };

  const clearAllStats = () => {
    onChange({});
  };

  const statsEntries = Object.entries(stats);

  return (
    <div className="space-y-6">
      {/* Templates et actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Templates de stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(STATS_TEMPLATES).map((template) => (
              <Button
                key={template}
                size="sm"
                variant="outline"
                onClick={() => applyTemplate(template as keyof typeof STATS_TEMPLATES)}
              >
                {template}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" onClick={addStat} disabled={statsEntries.length >= STATS_OPTIONS.length}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une stat
            </Button>
            <Button size="sm" variant="outline" onClick={clearAllStats}>
              <Trash2 className="h-4 w-4 mr-2" />
              Effacer tout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Éditeur de stats */}
      <div className="space-y-4">
        {statsEntries.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Aucune stat configurée</p>
                <Button onClick={addStat}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter la première stat
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statsEntries.map(([statKey, statValue], index) => (
              <Card key={`${statKey}-${index}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      {/* Sélection de la stat */}
                      <div>
                        <Label htmlFor={`stat-key-${index}`}>Statistique</Label>
                        <Select
                          value={statKey}
                          onValueChange={(newKey) => updateStat(statKey, newKey, statValue)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATS_OPTIONS.map((stat) => (
                              <SelectItem 
                                key={stat} 
                                value={stat}
                                disabled={stat in stats && stat !== statKey}
                              >
                                {stat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Valeur de la stat */}
                      <div>
                        <Label htmlFor={`stat-value-${index}`}>Valeur</Label>
                        <Input
                          id={`stat-value-${index}`}
                          value={statValue}
                          onChange={(e) => updateStat(statKey, statKey, e.target.value)}
                          placeholder="Ex: 695 Points, 50%, Le plus possible..."
                        />
                      </div>
                    </div>

                    {/* Bouton supprimer */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeStat(statKey)}
                      className="mt-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Aperçu */}
      {statsEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aperçu des stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {statsEntries.map(([statKey, statValue]) => (
                <div key={statKey} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span className="text-sm font-medium truncate">{statKey}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {statValue || ''}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default StatsEditor;
export { StatsEditor };