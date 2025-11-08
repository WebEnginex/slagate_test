import React from "react";
import { Settings, Gift, Trophy, Users, Package, Zap, Database, Sparkles, Swords, Shield, Youtube } from "lucide-react";
import { useDashboardStats } from "@/admin/hooks/useDashboardStats";
import { 
  DashboardHeader,
  CategoryHeader,
  AdminCard,
  DashboardSkeleton
} from "@/admin/components/dashboard";

const DashboardPage: React.FC = () => {
  const { stats, isLoading } = useDashboardStats();

  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Catégories de panneaux d'administration
  const adminCategories = [
    {
      name: "Builds",
      description: "Gérer les configurations des chasseurs",
      icon: <Settings className="h-4 w-4" />,
      color: "from-indigo-500 to-purple-600",
      panels: [
        {
          title: "Gestion des Builds",
          description: "Créer et gérer les builds des chasseurs",
          icon: <Settings className="h-6 w-6" />,
          to: "/admin/builds",
          iconBg: "bg-indigo-500/20",
          iconColor: "text-indigo-400",
          borderColor: "border-indigo-500/30",
          buttonColor: "bg-indigo-600 hover:bg-indigo-700 text-white",
          hoverColor: "group-hover:text-indigo-400"
        },
      ],
    },
    {
      name: "Tier Lists",
      description: "Gérer les classements et équipes",
      icon: <Trophy className="h-4 w-4" />,
      color: "from-amber-500 to-orange-600",
      panels: [
        {
          title: "Tier List",
          description: "Créer et gérer les classements des Tier List",
          icon: <Trophy className="h-6 w-6" />,
          to: "/admin/tier-list",
          iconBg: "bg-amber-500/20",
          iconColor: "text-amber-400",
          borderColor: "border-amber-500/30",
          buttonColor: "bg-amber-600 hover:bg-amber-700 text-white",
          hoverColor: "group-hover:text-amber-400"
        },
      ],
    },
    {
      name: "Base de Données",
      description: "Gérer les entités du jeu",
      icon: <Database className="h-4 w-4" />,
      color: "from-blue-500 to-blue-600",
      panels: [
        {
          title: "Chasseurs",
          description: "Créer et gérer les chasseurs",
          icon: <Users className="h-6 w-6" />,
          to: "/admin/chasseurs",
          iconBg: "bg-blue-500/20",
          iconColor: "text-blue-400",
          borderColor: "border-blue-500/30",
          buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
          hoverColor: "group-hover:text-blue-400"
        },
        {
          title: "Artefacts",
          description: "Créer et gérer les artefacts et équipements",
          icon: <Shield className="h-6 w-6" />,
          to: "/admin/artefacts",
          iconBg: "bg-blue-500/20",
          iconColor: "text-blue-400",
          borderColor: "border-blue-500/30",
          buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
          hoverColor: "group-hover:text-blue-400"
        },
        {
          title: "Noyaux",
          description: "Créer et gérer les noyaux et leurs slots",
          icon: <Zap className="h-6 w-6" />,
          to: "/admin/noyaux",
          iconBg: "bg-blue-500/20",
          iconColor: "text-blue-400",
          borderColor: "border-blue-500/30",
          buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
          hoverColor: "group-hover:text-blue-400"
        },
        {
          title: "Armes",
          description: "Créer et gérer les armes de Sung Jinwoo",
          icon: <Swords className="h-6 w-6" />,
          to: "/admin/armes",
          iconBg: "bg-blue-500/20",
          iconColor: "text-blue-400",
          borderColor: "border-blue-500/30",
          buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
          hoverColor: "group-hover:text-blue-400"
        },
      ],
    },
    {
      name: "Promotions",
      description: "Gérer les codes et récompenses",
      icon: <Gift className="h-4 w-4" />,
      color: "from-rose-500 to-pink-600",
      panels: [
        {
          title: "Codes Promo",
          description: "Créer et gérer les codes promotionnels",
          icon: <Gift className="h-6 w-6" />,
          to: "/admin/promo-codes",
          iconBg: "bg-rose-500/20",
          iconColor: "text-rose-400",
          borderColor: "border-rose-500/30",
          buttonColor: "bg-rose-600 hover:bg-rose-700 text-white",
          hoverColor: "group-hover:text-rose-400"
        },
      ],
    },
    {
      name: "Contenu",
      description: "Gérer le contenu du site",
      icon: <Youtube className="h-4 w-4" />,
      color: "from-red-500 to-red-600",
      panels: [
        {
          title: "YouTube",
          description: "Gérer les vidéos YouTube affichées",
          icon: <Youtube className="h-6 w-6" />,
          to: "/admin/youtube",
          iconBg: "bg-red-500/20",
          iconColor: "text-red-400",
          borderColor: "border-red-500/30",
          buttonColor: "bg-red-600 hover:bg-red-700 text-white",
          hoverColor: "group-hover:text-red-400"
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header du dashboard */}
      <DashboardHeader />

      {/* Catégories de gestion */}
      {adminCategories.map((category, idx) => (
        <div key={idx} className="space-y-3">
          {/* En-tête de catégorie */}
          <CategoryHeader
            name={category.name}
            description={category.description}
            icon={category.icon}
            gradient={category.color}
          />

          {/* Grille de cartes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {category.panels.map((panel) => (
              <AdminCard
                key={panel.to}
                title={panel.title}
                description={panel.description}
                icon={panel.icon}
                to={panel.to}
                iconBg={panel.iconBg}
                iconColor={panel.iconColor}
                borderColor={panel.borderColor}
                buttonColor={panel.buttonColor}
                hoverColor={panel.hoverColor}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardPage;
