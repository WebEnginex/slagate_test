import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";

interface Chasseur {
  id: number;
  nom: string;
  image: string;
  element: string;
}

interface LatestChasseur {
  id?: number;
  chasseur_id: number;
  position: number;
}

const LatestChasseursAdminPageContent = () => {
  const [chasseurs, setChasseurs] = useState<Chasseur[]>([]);
  const [latest, setLatest] = useState<LatestChasseur[]>([
    { chasseur_id: 0, position: 1 },
    { chasseur_id: 0, position: 2 },
    { chasseur_id: 0, position: 3 },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Charger tous les chasseurs
    supabase
      .from("chasseurs")
      .select("id, nom, image, element")
      .then(({ data }) => setChasseurs(data || []));
    // Charger la sélection actuelle
    supabase
      .from("latest_chasseurs")
      .select("id, chasseur_id, position")
      .order("position")
      .then(({ data }) => {
        if (data && Array.isArray(data) && data.length === 3) setLatest(data);
      });
  }, []);

  const handleSelect = (pos: number, chasseur_id: number) => {
    setLatest((prev) =>
      prev.map((item) =>
        item.position === pos ? { ...item, chasseur_id } : item
      )
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      // Supprimer tout et réinsérer (simple, car 3 lignes)
      await supabase.from("latest_chasseurs").delete().neq("id", 0);
      for (const item of latest) {
        await supabase.from("latest_chasseurs").insert({
          chasseur_id: item.chasseur_id,
          position: item.position,
        });
      }
      setMessage("Derniers chasseurs mis à jour !");
    } catch (e) {
      setMessage("Erreur lors de la sauvegarde");
    }
    setLoading(false);
  };

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Derniers chasseurs sortis</CardTitle>
      </CardHeader>
      <CardContent>
        <Separator className="mb-4" />
        {latest.map((item) => (
          <div key={item.position} className="flex items-center gap-4 mb-4">
            <Badge>Position {item.position}</Badge>
            <Select
              value={item.chasseur_id ? String(item.chasseur_id) : ""}
              onValueChange={(val) => handleSelect(item.position, Number(val))}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Choisir un chasseur" />
              </SelectTrigger>
              <SelectContent>
                {chasseurs.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
        <Button onClick={handleSave} disabled={loading} className="mt-4">
          <Save className="mr-2 h-4 w-4" /> Sauvegarder
        </Button>
        {message && <Alert className="mt-4">{message}</Alert>}
      </CardContent>
    </Card>
  );
};
const LatestChasseursAdminPage = () => {
  return (
    <AdminLayout>
      <LatestChasseursAdminPageContent />
    </AdminLayout>
  );
};

export default LatestChasseursAdminPage;
