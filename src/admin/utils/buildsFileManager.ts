// Import conditionnel pour la compatibilité navigateur/Node.js
let fs: typeof import('fs/promises') | null = null;
let path: typeof import('path') | null = null;

// Tentative d'import des modules Node.js (disponible seulement côté serveur)
try {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    fs = require('fs/promises');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    path = require('path');
  }
} catch {
  // Ignorer les erreurs d'import dans le navigateur
}

import type { ChasseurBuild } from '../config/builds/buildsChasseurs';
import type { EditorReferenceData, BuildValidationResult } from './types';

// Chemins des fichiers (seulement disponibles côté serveur)
const BUILDS_FILE_PATH = path?.resolve(process.cwd?.() || '', 'src/config/builds/buildsChasseurs.ts');
const LAST_MODIFIED_PATH = path?.resolve(process.cwd?.() || '', 'src/config/last-modification-date/lastModifiedDates.ts');

// Classe pour gérer les opérations sur le fichier buildsChasseurs.ts
export class BuildsFileManager {
  
  /**
   * Lit le contenu du fichier buildsChasseurs.ts
   */
  static async readBuildsFile(): Promise<string> {
    if (!fs || !BUILDS_FILE_PATH) {
      throw new Error('Opération de lecture de fichier non disponible dans le navigateur');
    }
    
    try {
      const content = await fs.readFile(BUILDS_FILE_PATH, 'utf-8');
      return content;
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier builds:', error);
      throw new Error('Impossible de lire le fichier de configuration des builds');
    }
  }

  /**
   * Parse le contenu du fichier et extrait les données des builds
   */
  static parseBuildsContent(content: string): ChasseurBuild[] {
    try {
      // Extraction des données entre les crochets de l'export
      const exportMatch = content.match(/export const buildsChasseurs: ChasseurBuild\[\] = (\[[\s\S]*\]);/);
      if (!exportMatch) {
        throw new Error('Format du fichier invalide');
      }

      // Évaluation sécurisée du contenu JavaScript
      // Note: En production, il faudrait utiliser un parser plus sûr comme @babel/parser
      const buildsData = eval(`(${exportMatch[1]})`);
      return buildsData as ChasseurBuild[];
    } catch (error) {
      console.error('Erreur lors du parsing du fichier builds:', error);
      throw new Error('Format du fichier builds invalide');
    }
  }

  /**
   * Convertit les données des builds en contenu TypeScript
   */
  static generateBuildsContent(builds: ChasseurBuild[]): string {
    const header = `export type ChasseurBuild = {
  chasseurId: number;
  element: "feu" | "eau" | "vent" | "lumiere" | "tenebres" | "jinwoo";
  builds: {
    id: number;
    nom: string;
    artefacts: {
      [slot: string]: {
        id: number;
        statPrincipale: string;
        statsSecondaires: string[];
      };
    };
    noyaux: {
      [slot: number]: {
        id: number;
        statPrincipale: string;
      }[];
    };
    ombre?: number; // Ajouté comme optionnel
    sets_bonus: { id: number }[];
    stats: Record<string, string>;
  }[];
};

// Eléments possibles : "feu", "eau", "vent", "lumiere", "tenebres"

export const buildsChasseurs: ChasseurBuild[] = `;

    const buildsJson = JSON.stringify(builds, null, 2);
    
    return header + buildsJson + ';\n';
  }

  /**
   * Écrit les données dans le fichier buildsChasseurs.ts
   */
  static async writeBuildsFile(builds: ChasseurBuild[]): Promise<void> {
    if (!fs || !BUILDS_FILE_PATH) {
      throw new Error('Opération d\'écriture de fichier non disponible dans le navigateur');
    }
    
    try {
      // Créer une sauvegarde
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `${BUILDS_FILE_PATH}.backup.${timestamp}`;
      
      const originalContent = await this.readBuildsFile();
      await fs.writeFile(backupPath, originalContent, 'utf-8');
      
      // Écrire le nouveau contenu
      const newContent = this.generateBuildsContent(builds);
      await fs.writeFile(BUILDS_FILE_PATH, newContent, 'utf-8');
      
      console.log(`✅ Fichier builds sauvegardé. Backup créé: ${backupPath}`);
    } catch (error) {
      console.error('Erreur lors de l\'écriture du fichier builds:', error);
      throw new Error('Impossible de sauvegarder le fichier de configuration des builds');
    }
  }

