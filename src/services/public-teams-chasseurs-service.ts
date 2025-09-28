import { supabase } from "@/integrations/supabase/client";

// Types publics pour les teams chasseurs (simplifié par rapport aux types admin)
export interface PublicChasseurInfo {
  id: number;
  nom: string;
  rarete: string | null;
  element: string | null;
  imageUrl: string | null;
}

export interface PublicTeamPosition {
  id: string;
  position: number;
  role: string;
  chasseur?: PublicChasseurInfo;
}

export interface PublicElementTeam {
  element: string;
  breaker_positions: PublicTeamPosition[];
  support_positions: PublicTeamPosition[];
  dps_positions: PublicTeamPosition[];
}

export interface PublicTeamsChasseurs {
  feu: PublicElementTeam;
  vent: PublicElementTeam;
  lumiere: PublicElementTeam;
  eau: PublicElementTeam;
  tenebres: PublicElementTeam;
}

export class PublicTeamsChasseursService {
  /**
   * Récupère toutes les teams chasseurs pour affichage public
   */
  static async getAllTeamsChasseurs(): Promise<PublicTeamsChasseurs> {
    const { data, error } = await supabase
      .from('tier_list_teams_chasseurs')
      .select(`
        *,
        chasseur:chasseurs(id, nom, rarete, element_chasseur, image)
      `)
      .order('element')
      .order('role')
      .order('position');

    if (error) {
      console.error('Erreur lors de la récupération des teams chasseurs:', error);
      throw new Error(`Erreur lors de la récupération: ${error.message}`);
    }

    // Organiser les données par élément et rôle
    const teamsData: Record<string, PublicElementTeam> = {};
    const elements = ['feu', 'vent', 'lumiere', 'eau', 'tenebres'];

    // Initialiser la structure
    elements.forEach(element => {
      teamsData[element] = {
        element,
        breaker_positions: [],
        support_positions: [],
        dps_positions: []
      };
    });

    // Remplir avec les données
    data?.forEach(position => {
      const elementKey = position.element.toLowerCase();
      const roleKey = `${position.role}_positions` as keyof PublicElementTeam;
      
      if (teamsData[elementKey] && typeof teamsData[elementKey][roleKey] === 'object') {
        (teamsData[elementKey][roleKey] as PublicTeamPosition[]).push({
          id: position.id,
          position: position.position,
          role: position.role,
          chasseur: position.chasseur ? {
            id: position.chasseur.id,
            nom: position.chasseur.nom,
            rarete: position.chasseur.rarete,
            element: position.chasseur.element_chasseur,
            imageUrl: position.chasseur.image
          } : undefined
        });
      }
    });

    // Trier les positions par numéro
    elements.forEach(element => {
      teamsData[element].breaker_positions.sort((a, b) => a.position - b.position);
      teamsData[element].support_positions.sort((a, b) => a.position - b.position);
      teamsData[element].dps_positions.sort((a, b) => a.position - b.position);
    });

    return {
      feu: teamsData.feu,
      vent: teamsData.vent,
      lumiere: teamsData.lumiere,
      eau: teamsData.eau,
      tenebres: teamsData.tenebres
    };
  }

  /**
   * Récupère la team d'un élément spécifique
   */
  static async getElementTeam(element: string): Promise<PublicElementTeam> {
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
      throw new Error(`Erreur lors de la récupération: ${error.message}`);
    }

    // Organiser par rôle
    const breakerPositions = data?.filter(pos => pos.role === 'breaker') || [];
    const supportPositions = data?.filter(pos => pos.role === 'support') || [];
    const dpsPositions = data?.filter(pos => pos.role === 'dps') || [];

    const mapPosition = (pos: {
      id: string;
      position: number;
      role: string;
      chasseur?: {
        id: number;
        nom: string;
        rarete: string | null;
        element_chasseur: string | null;
        image: string | null;
      } | null;
    }): PublicTeamPosition => ({
      id: pos.id,
      position: pos.position,
      role: pos.role,
      chasseur: pos.chasseur ? {
        id: pos.chasseur.id,
        nom: pos.chasseur.nom,
        rarete: pos.chasseur.rarete,
        element: pos.chasseur.element_chasseur,
        imageUrl: pos.chasseur.image
      } : undefined
    });

    return {
      element,
      breaker_positions: breakerPositions.map(mapPosition).sort((a, b) => a.position - b.position),
      support_positions: supportPositions.map(mapPosition).sort((a, b) => a.position - b.position),
      dps_positions: dpsPositions.map(mapPosition).sort((a, b) => a.position - b.position)
    };
  }
}