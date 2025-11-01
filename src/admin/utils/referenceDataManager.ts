import { supabase } from '../../integrations/supabase/client';
import type { EditorReferenceData } from '../types';

/**
 * Classe pour gérer les données de référence nécessaires à l'éditeur
 */
export class ReferenceDataManager {
  
  /**
   * Charge toutes les données de référence depuis Supabase
   */
  static async loadAllReferenceData(): Promise<EditorReferenceData> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Chargement des données de référence...');
      }
      
      // Charger toutes les données en parallèle
      const [
        chasseursResponse,
        artefactsResponse,
        noyauxResponse,
        ombresResponse,
        setsBonusResponse
      ] = await Promise.all([
        supabase.from('chasseurs').select('id, nom, element, image, rarete').not('id', 'is', null).order('nom'),
        supabase.from('artefacts').select('id, nom, categorie, image').not('id', 'is', null).order('nom'),
        supabase.from('noyaux').select('id, nom, image, slot').not('id', 'is', null).order('nom'),
        supabase.from('ombres').select('id, nom').not('id', 'is', null).order('nom'),
        supabase.from('sets_bonus').select('id, nom').not('id', 'is', null).order('nom')
      ]);

      // Vérifier les erreurs
      if (chasseursResponse.error) throw chasseursResponse.error;
      if (artefactsResponse.error) throw artefactsResponse.error;
      if (noyauxResponse.error) throw noyauxResponse.error;
      if (ombresResponse.error) throw ombresResponse.error;
      if (setsBonusResponse.error) throw setsBonusResponse.error;

      const referenceData: EditorReferenceData = {
        chasseurs: (chasseursResponse.data || [])
          .filter(c => c.id !== null)
          .map(c => ({ ...c, id: c.id! })),
        artefacts: (artefactsResponse.data || [])
          .filter(a => a.id !== null)
          .map(a => ({ ...a, id: a.id! })),
        noyaux: (noyauxResponse.data || [])
          .filter(n => n.id !== null)
          .map(n => ({ ...n, id: n.id! })),
        ombres: (ombresResponse.data || [])
          .filter(o => o.id !== null)
          .map(o => ({ ...o, id: o.id! })),
        setsBonus: (setsBonusResponse.data || [])
          .filter(s => s.id !== null)
          .map(s => ({ ...s, id: s.id! }))
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Données de référence chargées:', {
          chasseurs: referenceData.chasseurs.length,
          artefacts: referenceData.artefacts.length,
          noyaux: referenceData.noyaux.length,
          ombres: referenceData.ombres.length,
          setsBonus: referenceData.setsBonus.length
        });
      }

      return referenceData;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données de référence:', error);
      throw new Error('Impossible de charger les données de référence');
    }
  }

  /**
   * Trouve un chasseur par ID
   */
  static findChasseurById(chasseurs: EditorReferenceData['chasseurs'], id: number) {
    return chasseurs.find(c => c.id === id);
  }

  /**
   * Trouve un artefact par ID
   */
  static findArtefactById(artefacts: EditorReferenceData['artefacts'], id: number) {
    return artefacts.find(a => a.id === id);
  }

  /**
   * Trouve un noyau par ID
   */
  static findNoyauById(noyaux: EditorReferenceData['noyaux'], id: number) {
    return noyaux.find(n => n.id === id);
  }

  /**
   * Trouve une ombre par ID
   */
  static findOmbreById(ombres: EditorReferenceData['ombres'], id: number) {
    return ombres.find(o => o.id === id);
  }

  /**
   * Trouve un set bonus par ID
   */
  static findSetBonusById(setsBonus: EditorReferenceData['setsBonus'], id: number) {
    return setsBonus.find(s => s.id === id);
  }

  /**
   * Filtre les artefacts par catégorie
   */
  static filterArtefactsByCategory(artefacts: EditorReferenceData['artefacts'], category: string) {
    return artefacts.filter(a => a.categorie === category);
  }

  /**
   * Filtre les chasseurs par élément
   */
  static filterChasseursByElement(chasseurs: EditorReferenceData['chasseurs'], element: string) {
    return chasseurs.filter(c => c.element === element);
  }
}