/**
 * Validateur pour les données de builds
 * Vérifie toutes les contraintes du schéma et la cohérence des données
 */

import type { EditorReferenceData } from '../../../types';

/**
 * Interface pour les résultats de validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Structure attendue pour un build
 */
export interface BuildData {
  stats?: Record<string, string | number>;
  artefacts?: Record<string, { id: number; statPrincipale: string }>;
  noyaux?: Record<string, Array<{ id: number; statPrincipale: string }>>;
  sets_bonus?: Array<{ id: number }>;
  ombre?: number;
}

/**
 * Classe de validation des builds
 */
export class BuildValidator {
  
  /**
   * Valide un nom de build
   */
  static validateBuildName(buildName: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!buildName || buildName.trim().length === 0) {
      errors.push('Le nom du build ne peut pas être vide');
    }

    if (buildName.length > 100) {
      errors.push('Le nom du build ne peut pas dépasser 100 caractères');
    }

    if (buildName.includes('/') || buildName.includes('\\')) {
      errors.push('Le nom du build ne peut pas contenir de caractères spéciaux (/, \\)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Valide les données complètes d'un build
   */
  static validateBuildData(
    buildData: BuildData,
    referenceData?: EditorReferenceData
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation de base (structure)
    if (!buildData || typeof buildData !== 'object') {
      errors.push('Les données du build sont invalides');
      return { isValid: false, errors, warnings };
    }

    // Valider les artefacts
    const artefactsResult = this.validateArtefacts(buildData.artefacts, referenceData);
    errors.push(...artefactsResult.errors);
    warnings.push(...artefactsResult.warnings);

    // Valider les noyaux
    const noyauxResult = this.validateNoyaux(buildData.noyaux, referenceData);
    errors.push(...noyauxResult.errors);
    warnings.push(...noyauxResult.warnings);

    // Valider les stats
    const statsResult = this.validateStats(buildData.stats);
    errors.push(...statsResult.errors);
    warnings.push(...statsResult.warnings);

    // Valider les sets bonus
    const setsResult = this.validateSetsBonus(buildData.sets_bonus, referenceData);
    errors.push(...setsResult.errors);
    warnings.push(...setsResult.warnings);

    // Valider l'ombre (optionnelle)
    if (buildData.ombre !== undefined) {
      const ombreResult = this.validateOmbre(buildData.ombre, referenceData);
      errors.push(...ombreResult.errors);
      warnings.push(...ombreResult.warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Valide les artefacts
   */
  private static validateArtefacts(
    artefacts: BuildData['artefacts'],
    referenceData?: EditorReferenceData
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!artefacts || typeof artefacts !== 'object') {
      errors.push('Les artefacts sont requis');
      return { isValid: false, errors, warnings };
    }

    const slots = ['casque', 'armure', 'gants', 'bottes', 'collier', 'bracelet', 'bague', 'boucles'];
    const definedSlots = Object.keys(artefacts);
    const missingSlots: string[] = [];
    const slotsWithoutStats: string[] = [];

    // Vérifier les slots manquants
    slots.forEach(slot => {
      if (!artefacts[slot]) {
        missingSlots.push(slot);
      }
    });

    // Vérifier si tous les slots sont présents
    if (definedSlots.length === 0) {
      warnings.push('Aucun artefact configuré');
    } else if (missingSlots.length > 0) {
      warnings.push(`Artefacts manquants : ${missingSlots.join(', ')} (${definedSlots.length}/8)`);
    }

    // Valider chaque artefact
    Object.entries(artefacts).forEach(([slot, artefact]) => {
      if (!slots.includes(slot)) {
        errors.push(`Slot d'artefact invalide : "${slot}"`);
        return;
      }

      if (!artefact || typeof artefact !== 'object') {
        errors.push(`Artefact ${slot} : données invalides`);
        return;
      }

      // Vérifier l'ID
      if (!artefact.id || artefact.id === 0) {
        errors.push(`Artefact ${slot} : ID manquant ou invalide`);
      } else if (referenceData) {
        // Vérifier que l'artefact existe dans les données de référence
        const exists = referenceData.artefacts.some(a => a.id === artefact.id);
        if (!exists) {
          errors.push(`Artefact ${slot} : ID ${artefact.id} introuvable dans la base de données`);
        }
      }

      // Vérifier la stat principale
      if (!artefact.statPrincipale || artefact.statPrincipale.trim() === '') {
        slotsWithoutStats.push(slot);
      }
    });

    // Avertissement global pour les stats manquantes
    if (slotsWithoutStats.length > 0) {
      warnings.push(`Stats principales manquantes : ${slotsWithoutStats.join(', ')}`);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Valide les noyaux
   */
  private static validateNoyaux(
    noyaux: BuildData['noyaux'],
    referenceData?: EditorReferenceData
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!noyaux || typeof noyaux !== 'object') {
      errors.push('Les noyaux sont requis');
      return { isValid: false, errors, warnings };
    }

    const slots = ['1', '2', '3'];
    const emptySlots: string[] = [];

    slots.forEach(slot => {
      const slotNoyaux = noyaux[slot];

      if (!slotNoyaux || !Array.isArray(slotNoyaux) || slotNoyaux.length === 0) {
        emptySlots.push(slot);
        return;
      }

      slotNoyaux.forEach((noyau, index) => {
        if (!noyau || typeof noyau !== 'object') {
          errors.push(`Noyau slot ${slot}[${index}] : données invalides`);
          return;
        }

        // Vérifier l'ID
        if (!noyau.id || noyau.id === 0) {
          errors.push(`Noyau slot ${slot}[${index}] : ID manquant ou invalide`);
        } else if (referenceData) {
          // Vérifier que le noyau existe et correspond au bon slot
          const noyauRef = referenceData.noyaux.find(n => n.id === noyau.id);
          if (!noyauRef) {
            errors.push(`Noyau slot ${slot}[${index}] : ID ${noyau.id} introuvable dans la base de données`);
          } else if (noyauRef.slot !== parseInt(slot)) {
            errors.push(`Noyau slot ${slot}[${index}] : "${noyauRef.nom}" n'appartient pas au slot ${slot}`);
          }
        }

        // Vérifier la stat principale
        if (!noyau.statPrincipale || noyau.statPrincipale.trim() === '') {
          errors.push(`Noyau slot ${slot}[${index}] : stat principale manquante`);
        }
      });
    });

    // Avertissement global pour les slots vides (au lieu d'un avertissement par slot)
    if (emptySlots.length > 0) {
      warnings.push(`Slots noyaux vides : ${emptySlots.join(', ')}`);
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Valide les statistiques
   */
  private static validateStats(stats: BuildData['stats']): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!stats || typeof stats !== 'object') {
      errors.push('Les statistiques sont requises');
      return { isValid: false, errors, warnings };
    }

    const statEntries = Object.entries(stats);
    
    if (statEntries.length === 0) {
      warnings.push('Aucune statistique configurée');
      return { isValid: true, errors, warnings };
    }

    // Vérifier que les valeurs ne sont pas toutes vides
    const hasNonEmptyStats = statEntries.some(([_, value]) => 
      value !== '' && value !== null && value !== undefined
    );

    if (!hasNonEmptyStats) {
      warnings.push('Toutes les statistiques sont vides');
    }

    // Valider le format des valeurs numériques
    statEntries.forEach(([statName, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        const numValue = typeof value === 'number' ? value : parseFloat(String(value));
        if (isNaN(numValue)) {
          errors.push(`Statistique "${statName}" : valeur invalide "${value}"`);
        } else if (numValue < 0) {
          errors.push(`Statistique "${statName}" : la valeur ne peut pas être négative`);
        }
      }
    });

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Valide les sets bonus
   */
  private static validateSetsBonus(
    setsBonus: BuildData['sets_bonus'],
    referenceData?: EditorReferenceData
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!setsBonus || !Array.isArray(setsBonus)) {
      errors.push('Les sets bonus sont requis');
      return { isValid: false, errors, warnings };
    }

    if (setsBonus.length === 0) {
      warnings.push('Aucun set bonus configuré');
      return { isValid: true, errors, warnings };
    }

    setsBonus.forEach((set, index) => {
      if (!set || typeof set !== 'object') {
        errors.push(`Set bonus [${index}] : données invalides`);
        return;
      }

      // Vérifier l'ID
      if (!set.id || set.id === 0) {
        errors.push(`Set bonus [${index}] : ID manquant ou invalide - veuillez sélectionner un set valide`);
      } else if (referenceData) {
        // Vérifier que le set existe
        const exists = referenceData.setsBonus.some(s => s.id === set.id);
        if (!exists) {
          errors.push(`Set bonus [${index}] : ID ${set.id} introuvable dans la base de données`);
        }
      }
    });

    // Vérifier les doublons
    const setIds = setsBonus.map(s => s.id).filter(id => id && id !== 0);
    const uniqueIds = new Set(setIds);
    if (setIds.length !== uniqueIds.size) {
      warnings.push('Certains sets bonus sont dupliqués');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Valide l'ombre (optionnelle)
   */
  private static validateOmbre(
    ombreId: number,
    referenceData?: EditorReferenceData
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (ombreId && ombreId !== 0) {
      if (referenceData) {
        const exists = referenceData.ombres.some(o => o.id === ombreId);
        if (!exists) {
          errors.push(`Ombre : ID ${ombreId} introuvable dans la base de données`);
        }
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  /**
   * Valide les données d'un chasseur (pour insertion/mise à jour)
   */
  static validateChasseurData(
    chasseurId: number,
    chasseurNom: string,
    element: string
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Valider chasseur_id
    if (!chasseurId || chasseurId <= 0) {
      errors.push('ID du chasseur invalide');
    }

    // Valider chasseur_nom (NOT NULL, varchar(100))
    if (!chasseurNom || chasseurNom.trim().length === 0) {
      errors.push('Le nom du chasseur est requis');
    } else if (chasseurNom.length > 100) {
      errors.push('Le nom du chasseur ne peut pas dépasser 100 caractères');
    }

    // Valider element (varchar(50), peut être vide pour Jinwoo qui utilise tous les éléments)
    // L'élément peut être null, undefined ou une chaîne vide pour Jinwoo
    if (element && element.length > 50) {
      errors.push('L\'élément ne peut pas dépasser 50 caractères');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
