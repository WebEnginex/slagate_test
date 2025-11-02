import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sparkles, User, LogOut, Menu, ChevronDown } from 'lucide-react';
import { useAuth } from '@/admin/auth/hooks/useAuth';

/**
 * Header du dashboard avec profil utilisateur
 * Version responsive avec menu burger sur mobile
 */
export function DashboardHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <div className="relative bg-sidebar rounded-xl border border-sidebar-border shadow-lg">
      {/* Pattern de fond subtil */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px] rounded-xl overflow-hidden" aria-hidden="true"></div>
      
      {/* Contenu du header */}
      <div className="relative p-4 md:p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap md:flex-nowrap">
          {/* Titre et description */}
          <div className="flex-1 min-w-[200px] space-y-2">
            {/* Badge Administration */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-solo-purple/20 backdrop-blur-sm rounded-full border border-solo-purple/30">
              <Sparkles className="h-3.5 w-3.5 text-solo-purple" aria-hidden="true" />
              <span className="text-xs font-medium text-white">Administration</span>
            </div>
            
            {/* Titre principal */}
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Panneau d'Administration
            </h1>
            
            {/* Description */}
            <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
              Gérez l'ensemble du contenu de <span className="font-semibold text-white">Slagate</span> en toute simplicité.
            </p>
          </div>
          
          {/* Menu utilisateur */}
          <div className="relative flex items-center gap-2">
            {/* Desktop: Dropdown menu */}
            <div className="hidden sm:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex items-center gap-3 bg-sidebar-accent/50 hover:bg-sidebar-accent/70 backdrop-blur-sm px-4 py-3 rounded-xl border border-sidebar-border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-solo-purple focus:ring-offset-2 focus:ring-offset-sidebar"
                    aria-label="Menu utilisateur"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user?.email?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">
                        {user?.user_metadata?.display_name || 'Administrateur'}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-sidebar border-sidebar-border">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-white">{user?.user_metadata?.display_name || 'Administrateur'}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-sidebar-border" />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <button
                      onClick={() => navigate('/admin/profil')}
                      className="w-full flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Mon Profil</span>
                    </button>
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
            
            {/* Mobile: Burger menu */}
            <div className="sm:hidden relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 bg-sidebar-accent/50 hover:bg-sidebar-accent/70 backdrop-blur-sm p-3 rounded-xl border border-sidebar-border transition-all focus:outline-none focus:ring-2 focus:ring-solo-purple focus:ring-offset-2 focus:ring-offset-sidebar z-50"
                aria-label="Menu utilisateur"
                aria-expanded={isMenuOpen}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <Menu className="h-4 w-4 text-gray-300" aria-hidden="true" />
              </button>
              
              {/* Menu mobile déroulant */}
              {isMenuOpen && (
                <>
                  {/* Overlay pour fermer le menu */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                  />
                  
                  {/* Menu */}
                  <div className="absolute right-0 top-full mt-2 w-64 bg-sidebar border border-sidebar-border rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-sidebar-border">
                      <p className="text-sm font-medium text-white">{user?.user_metadata?.display_name || 'Administrateur'}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate('/admin/profil');
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-sidebar-accent rounded-lg transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Mon Profil</span>
                      </button>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors mt-1"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
