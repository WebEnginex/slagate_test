/**
 * Service pour gérer les armes de Jinwoo dans Supabase
 * Gère le CRUD complet + upload/suppression d'images dans le storage
 */

import { supabase } from '@/integrations/supabase/client';
import type { JinwooArme, CreateArmeData, UpdateArmeData, ElementArme } from '@/admin/types';
import { ELEMENT_ARME_ICONS as ELEMENT_ICONS_MAP } from '@/admin/types';

const BUCKET_NAME = 'armes';

export class ArmesService {
  /**
   * Récupère toutes les armes
   */
  static async getAllArmes(): Promise<JinwooArme[]> {
    try {
      const { data, error } = await supabase
        .from('jinwoo_armes')
        .select('*')
        .order('nom', { ascending: true });

      if (error) {
        console.error('Erreur Supabase getAllArmes:', error);
        throw new Error('Impossible de charger la liste des armes. Veuillez réessayer dans quelques instants.');
      }

      return (data || []) as JinwooArme[];
    } catch (error) {
      console.error('Erreur dans getAllArmes:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors du chargement des armes.');
    }
  }

  /**
   * Récupère une arme par son ID
   */
  static async getArmeById(id: number): Promise<JinwooArme | null> {
    try {
      const { data, error } = await supabase
        .from('jinwoo_armes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur Supabase getArmeById:', error);
        
        if (error.code === 'PGRST116') {
          throw new Error(`L'arme avec l'ID ${id} est introuvable.`);
        }
        
        throw new Error('Une erreur est survenue lors de la récupération de l\'arme.');
      }

      return data as JinwooArme | null;
    } catch (error) {
      console.error('Erreur dans getArmeById:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur est survenue lors de la récupération de l\'arme.');
    }
  }

  /**
   * Upload une image dans le storage Supabase
   * @param file - Fichier image (format .webp uniquement)
   * @param armeNom - Nom de l'arme pour nommer le fichier
   * @returns URL publique de l'image uploadée
   */
  static async uploadImage(file: File, armeNom: string): Promise<string> {
    try {
      // Vérifier le format
      if (!file.type.includes('webp')) {
        throw new Error('Format d\'image non valide. Seul le format .webp est accepté.');
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('L\'image est trop volumineuse. La taille maximale est de 5 MB.');
      }

      // Vérifier que le nom de l'arme est valide
      if (!armeNom || armeNom.trim().length === 0) {
        throw new Error('Le nom de l\'arme est requis pour l\'upload de l\'image.');
      }

      // Générer un nom de fichier UNIQUE basé sur le nom de l'arme + timestamp
      // Remplacer les espaces par des underscores et supprimer les caractères spéciaux
      const cleanName = armeNom
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '');

      if (cleanName.length === 0) {
        throw new Error('Le nom de l\'arme contient des caractères non valides.');
      }

      // Ajouter un timestamp pour garantir l'unicité du nom de fichier
      const timestamp = Date.now();
      const fileName = `${cleanName}_${timestamp}.webp`;

      // Upload le fichier (upsert: false pour éviter d'écraser un fichier existant)
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
        // Ne pas faire planter si la suppression échoue (l'image n'existe peut-être plus)
      } else {
        console.log('[DEBUG] deleteImage - Image supprimée avec succès:', fileName);
      }
    } catch (error) {
      console.error('[deleteImage] Erreur dans deleteImage:', error);
      // Ne pas faire planter l'opération principale
    }
  }

  /**
   * Crée une nouvelle arme
   */
  static async createArme(data: CreateArmeData, imageFile?: File): Promise<JinwooArme> {
    try {
      // Validation des données d'entrée
      if (!data.nom || data.nom.trim().length === 0) {
        throw new Error('Le nom de l\'arme est obligatoire.');
      }

      if (data.nom.trim().length < 2) {
        throw new Error('Le nom de l\'arme doit contenir au moins 2 caractères.');
      }

      if (data.nom.trim().length > 100) {
        throw new Error('Le nom de l\'arme ne peut pas dépasser 100 caractères.');
      }

      // Vérifier les caractères dangereux
      if (/<|>|{|}/.test(data.nom)) {
        throw new Error('Le nom contient des caractères non autorisés (< > { }).');
      }

      // Valider l'élément si fourni
      const elementsValides = ['Feu', 'Eau', 'Vent', 'Lumière', 'Ténèbres'];
      if (data.element && !elementsValides.includes(data.element)) {
        throw new Error(`L'élément doit être l'un des suivants : ${elementsValides.join(', ')}.`);
      }

      // Vérifier si le nom existe déjà
      const nomExiste = await this.nomExists(data.nom);
      if (nomExiste) {
        throw new Error(`Une arme nommée "${data.nom}" existe déjà. Veuillez choisir un autre nom.`);
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

      // 2. Créer l'arme
      const insertData = {
        nom: data.nom.trim(),
        element: data.element || null,
        arme_element: data.element ? ELEMENT_ICONS_MAP[data.element as ElementArme] : null, // Stocker l'URL de l'icône
        image: imageUrl
      };

      const { data: arme, error } = await supabase
        .from('jinwoo_armes')
        .insert(insertData as never)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase createArme:', error);
        console.error('Données tentées:', insertData);
        
        // Supprimer l'image uploadée en cas d'erreur
        if (imageUrl) {
          await this.deleteImage(imageUrl);
        }

        // Messages d'erreur spécifiques
        if (error.message.includes('duplicate') || error.code === '23505') {
          throw new Error('Une arme avec ce nom existe déjà. Veuillez choisir un nom différent.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour créer une arme.');
        }
        
        throw new Error(`Impossible de créer l'arme: ${error.message}`);
      }

      if (!arme) {
        // Supprimer l'image si aucune arme n'a été créée
        if (imageUrl) {
          await this.deleteImage(imageUrl);
        }
        throw new Error('La création de l\'arme a échoué. Aucune donnée retournée.');
      }

      return arme as JinwooArme;
    } catch (error) {
      console.error('Erreur dans createArme:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la création de l\'arme.');
    }
  }

  /**
   * Met à jour une arme
   */
  static async updateArme(
    id: number,
    data: UpdateArmeData,
    imageFile?: File
  ): Promise<JinwooArme> {
    try {
      // 0. Vérifier que l'arme existe AVANT toute opération
      const existingArme = await this.getArmeById(id);
      if (!existingArme) {
        throw new Error('L\'arme à modifier est introuvable.');
      }

      // Validation des données d'entrée
      if (data.nom !== undefined) {
        if (!data.nom || data.nom.trim().length === 0) {
          throw new Error('Le nom de l\'arme ne peut pas être vide.');
        }

        if (data.nom.trim().length < 2) {
          throw new Error('Le nom de l\'arme doit contenir au moins 2 caractères.');
        }

        if (data.nom.trim().length > 100) {
          throw new Error('Le nom de l\'arme ne peut pas dépasser 100 caractères.');
        }

        // Vérifier les caractères dangereux
        if (/<|>|{|}/.test(data.nom)) {
          throw new Error('Le nom contient des caractères non autorisés (< > { }).');
        }

        // Vérifier l'unicité (en excluant l'arme en cours d'édition)
        const nomExiste = await this.nomExists(data.nom, id);
        if (nomExiste) {
          throw new Error(`Une autre arme nommée "${data.nom}" existe déjà. Veuillez choisir un nom différent.`);
        }
      }

      // Valider l'élément si fourni
      if (data.element !== undefined && data.element !== null) {
        const elementsValides = ['Feu', 'Eau', 'Vent', 'Lumière', 'Ténèbres'];
        if (!elementsValides.includes(data.element)) {
          throw new Error(`L'élément doit être l'un des suivants : ${elementsValides.join(', ')}.`);
        }
      }

      let newImageUrl: string | null = null;
      let oldImageUrl: string | null = null;

      // 1. Upload de la nouvelle image si fournie
      if (imageFile) {
        oldImageUrl = existingArme.image || null;
        console.log('[DEBUG] updateArme - oldImageUrl:', oldImageUrl);

        // Upload de la nouvelle image
        try {
          newImageUrl = await this.uploadImage(imageFile, data.nom || existingArme.nom);
          console.log('[DEBUG] updateArme - newImageUrl:', newImageUrl);
        } catch (uploadError) {
          console.error('Erreur upload nouvelle image:', uploadError);
          throw uploadError;
        }
      }

      // 2. Préparer les données de mise à jour
      const updateData: Partial<CreateArmeData & { image: string; arme_element: string | null }> = {};
      if (data.nom !== undefined) updateData.nom = data.nom.trim();
      if (data.element !== undefined) {
        updateData.element = data.element;
        // Mettre à jour l'URL de l'icône d'élément
        updateData.arme_element = data.element ? ELEMENT_ICONS_MAP[data.element as ElementArme] : null;
      }
      if (newImageUrl) updateData.image = newImageUrl;

      // 3. Mettre à jour l'arme
      console.log('[DEBUG] updateArme - ID:', id, 'updateData:', updateData);

      const { data: arme, error } = await supabase
        .from('jinwoo_armes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase updateArme:', error);

        // Supprimer la nouvelle image en cas d'erreur
        if (newImageUrl) {
          await this.deleteImage(newImageUrl);
        }

        // Messages d'erreur spécifiques
        if (error.code === 'PGRST116') {
          // PGRST116 avec "0 rows" peut indiquer un problème de permissions RLS
          if (error.details?.includes('0 rows')) {
            throw new Error('Impossible de mettre à jour l\'arme. Vérifiez vos permissions ou que l\'arme existe toujours.');
          }
          throw new Error('L\'arme a été supprimée entre-temps. Veuillez rafraîchir la page.');
        }
        if (error.message.includes('duplicate') || error.code === '23505') {
          throw new Error('Une arme avec ce nom existe déjà. Veuillez choisir un nom différent.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour modifier cette arme.');
        }

        throw new Error('Impossible de mettre à jour l\'arme. Vérifiez les données saisies et réessayez.');
      }

      if (!arme) {
        // Supprimer la nouvelle image si la mise à jour a échoué
        if (newImageUrl) {
          await this.deleteImage(newImageUrl);
        }
        throw new Error('La mise à jour de l\'arme a échoué. Aucune donnée retournée.');
      }

      // 4. Supprimer l'ancienne image si tout s'est bien passé
      if (oldImageUrl && newImageUrl) {
        console.log('[DEBUG] updateArme - Suppression de l\'ancienne image...');
        await this.deleteImage(oldImageUrl);
      } else if (oldImageUrl && !newImageUrl) {
        console.log('[DEBUG] updateArme - Ancienne image conservée (pas de nouvelle image)');
      } else if (!oldImageUrl && newImageUrl) {
        console.log('[DEBUG] updateArme - Première image ajoutée (pas d\'ancienne image)');
      }

      console.log('[DEBUG] updateArme - Mise à jour réussie, arme retournée:', arme);
      return arme as JinwooArme;
    } catch (error) {
      console.error('Erreur dans updateArme:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la mise à jour de l\'arme.');
    }
  }

  /**
   * Supprime une arme et son image
   */
  static async deleteArme(id: number): Promise<void> {
    try {
      // 1. Récupérer l'arme pour obtenir l'URL de l'image
      const arme = await this.getArmeById(id);
      
      // 2. Supprimer l'arme
      const { error } = await supabase
        .from('jinwoo_armes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase deleteArme:', error);
        
        // Messages d'erreur spécifiques
        if (error.code === 'PGRST116') {
          throw new Error('L\'arme à supprimer est introuvable.');
        }
        if (error.code === '23503') {
          throw new Error('Cette arme ne peut pas être supprimée car elle est utilisée dans des builds. Supprimez d\'abord les builds associés.');
        }
        if (error.message.includes('permission')) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour supprimer cette arme.');
        }
        
        throw new Error('Impossible de supprimer l\'arme. Veuillez réessayer.');
      }

      // 3. Supprimer l'image du storage
      if (arme?.image) {
        await this.deleteImage(arme.image);
      }
    } catch (error) {
      console.error('Erreur dans deleteArme:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue lors de la suppression de l\'arme.');
    }
  }

  /**
   * Vérifie si un nom d'arme existe déjà
   */
  static async nomExists(nom: string, excludeId?: number): Promise<boolean> {
    try {
      if (!nom || nom.trim().length === 0) {
        return false;
      }

      let query = supabase
        .from('jinwoo_armes')
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
