import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Gift, Trophy, Users, Package, Zap, Database, Sparkles, User, LogOut } from "lucide-react";
import { useAuth } from "@/admin/auth/hooks/useAuth";

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, signIn, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Catégories de panneaux d'administration
  const adminCategories = [
    {
      name: "Contenu & Stratégie",
      description: "Gérer les builds et classements",
      icon: <Sparkles className="h-5 w-5" />,
      color: "from-violet-500 to-purple-600",
      panels: [
        {
          title: "Gestion des Builds",
          description: "Créer et modifier les builds de chasseurs avec configurations complètes",
          icon: <Settings className="h-5 w-5" />,
          to: "/admin/builds",
          color: "bg-violet-500/15 border-violet-500/30 hover:bg-violet-500/25",
          iconBg: "bg-violet-500/20",
          iconColor: "text-violet-400",
          buttonColor: "bg-violet-600 hover:bg-violet-700 text-white",
        },
        {
          title: "Tier List",
          description: "Organiser et mettre à jour les classements des armes",
          icon: <Trophy className="h-5 w-5" />,
          to: "/admin/tier-list",
          color: "bg-purple-500/15 border-purple-500/30 hover:bg-purple-500/25",
          iconBg: "bg-purple-500/20",
          iconColor: "text-purple-400",
          buttonColor: "bg-purple-600 hover:bg-purple-700 text-white",
        },
      ],
    },
    {
      name: "Base de Données",
      description: "Gérer les entités du jeu",
      icon: <Database className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-600",
      panels: [
        {
          title: "Chasseurs",
          description: "Ajouter, modifier ou supprimer des personnages chasseurs",
          icon: <Users className="h-5 w-5" />,
          to: "/admin/chasseurs",
          color: "bg-blue-500/15 border-blue-500/30 hover:bg-blue-500/25",
          iconBg: "bg-blue-500/20",
          iconColor: "text-blue-400",
          buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
        },
        {
          title: "Artefacts",
          description: "Gérer l'inventaire complet des artefacts et équipements",
          icon: <Package className="h-5 w-5" />,
          to: "/admin/artefacts",
          color: "bg-green-500/15 border-green-500/30 hover:bg-green-500/25",
          iconBg: "bg-green-500/20",
          iconColor: "text-green-400",
          buttonColor: "bg-green-600 hover:bg-green-700 text-white",
        },
        {
          title: "Noyaux",
          description: "Administrer les noyaux et leurs emplacements de slot",
          icon: <Zap className="h-5 w-5" />,
          to: "/admin/noyaux",
          color: "bg-amber-500/15 border-amber-500/30 hover:bg-amber-500/25",
          iconBg: "bg-amber-500/20",
          iconColor: "text-amber-400",
          buttonColor: "bg-amber-600 hover:bg-amber-700 text-white",
        },
        {
          title: "Armes",
          description: "Gérer les armes de Jinwoo et leurs éléments",
          icon: <Settings className="h-5 w-5" />,
          to: "/admin/armes",
          color: "bg-red-500/15 border-red-500/30 hover:bg-red-500/25",
          iconBg: "bg-red-500/20",
          iconColor: "text-red-400",
          buttonColor: "bg-red-600 hover:bg-red-700 text-white",
        },
      ],
    },
    {
      name: "Promotions",
      description: "Gérer les codes et récompenses",
      icon: <Gift className="h-5 w-5" />,
      color: "from-pink-500 to-rose-600",
      panels: [
        {
          title: "Codes Promo",
          description: "Créer et gérer les codes promotionnels pour les joueurs",
          icon: <Gift className="h-5 w-5" />,
          to: "/admin/promo-codes",
          color: "bg-pink-500/15 border-pink-500/30 hover:bg-pink-500/25",
          iconBg: "bg-pink-500/20",
          iconColor: "text-pink-400",
          buttonColor: "bg-pink-600 hover:bg-pink-700 text-white",
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header du dashboard - Design amélioré */}
      <div className="relative overflow-hidden bg-gradient-to-br from-solo-purple via-purple-700 to-solo-dark-purple rounded-2xl shadow-2xl">
        {/* Effets de fond décoratifs */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
        
        {/* Contenu du header */}
        <div className="relative p-8 md:p-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
                <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
                <span className="text-sm font-medium text-white">Administration</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                Panneau d'Administration
              </h1>
              <p className="text-lg text-gray-200/90 leading-relaxed max-w-2xl">
                Bienvenue sur le panneau d'administration de <span className="font-semibold text-white">Slagate</span>. 
                Gérez l'ensemble du contenu du site en toute simplicité.
              </p>
            </div>
            
            {/* Badge utilisateur - Menu dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20 hover:bg-white/15 transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user?.email?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">
                      {user?.user_metadata?.display_name || 'Administrateur'}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-sidebar border-sidebar-border">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/admin/profil" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Mon Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-sidebar-border" />
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-400/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Catégories de gestion */}
      {adminCategories.map((category, idx) => (
        <div key={idx} className="space-y-4">
          {/* En-tête de catégorie avec séparateur */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t-2 border-gray-700/50"></div>
            </div>
            <div className="relative flex items-center gap-3">
              <div className={`bg-gradient-to-r ${category.color} px-4 py-2 rounded-lg shadow-lg flex items-center gap-3`}>
                <div className="text-white">
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {category.name}
                  </h2>
                  <p className="text-sm text-white/80">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cartes de la catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.panels.map((panel) => (
              <Card 
                key={panel.to} 
                className={`${panel.color} border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-opacity-50`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className={`p-2 rounded-lg ${panel.iconBg}`}>
                      <div className={panel.iconColor}>
                        {panel.icon}
                      </div>
                    </div>
                    <span className="text-white font-semibold">{panel.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300 leading-relaxed min-h-[2.5rem]">
                    {panel.description}
                  </p>
                  <Button asChild className={`w-full text-sm py-2.5 font-medium ${panel.buttonColor} border-0 shadow-md hover:shadow-lg transition-all`}>
                    <Link to={panel.to}>
                      Accéder à la gestion
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardPage;