  /**
   * Met à jour la date de dernière modification
   */
  static async updateLastModifiedDate(): Promise<void> {
    if (!fs || !LAST_MODIFIED_PATH) {
      console.warn('Mise à jour de date non disponible dans le navigateur');
      return;
    }
    
    try {
      const now = new Date();
      const dateStr = `${now.getDate()} ${now.toLocaleDateString('fr-FR', { month: 'long' })} ${now.getFullYear()} | ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const content = await fs.readFile(LAST_MODIFIED_PATH, 'utf-8');
      const updatedContent = content.replace(
        /builds: "[^"]*"/,
        `builds: "${dateStr}"`
      );
      
      await fs.writeFile(LAST_MODIFIED_PATH, updatedContent, 'utf-8');
      console.log(`✅ Date de modification mise à jour: ${dateStr}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la date:', error);
      // Ne pas échouer si la mise à jour de la date échoue
    }
  }

  /**
   * Valide les données des builds
   */
  static validateBuilds(builds: ChasseurBuild[]): BuildValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    builds.forEach((chasseurBuild, chasseurIndex) => {
      // Vérification de base
      if (!chasseurBuild.chasseurId || typeof chasseurBuild.chasseurId !== 'number') {
        errors.push(`Build ${chasseurIndex}: ID chasseur manquant ou invalide`);
      }

      if (!chasseurBuild.element || !['feu', 'eau', 'vent', 'lumiere', 'tenebres', 'jinwoo'].includes(chasseurBuild.element)) {
        errors.push(`Build ${chasseurIndex}: Élément manquant ou invalide`);
      }

      if (!Array.isArray(chasseurBuild.builds) || chasseurBuild.builds.length === 0) {
        errors.push(`Build ${chasseurIndex}: Aucun build défini`);
      }

      // Vérification des builds individuels
      chasseurBuild.builds?.forEach((build, buildIndex) => {
        if (!build.id || typeof build.id !== 'number') {
          errors.push(`Chasseur ${chasseurIndex}, Build ${buildIndex}: ID manquant ou invalide`);
        }

        if (!build.nom || typeof build.nom !== 'string') {
          errors.push(`Chasseur ${chasseurIndex}, Build ${buildIndex}: Nom manquant ou invalide`);
        }

        // Vérification des artefacts
        const requiredSlots = ['casque', 'armure', 'gants', 'bottes', 'collier', 'bracelet', 'bague', 'boucles'];
        requiredSlots.forEach(slot => {
          if (!build.artefacts?.[slot]) {
            warnings.push(`Chasseur ${chasseurIndex}, Build ${buildIndex}: Artefact ${slot} manquant`);
          } else {
            const artefact = build.artefacts[slot];
            if (!artefact.id || typeof artefact.id !== 'number') {
              errors.push(`Chasseur ${chasseurIndex}, Build ${buildIndex}: ID artefact ${slot} invalide`);
            }
          }
        });

        // Vérification des noyaux
        if (!build.noyaux || typeof build.noyaux !== 'object') {
          warnings.push(`Chasseur ${chasseurIndex}, Build ${buildIndex}: Noyaux manquants`);
        }

        // Vérification des sets bonus
        if (!Array.isArray(build.sets_bonus)) {
          errors.push(`Chasseur ${chasseurIndex}, Build ${buildIndex}: Sets bonus invalides`);
        }

        // Vérification des stats
        if (!build.stats || typeof build.stats !== 'object') {
          errors.push(`Chasseur ${chasseurIndex}, Build ${buildIndex}: Stats manquantes`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Sauvegarde complète avec validation
   */
  static async saveBuilds(builds: ChasseurBuild[]): Promise<BuildValidationResult> {
    // Valider d'abord
    const validation = this.validateBuilds(builds);
    
    if (!validation.isValid) {
      throw new Error(`Validation échouée: ${validation.errors.join(', ')}`);
    }

    // Sauvegarder
    await this.writeBuildsFile(builds);
    await this.updateLastModifiedDate();

    return validation;
  }
}