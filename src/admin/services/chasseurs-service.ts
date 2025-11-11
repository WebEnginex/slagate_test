/**
 * Service pour gérer les chasseurs dans Supabase
 * Gère le CRUD complet + upload/suppression d'images dans le storage
 */

import { supabase } from '@/integrations/supabase/client';
import type { Chasseur, CreateChasseurData, UpdateChasseurData } from '@/admin/types';

const BUCKET_NAME = 'hunter-portrait';

export class ChasseursService {
  /**
   * Récupère tous les chasseurs
   */
  static async getAllChasseurs(): Promise<Chasseur[]> {
    try {
      const { data, error } = await supabase
        .from('chasseurs')
        .select('*')
        .order('nom', { ascending: true });

      if (error) {
        console.error('Erreur Supabase getAllChasseurs:', error);
        throw new Error('Impossible de charger la liste des chasseurs. Veuillez réessayer dans quelques instants.');
      }

      return (data || []) as Chasseur[];
    } catch (error) {
      console.error('Erreur dans getAllChasseurs:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors du chargement des chasseurs.');
    }
  }

  /**
   * Récupère un chasseur par son ID
   */
  static async getChasseurById(id: number): Promise<Chasseur | null> {
    try {
      const { data, error } = await supabase
        .from('chasseurs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur Supabase getChasseurById:', error);
        throw new Error(`Le chasseur avec l'ID ${id} est introuvable.`);
      }

      return data as Chasseur | null;
    } catch (error) {
      console.error('Erreur dans getChasseurById:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur est survenue lors de la récupération du chasseur.');
    }
  }

  /**
   * Upload une image dans le storage Supabase
   * @param file - Fichier image (format .webp uniquement)
   * @param chasseurNom - Nom du chasseur pour nommer le fichier
   * @returns URL publique de l'image uploadée
   */
  static async uploadImage(file: File, chasseurNom: string): Promise<string> {
    try {
      // Vérifier le format
      if (!file.type.includes('webp')) {
        throw new Error('Format d\'image non valide. Seul le format .webp est accepté.');
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('L\'image est trop volumineuse. La taille maximale est de 5 MB.');
      }

      // Vérifier que le nom du chasseur est valide
      if (!chasseurNom || chasseurNom.trim().length === 0) {
        throw new Error('Le nom du chasseur est requis pour l\'upload de l\'image.');
      }

      // Générer un nom de fichier basé sur le nom du chasseur
      // Remplacer les espaces par des underscores et supprimer les caractères spéciaux
      const cleanName = chasseurNom
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '');

      if (cleanName.length === 0) {
        throw new Error('Le nom du chasseur contient des caractères non valides.');
      }

      const fileName = `${cleanName}_Portrait.webp`;

      // Upload le fichier
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          contentType: 'image/webp',
          upsert: true
        });

      if (error) {
        console.error('Erreur Supabase upload:', error);
        
        // Messages d'erreur spécifiques selon le code d'erreur
        if (error.message.includes('Duplicate')) {
          throw new Error('Une image avec ce nom existe déjà. Veuillez réessayer dans quelques secondes.');
        }
        if (error.message.includes('exceeded')) {
          throw new Error('Espace de stockage insuffisant. Contactez l\'administrateur.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour uploader des images.');
        }
        
        throw new Error('Impossible d\'uploader l\'image. Vérifiez votre connexion internet et réessayez.');
      }

      if (!data || !data.path) {
        throw new Error('L\'upload de l\'image a échoué. Aucune donnée retournée.');
      }

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      if (!publicUrl) {
        throw new Error('Impossible de générer l\'URL publique de l\'image.');
      }

      return publicUrl;
    } catch (error) {
      console.error('Erreur dans uploadImage:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de l\'upload de l\'image.');
    }
  }

  /**
   * Supprime une image du storage Supabase
   * @param imageUrl - URL complète de l'image à supprimer
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      if (!imageUrl) {
        console.warn('Tentative de suppression d\'une image sans URL');
        return;
      }

      // Extraire le nom du fichier depuis l'URL
      const fileName = imageUrl.split('/').pop();
      if (!fileName) {
        console.warn('URL d\'image invalide pour la suppression:', imageUrl);
        return;
      }

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
        // Ne pas faire planter si la suppression échoue (l'image n'existe peut-être plus)
      }
    } catch (error) {
      console.error('Erreur dans deleteImage:', error);
      // Ne pas faire planter l'opération principale
    }
  }

  /**
   * Crée un nouveau chasseur
   */
  static async createChasseur(data: CreateChasseurData, imageFile?: File): Promise<Chasseur> {
    try {
      // Validation des données d'entrée
      if (!data.nom || data.nom.trim().length === 0) {
        throw new Error('Le nom du chasseur est obligatoire.');
      }

      if (data.nom.trim().length > 100) {
        throw new Error('Le nom du chasseur ne peut pas dépasser 100 caractères.');
      }

      if (!data.element_chasseur) {
        throw new Error('L\'élément du chasseur est obligatoire.');
      }

      if (!data.rarete) {
        throw new Error('La rareté du chasseur est obligatoire.');
      }

      // Vérifier si le nom existe déjà
      const nomExiste = await this.nomExists(data.nom);
      if (nomExiste) {
        throw new Error(`Un chasseur nommé "${data.nom}" existe déjà. Veuillez choisir un autre nom.`);
      }

      let imageUrl: string | null = null;

      // 1. Upload de l'image si fournie
      if (imageFile) {
        try {
          imageUrl = await this.uploadImage(imageFile, data.nom);
        } catch (uploadError) {
          console.error('Erreur upload image:', uploadError);
          throw uploadError; // Propager l'erreur d'upload
        }
      }

      // 2. Créer le chasseur
      const insertData = {
        nom: data.nom.trim(),
        element_chasseur: data.element_chasseur,
        rarete: data.rarete,
        image: imageUrl,
        image_body: data.image_body?.trim() || null,
        element: data.element?.trim() || null
      };

      const { data: chasseur, error } = await supabase
        .from('chasseurs')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase createChasseur:', error);
        
        // Supprimer l'image uploadée en cas d'erreur
        if (imageUrl) {
          await this.deleteImage(imageUrl);
        }

        // Messages d'erreur spécifiques
        if (error.message.includes('duplicate') || error.code === '23505') {
          throw new Error(`Un chasseur avec ce nom existe déjà. Veuillez choisir un nom différent.`);
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour créer un chasseur.');
        }
        
        throw new Error('Impossible de créer le chasseur. Vérifiez les données saisies et réessayez.');
      }

      if (!chasseur) {
        // Supprimer l'image si aucun chasseur n'a été créé
        if (imageUrl) {
          await this.deleteImage(imageUrl);
        }
        throw new Error('La création du chasseur a échoué. Aucune donnée retournée.');
      }

      // 3. Créer une entrée vide dans la table builds pour synchronisation
      try {
        const buildInsertData = {
          chasseur_id: chasseur.id,
          chasseur_nom: chasseur.nom,
          element: chasseur.element_chasseur || 'Inconnu',
          builds_data: { builds: {} },
          version: 1
        };

        const { error: buildError } = await supabase
          .from('builds')
          .insert(buildInsertData);

        if (buildError) {
          console.error('Erreur lors de la création de l\'entrée builds:', buildError);

          // Si la création dans builds échoue, supprimer le chasseur créé pour éviter les incohérences
          console.warn('Rollback: suppression du chasseur créé car l\'insertion dans builds a échoué');

          await supabase
            .from('chasseurs')
            .delete()
            .eq('id', chasseur.id);

          // Supprimer l'image uploadée
          if (imageUrl) {
            await this.deleteImage(imageUrl);
          }

          throw new Error('Impossible de créer l\'entrée dans la table builds. La création du chasseur a été annulée.');
        }

        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Entrée builds créée pour le chasseur ${chasseur.id}`);
        }
      } catch (buildCreationError) {
        console.error('Erreur critique lors de la synchronisation avec builds:', buildCreationError);
        throw buildCreationError;
      }

      return chasseur as Chasseur;
    } catch (error) {
      console.error('Erreur dans createChasseur:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la création du chasseur.');
    }
  }

  /**
   * Met à jour un chasseur
   */
  static async updateChasseur(
    id: number,
    data: UpdateChasseurData,
    imageFile?: File
  ): Promise<Chasseur> {
    try {
      // Validation de l'ID
      if (!id || id <= 0) {
        throw new Error('ID de chasseur invalide.');
      }

      // Validation des données si fournies
      if (data.nom !== undefined) {
        if (!data.nom || data.nom.trim().length === 0) {
          throw new Error('Le nom du chasseur ne peut pas être vide.');
        }
        if (data.nom.trim().length > 100) {
          throw new Error('Le nom du chasseur ne peut pas dépasser 100 caractères.');
        }

        // Vérifier si le nom existe déjà (en excluant le chasseur actuel)
        const nomExiste = await this.nomExists(data.nom, id);
        if (nomExiste) {
          throw new Error(`Un autre chasseur nommé "${data.nom}" existe déjà. Veuillez choisir un autre nom.`);
        }
      }

      let newImageUrl: string | null = null;
      let oldImageUrl: string | null = null;

      // 1. Récupérer l'ancienne image si on va la remplacer
      if (imageFile) {
        try {
          const chasseur = await this.getChasseurById(id);
          if (!chasseur) {
            throw new Error(`Le chasseur avec l'ID ${id} est introuvable.`);
          }
          oldImageUrl = chasseur.image || null;

          // Upload de la nouvelle image
          newImageUrl = await this.uploadImage(imageFile, data.nom || chasseur.nom || 'Chasseur');
        } catch (uploadError) {
          console.error('Erreur upload nouvelle image:', uploadError);
          throw uploadError; // Propager l'erreur d'upload
        }
      }

      // 2. Préparer les données de mise à jour
      const updateData: Partial<CreateChasseurData & { image: string }> = {};
      if (data.nom !== undefined) updateData.nom = data.nom.trim();
      if (data.element_chasseur !== undefined) updateData.element_chasseur = data.element_chasseur;
      if (data.rarete !== undefined) updateData.rarete = data.rarete;
      if (data.image_body !== undefined) updateData.image_body = data.image_body?.trim() || null;
      if (data.element !== undefined) updateData.element = data.element?.trim() || null;
      if (newImageUrl) updateData.image = newImageUrl;

      // Vérifier qu'il y a au moins un champ à mettre à jour
      if (Object.keys(updateData).length === 0) {
        throw new Error('Aucune modification à enregistrer.');
      }

      // 3. Mettre à jour le chasseur
      const { data: chasseur, error } = await supabase
        .from('chasseurs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase updateChasseur:', error);
        
        // Supprimer la nouvelle image en cas d'erreur
        if (newImageUrl) {
          await this.deleteImage(newImageUrl);
        }

        // Messages d'erreur spécifiques
        if (error.message.includes('duplicate') || error.code === '23505') {
          throw new Error('Un chasseur avec ce nom existe déjà. Veuillez choisir un nom différent.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour modifier ce chasseur.');
        }
        if (error.code === 'PGRST116') {
          throw new Error(`Le chasseur avec l'ID ${id} est introuvable.`);
        }
        
        throw new Error('Impossible de mettre à jour le chasseur. Vérifiez les données saisies et réessayez.');
      }

      if (!chasseur) {
        // Supprimer la nouvelle image si la mise à jour a échoué
        if (newImageUrl) {
          await this.deleteImage(newImageUrl);
        }
        throw new Error('La mise à jour du chasseur a échoué. Aucune donnée retournée.');
      }

      // 4. Supprimer l'ancienne image si tout s'est bien passé
      if (oldImageUrl && newImageUrl) {
        await this.deleteImage(oldImageUrl);
      }

      return chasseur as Chasseur;
    } catch (error) {
      console.error('Erreur dans updateChasseur:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la mise à jour du chasseur.');
    }
  }

  /**
   * Supprime un chasseur et son image
   */
  static async deleteChasseur(id: number): Promise<void> {
    try {
      // Validation de l'ID
      if (!id || id <= 0) {
        throw new Error('ID de chasseur invalide.');
      }

      // 1. Récupérer le chasseur pour obtenir l'URL de l'image
      const chasseur = await this.getChasseurById(id);

      if (!chasseur) {
        throw new Error(`Le chasseur avec l'ID ${id} est introuvable.`);
      }

      // 2. Supprimer l'entrée dans la table builds (si elle existe)
      try {
        const { error: buildDeleteError } = await supabase
          .from('builds')
          .delete()
          .eq('chasseur_id', id);

        if (buildDeleteError) {
          console.warn('Erreur lors de la suppression de l\'entrée builds:', buildDeleteError);
          // On continue quand même, car l'entrée n'existe peut-être pas
        } else if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Entrée builds supprimée pour le chasseur ${id}`);
        }
      } catch (buildDeleteError) {
        console.warn('Impossible de supprimer l\'entrée builds:', buildDeleteError);
        // On continue quand même
      }

      // 3. Supprimer le chasseur de la base de données
      const { error } = await supabase
        .from('chasseurs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase deleteChasseur:', error);

        // Messages d'erreur spécifiques
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour supprimer ce chasseur.');
        }
        if (error.message.includes('foreign key') || error.code === '23503') {
          throw new Error('Impossible de supprimer ce chasseur car il est utilisé dans d\'autres éléments (builds, équipes, etc.). Supprimez d\'abord ces références.');
        }

        throw new Error('Impossible de supprimer le chasseur. Veuillez réessayer.');
      }

      // 4. Supprimer l'image du storage (ne fait pas planter si échoue)
      if (chasseur.image) {
        try {
          await this.deleteImage(chasseur.image);
        } catch (imageError) {
          console.warn('Impossible de supprimer l\'image du chasseur:', imageError);
          // On continue quand même car le chasseur a été supprimé de la base
        }
      }
    } catch (error) {
      console.error('Erreur dans deleteChasseur:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la suppression du chasseur.');
    }
  }

  /**
   * Vérifie si un nom de chasseur existe déjà
   */
  static async nomExists(nom: string, excludeId?: number): Promise<boolean> {
    try {
      if (!nom || nom.trim().length === 0) {
        return false;
      }

      let query = supabase
        .from('chasseurs')
        .select('id')
        .eq('nom', nom.trim());

      if (excludeId !== undefined) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur Supabase nomExists:', error);
        throw new Error('Impossible de vérifier l\'unicité du nom. Veuillez réessayer.');
      }

      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Erreur dans nomExists:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur est survenue lors de la vérification du nom.');
    }
  }
}
