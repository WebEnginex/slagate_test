import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Copy, Settings } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ArtefactEditor from './ArtefactEditor';
import NoyauEditor from './NoyauEditor';
import StatsEditor from './StatsEditor';
import SetsBonusEditor from './SetsBonusEditor';
import type { 
  ChasseurBuild, 
  EditorReferenceData, 
  BuildFormData, 
  Element 
} from '../../../types';

interface Props {
  chasseurBuild: ChasseurBuild;
  chasseur: { id: number; nom: string; element: string };
  referenceData: EditorReferenceData;
  onChange: (build: ChasseurBuild) => void;
}

function BuildEditor({ chasseurBuild, chasseur, referenceData, onChange }: Props) {
  const [selectedBuildIndex, setSelectedBuildIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('artefacts');

  const currentBuild = chasseurBuild.builds[selectedBuildIndex];

  const updateBuild = (updatedBuild: BuildFormData) => {
    const newBuilds = [...chasseurBuild.builds];
    newBuilds[selectedBuildIndex] = updatedBuild;
    
    onChange({
      ...chasseurBuild,
      builds: newBuilds
    });
  };

  const addBuild = () => {
    const newBuild: BuildFormData = {
      id: Date.now(),
      nom: `Build ${chasseurBuild.builds.length + 1}`,
      stats: {},
      artefacts: {},
      noyaux: {},
      sets_bonus: []
    };

    onChange({
      ...chasseurBuild,
      builds: [...chasseurBuild.builds, newBuild]
    });
    
    setSelectedBuildIndex(chasseurBuild.builds.length);
  };

  const duplicateBuild = () => {
    const duplicated: BuildFormData = {
      ...currentBuild,
      id: Date.now(),
      nom: `${currentBuild.nom} (Copie)`
    };

    onChange({
      ...chasseurBuild,
      builds: [...chasseurBuild.builds, duplicated]
    });
    
    setSelectedBuildIndex(chasseurBuild.builds.length);
  };

  const removeBuild = (index: number) => {
    if (chasseurBuild.builds.length <= 1) return; // Garder au moins un build
    
    const newBuilds = chasseurBuild.builds.filter((_, i) => i !== index);
    onChange({
      ...chasseurBuild,
      builds: newBuilds
    });
    
    if (selectedBuildIndex >= newBuilds.length) {
      setSelectedBuildIndex(Math.max(0, newBuilds.length - 1));
    }
  };

  const updateElement = (element: Element) => {
    onChange({
      ...chasseurBuild,
      element
    });
  };

  const updateBuildName = (nom: string) => {
    updateBuild({
      ...currentBuild,
      nom
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {chasseur.nom}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              ID: {chasseur.id} • Élément: {chasseurBuild.element}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={chasseurBuild.element} onValueChange={updateElement}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feu">Feu</SelectItem>
                <SelectItem value="eau">Eau</SelectItem>
                <SelectItem value="vent">Vent</SelectItem>
                <SelectItem value="lumiere">Lumière</SelectItem>
                <SelectItem value="tenebres">Ténèbres</SelectItem>
                <SelectItem value="jinwoo">Jin-Woo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Gestion des builds multiples */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Builds ({chasseurBuild.builds.length})</h4>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={duplicateBuild}>
                <Copy className="h-4 w-4 mr-2" />
                Dupliquer
              </Button>
              <Button size="sm" onClick={addBuild}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>

          {/* Sélecteur de builds */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {chasseurBuild.builds.map((build, index) => (
              <div
                key={build.id}
                className={`flex-shrink-0 p-2 rounded-lg border cursor-pointer transition-colors ${
                  selectedBuildIndex === index
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => setSelectedBuildIndex(index)}
              >
                <div className="flex items-center gap-2 min-w-32">
                  <span className="text-sm font-medium truncate">{build.nom}</span>
                  {chasseurBuild.builds.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBuild(index);
                      }}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Nom du build actuel */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="build-name">Nom du build</Label>
              <Input
                id="build-name"
                value={currentBuild.nom}
                onChange={(e) => updateBuildName(e.target.value)}
                placeholder="Nom du build..."
              />
            </div>
            <div>
              <Label>ID du build</Label>
              <Input value={currentBuild.id} disabled />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="artefacts">Artefacts</TabsTrigger>
            <TabsTrigger value="noyaux">Noyaux</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="sets">Sets Bonus</TabsTrigger>
          </TabsList>

          <TabsContent value="artefacts" className="mt-6">
            <ArtefactEditor
              artefacts={currentBuild.artefacts}
              availableArtefacts={referenceData.artefacts}
              onChange={(artefacts) => updateBuild({ ...currentBuild, artefacts })}
            />
          </TabsContent>

          <TabsContent value="noyaux" className="mt-6">
            <NoyauEditor
              noyaux={currentBuild.noyaux}
              availableNoyaux={referenceData.noyaux}
              onChange={(noyaux) => updateBuild({ ...currentBuild, noyaux })}
            />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <StatsEditor
              stats={currentBuild.stats}
              onChange={(stats) => updateBuild({ ...currentBuild, stats })}
            />
          </TabsContent>

          <TabsContent value="sets" className="mt-6">
            <SetsBonusEditor
              setsBonus={currentBuild.sets_bonus}
              availableSets={referenceData.setsBonus}
              onChange={(sets_bonus) => updateBuild({ ...currentBuild, sets_bonus })}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default BuildEditor;
export { BuildEditor };