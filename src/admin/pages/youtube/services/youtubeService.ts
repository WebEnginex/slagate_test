/**
 * Service pour gérer les liens YouTube dans Supabase
 */
import { supabase } from '@/integrations/supabase/client';
import type { YoutubeLink, YoutubeLinkInput, YoutubeLinkUpdate } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabaseClient = supabase as any;

export class YoutubeService {
  
  /**
   * Récupère tous les liens YouTube
   */
  static async getAllLinks(): Promise<YoutubeLink[]> {
    const { data, error } = await supabaseClient
      .from('youtube_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des liens YouTube:', error);
      throw new Error(`Impossible de récupérer les liens: ${error.message}`);
    }

    return (data || []) as YoutubeLink[];
  }

  /**
   * Récupère le lien actif (pour l'affichage public)
   */
  static async getActiveLink(): Promise<YoutubeLink | null> {
    const { data, error } = await supabaseClient
      .from('youtube_links')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Aucun lien actif trouvé
        return null;
      }
      console.error('Erreur lors de la récupération du lien actif:', error);
      throw new Error(`Impossible de récupérer le lien actif: ${error.message}`);
    }

    return data as YoutubeLink;
  }

  /**
   * Récupère un lien par son ID
   */
  static async getLinkById(id: number): Promise<YoutubeLink | null> {
    const { data, error } = await supabaseClient
      .from('youtube_links')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Erreur lors de la récupération du lien:', error);
      throw new Error(`Impossible de récupérer le lien: ${error.message}`);
    }

    return data as YoutubeLink;
  }

  /**
   * Crée un nouveau lien YouTube
   */
  static async createLink(linkData: YoutubeLinkInput): Promise<YoutubeLink> {
    // Si le nouveau lien est actif, désactiver tous les autres
    if (linkData.is_active) {
      await this.deactivateAllLinks();
    }

    const { data, error} = await supabaseClient
      .from('youtube_links')
      .insert([{
        url: linkData.url,
        title: linkData.title || null,
        description: linkData.description || null,
        is_active: linkData.is_active ?? true
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du lien:', error);
      throw new Error(`Impossible de créer le lien: ${error.message}`);
    }

    return data as YoutubeLink;
  }

  /**
   * Met à jour un lien YouTube existant
   */
  static async updateLink(updateData: YoutubeLinkUpdate): Promise<YoutubeLink> {
    const { id, ...updates } = updateData;

    // Si on active ce lien, désactiver tous les autres
    if (updates.is_active) {
      await this.deactivateAllLinks(id);
    }

    const { data, error } = await supabaseClient
      .from('youtube_links')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du lien:', error);
      throw new Error(`Impossible de mettre à jour le lien: ${error.message}`);
    }

    return data as YoutubeLink;
  }

  /**
   * Supprime un lien YouTube
   */
  static async deleteLink(id: number): Promise<void> {
    const { error } = await supabaseClient
      .from('youtube_links')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du lien:', error);
      throw new Error(`Impossible de supprimer le lien: ${error.message}`);
    }
  }

  /**
   * Désactive tous les liens (sauf celui spécifié)
   */
  private static async deactivateAllLinks(exceptId?: number): Promise<void> {
    let query = supabaseClient
      .from('youtube_links')
      .update({ is_active: false })
      .eq('is_active', true);

    if (exceptId) {
      query = query.neq('id', exceptId);
    }

    const { error } = await query;

    if (error) {
      console.error('Erreur lors de la désactivation des liens:', error);
      throw new Error(`Impossible de désactiver les liens: ${error.message}`);
    }
  }

  /**
   * Active un lien et désactive tous les autres
   */
  static async setActiveLink(id: number): Promise<void> {
    await this.deactivateAllLinks(id);
    await this.updateLink({ id, is_active: true });
  }

  /**
   * Extrait l'ID de la vidéo YouTube à partir d'une URL
   */
  static extractVideoId(url: string): string | null {
    // Patterns supportés:
    // - https://www.youtube.com/watch?v=VIDEO_ID
    // - https://youtu.be/VIDEO_ID
    // - https://www.youtube.com/embed/VIDEO_ID
    // - Juste l'ID: VIDEO_ID
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Valide une URL YouTube
   */
  static validateYoutubeUrl(url: string): { isValid: boolean; error?: string } {
    if (!url || url.trim() === '') {
      return { isValid: false, error: 'L\'URL ne peut pas être vide' };
    }

    const videoId = this.extractVideoId(url);
    if (!videoId) {
      return { 
        isValid: false, 
        error: 'URL YouTube invalide. Formats acceptés: youtube.com/watch?v=..., youtu.be/..., ou ID de vidéo' 
      };
    }

    return { isValid: true };
  }

  /**
   * Génère l'URL d'embed pour une vidéo YouTube
   */
  static getEmbedUrl(url: string): string | null {
    const videoId = this.extractVideoId(url);
    if (!videoId) return null;
    
    return `https://www.youtube.com/embed/${videoId}`;
  }
}
