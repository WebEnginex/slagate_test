import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Award, Gift, Users, Menu, X, Flame, Shield, Swords, Skull, Settings, LogIn } from "lucide-react";
import { useAuth } from "@/admin/auth/hooks/useAuth";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  className?: string;
};

const NavItem = ({ to, icon, label, isActive, className }: NavItemProps) => {
  return (
    <div className={className}>
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
          isActive && "bg-sidebar-accent text-solo-purple"
        )}
      >
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{label}</span>
      </Link>
    </div>
  );
};

type SideNavProps = {
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// Navigation items de base (statiques)
const baseNavItems = [
  { to: "/", icon: <Home size={20} />, label: "Accueil" },
  { to: "/guides", icon: <BookOpen size={20} />, label: "Guides" }, 
  { to: "/tier-list", icon: <Award size={20} />, label: "Tier List" },
  { to: "/builds", icon: <Shield size={20} />, label: "Builds" }, 
  { to: "/atelier", icon: <Flame size={20} />, label: "Atelier" },
  { to: "/ennio", icon: <Swords size={20} />, label: "Ennio" },
  { to: "/bdg", icon: <Skull size={20} />, label: "Boss de Guilde" },
  { to: "/promo-codes", icon: <Gift size={20} />, label: "Code Promo" },
  { to: "/creators", icon: <Users size={20} />, label: "Creators" },
];

const SideNav = ({ isMobileOpen, setIsMobileOpen }: SideNavProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, loading, isAuthenticated } = useAuth();

  // Debug pour voir l'état d'authentification
  if (process.env.NODE_ENV === 'development') {
    console.log('SideNav - Auth state:', { user: !!user, loading, isAuthenticated });
  }

  // Composant de debug temporaire en développement
  const DebugAuth = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded text-xs z-50">
        Auth: {isAuthenticated ? 'Connecté' : 'Non connecté'} | Loading: {loading ? 'Oui' : 'Non'}
      </div>
    );
  };

  // Ajouter les liens selon l'état d'authentification
  const allNavItems = React.useMemo(() => {
    if (loading) return baseNavItems; // Pendant le chargement, afficher seulement les liens de base
    
    if (isAuthenticated) {
      // Si connecté : ajouter le lien Administration
      return [...baseNavItems, { to: "/admin", icon: <Settings size={20} />, label: "Administration" }];
    } else {
      // Si non connecté : ajouter le lien Connexion
      return [...baseNavItems, { to: "/admin/login", icon: <LogIn size={20} />, label: "Connexion" }];
    }
  }, [isAuthenticated, loading]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Side navigation */}
      <nav
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 w-64 flex-col bg-sidebar p-4 transition-transform duration-200 flex transform-gpu",
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute right-4 top-4 text-sidebar-foreground lg:hidden"
        >
          <X size={24} />
        </button>

        {/* Logo */}
<Link to="/" className="flex items-center gap-3 px-3 py-4">
  <img
    src="/images/logo/Sohoven_Logo.webp"
    alt="Sohoven Logo"
    className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded object-cover"
  />

  <div className="flex flex-col">
    <span className="font-bold text-sidebar-foreground">
      SLAGATE
    </span>
  </div>
</Link>

        {/* Nav links */}
        <div className="mt-8 space-y-1">
          {allNavItems.map((item) => {
            const isAdminLink = item.to === "/admin" || item.to === "/admin/login";
            const isActive = currentPath === item.to || 
              (item.to === "/admin" && currentPath.startsWith("/admin")) ||
              (item.to === "/admin/login" && currentPath === "/admin/login");
            
            return (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isActive={isActive}
                className={isAdminLink ? "border-t border-sidebar-border pt-2 mt-2" : ""}
              />
            );
          })}
        </div>

      </nav>
      <DebugAuth />
    </>
  );
};

export default SideNav;
