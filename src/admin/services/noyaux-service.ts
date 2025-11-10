/**
 * Service pour gérer les noyaux dans Supabase
 * Gère le CRUD complet + upload/suppression d'images dans le storage
 */

import { supabase } from '@/integrations/supabase/client';
import type { Noyau, CreateNoyauData, UpdateNoyauData } from '@/admin/types';

const BUCKET_NAME = 'noyaux';

export class NoyauxService {
  /**
   * Récupère tous les noyaux
   */
  static async getAllNoyaux(): Promise<Noyau[]> {
    try {
      const { data, error } = await supabase
        .from('noyaux')
        .select('*')
        .order('slot', { ascending: true })
        .order('nom', { ascending: true });

      if (error) {
        console.error('Erreur Supabase getAllNoyaux:', error);
        throw new Error('Impossible de charger la liste des noyaux. Veuillez réessayer dans quelques instants.');
      }

      return (data || []) as Noyau[];
    } catch (error) {
      console.error('Erreur dans getAllNoyaux:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors du chargement des noyaux.');
    }
  }

  /**
   * Récupère un noyau par son ID
   */
  static async getNoyauById(id: number): Promise<Noyau | null> {
    try {
      const { data, error } = await supabase
        .from('noyaux')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur Supabase getNoyauById:', error);
        
        if (error.code === 'PGRST116') {
          throw new Error(`Le noyau avec l'ID ${id} est introuvable.`);
        }
        
        throw new Error('Une erreur est survenue lors de la récupération du noyau.');
      }

      return data as Noyau | null;
    } catch (error) {
      console.error('Erreur dans getNoyauById:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur est survenue lors de la récupération du noyau.');
    }
  }

  /**
   * Upload une image dans le storage Supabase
   * @param file - Fichier image (format .webp uniquement)
   * @param noyauNom - Nom du noyau pour nommer le fichier
   * @returns URL publique de l'image uploadée
   */
  static async uploadImage(file: File, noyauNom: string): Promise<string> {
    try {
      // Vérifier le format
      if (!file.type.includes('webp')) {
        throw new Error('Format d\'image non valide. Seul le format .webp est accepté.');
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('L\'image est trop volumineuse. La taille maximale est de 5 MB.');
      }

      // Vérifier que le nom du noyau est valide
      if (!noyauNom || noyauNom.trim().length === 0) {
        throw new Error('Le nom du noyau est requis pour l\'upload de l\'image.');
      }

      // Générer un nom de fichier basé sur le nom du noyau
      // Remplacer les espaces par des underscores et supprimer les caractères spéciaux
      const cleanName = noyauNom
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '');

      if (cleanName.length === 0) {
        throw new Error('Le nom du noyau contient des caractères non valides.');
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
   * Crée un nouveau noyau
   */
  static async createNoyau(data: CreateNoyauData, imageFile?: File): Promise<Noyau> {
    try {
      // Validation des données d'entrée
      if (!data.nom || data.nom.trim().length === 0) {
        throw new Error('Le nom du noyau est obligatoire.');
      }

      if (data.nom.trim().length < 2) {
        throw new Error('Le nom du noyau doit contenir au moins 2 caractères.');
      }

      if (data.nom.trim().length > 100) {
        throw new Error('Le nom du noyau ne peut pas dépasser 100 caractères.');
      }

      // Vérifier les caractères dangereux
      if (/<|>|{|}/.test(data.nom)) {
        throw new Error('Le nom contient des caractères non autorisés (< > { }).');
      }

      if (!data.slot) {
        throw new Error('Le slot du noyau est obligatoire.');
      }

      if (![1, 2, 3].includes(data.slot)) {
        throw new Error('Le slot du noyau doit être 1, 2 ou 3.');
      }

      if (data.description && data.description.length > 500) {
        throw new Error('La description ne peut pas dépasser 500 caractères.');
      }

      // Vérifier si le nom existe déjà
      const nomExiste = await this.nomExists(data.nom);
      if (nomExiste) {
        throw new Error(`Un noyau nommé "${data.nom}" existe déjà. Veuillez choisir un autre nom.`);
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

      // 2. Créer le noyau
      const insertData = {
        nom: data.nom.trim(),
        slot: data.slot,
        description: data.description?.trim() || null,
        image: imageUrl
      };

      const { data: noyau, error } = await supabase
        .from('noyaux')
        .insert(insertData as never)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase createNoyau:', error);
        
        // Supprimer l'image uploadée en cas d'erreur
        if (imageUrl) {
          await this.deleteImage(imageUrl);
        }

        // Messages d'erreur spécifiques
        if (error.message.includes('duplicate') || error.code === '23505') {
          throw new Error('Un noyau avec ce nom existe déjà. Veuillez choisir un nom différent.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour créer un noyau.');
        }
        if (error.message.includes('check') || error.code === '23514') {
          throw new Error('Le slot doit être 1, 2 ou 3.');
        }
        
        throw new Error('Impossible de créer le noyau. Vérifiez les données saisies et réessayez.');
      }

      if (!noyau) {
        // Supprimer l'image si aucun noyau n'a été créé
        if (imageUrl) {
          await this.deleteImage(imageUrl);
        }
        throw new Error('La création du noyau a échoué. Aucune donnée retournée.');
      }

      return noyau as Noyau;
    } catch (error) {
      console.error('Erreur dans createNoyau:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la création du noyau.');
    }
  }

  /**
   * Met à jour un noyau
   */
  static async updateNoyau(
    id: number,
    data: UpdateNoyauData,
    imageFile?: File
  ): Promise<Noyau> {
    try {
      // Validation des données d'entrée
      if (data.nom !== undefined) {
        if (!data.nom || data.nom.trim().length === 0) {
          throw new Error('Le nom du noyau ne peut pas être vide.');
        }

        if (data.nom.trim().length < 2) {
          throw new Error('Le nom du noyau doit contenir au moins 2 caractères.');
        }

        if (data.nom.trim().length > 100) {
          throw new Error('Le nom du noyau ne peut pas dépasser 100 caractères.');
        }

        // Vérifier les caractères dangereux
        if (/<|>|{|}/.test(data.nom)) {
          throw new Error('Le nom contient des caractères non autorisés (< > { }).');
        }

        // Vérifier l'unicité (en excluant le noyau en cours d'édition)
        const nomExiste = await this.nomExists(data.nom, id);
        if (nomExiste) {
          throw new Error(`Un autre noyau nommé "${data.nom}" existe déjà. Veuillez choisir un nom différent.`);
        }
      }

      if (data.slot !== undefined && ![1, 2, 3].includes(data.slot)) {
        throw new Error('Le slot du noyau doit être 1, 2 ou 3.');
      }

      if (data.description !== undefined && data.description.length > 500) {
        throw new Error('La description ne peut pas dépasser 500 caractères.');
      }

      let newImageUrl: string | null = null;
      let oldImageUrl: string | null = null;

      // 1. Récupérer l'ancienne image si on va la remplacer
      if (imageFile) {
        const noyau = await this.getNoyauById(id);
        if (!noyau) {
          throw new Error('Le noyau à modifier est introuvable.');
        }
        oldImageUrl = noyau.image || null;

        // Upload de la nouvelle image
        try {
          newImageUrl = await this.uploadImage(imageFile, data.nom || noyau.nom);
        } catch (uploadError) {
          console.error('Erreur upload nouvelle image:', uploadError);
          throw uploadError;
        }
      }

      // 2. Préparer les données de mise à jour
      const updateData: Partial<CreateNoyauData & { image: string }> = {};
      if (data.nom !== undefined) updateData.nom = data.nom.trim();
      if (data.slot !== undefined) updateData.slot = data.slot;
      if (data.description !== undefined) updateData.description = data.description?.trim() || null;
      if (newImageUrl) updateData.image = newImageUrl;

      // 3. Mettre à jour le noyau
      const { data: noyau, error } = await supabase
        .from('noyaux')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase updateNoyau:', error);
        
        // Supprimer la nouvelle image en cas d'erreur
        if (newImageUrl) {
          await this.deleteImage(newImageUrl);
        }

        // Messages d'erreur spécifiques
        if (error.code === 'PGRST116') {
          throw new Error('Le noyau à modifier est introuvable.');
        }
        if (error.message.includes('duplicate') || error.code === '23505') {
          throw new Error('Un noyau avec ce nom existe déjà. Veuillez choisir un nom différent.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour modifier ce noyau.');
        }
        if (error.message.includes('check') || error.code === '23514') {
          throw new Error('Le slot doit être 1, 2 ou 3.');
        }
        
        throw new Error('Impossible de mettre à jour le noyau. Vérifiez les données saisies et réessayez.');
      }

      if (!noyau) {
        // Supprimer la nouvelle image si la mise à jour a échoué
        if (newImageUrl) {
          await this.deleteImage(newImageUrl);
        }
        throw new Error('La mise à jour du noyau a échoué. Aucune donnée retournée.');
      }

      // 4. Supprimer l'ancienne image si tout s'est bien passé
      if (oldImageUrl && newImageUrl) {
        await this.deleteImage(oldImageUrl);
      }

      return noyau as Noyau;
    } catch (error) {
      console.error('Erreur dans updateNoyau:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la mise à jour du noyau.');
    }
  }

  /**
   * Supprime un noyau et son image
   */
  static async deleteNoyau(id: number): Promise<void> {
    try {
      // 1. Récupérer le noyau pour obtenir l'URL de l'image
      const noyau = await this.getNoyauById(id);
      
      // 2. Supprimer le noyau
      const { error } = await supabase
        .from('noyaux')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase deleteNoyau:', error);
        
        // Messages d'erreur spécifiques
        if (error.code === 'PGRST116') {
          throw new Error('Le noyau à supprimer est introuvable.');
        }
        if (error.code === '23503') {
          throw new Error('Ce noyau ne peut pas être supprimé car il est utilisé dans des builds. Supprimez d\'abord les builds associés.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour supprimer ce noyau.');
        }
        
        throw new Error('Impossible de supprimer le noyau. Veuillez réessayer.');
      }

      // 3. Supprimer l'image du storage
      if (noyau?.image) {
        await this.deleteImage(noyau.image);
      }
    } catch (error) {
      console.error('Erreur dans deleteNoyau:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la suppression du noyau.');
    }
  }

  /**
   * Vérifie si un nom de noyau existe déjà
   */
  static async nomExists(nom: string, excludeId?: number): Promise<boolean> {
    try {
      if (!nom || nom.trim().length === 0) {
        return false;
      }

      let query = supabase
        .from('noyaux')
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
