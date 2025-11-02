/**
 * Utilitaires pour formater les dates des codes promo
 */

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

/**
 * Formate une date ISO en format français "25 Septembre à 16h59" ou "Permanent"
 * @param isoDate - Date au format ISO ou null (ex: "2024-09-25T14:59:00+00:00" ou null)
 * @returns Date formatée (ex: "25 Septembre à 16h59" ou "Permanent")
 */
export function formatPromoCodeDate(isoDate: string | null): string {
  // Code permanent (pas d'expiration)
  if (isoDate === null) {
    return 'Permanent';
  }
  
  try {
    const date = new Date(isoDate);
    
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Format de l'heure : 16h59 ou 16h00 ou 0h30
    const formattedTime = `${hours}h${minutes.toString().padStart(2, '0')}`;
    
    return `${day} ${month} à ${formattedTime}`;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur lors du formatage de la date:', error);
    }
    return 'Date invalide';
  }
}

/**
 * Convertit une date française "25 Septembre à 16h59" vers ISO
 * @param frenchDate - Date au format français
 * @param year - Année (par défaut: année courante)
 * @returns Date ISO ou null si conversion échouée
 */
export function parseFrenchDateToISO(frenchDate: string, year?: number): string | null {
  try {
    // Exemple: "25 Septembre à 16h59"
    const regex = /^(\d{1,2})\s+([A-Za-zéèàù]+)\s+à\s+(\d{1,2})h(\d{2})$/;
    const match = frenchDate.match(regex);
    
    if (!match) {
      return null;
    }
    
    const [, dayStr, monthName, hoursStr, minutesStr] = match;
    const day = parseInt(dayStr, 10);
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const currentYear = year || new Date().getFullYear();
    
    // Trouver l'index du mois
    const monthIndex = MONTHS.findIndex(
      month => month.toLowerCase() === monthName.toLowerCase()
    );
    
    if (monthIndex === -1) {
      return null;
    }
    
    const date = new Date(currentYear, monthIndex, day, hours, minutes);
    return date.toISOString();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur lors du parsing de la date française:', error);
    }
    return null;
  }
}

/**
 * Vérifie si un code promo est expiré
 * @param expiresAt - Date d'expiration ISO ou null (permanent)
 * @returns true si expiré, false sinon (les codes permanents ne sont jamais expirés)
 */
export function isPromoCodeExpired(expiresAt: string | null): boolean {
  // Les codes permanents ne sont jamais expirés
  if (expiresAt === null) {
    return false;
  }
  
  try {
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    return expirationDate < now;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur lors de la vérification d\'expiration:', error);
    }
    return false; // En cas d'erreur, considérer comme non expiré
  }
}

/**
 * Vérifie si un code promo est permanent
 * @param expiresAt - Date d'expiration ISO ou null
 * @returns true si permanent, false sinon
 */
export function isPromoCodePermanent(expiresAt: string | null): boolean {
  return expiresAt === null;
}

/**
 * Formate les récompenses pour l'affichage
 * @param rewards - Liste des récompenses de la BDD
 * @returns Liste formatée (ex: ["Gold x 1.000.000", "Cristal abyssal x5"])
 */
export function formatRewards(rewards: { reward_name: string; reward_quantity: number }[]): string[] {
  return rewards.map(reward => {
    // Formatter la quantité avec des séparateurs de milliers
    const formattedQuantity = reward.reward_quantity.toLocaleString('fr-FR');
    return `${reward.reward_name} x${formattedQuantity}`;
  });
}

/**
 * Crée une date d'expiration à partir d'une date française ou datetime-local
 * @param dateInput - Date au format français ("25 Septembre à 16h59") ou datetime-local ("2024-09-25T16:59")
 * @param year - Année (par défaut: année courante) - utilisé seulement pour le format français
 * @returns Date ISO pour le code promo
 */
export function createExpirationDate(dateInput: string, year?: number): string | null {
  // Si la date est vide ou contient "permanent", retourner null
  if (!dateInput.trim() || dateInput.toLowerCase().includes('permanent')) {
    return null;
  }
  
  // Vérifier si c'est une date au format datetime-local (YYYY-MM-DDTHH:MM)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateInput)) {
    try {
      // Créer une date à partir du format datetime-local
      const date = new Date(dateInput);
      
      if (isNaN(date.getTime())) {
        throw new Error('Date invalide');
      }
      
      return date.toISOString();
    } catch (error) {
      throw new Error(`Format de date datetime-local invalide: ${dateInput}`);
    }
  }
  
  // Sinon, traiter comme une date française
  const isoDate = parseFrenchDateToISO(dateInput, year);
  if (!isoDate) {
    throw new Error(`Format de date invalide: ${dateInput}`);
  }
  return isoDate;
}

/**
 * Convertit une date ISO vers le format requis par les inputs datetime-local
 * @param isoDate - Date au format ISO (ex: "2024-09-25T14:59:00+00:00")
 * @returns Date au format datetime-local (ex: "2024-09-25T16:59")
 */
export function formatDateForInput(isoDate: string | null): string {
  if (!isoDate) {
    return '';
  }
  
  try {
    const date = new Date(isoDate);
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Formater en YYYY-MM-DDTHH:MM pour l'input datetime-local
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur lors du formatage de la date pour input:', error);
    }
    return '';
  }
}