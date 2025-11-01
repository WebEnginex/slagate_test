/**
 * Service pour gérer les artefacts dans Supabase
 * Gère le CRUD complet + upload/suppression d'images dans le storage
 */

import { supabase } from '@/integrations/supabase/client';
import type { Artefact, CreateArtefactData, UpdateArtefactData } from '@/admin/types';

const BUCKET_NAME = 'artefacts';

export class ArtefactsService {
  /**
   * Récupère tous les artefacts
   */
  static async getAllArtefacts(): Promise<Artefact[]> {
    try {
      const { data, error } = await supabase
        .from('artefacts')
        .select('*')
        .order('nom', { ascending: true });

      if (error) {
        console.error('Erreur Supabase getAllArtefacts:', error);
        throw new Error('Impossible de charger la liste des artefacts. Veuillez réessayer dans quelques instants.');
      }

      return (data || []) as Artefact[];
    } catch (error) {
      console.error('Erreur dans getAllArtefacts:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors du chargement des artefacts.');
    }
  }

  /**
   * Récupère un artefact par son ID
   */
  static async getArtefactById(id: number): Promise<Artefact | null> {
    try {
      const { data, error } = await supabase
        .from('artefacts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur Supabase getArtefactById:', error);
        throw new Error(`L'artefact avec l'ID ${id} est introuvable.`);
      }

      return data as Artefact | null;
    } catch (error) {
      console.error('Erreur dans getArtefactById:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur est survenue lors de la récupération de l\'artefact.');
    }
  }

  /**
   * Upload une image dans le storage Supabase
   * @param file - Fichier image (format .webp uniquement)
   * @param artefactNom - Nom de l'artefact pour nommer le fichier
   * @returns URL publique de l'image uploadée
   */
  static async uploadImage(file: File, artefactNom: string): Promise<string> {
    try {
      // Vérifier le format
      if (!file.type.includes('webp')) {
        throw new Error('Format d\'image non valide. Seul le format .webp est accepté.');
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('L\'image est trop volumineuse. La taille maximale est de 5 MB.');
      }

      // Vérifier que le nom de l'artefact est valide
      if (!artefactNom || artefactNom.trim().length === 0) {
        throw new Error('Le nom de l\'artefact est requis pour l\'upload de l\'image.');
      }

      // Générer un nom de fichier unique basé sur le nom de l'artefact
      const timestamp = Date.now();
      const cleanName = artefactNom.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
      
      if (cleanName.length === 0) {
        throw new Error('Le nom de l\'artefact contient des caractères non valides.');
      }
      
      const fileName = `${cleanName}_${timestamp}.webp`;

      // Upload le fichier
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          contentType: 'image/webp',
          upsert: false
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
   * Crée un nouvel artefact
   */
  static async createArtefact(data: CreateArtefactData, imageFile?: File): Promise<Artefact> {
    try {
      // Validation des données d'entrée
      if (!data.nom || data.nom.trim().length === 0) {
        throw new Error('Le nom de l\'artefact est obligatoire.');
      }

      if (data.nom.trim().length > 100) {
        throw new Error('Le nom de l\'artefact ne peut pas dépasser 100 caractères.');
      }

      if (!data.categorie) {
        throw new Error('La catégorie de l\'artefact est obligatoire.');
      }

      // Vérifier si le nom existe déjà
      const nomExiste = await this.nomExists(data.nom);
      if (nomExiste) {
        throw new Error(`Un artefact nommé "${data.nom}" existe déjà. Veuillez choisir un autre nom.`);
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

      // 2. Créer l'artefact
      const insertData = {
        nom: data.nom.trim(),
        categorie: data.categorie,
        image: imageUrl
      };

      const { data: artefact, error } = await supabase
        .from('artefacts')
        .insert(insertData as never)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase createArtefact:', error);
        
        // Supprimer l'image uploadée en cas d'erreur
        if (imageUrl) {
          await this.deleteImage(imageUrl);
        }

        // Messages d'erreur spécifiques
        if (error.message.includes('duplicate') || error.code === '23505') {
          throw new Error('Un artefact avec ce nom existe déjà. Veuillez choisir un nom différent.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour créer un artefact.');
        }
        
        throw new Error('Impossible de créer l\'artefact. Vérifiez les données saisies et réessayez.');
      }

      if (!artefact) {
        // Supprimer l'image si aucun artefact n'a été créé
        if (imageUrl) {
          await this.deleteImage(imageUrl);
        }
        throw new Error('La création de l\'artefact a échoué. Aucune donnée retournée.');
      }

      return artefact as Artefact;
    } catch (error) {
      console.error('Erreur dans createArtefact:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la création de l\'artefact.');
    }
  }

  /**
   * Met à jour un artefact
   */
  static async updateArtefact(
    id: number,
    data: UpdateArtefactData,
    imageFile?: File
  ): Promise<Artefact> {
    try {
      // Validation de l'ID
      if (!id || id <= 0) {
        throw new Error('ID d\'artefact invalide.');
      }

      // Validation des données si fournies
      if (data.nom !== undefined) {
        if (!data.nom || data.nom.trim().length === 0) {
          throw new Error('Le nom de l\'artefact ne peut pas être vide.');
        }
        if (data.nom.trim().length > 100) {
          throw new Error('Le nom de l\'artefact ne peut pas dépasser 100 caractères.');
        }

        // Vérifier si le nom existe déjà (en excluant l'artefact actuel)
        const nomExiste = await this.nomExists(data.nom, id);
        if (nomExiste) {
          throw new Error(`Un autre artefact nommé "${data.nom}" existe déjà. Veuillez choisir un autre nom.`);
        }
      }

      let newImageUrl: string | null = null;
      let oldImageUrl: string | null = null;

      // 1. Récupérer l'ancienne image si on va la remplacer
      if (imageFile) {
        try {
          const artefact = await this.getArtefactById(id);
          if (!artefact) {
            throw new Error(`L'artefact avec l'ID ${id} est introuvable.`);
          }
          oldImageUrl = artefact.image || null;

          // Upload de la nouvelle image
          newImageUrl = await this.uploadImage(imageFile, data.nom || artefact.nom || 'Artefact');
        } catch (uploadError) {
          console.error('Erreur upload nouvelle image:', uploadError);
          throw uploadError; // Propager l'erreur d'upload
        }
      }

      // 2. Préparer les données de mise à jour
      const updateData: Partial<CreateArtefactData & { image: string }> = {};
      if (data.nom !== undefined) updateData.nom = data.nom.trim();
      if (data.categorie !== undefined) updateData.categorie = data.categorie;
      if (newImageUrl) updateData.image = newImageUrl;

      // Vérifier qu'il y a au moins un champ à mettre à jour
      if (Object.keys(updateData).length === 0) {
        throw new Error('Aucune modification à enregistrer.');
      }

      // 3. Mettre à jour l'artefact
      const { data: artefact, error } = await supabase
        .from('artefacts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase updateArtefact:', error);
        
        // Supprimer la nouvelle image en cas d'erreur
        if (newImageUrl) {
          await this.deleteImage(newImageUrl);
        }

        // Messages d'erreur spécifiques
        if (error.message.includes('duplicate') || error.code === '23505') {
          throw new Error('Un artefact avec ce nom existe déjà. Veuillez choisir un nom différent.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour modifier cet artefact.');
        }
        if (error.code === 'PGRST116') {
          throw new Error(`L'artefact avec l'ID ${id} est introuvable.`);
        }
        
        throw new Error('Impossible de mettre à jour l\'artefact. Vérifiez les données saisies et réessayez.');
      }

      if (!artefact) {
        // Supprimer la nouvelle image si la mise à jour a échoué
        if (newImageUrl) {
          await this.deleteImage(newImageUrl);
        }
        throw new Error('La mise à jour de l\'artefact a échoué. Aucune donnée retournée.');
      }

      // 4. Supprimer l'ancienne image si tout s'est bien passé
      if (oldImageUrl && newImageUrl) {
        await this.deleteImage(oldImageUrl);
      }

      return artefact as Artefact;
    } catch (error) {
      console.error('Erreur dans updateArtefact:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la mise à jour de l\'artefact.');
    }
  }

  /**
   * Supprime un artefact et son image
   */
  static async deleteArtefact(id: number): Promise<void> {
    try {
      // Validation de l'ID
      if (!id || id <= 0) {
        throw new Error('ID d\'artefact invalide.');
      }

      // 1. Récupérer l'artefact pour obtenir l'URL de l'image
      const artefact = await this.getArtefactById(id);
      
      if (!artefact) {
        throw new Error(`L'artefact avec l'ID ${id} est introuvable.`);
      }

      // 2. Supprimer l'artefact de la base de données
      const { error } = await supabase
        .from('artefacts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase deleteArtefact:', error);
        
        // Messages d'erreur spécifiques
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour supprimer cet artefact.');
        }
        if (error.message.includes('foreign key') || error.code === '23503') {
          throw new Error('Impossible de supprimer cet artefact car il est utilisé dans d\'autres éléments (builds, tier lists, etc.). Supprimez d\'abord ces références.');
        }
        
        throw new Error('Impossible de supprimer l\'artefact. Veuillez réessayer.');
      }

      // 3. Supprimer l'image du storage (ne fait pas planter si échoue)
      if (artefact.image) {
        try {
          await this.deleteImage(artefact.image);
        } catch (imageError) {
          console.warn('Impossible de supprimer l\'image de l\'artefact:', imageError);
          // On continue quand même car l'artefact a été supprimé de la base
        }
      }
    } catch (error) {
      console.error('Erreur dans deleteArtefact:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la suppression de l\'artefact.');
    }
  }

  /**
   * Vérifie si un nom d'artefact existe déjà
   */
  static async nomExists(nom: string, excludeId?: number): Promise<boolean> {
    try {
      if (!nom || nom.trim().length === 0) {
        return false;
      }

      let query = supabase
        .from('artefacts')
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
