/**
 * Service pour gérer les compétences de Jinwoo dans Supabase
 * Gère le CRUD complet + upload/suppression d'images dans le storage
 */

import { supabase } from '@/integrations/supabase/client';
import type { JinwooCompetence, CreateCompetenceData, UpdateCompetenceData, ElementCompetence } from '@/admin/types';
import { ELEMENTS_COMPETENCE } from '@/admin/constants';

const BUCKET_NAME = 'runes';

export class JinwooCompetencesService {
  /**
   * Récupère toutes les compétences
   */
  static async getAllCompetences(): Promise<JinwooCompetence[]> {
    try {
      const { data, error } = await supabase
        .from('jinwoo_competences')
        .select('*')
        .order('nom', { ascending: true });

      if (error) {
        console.error('Erreur Supabase getAllCompetences:', error);
        throw new Error('Impossible de charger la liste des compétences. Veuillez réessayer dans quelques instants.');
      }

      return (data || []) as JinwooCompetence[];
    } catch (error) {
      console.error('Erreur dans getAllCompetences:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors du chargement des compétences.');
    }
  }

  /**
   * Récupère une compétence par son ID
   */
  static async getCompetenceById(id: number): Promise<JinwooCompetence | null> {
    try {
      const { data, error } = await supabase
        .from('jinwoo_competences')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur Supabase getCompetenceById:', error);
        
        if (error.code === 'PGRST116') {
          throw new Error(`La compétence avec l'ID ${id} est introuvable.`);
        }
        
        throw new Error('Une erreur est survenue lors de la récupération de la compétence.');
      }

      return data as JinwooCompetence | null;
    } catch (error) {
      console.error('Erreur dans getCompetenceById:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur est survenue lors de la récupération de la compétence.');
    }
  }

  /**
   * Upload une image dans le storage Supabase
   * @param file - Fichier image (format .webp uniquement)
   * @param competenceNom - Nom de la compétence pour nommer le fichier
   * @returns URL publique de l'image uploadée
   */
  static async uploadImage(file: File, competenceNom: string): Promise<string> {
    try {
      // Vérifier le format
      if (!file.type.includes('webp')) {
        throw new Error('Format d\'image non valide. Seul le format .webp est accepté.');
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('L\'image est trop volumineuse. La taille maximale est de 5 MB.');
      }

      // Vérifier que le nom de la compétence est valide
      if (!competenceNom || competenceNom.trim().length === 0) {
        throw new Error('Le nom de la compétence est requis pour l\'upload de l\'image.');
      }

      // Générer un nom de fichier UNIQUE basé sur le nom de la compétence + timestamp
      const cleanName = competenceNom
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '');

      if (cleanName.length === 0) {
        throw new Error('Le nom de la compétence contient des caractères non valides.');
      }

      // Ajouter un timestamp pour garantir l'unicité du nom de fichier
      const timestamp = Date.now();
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
        console.warn('[deleteImage] Tentative de suppression d\'une image sans URL');
        return;
      }

      // Extraire le nom du fichier depuis l'URL
      const fileName = imageUrl.split('/').pop();
      if (!fileName) {
        console.warn('[deleteImage] URL d\'image invalide pour la suppression:', imageUrl);
        return;
      }

      console.log('[DEBUG] deleteImage - fileName:', fileName);

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        console.error('[deleteImage] Erreur lors de la suppression de l\'image:', error);
        // Ne pas faire planter si la suppression échoue
      } else {
        console.log('[DEBUG] deleteImage - Image supprimée avec succès:', fileName);
      }
    } catch (error) {
      console.error('[deleteImage] Erreur dans deleteImage:', error);
      // Ne pas faire planter l'opération principale
    }
  }

  /**
   * Crée une nouvelle compétence
   */
  static async createCompetence(data: CreateCompetenceData, imageFile?: File): Promise<JinwooCompetence> {
    try {
      // Validation des données d'entrée
      if (!data.nom || data.nom.trim().length === 0) {
        throw new Error('Le nom de la compétence est obligatoire.');
      }

      if (data.nom.trim().length < 2) {
        throw new Error('Le nom de la compétence doit contenir au moins 2 caractères.');
      }

      if (data.nom.trim().length > 100) {
        throw new Error('Le nom de la compétence ne peut pas dépasser 100 caractères.');
      }

      // Vérifier les caractères dangereux
      if (/<|>|{|}/.test(data.nom)) {
        throw new Error('Le nom contient des caractères non autorisés (< > { }).');
      }

      // Valider les éléments si fournis
      if (data.element && !ELEMENTS_COMPETENCE.includes(data.element as any)) {
        throw new Error(`L'élément doit être l'un des suivants : ${ELEMENTS_COMPETENCE.join(', ')}.`);
      }
      if (data.element2 && !ELEMENTS_COMPETENCE.includes(data.element2 as any)) {
        throw new Error(`L'élément secondaire doit être l'un des suivants : ${ELEMENTS_COMPETENCE.join(', ')}.`);
      }

      // Vérifier si le nom existe déjà
      const nomExiste = await this.nomExists(data.nom);
      if (nomExiste) {
        throw new Error(`Une compétence nommée "${data.nom}" existe déjà. Veuillez choisir un autre nom.`);
      }

      let imageUrl: string | null = null;

      // 1. Upload de l'image si fournie
      if (imageFile) {
        try {
          imageUrl = await this.uploadImage(imageFile, data.nom);
        } catch (uploadError) {
          console.error('Erreur upload image:', uploadError);
          throw uploadError;
        }
      }

      // 2. Créer la compétence
      const insertData = {
        nom: data.nom.trim(),
        element: data.element || null,
        element2: data.element2 || null,
        description: data.description || null,
        image: imageUrl
      };

      const { data: competence, error } = await supabase
        .from('jinwoo_competences')
        .insert(insertData as never)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase createCompetence:', error);
        console.error('Données tentées:', insertData);

        // Supprimer l'image uploadée en cas d'erreur
        if (imageUrl) {
          await this.deleteImage(imageUrl);
        }

        if (error.message.includes('duplicate') || error.code === '23505') {
          throw new Error('Une compétence avec ce nom existe déjà. Veuillez choisir un nom différent.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour créer une compétence.');
        }

        throw new Error(`Impossible de créer la compétence: ${error.message}`);
      }

      if (!competence) {
        if (imageUrl) {
          await this.deleteImage(imageUrl);
        }
        throw new Error('La création de la compétence a échoué. Aucune donnée retournée.');
      }

      return competence as JinwooCompetence;
    } catch (error) {
      console.error('Erreur dans createCompetence:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la création de la compétence.');
    }
  }

  /**
   * Met à jour une compétence
   */
  static async updateCompetence(
    id: number,
    data: UpdateCompetenceData,
    imageFile?: File
  ): Promise<JinwooCompetence> {
    try {
      // Vérifier que la compétence existe
      const existingCompetence = await this.getCompetenceById(id);
      if (!existingCompetence) {
        throw new Error('La compétence à modifier est introuvable.');
      }

      // Validation des données d'entrée
      if (data.nom !== undefined) {
        if (!data.nom || data.nom.trim().length === 0) {
          throw new Error('Le nom de la compétence ne peut pas être vide.');
        }

        if (data.nom.trim().length < 2) {
          throw new Error('Le nom de la compétence doit contenir au moins 2 caractères.');
        }

        if (data.nom.trim().length > 100) {
          throw new Error('Le nom de la compétence ne peut pas dépasser 100 caractères.');
        }

        if (/<|>|{|}/.test(data.nom)) {
          throw new Error('Le nom contient des caractères non autorisés (< > { }).');
        }

        // Vérifier l'unicité
        const nomExiste = await this.nomExists(data.nom, id);
        if (nomExiste) {
          throw new Error(`Une autre compétence nommée "${data.nom}" existe déjà. Veuillez choisir un nom différent.`);
        }
      }

      // Valider les éléments si fournis
      if (data.element !== undefined && data.element !== null && !ELEMENTS_COMPETENCE.includes(data.element as any)) {
        throw new Error(`L'élément doit être l'un des suivants : ${ELEMENTS_COMPETENCE.join(', ')}.`);
      }
      if (data.element2 !== undefined && data.element2 !== null && !ELEMENTS_COMPETENCE.includes(data.element2 as any)) {
        throw new Error(`L'élément secondaire doit être l'un des suivants : ${ELEMENTS_COMPETENCE.join(', ')}.`);
      }

      let newImageUrl: string | null = null;
      let oldImageUrl: string | null = null;

      // Upload de la nouvelle image si fournie
      if (imageFile) {
        oldImageUrl = existingCompetence.image || null;

        try {
          newImageUrl = await this.uploadImage(imageFile, data.nom || existingCompetence.nom);
        } catch (uploadError) {
          console.error('Erreur upload nouvelle image:', uploadError);
          throw uploadError;
        }
      }

      // Préparer les données de mise à jour
      const updateData: Partial<CreateCompetenceData & { image: string }> = {};
      if (data.nom !== undefined) updateData.nom = data.nom.trim();
      if (data.element !== undefined) updateData.element = data.element;
      if (data.element2 !== undefined) updateData.element2 = data.element2;
      if (data.description !== undefined) updateData.description = data.description;
      if (newImageUrl) updateData.image = newImageUrl;

      // Mettre à jour la compétence
      const { data: competence, error } = await supabase
        .from('jinwoo_competences')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase updateCompetence:', error);

        // Supprimer la nouvelle image en cas d'erreur
        if (newImageUrl) {
          await this.deleteImage(newImageUrl);
        }

        if (error.code === 'PGRST116') {
          throw new Error('La compétence a été supprimée entre-temps. Veuillez rafraîchir la page.');
        }
        if (error.message.includes('duplicate') || error.code === '23505') {
          throw new Error('Une compétence avec ce nom existe déjà. Veuillez choisir un nom différent.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour modifier cette compétence.');
        }

        throw new Error('Impossible de mettre à jour la compétence. Vérifiez les données saisies et réessayez.');
      }

      if (!competence) {
        if (newImageUrl) {
          await this.deleteImage(newImageUrl);
        }
        throw new Error('La mise à jour de la compétence a échoué. Aucune donnée retournée.');
      }

      // Supprimer l'ancienne image si tout s'est bien passé
      if (oldImageUrl && newImageUrl) {
        await this.deleteImage(oldImageUrl);
      }

      return competence as JinwooCompetence;
    } catch (error) {
      console.error('Erreur dans updateCompetence:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la mise à jour de la compétence.');
    }
  }

  /**
   * Supprime une compétence et son image
   */
  static async deleteCompetence(id: number): Promise<void> {
    try {
      // Récupérer la compétence pour obtenir l'URL de l'image
      const competence = await this.getCompetenceById(id);

      // Supprimer la compétence
      const { error } = await supabase
        .from('jinwoo_competences')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase deleteCompetence:', error);

        if (error.code === 'PGRST116') {
          throw new Error('La compétence à supprimer est introuvable.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour supprimer cette compétence.');
        }

        throw new Error('Impossible de supprimer la compétence. Veuillez réessayer.');
      }

      // Supprimer l'image du storage
      if (competence?.image) {
        await this.deleteImage(competence.image);
      }
    } catch (error) {
      console.error('Erreur dans deleteCompetence:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la suppression de la compétence.');
    }
  }

  /**
   * Vérifie si un nom de compétence existe déjà
   */
  static async nomExists(nom: string, excludeId?: number): Promise<boolean> {
    try {
      if (!nom || nom.trim().length === 0) {
        return false;
      }

      let query = supabase
        .from('jinwoo_competences')
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
