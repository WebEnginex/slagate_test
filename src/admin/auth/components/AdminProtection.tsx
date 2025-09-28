import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AdminProtectionProps {
  children: React.ReactNode;
}

export function AdminProtection({ children }: AdminProtectionProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger vers la page de connexion si pas authentifié
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [loading, isAuthenticated, navigate]);

  // Affichage du loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-solo-purple" />
          <p className="text-sm text-muted-foreground">Vérification en cours...</p>
        </div>
      </div>
    );
  }

  // Si pas authentifié, afficher un loader le temps de la redirection
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-solo-purple" />
          <p className="text-sm text-muted-foreground">Redirection vers la connexion...</p>
        </div>
      </div>
    );
  }

  // Si authentifié, afficher le contenu protégé
  return <>{children}</>;
}