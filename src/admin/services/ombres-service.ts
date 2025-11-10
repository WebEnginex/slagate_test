/**
 * Service pour gérer les ombres dans Supabase
 * Gère le CRUD complet + upload/suppression d'images dans le storage
 */

import { supabase } from '@/integrations/supabase/client';
import type { Ombre, CreateOmbreData, UpdateOmbreData } from '@/admin/types';

const BUCKET_NAME = 'ombres';

export class OmbresService {
  /**
   * Récupère toutes les ombres
   */
  static async getAllOmbres(): Promise<Ombre[]> {
    try {
      const { data, error } = await supabase
        .from('ombres')
        .select('*')
        .order('nom', { ascending: true });

      if (error) {
        console.error('Erreur Supabase getAllOmbres:', error);
        throw new Error('Impossible de charger la liste des ombres. Veuillez réessayer dans quelques instants.');
      }

      return (data || []) as Ombre[];
    } catch (error) {
      console.error('Erreur dans getAllOmbres:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors du chargement des ombres.');
    }
  }

  /**
   * Récupère une ombre par son ID
   */
  static async getOmbreById(id: number): Promise<Ombre | null> {
    try {
      const { data, error } = await supabase
        .from('ombres')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur Supabase getOmbreById:', error);
        throw new Error(`L'ombre avec l'ID ${id} est introuvable.`);
      }

      return data as Ombre | null;
    } catch (error) {
      console.error('Erreur dans getOmbreById:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur est survenue lors de la récupération de l\'ombre.');
    }
  }

  /**
   * Upload une image dans le storage Supabase
   * @param file - Fichier image (format .webp uniquement)
   * @param ombreNom - Nom de l'ombre pour nommer le fichier
   * @returns URL publique de l'image uploadée
   */
  static async uploadImage(file: File, ombreNom: string): Promise<string> {
    try {
      // Vérifier le format
      if (!file.type.includes('webp')) {
        throw new Error('Format d\'image non valide. Seul le format .webp est accepté.');
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('L\'image est trop volumineuse. La taille maximale est de 5 MB.');
      }

      // Vérifier que le nom de l'ombre est valide
      if (!ombreNom || ombreNom.trim().length === 0) {
        throw new Error('Le nom de l\'ombre est requis pour l\'upload de l\'image.');
      }

      // Générer un nom de fichier basé sur le nom de l'ombre
      // Remplacer les espaces par des underscores et supprimer les caractères spéciaux
      const cleanName = ombreNom
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '');

      if (cleanName.length === 0) {
        throw new Error('Le nom de l\'ombre contient des caractères non valides.');
      }

      const fileName = `${cleanName}.webp`;

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
   * Crée une nouvelle ombre
   */
  static async createOmbre(data: CreateOmbreData, imageFile?: File): Promise<Ombre> {
    try {
      // Validation des données d'entrée
      if (!data.nom || data.nom.trim().length === 0) {
        throw new Error('Le nom de l\'ombre est obligatoire.');
      }

      if (data.nom.trim().length > 100) {
        throw new Error('Le nom de l\'ombre ne peut pas dépasser 100 caractères.');
      }

      // Vérifier si le nom existe déjà
      const nomExiste = await this.nomExists(data.nom);
      if (nomExiste) {
        throw new Error(`Une ombre nommée "${data.nom}" existe déjà. Veuillez choisir un autre nom.`);
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

      // 2. Créer l'ombre
      const insertData = {
        nom: data.nom.trim(),
        description: data.description?.trim() || null,
        image: imageUrl,
      };

      const { data: ombre, error } = await supabase
        .from('ombres')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase createOmbre:', error);
        
        // Supprimer l'image uploadée en cas d'erreur
        if (imageUrl) {
          await this.deleteImage(imageUrl);
        }

        // Messages d'erreur spécifiques
        if (error.message.includes('duplicate') || error.code === '23505') {
          throw new Error(`Une ombre avec ce nom existe déjà. Veuillez choisir un nom différent.`);
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour créer une ombre.');
        }
        
        throw new Error('Impossible de créer l\'ombre. Vérifiez les données saisies et réessayez.');
      }

      if (!ombre) {
        // Supprimer l'image si aucune ombre n'a été créée
        if (imageUrl) {
          await this.deleteImage(imageUrl);
        }
        throw new Error('La création de l\'ombre a échoué. Aucune donnée retournée.');
      }

      return ombre as Ombre;
    } catch (error) {
      console.error('Erreur dans createOmbre:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la création de l\'ombre.');
    }
  }

  /**
   * Met à jour une ombre
   */
  static async updateOmbre(
    id: number,
    data: UpdateOmbreData,
    imageFile?: File
  ): Promise<Ombre> {
    try {
      // Validation de l'ID
      if (!id || id <= 0) {
        throw new Error('ID d\'ombre invalide.');
      }

      // Validation des données si fournies
      if (data.nom !== undefined) {
        if (!data.nom || data.nom.trim().length === 0) {
          throw new Error('Le nom de l\'ombre ne peut pas être vide.');
        }
        if (data.nom.trim().length > 100) {
          throw new Error('Le nom de l\'ombre ne peut pas dépasser 100 caractères.');
        }

        // Vérifier si le nom existe déjà (en excluant l'ombre actuelle)
        const nomExiste = await this.nomExists(data.nom, id);
        if (nomExiste) {
          throw new Error(`Une autre ombre nommée "${data.nom}" existe déjà. Veuillez choisir un autre nom.`);
        }
      }

      let newImageUrl: string | null = null;
      let oldImageUrl: string | null = null;

      // 1. Récupérer l'ancienne image si on va la remplacer
      if (imageFile) {
        try {
          const ombre = await this.getOmbreById(id);
          if (!ombre) {
            throw new Error(`L'ombre avec l'ID ${id} est introuvable.`);
          }
          oldImageUrl = ombre.image || null;

          // Upload de la nouvelle image
          newImageUrl = await this.uploadImage(imageFile, data.nom || ombre.nom || 'Ombre');
        } catch (uploadError) {
          console.error('Erreur upload nouvelle image:', uploadError);
          throw uploadError; // Propager l'erreur d'upload
        }
      }

      // 2. Préparer les données de mise à jour
      const updateData: Partial<CreateOmbreData & { image: string }> = {};
      if (data.nom !== undefined) updateData.nom = data.nom.trim();
      if (data.description !== undefined) updateData.description = data.description?.trim() || null;
      if (newImageUrl) updateData.image = newImageUrl;

      // Vérifier qu'il y a au moins un champ à mettre à jour
      if (Object.keys(updateData).length === 0) {
        throw new Error('Aucune modification à enregistrer.');
      }

      // 3. Mettre à jour l'ombre
      const { data: ombre, error } = await supabase
        .from('ombres')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase updateOmbre:', error);
        
        // Supprimer la nouvelle image en cas d'erreur
        if (newImageUrl) {
          await this.deleteImage(newImageUrl);
        }

        // Messages d'erreur spécifiques
        if (error.message.includes('duplicate') || error.code === '23505') {
          throw new Error('Une ombre avec ce nom existe déjà. Veuillez choisir un nom différent.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour modifier cette ombre.');
        }
        if (error.code === 'PGRST116') {
          throw new Error(`L'ombre avec l'ID ${id} est introuvable.`);
        }
        
        throw new Error('Impossible de mettre à jour l\'ombre. Vérifiez les données saisies et réessayez.');
      }

      if (!ombre) {
        // Supprimer la nouvelle image si la mise à jour a échoué
        if (newImageUrl) {
          await this.deleteImage(newImageUrl);
        }
        throw new Error('La mise à jour de l\'ombre a échoué. Aucune donnée retournée.');
      }

      // 4. Supprimer l'ancienne image si tout s'est bien passé
      if (oldImageUrl && newImageUrl) {
        await this.deleteImage(oldImageUrl);
      }

      return ombre as Ombre;
    } catch (error) {
      console.error('Erreur dans updateOmbre:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la mise à jour de l\'ombre.');
    }
  }

  /**
   * Supprime une ombre et son image
   */
  static async deleteOmbre(id: number): Promise<void> {
    try {
      // Validation de l'ID
      if (!id || id <= 0) {
        throw new Error('ID d\'ombre invalide.');
      }

      // 1. Récupérer l'ombre pour obtenir l'URL de l'image
      const ombre = await this.getOmbreById(id);
      
      if (!ombre) {
        throw new Error(`L'ombre avec l'ID ${id} est introuvable.`);
      }

      // 2. Supprimer l'ombre de la base de données
      const { error } = await supabase
        .from('ombres')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase deleteOmbre:', error);
        
        // Messages d'erreur spécifiques
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour supprimer cette ombre.');
        }
        if (error.message.includes('foreign key') || error.code === '23503') {
          throw new Error('Impossible de supprimer cette ombre car elle est utilisée dans d\'autres éléments (builds, etc.). Supprimez d\'abord ces références.');
        }
        
        throw new Error('Impossible de supprimer l\'ombre. Veuillez réessayer.');
      }

      // 3. Supprimer l'image du storage (ne fait pas planter si échoue)
      if (ombre.image) {
        try {
          await this.deleteImage(ombre.image);
        } catch (imageError) {
          console.warn('Impossible de supprimer l\'image de l\'ombre:', imageError);
          // On continue quand même car l'ombre a été supprimée de la base
        }
      }
    } catch (error) {
      console.error('Erreur dans deleteOmbre:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la suppression de l\'ombre.');
    }
  }

  /**
   * Vérifie si un nom d'ombre existe déjà
   */
  static async nomExists(nom: string, excludeId?: number): Promise<boolean> {
    try {
      if (!nom || nom.trim().length === 0) {
        return false;
      }

      let query = supabase
        .from('ombres')
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

