import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, Menu, User, ChevronDown, Database, Users, Zap, Swords, LayoutDashboard, Trophy, Gift, Shield, Youtube } from "lucide-react";
import { useAuth } from "@/admin/auth/hooks/useAuth";
import SideNav from "@/components/SideNav";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const adminNavItems = [
    { to: "/admin", label: "Dashboard", exact: true, activeColor: "bg-solo-purple", hoverColor: "hover:bg-solo-purple/80", icon: <LayoutDashboard className="h-4 w-4 mr-1.5" /> },
    { to: "/admin/builds", label: "Builds", activeColor: "bg-indigo-600", hoverColor: "hover:bg-indigo-600/80", icon: <Settings className="h-4 w-4 mr-1.5" /> },
    { to: "/admin/tier-list", label: "Tier List", activeColor: "bg-amber-600", hoverColor: "hover:bg-amber-600/80", icon: <Trophy className="h-4 w-4 mr-1.5" /> },
    { to: "/admin/youtube", label: "YouTube", activeColor: "bg-red-600", hoverColor: "hover:bg-red-600/80", icon: <Youtube className="h-4 w-4 mr-1.5" /> },
  ];

  const databaseItems = [
    { to: "/admin/chasseurs", label: "Chasseurs", icon: <Users className="h-4 w-4 mr-2" /> },
    { to: "/admin/artefacts", label: "Artefacts", icon: <Shield className="h-4 w-4 mr-2" /> },
    { to: "/admin/noyaux", label: "Noyaux", icon: <Zap className="h-4 w-4 mr-2" /> },
    { to: "/admin/armes", label: "Armes", icon: <Swords className="h-4 w-4 mr-2" /> },
  ];

  const isDatabaseActive = databaseItems.some(item => location.pathname.startsWith(item.to));

  const handleSignOut = async () => {
    try {
      await signOut();
      // Rediriger vers l'accueil après déconnexion
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden">
      <SideNav isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Structure verticale pour main seulement (pas de footer) */}
      <div className="flex flex-col flex-1 min-h-screen max-w-full overflow-x-hidden">
        <main className="flex-1 overflow-auto relative lg:ml-64 max-w-full">
          <button
            className="fixed top-4 left-4 z-30 rounded-md bg-sidebar p-2 text-white lg:hidden"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          {/* Container admin avec largeur complète */}
          <div className="w-full py-8 px-4 lg:px-8 max-w-full box-border">
            {/* Navigation admin en haut de la page */}
            <Card className="mb-6 bg-sidebar border-sidebar-border rounded-xl shadow-md max-w-full">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Navigation */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    {/* Navigation admin */}
                    <nav className="flex flex-wrap gap-2">
                      {adminNavItems.map((item) => {
                        const isActive = item.exact 
                          ? location.pathname === item.to
                          : location.pathname.startsWith(item.to) && item.to !== "/admin";
                        
                        return (
                          <Button
                            key={item.to}
                            asChild
                            variant={isActive ? "default" : "ghost"}
                            size="sm"
                            className={`${isActive ? `${item.activeColor} ${item.hoverColor} text-white` : `${item.hoverColor} text-white/80`}`}
                          >
                            <Link to={item.to} className="flex items-center">
                              {item.icon}
                              {item.label}
                            </Link>
                          </Button>
                        );
                      })}
                      
                      {/* Dropdown Base de Données */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={isDatabaseActive ? "default" : "ghost"}
                            size="sm"
                            className={isDatabaseActive ? "bg-blue-600 text-white" : "hover:bg-blue-600/80 text-white/80"}
                          >
                            <Database className="h-4 w-4 mr-1.5" />
                            Base de Données
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48 bg-sidebar border-sidebar-border">
                          {databaseItems.map((item) => (
                            <DropdownMenuItem key={item.to} asChild className="cursor-pointer">
                              <Link 
                                to={item.to}
                                className="flex items-center w-full text-white hover:bg-blue-600/20"
                              >
                                {item.icon}
                                {item.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Codes Promo - placé après Base de Données */}
                      <Button
                        asChild
                        variant={location.pathname.startsWith("/admin/promo-codes") ? "default" : "ghost"}
                        size="sm"
                        className={location.pathname.startsWith("/admin/promo-codes") ? "bg-rose-600 hover:bg-rose-600/80 text-white" : "hover:bg-rose-600/80 text-white/80"}
                      >
                        <Link to="/admin/promo-codes" className="flex items-center">
                          <Gift className="h-4 w-4 mr-1.5" />
                          Codes Promo
                        </Link>
                      </Button>
                    </nav>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contenu admin */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}