import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Gift, BarChart3, TestTube, Trophy } from "lucide-react";
import { useAuth } from "@/admin/auth/hooks/useAuth";

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, signIn } = useAuth();

  // Test de connexion en développement
  const testLogin = async () => {
    if (process.env.NODE_ENV === 'development') {
      // Utiliser un compte de test - À CHANGER avec vos vraies credentials
      await signIn('test@example.com', 'password123');
    }
  };

  const adminPanels = [
    {
      title: "Gestion des Builds",
      description: "Gérer les builds de chasseurs et leurs configurations",
      icon: <Settings className="h-5 w-5" />,
      to: "/admin/builds",
      color: "bg-violet-500/15 border-violet-500/25 hover:bg-violet-500/20",
      buttonColor: "bg-violet-600 hover:bg-violet-700 text-white",
    },
    {
      title: "Codes Promo",
      description: "Gérer les codes promotionnels et leurs récompenses",
      icon: <Gift className="h-5 w-5" />,
      to: "/admin/promo-codes",
      color: "bg-violet-500/15 border-violet-500/25 hover:bg-violet-500/20",
      buttonColor: "bg-violet-600 hover:bg-violet-700 text-white",
    },
    {
      title: "Tier List",
      description: "Gérer les tier lists des armes et équipements",
      icon: <Trophy className="h-5 w-5" />,
      to: "/admin/tier-list",
      color: "bg-violet-500/15 border-violet-500/25 hover:bg-violet-500/20",
      buttonColor: "bg-violet-600 hover:bg-violet-700 text-white",
    },
    {
      title: "Statistiques",
      description: "Voir les statistiques d'utilisation du site (bientôt disponible)",
      icon: <BarChart3 className="h-5 w-5" />,
      to: "#",
      color: "bg-gray-500/10 border-gray-500/20",
      buttonColor: "bg-gray-500 text-gray-300 cursor-not-allowed",
      disabled: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header du dashboard */}
      <div className="bg-gradient-to-r from-solo-purple to-solo-dark-purple p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-white mb-2">
          Panneau d'Administration
        </h1>
        <p className="text-gray-200">
          Bienvenue sur le panneau d'administration de Slagate.
        </p>
        
        <div className="mt-4 p-3 bg-white/10 rounded text-sm">
          <p className="font-medium text-white mb-1">Interface d'administration</p>
          <p className="text-gray-300 mb-2">
            Gérez les builds de chasseurs, les codes promotionnels et les statistiques du site.
          </p>
          <p className="text-gray-300">
            Support technique : <span className="font-medium text-violet-200">Lendam</span> sur Discord
          </p>
        </div>
      </div>

      {/* Navigation vers les différents panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminPanels.map((panel) => (
          <Card key={panel.to} className={`${panel.color} border transition-all duration-300 ${!panel.disabled ? 'hover:shadow-lg hover:-translate-y-1' : 'opacity-70'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-md bg-white/15 text-violet-300">
                  {panel.icon}
                </div>
                <span className="text-white">{panel.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-300 leading-relaxed">
                {panel.description}
              </p>
              {panel.disabled ? (
                <Button disabled className={`w-full text-sm py-2 ${panel.buttonColor}`}>
                  Bientôt disponible
                </Button>
              ) : (
                <Button asChild className={`w-full text-sm py-2 ${panel.buttonColor} border-0`}>
                  <Link to={panel.to}>
                    Accéder
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
