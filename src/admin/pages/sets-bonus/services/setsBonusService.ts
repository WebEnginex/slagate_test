/**
 * Service pour gérer les bonus de set dans Supabase
 */
import { supabase } from '@/integrations/supabase/client';
import type { SetBonus, SetBonusInput, SetBonusUpdate } from '../types';

export class SetsBonusService {
  
  /**
   * Récupère tous les bonus de set
   */
  static async getAllSetsBonus(): Promise<SetBonus[]> {
    const { data, error } = await supabase
      .from('sets_bonus')
      .select('*')
      .order('nom', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des sets bonus:', error);
      throw new Error(`Impossible de récupérer les sets bonus: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Récupère un bonus de set par son ID
   */
  static async getSetBonusById(id: number): Promise<SetBonus | null> {
    const { data, error } = await supabase
      .from('sets_bonus')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Erreur lors de la récupération du set bonus:', error);
      throw new Error(`Impossible de récupérer le set bonus: ${error.message}`);
    }

    return data;
  }

  /**
   * Crée un nouveau bonus de set
   */
  static async createSetBonus(setBonusData: SetBonusInput): Promise<SetBonus> {
    const { data, error } = await supabase
      .from('sets_bonus')
      .insert([{
        nom: setBonusData.nom.trim(),
        description: setBonusData.description.trim()
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du set bonus:', error);
      throw new Error(`Impossible de créer le set bonus: ${error.message}`);
    }

    return data;
  }

  /**
   * Met à jour un bonus de set existant
   */
  static async updateSetBonus(updateData: SetBonusUpdate): Promise<SetBonus> {
    const { id, ...updates } = updateData;

    // Nettoyer les chaînes si présentes
    const cleanedUpdates: Partial<SetBonusInput> = {};
    if (updates.nom !== undefined) {
      cleanedUpdates.nom = updates.nom.trim();
    }
    if (updates.description !== undefined) {
      cleanedUpdates.description = updates.description.trim();
    }

    const { data, error } = await supabase
      .from('sets_bonus')
      .update(cleanedUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la mise à jour du set bonus:', error);
      throw new Error(`Impossible de mettre à jour le set bonus: ${error.message}`);
    }

    return data;
  }

  /**
   * Supprime un bonus de set
   */
  static async deleteSetBonus(id: number): Promise<void> {
    const { error } = await supabase
      .from('sets_bonus')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du set bonus:', error);
      throw new Error(`Impossible de supprimer le set bonus: ${error.message}`);
    }
  }

  /**
   * Recherche des bonus de set par nom
   */
  static async searchSetsBonusByName(searchTerm: string): Promise<SetBonus[]> {
    const { data, error } = await supabase
      .from('sets_bonus')
      .select('*')
      .ilike('nom', `%${searchTerm}%`)
      .order('nom', { ascending: true });

    if (error) {
      console.error('Erreur lors de la recherche des sets bonus:', error);
      throw new Error(`Impossible de rechercher les sets bonus: ${error.message}`);
    }

    return data || [];
  }
}
