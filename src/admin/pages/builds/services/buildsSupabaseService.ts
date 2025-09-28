// src/admin/services/buildsSupabaseService.ts
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase avec fallback pour le développement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zmjcebypuyjhwqzfmjib.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptamNlYnlwdXlqaHdxemZtamliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MjY5ODIsImV4cCI6MjA1MDIwMjk4Mn0.wKaxrMU2fB4U4tTR3QywqxLTYaiKM3LZCUwCUvBP1Fo';

console.log('🔧 Configuration Supabase:', {
  url: supabaseUrl,
  hasKey: !!supabaseKey,
  envUrl: import.meta.env.VITE_SUPABASE_URL,
  envKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌'
});

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Configuration Supabase manquante');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export class BuildsSupabaseService {
  
  // Récupérer un chasseur par son ID
  async getChasseur(chasseurId: number) {
    try {
      const { data, error } = await supabase
        .from('builds')
        .select('*')
        .eq('chasseur_id', chasseurId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error(`Chasseur ${chasseurId} non trouvé`);
        }
        throw error;
      }

      return data;
      
    } catch (error) {
      console.error(`Erreur récupération chasseur ${chasseurId}:`, error);
      throw error;
    }
  }

  // Sauvegarder un build pour un chasseur
  async saveChasseurBuild(chasseurId: number, buildName: string, buildData: Record<string, unknown>, originalBuildName?: string) {
    try {
      console.log(`💾 Sauvegarde build "${buildName}" pour chasseur ${chasseurId}...`);

      // 1. Récupérer les builds actuels du chasseur
      const chasseur = await this.getChasseur(chasseurId);
      
      // 2. Gestion des builds_data vides/null et du renommage
      const existingBuildsData = chasseur.builds_data || {};
      const currentBuilds = { ...(existingBuildsData.builds || {}) };
      
      if (originalBuildName && originalBuildName !== buildName) {
        // C'est un renommage : supprimer l'ancien
        delete currentBuilds[originalBuildName];
        console.log(`🔄 Renommage build: "${originalBuildName}" → "${buildName}"`);
      }
      
      // 3. Ajouter/mettre à jour le nouveau build (créer la structure si nécessaire)
      const updatedBuilds = {
        ...existingBuildsData,
        builds: {
          ...currentBuilds,
          [buildName]: buildData
        }
      };

      // 4. Sauvegarder en base avec versioning
      const { data, error } = await supabase
        .from('builds')
        .update({
          builds_data: updatedBuilds,
          updated_at: new Date().toISOString(),
          version: chasseur.version + 1
        })
        .eq('chasseur_id', chasseurId)
        .eq('version', chasseur.version) // Protection contre modifications concurrentes
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Conflit de version - Le chasseur a été modifié par quelqu\'un d\'autre');
        }
        throw error;
      }

      console.log(`✅ Build "${buildName}" sauvegardé pour chasseur ${chasseurId}`);
      return data;
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde build:', error);
      throw error;
    }
  }

  // Supprimer un build
  async deleteChasseurBuild(chasseurId: number, buildName: string) {
    const chasseur = await this.getChasseur(chasseurId);
    
    const existingBuildsData = chasseur.builds_data || {};
    const updatedBuilds = { ...existingBuildsData };
    const builds = { ...(updatedBuilds.builds || {}) };
    delete builds[buildName];
    updatedBuilds.builds = builds;

    const { error } = await supabase
      .from('builds')
      .update({
        builds_data: updatedBuilds,
        updated_at: new Date().toISOString(),
        version: chasseur.version + 1
      })
      .eq('chasseur_id', chasseurId)
      .eq('version', chasseur.version);

    if (error) throw error;

    return { success: true };
  }

  // Récupérer tous les chasseurs
  async getAllChasseurs() {
    console.log('🔍 Tentative de récupération des chasseurs...');
    
    try {
      const { data, error } = await supabase
        .from('builds')
        .select('chasseur_id, chasseur_nom, element, builds_data, updated_at')
        .order('chasseur_id');

      console.log('📊 Réponse Supabase:', { data, error });

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      console.log('✅ Chasseurs récupérés:', data?.length || 0);
      return data || [];
      
    } catch (error) {
      console.error('💥 Erreur récupération chasseurs:', error);
      throw error;
    }
  }

  // Validation des données avant sauvegarde
  validateBuildData(buildData: Record<string, unknown>): string[] {
    const errors: string[] = [];

    if (!buildData.artefacts) {
      errors.push('Les artefacts sont requis');
    }

    if (!buildData.noyaux) {
      errors.push('Les noyaux sont requis');
    }

    if (!buildData.stats) {
      errors.push('Les stats sont requises');
    }

    if (!buildData.sets_bonus) {
      errors.push('Les sets bonus sont requis');
    } else {
      // Valider que les sets_bonus ont des IDs valides (pas 0)
      const setsBonus = buildData.sets_bonus as Array<{ id: number }>;
      if (Array.isArray(setsBonus)) {
        const invalidSets = setsBonus.filter(set => !set.id || set.id === 0);
        if (invalidSets.length > 0) {
          errors.push(`${invalidSets.length} set(s) bonus ont des IDs invalides - veuillez sélectionner des sets valides`);
        }
      }
    }

    // Validation des artefacts
    if (buildData.artefacts) {
      Object.entries(buildData.artefacts).forEach(([slot, artefact]: [string, Record<string, unknown>]) => {
        if (!artefact.id) {
          errors.push(`Artefact ${slot}: ID manquant`);
        }
        if (!artefact.statPrincipale) {
          errors.push(`Artefact ${slot}: Stat principale manquante`);
        }
      });
    }

    return errors;
  }
}