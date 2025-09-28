import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Fonction de connexion
  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Erreur de connexion:', error.message);
        }
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message 
        }));
        return false;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('Connexion réussie:', !!data.user);
      }
      
      setState(prev => ({ 
        ...prev, 
        user: data.user, 
        loading: false, 
        error: null 
      }));
      return true;
    } catch (err) {
      console.error('Erreur de connexion inattendue:', err);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erreur de connexion inattendue' 
      }));
      return false;
    }
  }, []);

  // Fonction de déconnexion
  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await supabase.auth.signOut();
      setState(prev => ({ 
        ...prev, 
        user: null, 
        loading: false, 
        error: null 
      }));
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erreur lors de la déconnexion' 
      }));
    }
  }, []);

  // Écouter les changements d'état d'authentification
  useEffect(() => {
    // Fonction pour gérer l'état d'authentification
    const handleAuthState = (user: User | null) => {
      setState(prev => ({ 
        ...prev, 
        user, 
        loading: false 
      }));
      
      // Debug en développement
      if (process.env.NODE_ENV === 'development') {
        console.log('useAuth - Auth state changed:', { user: !!user });
      }
    };

    // Vérifier l'utilisateur actuel au démarrage
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) {
        // Ne pas traiter "Auth session missing" comme une erreur critique
        if (error.message !== 'Auth session missing!') {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
          setState(prev => ({ 
            ...prev, 
            user: null, 
            loading: false, 
            error: error.message 
          }));
        } else {
          // Pas de session = utilisateur non connecté (normal)
          handleAuthState(null);
        }
      } else {
        handleAuthState(user);
      }
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Auth event:', event, 'Session:', !!session);
        }
        handleAuthState(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,
    signIn,
    signOut,
  };
}