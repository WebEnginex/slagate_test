import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sword, Shield, Users, Trophy, Globe } from "lucide-react";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { WeaponsTierList } from "./components/WeaponsTierList.tsx";
import { ChasseursTierList } from "./components/ChasseursTierList.tsx";
import { GlobalChasseursTierList } from "./components/GlobalChasseursTierList.tsx";
import TeamsChasseursAdmin from "./components/TeamsChasseursAdmin";

const TierListAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("teams");

  const tierListTabs = [
    {
      id: "weapons",
      label: "Armes",
      icon: <Sword className="h-4 w-4" />,
      component: <WeaponsTierList />,
    },
    {
      id: "global",
      label: "Global",
      icon: <Globe className="h-4 w-4" />,
      component: <GlobalChasseursTierList />,
    },
    {
      id: "hunters",
      label: "Chasseurs",
      icon: <Users className="h-4 w-4" />,
      component: <ChasseursTierList />,
    },
    {
      id: "teams",
      label: "Teams Chasseurs",
      icon: <Users className="h-4 w-4" />,
      component: <TeamsChasseursAdmin />,
    },
  ];

  return (
    <AdminLayout>
      <style>{`
        .tier-list-tabs button[data-state="active"]:hover {
          background-color: rgb(217 119 6) !important;
        }
        .tier-list-tabs button[data-state="active"] {
          background-color: rgb(217 119 6) !important;
        }
      `}</style>
      <div className="space-y-4">
        {/* Header - Style des autres pages admin */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Tier Lists</h1>
            <p className="text-sidebar-foreground/70 mt-1">
              Organisez les armes, artefacts et équipements par niveau de puissance
            </p>
          </div>
        </div>

        {/* Tabs pour les différentes tier lists */}
        <Card className="bg-sidebar border-sidebar-border rounded-xl shadow-md">
          <CardHeader className="bg-sidebar-accent py-3 sm:py-4 px-3 sm:px-5 border-b border-sidebar-border">
            <CardTitle className="flex items-center gap-2 text-white text-xl sm:text-2xl font-bold">
              <Trophy className="h-5 w-5" />
              Catégories de Tier Lists
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="tier-list-tabs grid w-full grid-cols-4 bg-sidebar-accent [&>button[data-state=active]:hover]:bg-amber-600">
                {tierListTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 text-sidebar-foreground/80 hover:text-white hover:bg-sidebar-accent data-[state=active]:text-white data-[state=active]:bg-amber-600"
                  >
                    {tab.icon}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {tierListTabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-6">
                  {tab.component}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default TierListAdminPage;