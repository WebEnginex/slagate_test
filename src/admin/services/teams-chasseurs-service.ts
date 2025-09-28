import { supabase } from "@/integrations/supabase/client";
import { 
  ElementType, 
  RoleType, 
  TeamPosition, 
  ElementTeam, 
  TeamsChasseurs,
  CreateTeamPositionRequest,
  UpdateTeamPositionRequest,
  TeamPositionResponse,
  ELEMENTS,
  ROLES
} from "@/admin/types/teams-chasseurs";

export class TeamsChasseursService {
  /**
   * Récupère toutes les positions d'une team pour un élément donné
   */
  static async getElementTeam(element: ElementType): Promise<ElementTeam> {
    const { data, error } = await supabase
      .from('tier_list_teams_chasseurs')
      .select(`
        *,
        chasseur:chasseurs(id, nom, rarete, element_chasseur, image)
      `)
      .eq('element', element)
      .order('role')
      .order('position');

    if (error) {
      console.error('Erreur lors de la récupération de la team:', error);
      throw new Error(`Erreur lors de la récupération de la team ${element}: ${error.message}`);
    }

    // Organiser les données par rôle
    const breakerPositions = data?.filter(pos => pos.role === 'breaker') || [];
    const supportPositions = data?.filter(pos => pos.role === 'support') || [];
    const dpsPositions = data?.filter(pos => pos.role === 'dps') || [];

    return {
      element,
      breaker_positions: breakerPositions.map(this.mapToTeamPosition),
      support_positions: supportPositions.map(this.mapToTeamPosition),
      dps_positions: dpsPositions.map(this.mapToTeamPosition)
    };
  }

  /**
   * Récupère toutes les teams chasseurs (tous les éléments)
   */
  static async getAllTeams(): Promise<TeamsChasseurs> {
    const teams = await Promise.all(
      ELEMENTS.map(async element => ({
        element,
        data: await this.getElementTeam(element)
      }))
    );

    return teams.reduce((acc, { element, data }) => {
      acc[element] = data;
      return acc;
    }, {} as TeamsChasseurs);
  }

  /**
   * Ajoute ou met à jour une position dans une team
   */
  static async upsertTeamPosition(request: CreateTeamPositionRequest): Promise<TeamPositionResponse> {
    console.log("🔄 upsertTeamPosition called with:", request);
    
    // Vérifier si une position existe déjà pour cet élément/rôle/position
    const { data: existingPosition, error: searchError } = await supabase
      .from('tier_list_teams_chasseurs')
      .select('id')
      .eq('element', request.element)
      .eq('role', request.role)
      .eq('position', request.position)
      .single();

    if (searchError && searchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error("Erreur lors de la recherche de position existante:", searchError);
      throw new Error(`Erreur lors de la recherche: ${searchError.message}`);
    }
    
    console.log("Position existante trouvée:", existingPosition);

    let result;

    if (existingPosition) {
      // Mise à jour de la position existante
      const { data, error } = await supabase
        .from('tier_list_teams_chasseurs')
        .update({
          chasseur_id: request.chasseur_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPosition.id)
        .select('*')
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }
      result = data;
    } else {
      // Création d'une nouvelle position
      const { data, error } = await supabase
        .from('tier_list_teams_chasseurs')
        .insert({
          chasseur_id: request.chasseur_id,
          element: request.element,
          role: request.role,
          position: request.position
        })
        .select('*')
        .single();

      if (error) {
        console.error('Erreur lors de la création:', error);
        throw new Error(`Erreur lors de la création: ${error.message}`);
      }
      result = data;
    }

    return result as TeamPositionResponse;
  }

  /**
   * Supprime une position de team
   */
  static async deleteTeamPosition(positionId: string): Promise<void> {
    const { error } = await supabase
      .from('tier_list_teams_chasseurs')
      .delete()
      .eq('id', positionId);

    if (error) {
      console.error('Erreur lors de la suppression:', error);
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  }

  /**
   * Réorganise les positions d'un rôle dans un élément donné
   */
  static async reorderPositions(
    element: ElementType, 
    role: RoleType, 
    newOrder: { id: string; position: number }[]
  ): Promise<void> {
    // Effectuer les mises à jour en transaction
    const updates = newOrder.map(({ id, position }) => 
      supabase
        .from('tier_list_teams_chasseurs')
        .update({ position, updated_at: new Date().toISOString() })
        .eq('id', id)
    );

    const results = await Promise.all(updates);
    
    for (const { error } of results) {
      if (error) {
        console.error('Erreur lors de la réorganisation:', error);
        throw new Error(`Erreur lors de la réorganisation: ${error.message}`);
      }
    }
  }

  /**
   * Récupère tous les chasseurs disponibles pour les dropdowns
   */
  static async getAvailableChasseurs() {
    const { data, error } = await supabase
      .from('chasseurs')
      .select('id, nom, rarete, element_chasseur, image')
      .order('nom');

    if (error) {
      console.error('Erreur lors de la récupération des chasseurs:', error);
      throw new Error(`Erreur lors de la récupération des chasseurs: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Valide qu'un chasseur n'est pas déjà utilisé dans la même team/rôle
   */
  static async validateChasseurPosition(
    chasseurId: number, 
    element: ElementType, 
    role: RoleType,
    excludePositionId?: string
  ): Promise<{ isValid: boolean; message?: string }> {
    let query = supabase
      .from('tier_list_teams_chasseurs')
      .select('id, position')
      .eq('chasseur_id', chasseurId)
      .eq('element', element)
      .eq('role', role);

    if (excludePositionId) {
      query = query.neq('id', excludePositionId);
    }

    const { data, error } = await query;

    if (error) {
      return { isValid: false, message: `Erreur de validation: ${error.message}` };
    }

    if (data && data.length > 0) {
      return { 
        isValid: false, 
        message: `Ce chasseur est déjà assigné à la position ${data[0].position} du rôle ${role} pour l'élément ${element}` 
      };
    }

    return { isValid: true };
  }

  /**
   * Fonction utilitaire pour mapper les données Supabase vers notre type TeamPosition
   */
  private static mapToTeamPosition(data: {
    id: string;
    chasseur_id: number;
    element: string;
    role: string;
    position: number;
    created_at?: string | null;
    updated_at?: string | null;
    chasseur?: {
      id: number;
      nom: string;
      rarete: string | null;
      element_chasseur: string | null;
      image: string | null;
    } | null;
  }): TeamPosition {
    return {
      id: data.id,
      chasseur_id: data.chasseur_id,
      position: data.position,
      role: data.role as RoleType,
      element: data.element as ElementType,
      chasseur: data.chasseur ? {
        id: data.chasseur.id,
        nom: data.chasseur.nom,
        rarete: data.chasseur.rarete,
        element: data.chasseur.element_chasseur,
        imageUrl: data.chasseur.image
      } : undefined
    };
  }
}