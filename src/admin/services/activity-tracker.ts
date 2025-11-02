import type { RecentActivity } from '../types/dashboard';

const STORAGE_KEY = 'slagate_admin_activities';
const MAX_ACTIVITIES = 50; // Garder les 50 dernières activités

/**
 * Service pour gérer les activités récentes de l'administration
 * Utilise localStorage pour persister les activités entre les sessions
 */
export class ActivityTracker {
  /**
   * Récupère toutes les activités depuis le localStorage
   */
  static getActivities(): RecentActivity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const activities = JSON.parse(stored);
      // Reconvertir les timestamps en objets Date
      return activities.map((activity: RecentActivity & { timestamp: string }) => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
      return [];
    }
  }

  /**
   * Récupère les N dernières activités
   */
  static getRecentActivities(limit: number = 10): RecentActivity[] {
    const activities = this.getActivities();
    return activities.slice(0, limit);
  }

  /**
   * Ajoute une nouvelle activité
   */
  static addActivity(activity: Omit<RecentActivity, 'id' | 'timestamp'>): void {
    try {
      const activities = this.getActivities();
      
      const newActivity: RecentActivity = {
        ...activity,
        id: crypto.randomUUID(),
        timestamp: new Date()
      };
      
      // Ajouter au début de la liste
      activities.unshift(newActivity);
      
      // Limiter le nombre d'activités
      const trimmedActivities = activities.slice(0, MAX_ACTIVITIES);
      
      // Sauvegarder
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedActivities));
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'une activité:', error);
    }
  }

  /**
   * Efface toutes les activités
   */
  static clearActivities(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression des activités:', error);
    }
  }

  /**
   * Helper pour enregistrer une création
   */
  static trackCreate(
    type: RecentActivity['type'],
    title: string,
    description?: string
  ): void {
    this.addActivity({
      type,
      action: 'created',
      title,
      description
    });
  }

  /**
   * Helper pour enregistrer une modification
   */
  static trackUpdate(
    type: RecentActivity['type'],
    title: string,
    description?: string
  ): void {
    this.addActivity({
      type,
      action: 'updated',
      title,
      description
    });
  }

  /**
   * Helper pour enregistrer une suppression
   */
  static trackDelete(
    type: RecentActivity['type'],
    title: string,
    description?: string
  ): void {
    this.addActivity({
      type,
      action: 'deleted',
      title,
      description
    });
  }
}

// Exemples d'utilisation dans vos services:
// 
// Après création d'un build:
// ActivityTracker.trackCreate('build', 'Build Sung Jinwoo - PvP', 'Nouveau build ajouté');
//
// Après modification d'un chasseur:
// ActivityTracker.trackUpdate('chasseur', 'Cha Hae-In', 'Statistiques mises à jour');
//
// Après suppression d'un code promo:
// ActivityTracker.trackDelete('promo-code', 'SUMMER2024', 'Code promo expiré');
