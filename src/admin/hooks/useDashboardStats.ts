import { useState, useEffect } from 'react';
import type { DashboardStats } from '../types/dashboard';
import { buildsChasseurs } from '@/config/builds/buildsChasseurs';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook personnalisé pour récupérer les statistiques du dashboard
 * Agrège les données de différentes sources pour afficher un aperçu rapide
 */
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Statistiques des builds (depuis le fichier local)
        const totalBuilds = buildsChasseurs.reduce((acc, chasseur) => acc + chasseur.builds.length, 0);
        const buildsByElement = buildsChasseurs.reduce((acc, chasseur) => {
          const element = chasseur.element;
          acc[element] = (acc[element] || 0) + chasseur.builds.length;
          return acc;
        }, {} as Record<string, number>);

        // Récupération des données depuis Supabase en parallèle
        const [
          { count: chasseursCount },
          { count: artefactsCount },
          { count: noyauxCount },
          { count: armesCount },
          { data: promoCodesData },
          { count: tierListCount }
        ] = await Promise.all([
          supabase.from('chasseurs').select('*', { count: 'exact', head: true }),
          supabase.from('artefacts').select('*', { count: 'exact', head: true }),
          supabase.from('noyaux').select('*', { count: 'exact', head: true }),
          supabase.from('jinwoo_armes').select('*', { count: 'exact', head: true }),
          supabase.from('promo_codes').select('code, expires_at'),
          supabase.from('tier_list_armes').select('*', { count: 'exact', head: true })
        ]);

        // Calcul des codes promo actifs vs expirés
        const now = new Date();
        let activePromos = 0;
        let expiredPromos = 0;

        if (promoCodesData) {
          promoCodesData.forEach((promo) => {
            if (promo.expires_at) {
              const expirationDate = new Date(promo.expires_at);
              if (expirationDate > now) {
                activePromos++;
              } else {
                expiredPromos++;
              }
            } else {
              activePromos++; // Pas de date d'expiration = actif
            }
          });
        }

        const statsData: DashboardStats = {
          builds: {
            total: totalBuilds,
            byElement: buildsByElement
          },
          chasseurs: {
            total: chasseursCount || 0
          },
          artefacts: {
            total: artefactsCount || 0
          },
          noyaux: {
            total: noyauxCount || 0
          },
          armes: {
            total: armesCount || 0
          },
          promoCodes: {
            total: (promoCodesData?.length || 0),
            active: activePromos,
            expired: expiredPromos
          },
          tierList: {
            totalArmes: tierListCount || 0
          }
        };

        if (mounted) {
          setStats(statsData);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques:', err);
        if (mounted) {
          setError('Impossible de charger les statistiques');
          setIsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  return { stats, isLoading, error };
}
