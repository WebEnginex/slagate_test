import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

export interface ChasseurForTierList {
  id: number;
  nom: string;
  image: string | null;
  image_body: string | null;
  element_chasseur: string | null;
  rarete: string | null;
  last_modified: string | null;
}

export type ChasseurCategory = "breakers" | "dps" | "supports" | "collab";

export const ChasseursTierList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allChasseurs, setAllChasseurs] = useState<ChasseurForTierList[]>([]);
  const [activeCategory, setActiveCategory] = useState<ChasseurCategory>("breakers");

  // Configuration des catégories
  const categories = [
    {
      category: "breakers" as ChasseurCategory,
      label: "Breakers",
      description: "Chasseurs spécialisés dans la destruction des gardes ennemies",
    },
    {
      category: "dps" as ChasseurCategory,
      label: "DPS",
      description: "Chasseurs orientés dégâts pour maximiser les dommages infligés",
    },
    {
      category: "supports" as ChasseurCategory,
      label: "Supports",
      description: "Chasseurs de soutien pour buff l'équipe et débuff les ennemis",
    },
    {
      category: "collab" as ChasseurCategory,
      label: "Collaborations",
      description: "Chasseurs issus d'événements de collaboration spéciaux",
    }
  ];

  // Charger les chasseurs depuis Supabase
  useEffect(() => {
    const loadChasseurs = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('chasseurs')
          .select('id, nom, image, image_body, element_chasseur, rarete, last_modified')
          .order('nom');

        if (supabaseError) {
          console.error('Erreur lors de la récupération des chasseurs:', supabaseError);
          setError('Impossible de charger les chasseurs');
          return;
        }

        setAllChasseurs(data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des chasseurs:", err);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    loadChasseurs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des chasseurs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec description */}
      <Card className="bg-sidebar border-sidebar-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Tier List des Chasseurs
          </CardTitle>
          <p className="text-gray-300">
            Organisez les chasseurs par catégories et niveaux de performance. 
            Glissez-déposez les chasseurs entre les différents tiers pour créer votre classement.
          </p>
        </CardHeader>
      </Card>

      {/* Onglets des catégories */}
      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as ChasseurCategory)}>
        <TabsList className="grid w-full grid-cols-4 bg-sidebar-accent border-sidebar-border">
          {categories.map(category => (
            <TabsTrigger 
              key={category.category} 
              value={category.category}
              className="data-[state=active]:bg-solo-purple data-[state=active]:text-white"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.category} value={category.category} className="space-y-6">
            {/* Description de la catégorie */}
            <Card className="bg-sidebar-accent border-sidebar-border">
              <CardContent className="pt-6">
                <p className="text-gray-300">{category.description}</p>
              </CardContent>
            </Card>

            {/* Interface de tier list - En développement */}
            <Card className="bg-sidebar border-sidebar-border">
              <CardHeader className="bg-sidebar-accent py-3 sm:py-4 px-3 sm:px-5 border-b border-sidebar-border">
                <CardTitle className="text-white">
                  Tier List {category.label} - En développement
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <p className="text-gray-300">
                    Interface de tier list avec drag & drop en cours de développement
                  </p>
                  <p className="text-sm text-gray-400">
                    {allChasseurs.length} chasseurs disponibles dans la base de données
                  </p>
                  
                  {/* Aperçu des chasseurs */}
                  <div className="bg-sidebar-accent p-4 rounded-lg">
                    <h4 className="text-white font-medium mb-3">Aperçu des chasseurs disponibles :</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm text-gray-300">
                      {allChasseurs.slice(0, 12).map(chasseur => (
                        <div key={chasseur.id} className="truncate">
                          {chasseur.nom} {chasseur.rarete && `(${chasseur.rarete})`}
                        </div>
                      ))}
                      {allChasseurs.length > 12 && (
                        <div className="text-gray-400">
                          ... et {allChasseurs.length - 12} autres
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};