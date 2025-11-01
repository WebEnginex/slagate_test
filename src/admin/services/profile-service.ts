import { supabase } from '@/integrations/supabase/client';

/**
 * Service pour gérer le profil utilisateur
 */

export interface UpdateDisplayNameData {
  displayName: string;
}

export interface UpdateEmailData {
  email: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Met à jour le display name de l'utilisateur
 */
export async function updateDisplayName(data: UpdateDisplayNameData): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.updateUser({
      data: { display_name: data.displayName }
    });

    if (error) {
      console.error('Erreur lors de la mise à jour du display name:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur inattendue lors de la mise à jour du display name:', error);
    return { success: false, error: 'Une erreur inattendue est survenue' };
  }
}

/**
 * Met à jour l'email de l'utilisateur
 * Note: Supabase enverra un email de confirmation au nouvel email
 */
export async function updateEmail(data: UpdateEmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.updateUser({
      email: data.email
    });

    if (error) {
      console.error('Erreur lors de la mise à jour de l\'email:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur inattendue lors de la mise à jour de l\'email:', error);
    return { success: false, error: 'Une erreur inattendue est survenue' };
  }
}

/**
 * Met à jour le mot de passe de l'utilisateur
 * Nécessite l'ancien mot de passe pour des raisons de sécurité
 */
export async function updatePassword(data: UpdatePasswordData): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier l'ancien mot de passe en se reconnectant
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.email) {
      return { success: false, error: 'Utilisateur non connecté' };
    }

    // Tenter de se reconnecter avec l'ancien mot de passe pour valider
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: data.currentPassword,
    });

    if (signInError) {
      return { success: false, error: 'Le mot de passe actuel est incorrect' };
    }

    // Mettre à jour le mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
      password: data.newPassword
    });

    if (updateError) {
      console.error('Erreur lors de la mise à jour du mot de passe:', updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur inattendue lors de la mise à jour du mot de passe:', error);
    return { success: false, error: 'Une erreur inattendue est survenue' };
  }
}

/**
 * Récupère les informations du profil utilisateur
 */
export async function getUserProfile() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return null;
    }

    return {
      email: user?.email || '',
      displayName: user?.user_metadata?.display_name || '',
    };
  } catch (error) {
    console.error('Erreur inattendue lors de la récupération du profil:', error);
    return null;
  }
}
