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
import { Settings, LogOut, Menu, User } from "lucide-react";
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
    { to: "/admin", label: "Dashboard", exact: true, color: "bg-solo-purple hover:bg-solo-purple/90" },
    { to: "/admin/builds", label: "Builds", color: "bg-violet-600 hover:bg-violet-700" },
    { to: "/admin/chasseurs", label: "Chasseurs", color: "bg-blue-600 hover:bg-blue-700" },
    { to: "/admin/artefacts", label: "Artefacts", color: "bg-green-600 hover:bg-green-700" },
    { to: "/admin/noyaux", label: "Noyaux", color: "bg-amber-600 hover:bg-amber-700" },
    { to: "/admin/armes", label: "Armes", color: "bg-red-600 hover:bg-red-700" },
    { to: "/admin/promo-codes", label: "Codes Promo", color: "bg-pink-600 hover:bg-pink-700" },
    { to: "/admin/tier-list", label: "Tier List", color: "bg-purple-600 hover:bg-purple-700" },
  ];

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
    <div className="flex min-h-screen w-full">
      <SideNav isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Structure verticale pour main seulement (pas de footer) */}
      <div className="flex flex-col flex-1 min-h-screen">
        <main className="flex-1 overflow-auto relative lg:ml-64">
          <button
            className="fixed top-4 left-4 z-30 rounded-md bg-sidebar p-2 text-white lg:hidden"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          {/* Container admin avec largeur complète */}
          <div className="w-full py-8 px-4 lg:px-8">
            {/* Navigation admin en haut de la page */}
            <Card className="mb-6 bg-sidebar border-sidebar-border rounded-xl shadow-md">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Côté gauche : Titre et Navigation */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 text-solo-purple">
                      <Settings className="h-5 w-5" />
                      <span className="font-semibold">Administration</span>
                    </div>
                    
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
                            className={isActive ? `${item.color} text-white` : ""}
                          >
                            <Link to={item.to}>
                              {item.label}
                            </Link>
                          </Button>
                        );
                      })}
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